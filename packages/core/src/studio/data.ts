import { Context } from '../events/input/load/docs/context.js';
import {
  BaseMessageLike,
  HumanMessage,
} from '../events/input/load/msgs/base.js';
import { exhaustiveTuple } from '../utils/exhuastive.js';

export type DataDef<T extends string, RuntimeType> = {
  type: T;
  value: RuntimeType;
};

export type StringData = DataDef<'string', string>;
export type NumberData = DataDef<'number', number>;
export type BooleanData = DataDef<'boolean', boolean>;
export type UnknownData = DataDef<'unknown', unknown>;
export type JSONObjectData = DataDef<'object', Record<never, never>>;
export type BlobData = DataDef<'blob', Blob>;
export type ContextData = DataDef<'context', Context>;
export type ChatMessageData = DataDef<'chat-message', BaseMessageLike>;

export type ScalarData =
  | StringData
  | NumberData
  | BooleanData
  | UnknownData
  | JSONObjectData
  | BlobData
  | ContextData
  | ChatMessageData;
export type ScalarDataType = ScalarData['type'];

export type ArrayOf<T extends ScalarData> = DataDef<
  `${T['type']}[]`,
  T['value'][]
>;
export type ArrayData = {
  [P in ScalarData['type']]: ArrayOf<Extract<ScalarData, { type: P }>>;
}[ScalarData['type']];
export type ArrayDataType = ArrayData['type'];

export type Data = ScalarData | ArrayData;
export type DataType = Data['type'];

export type ValueOf<T extends DataType> = Extract<Data, { type: T }>;

export type DataFields = {
  [key: string]: Data | undefined;
};

export const scalarDefaults: {
  [P in ScalarDataType]: Extract<ScalarData, { type: P }>['value'];
} = {
  string: '',
  number: 0,
  boolean: false,
  unknown: undefined,
  object: {},
  blob: new Blob(['']),
  context: new Context({ pageContent: '' }),
  'chat-message': new HumanMessage(''),
};

export const scalarTypes = exhaustiveTuple<ScalarDataType>()(
  'string',
  'number',
  'boolean',
  'unknown',
  'object',
  'blob',
  'context',
  'chat-message'
);

export const dataTypes = exhaustiveTuple<DataType>()(
  'string',
  'string[]',
  'number',
  'number[]',
  'boolean',
  'boolean[]',
  'unknown',
  'unknown[]',
  'object',
  'object[]',
  'blob',
  'blob[]',
  'context',
  'context[]',
  'chat-message',
  'chat-message[]'
);

export function isArrayData(data: Data | undefined): data is ArrayData {
  if (!data) return false;

  return (
    isArrayDataType(data.type) ||
    ((data.type === 'unknown' || data.type === 'object') &&
      Array.isArray(data.value))
  );
}
export function isArrayDataType(type: DataType): type is ArrayDataType {
  return type.endsWith('[]');
}

export function isScalarData(data: Data | undefined): data is ScalarData {
  if (!data) return false;

  return isScalarDataType(data.type);
}
export function isScalarDataType(type: DataType): type is ScalarDataType {
  return !isArrayDataType(type);
}

export function getScalarTypeOf(type: DataType): ScalarDataType {
  if (isArrayDataType(type)) {
    return toScalarFromArray(type);
  }

  return type;
}
export function toScalarFromArray(arrayType: ArrayDataType): ScalarDataType {
  return arrayType.slice(0, -2) as ScalarDataType;
}
export function toArrayFromScalar(scalarType: ScalarDataType): ArrayDataType {
  return `${scalarType}[]` as ArrayDataType;
}

/**
 * Turns a {@link ArrayData} into an array of {@link ScalarData}, or puts a
 * {@link ScalarData} into an array.
 *
 * @param data can be either {@link ArrayData} or {@link ScalarData}
 * @returns an array of {@link ScalarData}
 */
export function arrayizeData(data: Data): ScalarData[] {
  if (!isArrayData(data)) {
    return [data];
  }

  const type = data.type;
  const unwrappedType = isArrayDataType(type) ? toScalarFromArray(type) : type;

  return (data.value as unknown[]).map((v) => ({
    type: unwrappedType,
    value: v,
  })) as ScalarData[];
}

export function getDefaultValue<T extends DataType>(
  type: T
): (Data & { type: T })['value'] {
  if (isArrayDataType(type)) {
    return [] as any;
  }

  return scalarDefaults[getScalarTypeOf(type)] as any;
}
