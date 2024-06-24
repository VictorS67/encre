import type {
  RecordId as IRecordId,
  // SerializableNode as INode,
  // NodeConnection as INodeConnection,
  // NodeInputPortDef as INodeInputPortDef,
  // NodeOutputPortDef as INodeOutputPortDef,
  // NodePortFields as INodePortFields,
  DataType as IDataType,
  ChatMessageData,
  NodeRegistration as INodeRegistration,
  BuiltInNodeTypes as IBuiltInNodeTypes,
  BuiltInNodeTypePairs as IBuiltInNodeTypePairs,
} from "@encrejs/core";
// import { globalNodeRegistry as coreGlobalNodeRegistry } from '@encrejs/core/studio/registration/nodes';
import { extMap as coreExtMap } from "@encrejs/core/studio/ui";
import { getRecordId as coreGetRecordId } from "@encrejs/core/utils/nanoid";

// export const globalNodeRegistry = coreGlobalNodeRegistry;

export type RecordId = IRecordId;

export function getRecordId() {
  return coreGetRecordId();
}

export type NodeRegistration = INodeRegistration;

export type BuiltInNodeTypes = IBuiltInNodeTypes;

export type BuiltInNodeTypePairs = IBuiltInNodeTypePairs;

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
  content?: {
    color?:
      | "red"
      | "orange"
      | "gold"
      | "yellow"
      | "palmera"
      | "green"
      | "meadow"
      | "cyan"
      | "blue"
      | "cornflower"
      | "purple"
      | "pink"
      | "razzmatazz"
      | "silver"
      | "dark";
  };
};

export type CommentVisualInfo = VisualInfo & {
  content?: {
    horitontal?: "center" | "start" | "end" | "justify";
    vertical?: "center" | "start" | "end";
    color?:
      | "red"
      | "orange"
      | "gold"
      | "yellow"
      | "palmera"
      | "green"
      | "meadow"
      | "cyan"
      | "blue"
      | "cornflower"
      | "purple"
      | "pink"
      | "razzmatazz"
      | "silver"
      | "dark";
  };
};

export type NodeInputPortDef = {
  nodeId: RecordId;
  name: string;
  type: DataType | Readonly<DataType[]>;
  required?: boolean;
  data?: ValueOf<DataType> | Readonly<ValueOf<DataType>[]>;
  default?: unknown;
};

export type NodeOutputPortDef = {
  nodeId: RecordId;
  name: string;
  type: DataType | Readonly<DataType[]>;
  required?: boolean;
  data?: ValueOf<DataType> | Readonly<ValueOf<DataType>[]>;
  default?: unknown;
};

export type NodePortFields = {
  [key: string]: DataType | Readonly<DataType[]>;
};

export interface BaseComment {
  id: string;

  visualInfo: CommentVisualInfo;

  title?: string | undefined;

  description?: string | undefined;
}

export interface PlainTextComment extends BaseComment {
  type: "plain";
  text: string;
}

export interface MarkdownComment extends BaseComment {
  type: "markdown";
  text: string;
}

export interface CodeComment extends BaseComment {
  type: "code";
  text: string;

  language?: string;
  keywords?: string[];
}

export type GraphComment = PlainTextComment | MarkdownComment | CodeComment;

export type NodePortSizes = {
  [key: string]: number;
};

export interface Node {
  id: RecordId;
  visualInfo: {
    position: {
      x: number;
      y: number;
      zIndex?: number;
    };
    size: {
      width: number;
      height: number;
    };
    content?: {
      color?:
        | "red"
        | "orange"
        | "gold"
        | "yellow"
        | "palmera"
        | "green"
        | "meadow"
        | "cyan"
        | "blue"
        | "cornflower"
        | "purple"
        | "pink"
        | "razzmatazz"
        | "silver"
        | "dark";
    };
  };
  inputs: NodePortFields | undefined;
  outputs: NodePortFields | undefined;
  title?: string | undefined;
  description?: string | undefined;
  outputSizes?: NodePortSizes | undefined;

  type: string;
  subType: string;
  registerArgs?: Record<string, unknown>;
  runtime?: number;
  memory?: number;
  data: any;

  tags?: Array<string>;
  state?: "init" | "pending" | "success" | "failed";
  isDebug?: boolean;
}

export type NodeConnection = {
  fromNodeId: RecordId;
  fromPortName: string;
  toNodeId: RecordId;
  toPortName: string;
};

export interface Context<Metadata = Record<string, unknown>> {
  pageContent: string;
  metadata: Metadata;
}

export type MessageRole =
  | "human"
  | "assistant"
  | "system"
  | "function"
  | "general";

export type ContentLike =
  | string
  | {
      [key: string]: unknown;
    };

export interface BaseMessage {
  content: ContentLike | ContentLike[];
  name?: string;
  additionalKwargs?: {
    [key: string]: unknown;
  };
}

export type BaseMessageLike = BaseMessage | [MessageRole, string] | string;

