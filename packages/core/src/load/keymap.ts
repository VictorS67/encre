import camelcase from 'camelcase';
import decamelize from 'decamelize';
// import snakeCase from 'decamelize';

export type SerializedFields = {
  [key: string]: unknown;
};

export type SecretFields = {
  [key: string]: string;
};

export type SerializedKeyAlias = {
  [key: string]: string;
};

export function keyToJson(key: string, map?: SerializedKeyAlias): string {
  return map?.[key] || decamelize(key);
}

export function keyFromJson(key: string, map?: SerializedKeyAlias): string {
  return map?.[key] || camelcase(key);
}

export function mapKeys(
  fields: SerializedFields,
  mapper: typeof keyFromJson,
  map?: SerializedKeyAlias
): SerializedFields {
  const mapToKeys: SerializedFields = {};

  for (const key in fields) {
    // console.log(`Map Keys: key: ${key}, fields: ${JSON.stringify(fields)}`);
    if (Object.hasOwn(fields, key)) {
      mapToKeys[mapper(key, map)] = fields[key];
    }
  }

  return mapToKeys;
}
