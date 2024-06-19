import { shallowCopy } from '../utils/copy.js';
import { getRecordId } from '../utils/nanoid.js';
import {
  type SerializedKeyAlias,
  type SecretFields,
  type SerializedFields,
  mapKeys,
  keyToJson,
  type EventSerializedFields,
  type TemplateSerializedFields,
  mapKeyTypes,
  RecordType,
  type RecordId,
} from './keymap.js';

/**
 * Base Serialized properties.
 */
export type BasedSerialized<T extends string> = {
  /**
   * The serializable group.
   */
  _grp: number;
  
  /**
   * The serializable type. Different types have their own way of serializing data.
   */
  _type: T;

  /**
   * The path of serializable.
   */
  _id: string[];
};

/**
 * Structure for serializing constructor parameters of class objects.
 * Extends {@link BasedSerialized} with type 'constructor'.
 */
export interface SerializedConstructor extends BasedSerialized<'constructor'> {
  /**
   * A dictionary mapping attribute names to their serialized values.
   */
  _kwargs: SerializedFields;
}

/**
 * Structure for serializing secret keys in class objects.
 * Extends {@link BasedSerialized} with type 'secret'.
 */
export interface SerializedSecret extends BasedSerialized<'secret'> {}

/**
 * Represents a non-implementable serialization type, used for objects that cannot be serialized.
 * Extends {@link BasedSerialized} with type 'not_implemented'.
 */
export interface SerializedNotImplemented
  extends BasedSerialized<'not_implemented'> {}

/**
 * @hidden
 * @deprecated
 */
export interface SerializedErrnoRecord extends BasedSerialized<'errno_record'> {
  _recordId: RecordId;
}

/**
 * @hidden
 * @deprecated
 */
export interface SerializedInputRecord extends BasedSerialized<'input_record'> {
  _recordId: RecordId;
  _kwargs: SerializedFields;
}

/**
 * @hidden
 * @deprecated
 */
export interface SerializedOutputRecord
  extends BasedSerialized<'output_record'> {
  _recordId: RecordId;
  _kwargs: SerializedFields;
}

/**
 * @hidden
 * @deprecated
 */
export interface SerializedSecretRecord
  extends BasedSerialized<'secret_record'> {
  _recordId: RecordId;
}

/**
 * @hidden
 * @deprecated
 */
export interface SerializedEventRecord extends BasedSerialized<'event_record'> {
  _recordId: RecordId;
  _kwargs: SerializedFields;
  _metadata: EventSerializedFields;
}

/**
 * @hidden
 * @deprecated
 */
export interface SerializedTemplateRecord
  extends BasedSerialized<'template_record'> {
  _recordId: RecordId;
  _metadata: TemplateSerializedFields;
}

/**
 * @hidden
 * @deprecated
 */
export type SerializedRecord =
  | SerializedErrnoRecord
  | SerializedInputRecord
  | SerializedOutputRecord
  | SerializedSecretRecord
  | SerializedEventRecord
  | SerializedTemplateRecord;

/**
 * Serialized Object. Can be either {@link SerializedConstructor}, {@link SerializedSecret}, {@link SerializedNotImplemented}.
 */
export type Serialized =
  | SerializedConstructor
  | SerializedSecret
  | SerializedNotImplemented
  | SerializedRecord;

/**
 * Assigns properties from the source object to the target object without overwriting existing properties.
 *
 * @param target - The object to which properties will be assigned.
 * @param source - The object from which properties will be sourced.
 * @returns The modified target object.
 * @ignore
 */
export function safeAssign<T extends object>(target: T, source: T): T {
  for (const key in source) {
    if (!Object.prototype.hasOwnProperty.call(target, key)) {
      target[key] = source[key];
    }
  }

  return target;
}

/**
 * Abstract base class for all serializable objects.
 * Defines a framework for serializing objects with various properties including secrets, attributes, and aliases.
 */
export abstract class Serializable {
  /**
   * Indicates if the instance is serializable. If false, toJSON returns a non-implementable serialization.
   */
  _isSerializable = false;

  /**
   * Key-value pairs of properties to be serialized.
   */
  _kwargs: SerializedFields;

  /**
   * Unique namespace identifier for the serialized object, represented as an array of strings.
   */
  abstract _namespace: string[];

  /**
   * Generates a unique name for the class, typically used for serialization identification.
   */
  static _name(): string {
    return this.name;
  }

  /**
   * Retrieves the name of the class. This provides a unique identifier for serialization.
   * @returns The path of serializable.
   * @readonly
   */
  get _id(): string[] {
    return [
      ...this._namespace,
      getUniqueName(this.constructor as typeof Serializable),
    ];
  }