export type StringData = DataDef<"string", string>;
export type NumberData = DataDef<"number", number>;
export type BooleanData = DataDef<"boolean", boolean>;
export type UnknownData = DataDef<"unknown", unknown>;
export type JSONObjectData = DataDef<"object", Record<never, never>>;
export type BlobData = DataDef<"blob", Blob>;
export type ContextData = DataDef<"context", Context>;
// export type ChatMessageData = DataDef<'chat-message', BaseMessageLike>;

export type ScalarData =
  | StringData
  | NumberData
  | BooleanData
  | UnknownData
  | JSONObjectData
  | BlobData
  | ContextData
  | ChatMessageData;

export type DataDef<T extends string, RuntimeType> = {
  type: T;
  value: RuntimeType;
};

export type ArrayOf<T extends ScalarData> = DataDef<
  `${T["type"]}[]`,
  T["value"][]
>;

export type ArrayData = {
  [P in ScalarData["type"]]: ArrayOf<
    Extract<
      ScalarData,
      {
        type: P;
      }
    >
  >;
}[ScalarData["type"]];

export type Data = ScalarData | ArrayData;

export type ValueOf<T extends DataType> = Extract<
  Data,
  {
    type: T;
  }
>;

export type DataType = IDataType;

export interface Guardrail {
  id: string;
  name: string;
  detail: string;
  type: string;
  dataType: DataType | Readonly<DataType[]>;
}

export type NodeBody = string | UIContext | UIContext[] | undefined;

export type BaseUIContext = {
  fontSize?: number;
  fontFamily?: "monospace" | "sans-serif";
  isReadOnly?: boolean;
};

export type PlainUIContext = {
  type: "plain";
  text: string;
};

export type MarkdownUIContext = {
  type: "markdown";
  text: string;
};

export type CodeUIContext = {
  type: "code";
  text: string;

  language?: string;
  keywords?: string[];
  properties?: string[];
  variables?: string[];
  isHoldingValues?: boolean;
};

export type BlobUIContext = {
  type: "blob";
  blob: Array<ImageUIContext | AudioUIContext | FileUIContext>;
  size: number;
  blobType: string;
};

export type ContextUIContext = {
  type: "context";
  text: Array<PlainUIContext | MarkdownUIContext | CodeUIContext>;
  metadata: Array<PlainUIContext | MarkdownUIContext | CodeUIContext>;
};

export type MessageUIContext = {
  type: "message";
  content: Array<PlainUIContext | MarkdownUIContext | CodeUIContext>;
  kwargs: Array<PlainUIContext | MarkdownUIContext | CodeUIContext>;
  role: string;

  name?: string;
};

export type ImageUIContext = {
  type: "image";
  mimeType: "image/png" | "image/jpeg" | "image/gif" | "image/svg+xml";
  data: Uint8Array;
};

export type AudioUIContext = {
  type: "audio";
  mimeType: "audio/mp3" | "audio/wav" | "audio/ogg";
  data: Uint8Array;
};

export type FileUIContext = {
  type: "file";
  mimeType:
    | "text/plain"
    | "text/html"
    | "text/javascript"
    | "text/css"
    | "application/json"
    | "application/pdf"
    | "application/xml";
  data: Uint8Array;
};

export type SerializedRuleMetadata = {
  left: SerializedRule;
  right?: SerializedRule;
  conjunction: "and" | "or";
};

export type SerializedRule = {
  _type: "rule";
  _ruleType: string;
  description: string;
  func: string;
  variables?: Record<string, unknown>;
  metadata?: SerializedRuleMetadata;
};

export type SerializedRuleCollection = {
  _type: "rule-collection";
  description: string;
  collection: Record<string, SerializedRule | SerializedRuleCollection>;
  conjunction: "and" | "or";
};

export type IfConditionUI = {
  type: "if";
  description?: string;
  metadata?: SerializedRuleCollection;
  source?: string;
};

export type ElseIfConditionUI = {
  type: "else-if";
  description?: string;
  metadata?: SerializedRuleCollection;
  source?: string;
};

export type OtherwiseConditionUI = {
  type: "otherwise";
  source?: string;
};

export type ConditionUI =
  | IfConditionUI
  | ElseIfConditionUI
  | OtherwiseConditionUI;

export type ConditionUIContext = {
  type: "condition";
  target: string;
  sources: string[];
  conditions: ConditionUI[];
};

export type UIContext = BaseUIContext &
  (
    | PlainUIContext
    | MarkdownUIContext
    | CodeUIContext
    | BlobUIContext
    | ContextUIContext
    | MessageUIContext
    | ImageUIContext
    | AudioUIContext
    | FileUIContext
    | ConditionUIContext
  );

export const extMap: Record<
  | ImageUIContext["mimeType"]
  | AudioUIContext["mimeType"]
  | FileUIContext["mimeType"],
  string
> = coreExtMap;
