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
  SerializableType,
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

export async function load<T>(
  text: string,
  secretsMap: SecretMap = {},
  optionalImportsMap: OptionalImportMap = {}
): Promise<T> {
  const json = JSON.parse(text);
  return reviver.call({ secretsMap, optionalImportsMap }, json) as Promise<T>;
}
