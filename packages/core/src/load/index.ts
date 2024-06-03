import { getEnvironmentVariables } from '../utils/environment';
import { optionalImportEndpoints } from './importEndpoints.js';
/*eslint import/namespace: ['error', { allowComputed: true }]*/
import * as importMap from './importMap.js';
import { OptionalImportMap, SecretMap } from './importType.js';
import {
  SerializedFields,
  SerializedKeyAlias,
  keyFromJson,
  mapKeys,
} from './keymap.js';
import {
  Serializable,
  SerializedConstructor,
  SerializedErrnoRecord,
  SerializedEventRecord,
  SerializedInputRecord,
  SerializedNotImplemented,
  SerializedRecord,
  SerializedSecret,
  SerializedSecretRecord,
  getUniqueName,
} from './serializable.js';

type ImportModule = (typeof importMap)[keyof typeof importMap];

type OptionalImportModule = OptionalImportMap[keyof OptionalImportMap];

function combineAliasesAndInvert(constructor: typeof Serializable) {
  const aliases: SerializedKeyAlias = {};

  for (
    let current = constructor;
    current && current.prototype;
    current = Object.getPrototypeOf(current)
  ) {
    Object.assign(aliases, Reflect.get(current.prototype, '_aliases'));
  }

  return Object.entries(aliases).reduce(
    (accumulator, [key, value]) => {
      accumulator[value] = key;

      return accumulator;
    },
    {} as Record<string, string>
  );
}

async function build(
  optionalImportsMap: OptionalImportMap,
  name: string,
  namespace: string[],
  pathStr: string,
  serializedStr: string
) {
  let module: ImportModule | OptionalImportModule | null = null;
  const endpoint: string = namespace.join('/');

  if (
    optionalImportEndpoints.includes(endpoint) ||
    endpoint in optionalImportsMap
  ) {
    if (endpoint in optionalImportsMap) {
      module =
        await optionalImportsMap[endpoint as keyof typeof optionalImportsMap];
    } else {
      throw new Error(
        `[MODULE] Missing key "${endpoint}" for ${pathStr} in load(optionalImportsMap={})`
      );
    }
  } else {
    if (namespace.length === 0) {
      throw new Error(
        `[MODULE] Invalid namespace: ${pathStr} -> ${serializedStr}`
      );
    }

    let importMapKey: string;
    do {
      importMapKey = namespace.join('_');
      if (importMapKey in importMap) {
        break;
      } else {
        namespace.pop();
      }
    } while (namespace.length > 0);

    if (importMapKey in importMap) {
      module = importMap[importMapKey as keyof typeof importMap];
    }
  }

  if (module === null || typeof module !== 'object') {
    throw new Error(
      `[MODULE] Invalid namespace: ${pathStr} -> ${serializedStr}`
    );
  }

  const builder =
    module[name as keyof typeof module] ??
    Object.values(module).find(
      (v) =>
        typeof v === 'function' &&
        getUniqueName(v as typeof Serializable) === name
    );

  if (typeof builder !== 'function') {
    throw new Error(
      `[MODULE] Invalid identifier: ${pathStr} -> ${serializedStr}`
    );
  }

  return builder;
}

async function reviveSecret(
  this: {
    optionalImportsMap: OptionalImportMap;
    secretsMap: SecretMap;
    path?: string[];
  },
  value: unknown
) {
  const { secretsMap, path = ['$'] } = this;
  const pathStr = path.join('.');

  const serialized = value as SerializedSecret;
  const [key] = serialized._id;

  if (key in secretsMap) {
    return secretsMap[key as keyof SecretMap];
  } else {
    const secretValueInEnv: string | undefined = getEnvironmentVariables(key);
    if (secretValueInEnv) {
      return secretValueInEnv;
    } else {
      throw new Error(
        `[MODULE] Missing key "${key}" for ${pathStr} in load(secretsMap={})`
      );
    }
  }
}

async function reviveConstructor(
  this: {
    optionalImportsMap: OptionalImportMap;
    secretsMap: SecretMap;
    path?: string[];
  },
  value: unknown
) {
  const { optionalImportsMap, path = ['$'] } = this;
  const pathStr = path.join('.');

  const serialized = value as SerializedConstructor;
  const serializedStr: string = JSON.stringify(serialized);
  const [name, ...namespaceReverse] = serialized._id.slice().reverse();
  const namespace: string[] = namespaceReverse.reverse();

  const builder = await build(
    optionalImportsMap,
    name,
    namespace,
    pathStr,
    serializedStr
  );

  const kwargs = await reviver.call(
    { ...this, path: [...path, 'kwargs'] },
    serialized._kwargs
  );

  if (serialized._type === 'constructor') {
    const instance = new (builder as any)(
      mapKeys(
        kwargs as SerializedFields,
        keyFromJson,
        combineAliasesAndInvert(builder as typeof Serializable)
      )
    );

    Object.defineProperty(instance.constructor, 'name', { value: name });

    return instance;
  } else {
    throw new Error(
      `[MODULE] Invalid identifier: ${pathStr} -> ${serializedStr}`
    );
  }
}

async function reviveSecretRecord(
  this: {
    optionalImportsMap: OptionalImportMap;
    secretsMap: SecretMap;
    path?: string[];
  },
  value: unknown,
) {
  const { secretsMap, path = ['$'] } = this;
  const pathStr = path.join('.');

  const serialized = value as SerializedSecretRecord;
  const [key] = serialized._id;

  if (key in secretsMap) {
    return secretsMap[key as keyof SecretMap];
  } else {
    const secretValueInEnv: string | undefined = getEnvironmentVariables(key);
    if (secretValueInEnv) {
      return secretValueInEnv;
    } else {
      throw new Error(
        `[RECORD] Missing key "${key}" for ${pathStr} in load(secretsMap={})`
      );
    }
  }
}