  /**
   * Retrieves any secrets defined in the object.
   * @returns An object representing secret fields, or undefined if none are defined.
   * @readonly
   */
  get _secrets(): SecretFields | undefined {
    return undefined;
  }

  /**
   * Retrieves attributes of the object.
   * @returns An object representing attributes, or undefined if none are defined.
   * @readonly
   */
  get _attributes(): SerializedFields | undefined {
    return undefined;
  }

  /**
   * Retrieves alias mappings for the object's attribute names.
   * @returns An object representing key aliases, or undefined if none are defined.
   * @readonly
   */
  get _aliases(): SerializedFields | undefined {
    return undefined;
  }

  /**
   * @hidden
   * @deprecated
   */
  protected _recordId: RecordId;

  /**
   * Initializes a new instance of the `Serializable` class.
   *
   * @param kwargs Optional parameters for initializing the serializable properties.
   * @param _args Additional optional variable argument handling in constructors, this is used outside the serializable.
   */
  constructor(kwargs?: object, ..._args: never[]) {
    this._kwargs = toSerializedFields(kwargs || {});
    this._recordId = getRecordId();
  }

  /**
   * Initializes the `_kwargs` property by merging instance-specific values with provided defaults.
   * @returns A {@link SerializedFields} object representing the initialized keyword arguments.
   * @hidden
   * @internal
   */
  protected _initKwargs(): SerializedFields {
    return Object.keys(this._kwargs).reduce((accumulator, key) => {
      accumulator[key] =
        key in this ? this[key as keyof this] : this._kwargs[key];

      return accumulator;
    }, {} as SerializedFields);
  }

  /**
   * Replaces sensitive information within the serialized fields with their respective secret keys.
   *
   * @param root The original serialized fields from which secrets need to be replaced.
   * @param secretsMap A mapping of field paths to their corresponding secret keys.
   * @returns A {@link SerializedFields} object with sensitive information replaced.
   * @hidden
   * @internal
   */
  protected _replaceSecret(
    root: SerializedFields,
    secretsMap: SecretFields
  ): SerializedFields {
    const result: SerializedFields = shallowCopy(root);

    for (const [path, secretKey] of Object.entries(secretsMap)) {
      const [last, ...partsReverse] = path.split('.').reverse();

      let current: SerializedFields = result;
      for (const key of partsReverse.reverse()) {
        if (current[key] === undefined) {
          break;
        }

        current[key] = shallowCopy(current[key] as SerializedFields);
        current = current[key] as SerializedFields;
      }

      if (current[last] !== undefined) {
        current[last] = this.toJSONSecret(secretKey);
      }
    }

    return result;
  }

  /**
   * Removes secret information from the serialized fields based on a provided map of secrets.
   *
   * @param root The original serialized fields from which secrets need to be removed.
   * @param secretsMap A mapping of field paths to their corresponding secret keys.
   * @returns A {@link SerializedFields} object with sensitive information removed.
   * @hidden
   * @internal
   */
  protected _removeSecret(
    root: SerializedFields,
    secretsMap: SecretFields
  ): SerializedFields {
    const result: SerializedFields = shallowCopy(root);

    for (const [path, secretKey] of Object.entries(secretsMap)) {
      const [last, ...partsReverse] = path.split('.').reverse();

      let current: SerializedFields = result;
      for (const key of partsReverse.reverse()) {
        if (current[key] === undefined) {
          break;
        }

        current[key] = shallowCopy(current[key] as SerializedFields);
        current = current[key] as SerializedFields;
      }

      if (current[last] !== undefined) {
        if (path.split('.').length > 1) {
          delete result[path.split('.')[0]];
        } else {
          delete current[last];
        }
      }
    }

    return result;
  }

/**
 * @hidden
 * @deprecated
 */
  protected async _getSecretRecord(
    root: SerializedFields,
    secretsMap: SecretFields
  ): Promise<SerializedFields> {
    const result: SerializedFields = shallowCopy(root);
    const secretKeys: string[] = [];

    for (const [path, secretKey] of Object.entries(secretsMap)) {
      const [last, ...partsReverse] = path.split('.').reverse();

      let current: SerializedFields = result;
      for (const key of partsReverse.reverse()) {
        if (current[key] === undefined) {
          break;
        }

        current[key] = shallowCopy(current[key] as SerializedFields);
        current = current[key] as SerializedFields;
      }

      if (current[last] !== undefined) {
        secretKeys.push(secretKey);
      }
    }

    return (
      secretKeys.length > 0 ? await this.toSecretRecord(secretKeys) : {}
    ) as SerializedFields;
  }

