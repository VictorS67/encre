import {
  type SerializedKeyAlias,
  type SecretFields,
  type SerializedFields,
  mapKeys,
  keyToJson,
} from './keymap.js';

export type BasedSerialized<T extends string> = {
  _grp: number;
  _type: T;
  _id: string[];
};

export interface SerializedConstructor extends BasedSerialized<'constructor'> {
  _kwargs: SerializedFields;
}

export interface SerializedSecret extends BasedSerialized<'secret'> {}

export interface SerializedNotImplemented
  extends BasedSerialized<'not_implemented'> {}

export type Serialized =
  | SerializedConstructor
  | SerializedSecret
  | SerializedNotImplemented;

function shallowCopy<T extends object>(obj: T): T {
  return Array.isArray(obj) ? ([...obj] as T) : ({ ...obj } as T);
}

function replaceSecret(
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
      current[last] = {
        _grp: 1,
        _type: 'secret',
        _id: [secretKey],
      };
    }
  }

  return result;
}

function safeAssign<T extends object>(target: T, source: T): T {
  for (const key in source) {
    if (!Object.prototype.hasOwnProperty.call(target, key)) {
      target[key] = source[key];
    }
  }

  return target;
}

export abstract class Serializable {
  _isSerializable = false;

  _kwargs: SerializedFields;

  abstract _namespace: string[];

  static _name(): string {
    return this.name;
  }

  get _id(): string[] {
    return [
      ...this._namespace,
      getUniqueName(this.constructor as typeof Serializable),
    ];
  }

  get _secrets(): SecretFields | undefined {
    return undefined;
  }

  get _attributes(): SerializedFields | undefined {
    return undefined;
  }

  get _aliases(): SerializedFields | undefined {
    return undefined;
  }

  constructor(kwargs?: SerializedFields, ..._args: never[]) {
    this._kwargs = kwargs || {};
  }

  toJSONNotImplemented(): Serialized {
    return {
      _grp: 1,
      _type: 'not_implemented',
      _id: this._id,
    };
  }

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

    let aliases: SerializedKeyAlias = {};
    let secrets: SecretFields = {};
    let kwargs: SerializedFields = Object.keys(this._kwargs).reduce(
      (accumulator, key) => {
        accumulator[key] =
          key in this ? this[key as keyof this] : this._kwargs[key];

        return accumulator;
      },
      {} as SerializedFields
    );

    for (
      let sub = Object.getPrototypeOf(this);
      sub;
      sub = Object.getPrototypeOf(sub)
    ) {
      aliases = safeAssign<SerializedKeyAlias>(aliases, Reflect.get(sub, '_aliases', this));
      secrets = safeAssign<SecretFields>(secrets, Reflect.get(sub, '_secrets', this));
      kwargs = safeAssign<SerializedFields>(kwargs, Reflect.get(sub, '_attributes', this));
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

    return {
      _grp: 1,
      _type: 'constructor',
      _id: this._id,
      _kwargs: mapKeys(
        Object.keys(secrets).length ? replaceSecret(kwargs, secrets) : kwargs,
        keyToJson,
        aliases
      ),
    };
  }
}

export function getUniqueName(serializableClass: typeof Serializable): string {
  const parentClass = Object.getPrototypeOf(serializableClass);
  const isSubclassed =
    typeof serializableClass._name === 'function' &&
    (typeof parentClass._name !== 'function' ||
      serializableClass._name !== parentClass._name);

  if (isSubclassed) return serializableClass._name();

  return serializableClass.name;
}