async function reviveRecord(
  this: {
    optionalImportsMap: OptionalImportMap;
    secretsMap: SecretMap;
    path?: string[];
  },
  value: unknown
) {
  const { optionalImportsMap, path = ['$'] } = this;
  const pathStr = path.join('.');

  const serialized = value as SerializedRecord;
  const serializedStr: string = JSON.stringify(serialized);
  const [name, ...namespaceReverse] = serialized._id.slice().reverse();
  const namespace: string[] = namespaceReverse.reverse();

  const builder = await build(
    optionalImportsMap,
    name,
    namespace,
    pathStr,
    serializedStr
  );

  if (serialized._type === 'event_record') {
    const serializedEvent = serialized as SerializedEventRecord;
    const kwargs = await reviver.call(
      { ...this, path: [...path, 'kwargs'] },
      serializedEvent._kwargs
    );
    const instance = new (builder as any)(
      mapKeys(
        kwargs as SerializedFields,
        keyFromJson,
        combineAliasesAndInvert(builder as typeof Serializable)
      )
    );

    Object.defineProperty(instance.constructor, 'name', { value: name });

    return instance;
  } else {
    throw new Error(
      `[RECORD] Invalid identifier type: ${serialized._type}: ${pathStr} -> ${serializedStr}`
    );
  }
}

async function reviver(
  this: {
    optionalImportsMap: OptionalImportMap;
    secretsMap: SecretMap;
    path?: string[];
  },
  value: unknown
) {
  const { path = ['$'] } = this;
  const pathStr = path.join('.');

  if (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    '_grp' in value &&
    '_type' in value &&
    '_id' in value &&
    '_recordId' in value &&
    value._grp === 2
  ) {
    if (value._type === 'errno_record') {
      const serialized = value as SerializedErrnoRecord;
      const serializedStr: string = JSON.stringify(serialized);
      throw new Error(
        `[RECORD] Trying to load an record that produce errno serialization: ${pathStr} -> ${serializedStr}`
      );
    } else if (value._type === 'secret_record') {
      return await reviveSecretRecord.call(this, value);
    } else {
      return await reviveRecord.call(this, value);
    }
  } else if (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    '_grp' in value &&
    '_type' in value &&
    '_id' in value &&
    value._grp === 1
  ) {
    if (value._type === 'not_implemented') {
      const serialized = value as SerializedNotImplemented;
      const serializedStr: string = JSON.stringify(serialized);
      throw new Error(
        `[MODULE] Trying to load an object that doesn't implement serialization: ${pathStr} -> ${serializedStr}`
      );
    } else if (value._type === 'secret') {
      return await reviveSecret.call(this, value);
    } else {
      return await reviveConstructor.call(this, value);
    }
  } else if (typeof value === 'object' && value !== null) {
    if (Array.isArray(value)) {
      return Promise.all(
        value.map((v, i) =>
          reviver.call({ ...this, path: [...path, `${i}`] }, v)
        )
      );
    } else {
      return Object.fromEntries(
        await Promise.all(
          Object.entries(value).map(async ([k, v]) => [
            k,
            await reviver.call({ ...this, path: [...path, k] }, v),
          ])
        )
      );
    }
  }

  return value;
}

/**
 * Asynchronously deserializes a JSON string into its complex object form with possible secrets and custom modules.
 * This function supports deserialization of complex object hierarchies, including those with custom behaviors
 * specified through the optionalImportsMap. It also supports decryption or secure handling of secrets specified
 * in the secretsMap. The function parses the JSON string, identifies objects that require special construction,
 * and invokes the appropriate constructors and methods based on the serialized metadata.
 *
 * @param text The JSON string representing the serialized form of an object or a complex object graph.
 * This string must conform to the expected serialization structure with `_grp`, `_type`, `_id`, and optionally `_recordId` (deprecated).
 *
 * @param secretsMap An optional map of secrets where keys are secret identifiers used in the serialized form,
 * and values are the actual secrets (such as API keys). This map is used to replace placeholders in the serialized 
 * data with actual secrets during the deserialization process.
 *
 * @param optionalImportsMap An optional map that provides instances of modules or constructors not available globally.
 * This is particularly useful for deserializing objects requiring custom handling or instantiation logic that
 * depends on runtime conditions or configurations.
 *
 * @returns A Promise resolving to the deserialized {@link Serializable} object of type T. The actual type of T depends 
 * on the serialized data and the constructors available in the optionalImportsMap. The function ensures that the returned 
 * object is fully constructed and initialized according to the rules defined by its class and the provided serialized data.
 *
 * @throws Errors in several scenarios:
 * - If the JSON parsing fails.
 * - If the serialized data structure does not meet the expected format.
 * - If required secrets or modules are missing from the provided maps.
 * - If the constructors or functions expected for object instantiation are missing or invalid.
 *
 * @template T The expected type of the deserialized object, which should match the type of the root object
 * in the provided JSON string.
 *
 * ### Example
 * ```typescript
 * // Example of a JSON string representing a serialized object graph
 * const jsonString = '{"_grp":1,"_type":"constructor","_id":["ExampleClass","ExampleNamespace"],"kwargs":{...}}';
 *
 * // Example usage of the load function
 * const instance = await load<ExampleClass>(jsonString, { 'secretId': 'actualSecretValue' });
 * ```
 */
export async function load<T>(
  text: string,
  secretsMap: SecretMap = {},
  optionalImportsMap: OptionalImportMap = {}
): Promise<T> {
  const json = JSON.parse(text);
  return reviver.call({ secretsMap, optionalImportsMap }, json) as Promise<T>;
}
