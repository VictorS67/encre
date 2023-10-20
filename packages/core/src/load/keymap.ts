import camelcase from 'camelcase';
import decamelize from 'decamelize';

import type { Opaque } from 'type-fest';

export type RecordId = Opaque<string, 'RecordId'>;

export enum RecordType {
  EVENT = 'event',
  TEMPLATE = 'template',
}

export type SerializedFields = {
  [key: string]: unknown;
};

export type EventSerializedFields = SerializedFields & {
  _recordType: RecordType;
  _secrets: SerializedFields;
  _inputs: SerializedFields;
  _outputs: SerializedFields;
  _parent?: RecordId;
};

export type TemplateSerializedFields = SerializedFields & {
  _recordType: RecordType;
  _children: RecordId[];
};

export type RecordSerializedFields =
  | EventSerializedFields
  | TemplateSerializedFields;

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
    if (Object.hasOwn(fields, key)) {
      mapToKeys[mapper(key, map)] = fields[key];
    }
  }

  return mapToKeys;
}

export function mapKeyTypes(
  fields: SerializedFields,
  mapper: typeof keyFromJson,
  map?: SerializedKeyAlias
): SerializedFields {
  const mapToKeyTypes: SerializedFields = {};

  for (const key in fields) {
    if (Object.hasOwn(fields, key)) {
      mapToKeyTypes[mapper(key, map)] =
        typeof fields[key] === 'object'
          ? mapKeyTypes(fields[key] as SerializedFields, mapper, map)
          : typeof fields[key];
    }
  }

  return mapToKeyTypes;
}
