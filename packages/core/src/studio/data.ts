import { Context } from '../events/input/load/docs/index.js';
import {
  type BaseMessageLike,
  HumanMessage,
} from '../events/input/load/msgs/index.js';
import { exhaustiveTuple } from '../utils/exhuastive.js';

/**
 * Defines a generic data structure with a specific type and runtime value.
 * @type T The string literal describing the data type.
 * @type RuntimeType The runtime type associated with the data.
 */
export type DataDef<T extends string, RuntimeType> = {
  /**
   * The data type.
   */
  type: T;

  /**
   * The data value.
   */
  value: RuntimeType;
};

/**
 * Represents a string data type with a value of type string.
 */
export type StringData = DataDef<'string', string>;

/**
 * Represents a number data type with a value of type number.
 */
export type NumberData = DataDef<'number', number>;

/**
 * Represents a boolean data type with a value of type boolean.
 */
export type BooleanData = DataDef<'boolean', boolean>;

/**
 * Represents an unknown data type with a value of type unknown.
 * In default, it means undefined or null values.
 */
export type UnknownData = DataDef<'unknown', unknown>;

/**
 * Represents a JSON object data type with a value of type object,
 * typically used for storing structured data.
 */
export type JSONObjectData = DataDef<'object', Record<never, never>>;

/**
 * Represents a blob data type with a value of type Blob,
 * commonly used for binary data such as images and files.
 */
export type BlobData = DataDef<'blob', Blob>;

/**
 * Represents a context data type with a value of type {@link Context},
 * often used for storing and passing around contextual information.
 */
export type ContextData = DataDef<'context', Context>;

/**
 * Represents a chat message data type with a value of type {@link BaseMessageLike},
 * designed for handling chat-based interactions and messages.
 */
export type ChatMessageData = DataDef<'chat-message', BaseMessageLike>;

/**
 * Any scalar data supported.
 */
export type ScalarData =
  | StringData
  | NumberData
  | BooleanData
  | UnknownData
  | JSONObjectData
  | BlobData
  | ContextData
  | ChatMessageData;

/**
 * Union type for all scalar data types supported.
 */
export type ScalarDataType = ScalarData['type'];

/**
 * Generic type for defining arrays of scalar data types.
 */
export type ArrayOf<T extends ScalarData> = DataDef<
  `${T['type']}[]`,
  T['value'][]
>;

/**
 * Generic type for array data based on scalar data types, defining the structure
 * of data arrays.
 */
export type ArrayData = {
  [P in ScalarData['type']]: ArrayOf<Extract<ScalarData, { type: P }>>;
}[ScalarData['type']];

/**
 * Represents the string type for arrays of scalar data.
 */
export type ArrayDataType = ArrayData['type'];

/**
 * Union type representing either scalar or array data types.
 */
export type Data = ScalarData | ArrayData;

/**
 * Type definition representing all possible data types within the system,
 * including both scalar and array variants.
 */
export type DataType = Data['type'];

/**
 * Utility type to extract the value corresponding to a specific data type.
 */
export type ValueOf<T extends DataType> = Extract<Data, { type: T }>;

/**
 * Utility type to extract the data type from a Data object.
 */
export type TypeOf<T extends Data> = T['type'];

/**
 * Defines a structure for mapping keys to data, allowing undefined values,
 * typically used to describe fields within a larger data structure or model.
 */
export type DataFields = {
  [key: string]: Data | undefined;
};

/**
 * A lookup table providing default values for all scalar data types.
 */
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

/**
 * A tuple containing all scalar data types, ensuring exhaustive inclusion
 * of all scalar types.
 */
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

/**
 * A tuple containing all possible data types, ensuring exhaustive inclusion
 * of both scalar and array types.
 */
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

/**
 * Checks if a given data instance is an array data type.
 */
export function isArrayData(data: Data | undefined): data is ArrayData {
  if (!data) return false;

  return (
    isArrayDataType(data.type) ||
    ((data.type === 'unknown' || data.type === 'object') &&
      Array.isArray(data.value))
  );
}

/**
 * Determines if a data type string represents an array data type.
 */
export function isArrayDataType(type: DataType): type is ArrayDataType {
  return type.endsWith('[]');
}

/**
 * Checks if a given data instance is a scalar data type.
 */
export function isScalarData(data: Data | undefined): data is ScalarData {
  if (!data) return false;

  return isScalarDataType(data.type);
}

/**
 * Determines if a data type string represents a scalar data type.
 */
export function isScalarDataType(type: DataType): type is ScalarDataType {
  return !isArrayDataType(type);
}

/**
 * Extracts the scalar type from a given data type, handling both scalar
 * and array types.
 */
export function getScalarTypeOf(type: DataType): ScalarDataType {
  if (isArrayDataType(type)) {
    return toScalarFromArray(type);
  }

  return type;
}

/**
 * Converts an array data type string to its corresponding scalar data type string.
 */
export function toScalarFromArray(arrayType: ArrayDataType): ScalarDataType {
  return arrayType.slice(0, -2) as ScalarDataType;
}

/**
 * Converts a scalar data type string to its corresponding array data type string.
 */
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

/**
 * Retrieves the default value for a given data type, considering both scalar and array forms.
 *
 */
export function getDefaultValue<T extends DataType>(
  type: T
): (Data & { type: T })['value'] {
  if (isArrayDataType(type)) {
    return [] as any;
  }

  return scalarDefaults[getScalarTypeOf(type)] as any;
}