  /**
   * Retrieves a comprehensive representation of the object's attributes, secrets, and aliases.
   * @returns An object containing aliases, secrets, and keyword arguments.
   * @hidden
   * @internal
   */
  protected _getAttributes(): {
    aliases: SerializedKeyAlias;
    secrets: SecretFields;
    kwargs: SerializedFields;
  } {
    let aliases: SerializedKeyAlias = {};
    let secrets: SecretFields = {};
    let kwargs: SerializedFields = this._initKwargs();

    for (
      let sub = Object.getPrototypeOf(this);
      sub;
      sub = Object.getPrototypeOf(sub)
    ) {
      aliases = safeAssign<SerializedKeyAlias>(
        aliases,
        Reflect.get(sub, '_aliases', this)
      );
      secrets = safeAssign<SecretFields>(
        secrets,
        Reflect.get(sub, '_secrets', this)
      );
      kwargs = safeAssign<SerializedFields>(
        kwargs,
        Reflect.get(sub, '_attributes', this)
      );
    }

    Object.keys(secrets).forEach((keyPath: string) => {
      // eslint-disable-next-line @typescript-eslint/no-this-alias, @typescript-eslint/no-explicit-any
      let read: Serializable = this;
      let write: SerializedFields = kwargs;

      const [last, ...partsReverse] = keyPath.split('.').reverse();
      for (const key of partsReverse.reverse()) {
        if (!(key in read) || read[key] === undefined) return;

        if (!(key in write) || write[key] === undefined) {
          if (typeof read[key] === 'object' && read[key] != null) {
            write[key] = {};
          } else if (Array.isArray(read[key])) {
            write[key] = [];
          }
        }

        read = read[key];
        write = write[key] as SerializedFields;
      }

      if (last in read && read[last] !== undefined) {
        write[last] = write[last] || read[last];
      }
    });

    return { aliases, secrets, kwargs };
  }

  /**
   * Retrieves a comprehensive representation of the object's attributes, secrets, and aliases.
   * @returns An object containing aliases, secrets, and keyword arguments.
   */
  getAttributes(): {
    aliases: SerializedKeyAlias;
    secrets: SecretFields;
    kwargs: SerializedFields;
  } {
    const { aliases, secrets, kwargs } = this._getAttributes();

    const filteredKwargs = Object.keys(secrets).length
      ? this._removeSecret(kwargs, secrets)
      : kwargs;

    return { aliases, secrets, kwargs: filteredKwargs };
  }

  /**
   * Converts the object to a serialized format that is not implemented. This method should be overridden in subclasses to provide specific serialization behavior.
   * @returns A serialized representation of the object.
   */
  toJSONNotImplemented(): Serialized {
    return {
      _grp: 1,
      _type: 'not_implemented',
      _id: this._id,
    };
  }

  /**
   * Converts a secret key to its serialized format. This method is typically used for serializing secrets in a secure manner.
   *
   * @param secretKey The secret key to serialize.
   * @returns A serialized representation of the secret key.
   */
  toJSONSecret(secretKey: string): Serialized {
    return {
      _grp: 1,
      _type: 'secret',
      _id: [secretKey],
    };
  }

  /**
   * Converts the object to a serialized constructor format. This method provides a way to serialize object construction details, including any aliases or secrets.
   *
   * @param aliases Key aliases to include in the serialized output.
   * @param secrets Secrets to be secured in the serialized output.
   * @param kwargs Additional keyword arguments to include in the serialized output.
   * @returns A serialized representation of the object as a constructor.
   */
  toJSONConstructor(
    aliases: SerializedKeyAlias,
    secrets: SecretFields,
    kwargs: SerializedFields
  ): Serialized {
    return {
      _grp: 1,
      _type: 'constructor',
      _id: this._id,
      _kwargs: mapKeys(
        Object.keys(secrets).length
          ? this._replaceSecret(kwargs, secrets)
          : kwargs,
        keyToJson,
        aliases
      ),
    };
  }

  /**
   * @hidden
   * @deprecated
   */
  async toJSONErrnoRecord(): Promise<Serialized> {
    return {
      _grp: 2,
      _type: 'errno_record',
      _id: this._id,
      _recordId: this._recordId,
    };
  }

  /**
   * @hidden
   * @deprecated
   */
  async toSecretRecord(secretKey: string | string[]): Promise<Serialized> {
    return {
      _grp: 2,
      _type: 'secret_record',
      _id: [...secretKey],
      _recordId: this._recordId,
    };
  }

