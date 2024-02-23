import type { Opaque } from 'type-fest';

export type BuiltInNodeType =
  | 'loader'
  | 'message'
  | 'prompt'
  | 'splitter'
  | 'llm'
  | 'chatlm';

export type BuiltInNodeTypePairs = {
  loader: string[];
  message: string[];
  prompt: string[];
  splitter: string[];
  llm: string[];
  chatlm: string[];
};

export type VisualInfo = {
  position: {
    x: number;
    y: number;
    zIndex: number;
  };
  size: {
    width: number;
    height: number;
  };
};

export type NodeInputPortDef = {
  id: string;
  name: string;
  type: string | string[];
  data?: unknown | unknown[];
  default?: unknown;
};

export type NodeOutputPortDef = {
  id: string;
  name: string;
  type: string | string[];
  data?: unknown | unknown[];
  default?: unknown;
};

export type NodePortFields = {
  [key: string]: DataType | Readonly<DataType[]>;
};

// This is mocking NodeImpl
export interface Node {
  id: string;
  type: string;
  subType: string;
  title: string;
  name: string;
  aliases: {
    [key: string]: string;
  };
  secrets: {
    [key: string]: string;
  };
  kwargs: DataFields;
  inputs: NodePortFields | undefined;
  outputs: NodePortFields | undefined;
  visualInfo: VisualInfo;

  setKwarg: (key: string, value: unknown) => void;
  getInputPortDefs: () => NodeInputPortDef[];
  getOutputPortDefs: () => NodeOutputPortDef[];
  validateInputs: (inputs?: ProcessInputMap) => boolean;
  getBody: () => Promise<NodeBody>;
  process: (
    inputs: ProcessInputMap,
    context: ProcessContext,
  ) => Promise<ProcessOutputMap>;

  tags?: Array<string>;
  state?: 'init' | 'pending' | 'success' | 'failed';
  isDebug?: boolean;
}

export function getNodeTypes() {
  return ['loader', 'message', 'prompt', 'splitter', 'llm', 'chatlm'];
}

/**
 * Creates a tuple ensuring at least one instance of each specified string literal type.
 *
 * `exhaustiveTuple` is a higher-order function for compile-time validation of tuples to contain at least
 * one of each specified string literal in type `T`. Useful in cases requiring a complete set of specified literals.
 *
 * @see https://stackoverflow.com/questions/55265679/enforce-that-an-array-is-exhaustive-over-a-union-type/55266531#55266531
 *
 * @example
 * ```
 * type Fruit = "apple" | "banana" | "cherry";
 *
 * const missingFruit = exhaustiveTuple<Fruit>()("apple", "banana");
 * // error, argument of type '"apple"' is not assignable to parameter of type '"cherry"'
 *
 * const extraFruit = exhaustiveTuple<Fruit>()("apple", "banana", "cherry", "orange");
 * // error, "orange" is not assignable to a parameter of type 'Fruit'
 *
 * const fruitTuple = exhaustiveTuple<Fruit>()("apple", "banana", "cherry");
 * // fruitTuple is now ensured to contain each literal in `Fruit` at least once.
 * ```
 */
export const exhaustiveTuple =
  <T extends string>() =>
  <L extends AtLeastOne<T>>(
    ...x: [T] extends any
      ? Exclude<T, L[number]> extends never
        ? L
        : Exclude<T, L[number]>[]
      : never
  ) =>
    x;

type AtLeastOne<T> = [T, ...T[]];

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

export type ScalarData =
  | StringData
  | NumberData
  | BooleanData
  | UnknownData
  | JSONObjectData
  | BlobData;
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
};

export const scalarTypes = exhaustiveTuple<ScalarDataType>()(
  'string',
  'number',
  'boolean',
  'unknown',
  'object',
  'blob',
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
  type: T,
): (Data & { type: T })['value'] {
  if (isArrayDataType(type)) {
    return [] as any;
  }

  return scalarDefaults[getScalarTypeOf(type)] as any;
}

export type NodeBody = string | UIContext | UIContext[] | undefined;

export type BaseUIContext = {
  fontSize?: number;
  fontFamily?: 'monospace' | 'sans-serif';
  isReadOnly?: boolean;
};

export type PlainUIContext = {
  type: 'plain';
  text: string;
};

export type MarkdownUIContext = {
  type: 'markdown';
  text: string;
};

export type CodeUIContext = {
  type: 'code';
  text: string;

  language?: string;
  keywords?: string[];
  isHoldingValues?: boolean;
};

export type BlobUIContext = {
  type: 'blob';
  blob: Blob;
  size: number;
  blobType: string;
};

export type ContextUIContext = {
  type: 'context';
  text: Array<PlainUIContext | MarkdownUIContext | CodeUIContext>;
  metadata: Array<PlainUIContext | MarkdownUIContext | CodeUIContext>;
};

export type MessageUIContext = {
  type: 'message';
  content: Array<PlainUIContext | MarkdownUIContext | CodeUIContext>;
  kwargs: Array<PlainUIContext | MarkdownUIContext | CodeUIContext>;
  role: string;

  name?: string;
};

export type UIContext = BaseUIContext &
  (
    | PlainUIContext
    | MarkdownUIContext
    | CodeUIContext
    | BlobUIContext
    | ContextUIContext
    | MessageUIContext
  );

export const UIDataTypesMap: Record<DataType, UIContext['type']> = {
  string: 'code',
  number: 'code',
  boolean: 'code',
  object: 'code',
  unknown: 'code',
  blob: 'blob',
  'string[]': 'code',
  'number[]': 'code',
  'boolean[]': 'code',
  'object[]': 'code',
  'unknown[]': 'code',
  'blob[]': 'blob',
};

export type ProcessId = Opaque<string, 'ProcessId'>;

export type ProcessInputMap = Record<string, Data | undefined>;
export type ProcessOutputMap = Record<string, Data | undefined>;

export type ProcessDataMap = ProcessInputMap | ProcessOutputMap;

export type ProcessContext = {
  processId: ProcessId;

  signal: AbortSignal;

  contextData: Record<string, Data>;

  graphInputs: Record<string, Data>;

  graphOutputs: Record<string, Data>;
};

/**
 * Validate whether the ports are full-filled with the process data.
 */
export function validateProcessDataFromPorts(
  processData: ProcessDataMap,
  portFields: NodePortFields,
): boolean {
  const keywords: string[] = Object.keys(portFields);

  return keywords.every((keyword: string): boolean => {
    // Return false if there is no such a port keyword in the process data.
    if (!Object.prototype.hasOwnProperty.call(processData, keyword)) {
      return false;
    }

    const processValue: Data | undefined = processData[keyword];
    const portType: DataType | Readonly<DataType[]> = portFields[keyword];

    // Check if this keyword can support multiple types of data
    if (Array.isArray(portType)) {
      // Return true if the process data value and the type are both empty.
      if (!processValue) {
        return (
          portType.length === 0 ||
          portType.some((t: DataType) => t === 'unknown')
        );
      }

      // Return true if there is some type in the type array that can be valid.
      // TODO: think about if coerceTypeOptional can apply here
      return portType.some((t: DataType) => processValue['type'] === t);
    }

    // Return false if the process data value is empty and the type is non-empty.
    if (!processValue) return portType === 'unknown';

    // Validate the types
    // TODO: think about if coerceTypeOptional can apply here
    return processValue['type'] === portType;
  });
}
