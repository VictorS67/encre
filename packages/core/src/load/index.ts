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
  SerializedSecret,
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
    Object.assign(aliases, Reflect.get(current.prototype, 'aliases'));
  }

  return Object.entries(aliases).reduce(
    (accumulator, [key, value]) => {
      accumulator[value] = key;

      return accumulator;
    },
    {} as Record<string, string>
  );
}

async function reviver(
  this: {
    optionalImportsMap: OptionalImportMap;
    secretsMap: SecretMap;
    path?: string[];
  },
  value: unknown
) {
  const { optionalImportsMap, secretsMap, path = ['$'] } = this;
  const pathStr = path.join('.');

  if (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    '_grp' in value &&
    '_type' in value &&
    '_id' in value &&
    value._grp === 1 &&
    value._type === 'secret'
  ) {
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
          `Missing key "${key}" for ${pathStr} in load(secretsMap={})`
        );
      }
    }
  } else if (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    '_grp' in value &&
    '_type' in value &&
    '_id' in value &&
    value._grp === 1 &&
    value._type === 'not_implemented'
  ) {
    const serialized = value as SerializedSecret;
    const serializedStr: string = JSON.stringify(serialized);
    throw new Error(
      `Trying to load an object that doesn't implement serialization: ${pathStr} -> ${serializedStr}`
    );
  } else if (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    '_grp' in value &&
    '_type' in value &&
    '_id' in value &&
    '_kwargs' in value &&
    value._grp === 1
  ) {
    const serialized = value as SerializedConstructor;
    const serializedStr: string = JSON.stringify(serialized);
    const [name, ...namespaceReverse] = serialized._id.slice().reverse();
    const namespace: string[] = namespaceReverse.reverse();

    let module: ImportModule | OptionalImportModule | null = null;
    const endpoint: string = namespace.join('/');

    if (
      (optionalImportEndpoints.includes(endpoint)) ||
      endpoint in optionalImportsMap
    ) {
      if (endpoint in optionalImportsMap) {
        module =
          await optionalImportsMap[endpoint as keyof typeof optionalImportsMap];
      } else {
        throw new Error(
          `Missing key "${endpoint}" for ${pathStr} in load(optionalImportsMap={})`
        );
      }
    } else {
      if (namespace.length === 0) {
        throw new Error(`Invalid namespace: ${pathStr} -> ${serializedStr}`);
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
      throw new Error(`Invalid namespace: ${pathStr} -> ${serializedStr}`);
    }

    const builder =
      module[name as keyof typeof module] ??
      Object.values(module).find(
        (v) =>
          typeof v === 'function' &&
          getUniqueName(v as typeof Serializable) === name
      );

    if (typeof builder !== 'function') {
      throw new Error(`Invalid identifier: ${pathStr} -> ${serializedStr}`);
    }

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
      throw new Error(`Invalid identifier: ${pathStr} -> ${serializedStr}`);
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