  /**
   * @hidden
   * @deprecated
   */
  async toInputRecord(
    aliases: SerializedKeyAlias,
    secrets: SecretFields,
    kwargs: SerializedFields
  ): Promise<Serialized> {
    return {
      _grp: 2,
      _type: 'input_record',
      _id: this._id,
      _recordId: this._recordId,
      _kwargs: mapKeyTypes(
        Object.keys(secrets).length
          ? this._removeSecret(kwargs, secrets)
          : kwargs,
        keyToJson,
        aliases
      ),
    };
  }

  /**
   * @hidden
   * @deprecated
   */
  async toOutputRecord(
    aliases: SerializedKeyAlias,
    secrets: SecretFields,
    kwargs: SerializedFields
  ): Promise<Serialized> {
    return {
      _grp: 2,
      _type: 'output_record',
      _id: this._id,
      _recordId: this._recordId,
      _kwargs: mapKeyTypes(
        Object.keys(secrets).length
          ? this._removeSecret(kwargs, secrets)
          : kwargs,
        keyToJson,
        aliases
      ),
    };
  }

  /**
   * @hidden
   * @deprecated
   */
  async toEventRecord(
    aliases: SerializedKeyAlias,
    secrets: SecretFields,
    kwargs: SerializedFields,
    outputs: unknown | SerializedFields,
    parent?: RecordId
  ): Promise<Serialized> {
    let serializedOutputs: SerializedFields;
    if (typeof outputs === 'object') {
      serializedOutputs = (outputs ?? {}) as SerializedFields;
    } else {
      serializedOutputs = (outputs ? { outputs } : {}) as SerializedFields;
    }

    return {
      _grp: 2,
      _type: 'event_record',
      _id: this._id,
      _recordId: this._recordId,
      _kwargs: mapKeys(
        Object.keys(secrets).length
          ? this._replaceSecret(kwargs, secrets)
          : kwargs,
        keyToJson,
        aliases
      ),
      _metadata: {
        _recordType: RecordType.EVENT,
        _secrets: await this._getSecretRecord(kwargs, secrets),
        _inputs: (await this.toInputRecord(
          aliases,
          secrets,
          kwargs
        )) as SerializedFields,
        _outputs: (await this.toOutputRecord(
          aliases,
          secrets,
          serializedOutputs
        )) as SerializedFields,
        _parent: parent,
      },
    };
  }

  /**
   * @hidden
   * @deprecated
   */
  async toTemplateRecord(children?: RecordId[]): Promise<Serialized> {
    return {
      _grp: 2,
      _type: 'template_record',
      _id: this._id,
      _recordId: this._recordId,
      _metadata: {
        _recordType: RecordType.TEMPLATE,
        _children: children ?? [],
      },
    };
  }

  /**
   * @hidden
   * @deprecated
   */
  async toRecord(
    outputs?: unknown | SerializedFields,
    parent?: RecordId
  ): Promise<Serialized> {
    if (!this._isSerializable) {
      return this.toJSONErrnoRecord();
    }

    if (
      this._kwargs instanceof Serializable ||
      typeof this._kwargs !== 'object' ||
      Array.isArray(this._kwargs)
    ) {
      return this.toJSONErrnoRecord();
    }

    const { aliases, secrets, kwargs } = this._getAttributes();

    return this.toEventRecord(aliases, secrets, kwargs, outputs, parent);
  }

  /**
   * Converts the object to a serialized representation based on the object's current state. This method determines whether to use a 'not implemented' or 'constructor' format based on the object's serializability.
   * @returns A serialized representation of the object.
   */
  toJSON(): Serialized {
    if (!this._isSerializable) {
      return this.toJSONNotImplemented();
    }

    if (
      this._kwargs instanceof Serializable ||
      typeof this._kwargs !== 'object' ||
      Array.isArray(this._kwargs)
    ) {
      return this.toJSONNotImplemented();
    }

    const { aliases, secrets, kwargs } = this._getAttributes();

    return this.toJSONConstructor(aliases, secrets, kwargs);
  }
}

/**
 * Generates a unique name for a given serializable class, accounting for subclassing.
 *
 * @param serializableClass The class for which a unique name is required.
 * @returns The unique name of the class.
 * @ignore
 */
export function getUniqueName(serializableClass: typeof Serializable): string {
  const parentClass = Object.getPrototypeOf(serializableClass);
  const isSubclassed =
    typeof serializableClass._name === 'function' &&
    (typeof parentClass._name !== 'function' ||
      serializableClass._name !== parentClass._name);

  if (isSubclassed) return serializableClass._name();

  return serializableClass.name;
}

/**
 * Casts a given input into a SerializedFields type. This function acts as a type assertion, used primarily for initializing serializable properties.
 *
 * @param input The input to cast.
 * @returns The input cast to the SerializedFields type.
 * @ignore
 */
export function toSerializedFields<T>(input: T): SerializedFields {
  return input as SerializedFields;
}
