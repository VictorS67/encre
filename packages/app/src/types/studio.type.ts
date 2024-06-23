import type {
  RecordId as IRecordId,
  SerializableNode as INode,
  NodeConnection as INodeConnection,
  NodeInputPortDef as INodeInputPortDef,
  NodeOutputPortDef as INodeOutputPortDef,
  NodePortFields as INodePortFields,
  DataType as IDataType,
  BuiltInNodeTypes as IBuiltInNodeTypes,
  BuiltInNodeTypePairs as IBuiltInNodeTypePairs,
} from '@encrejs/core';
import { globalNodeRegistry as coreGlobalNodeRegistry } from '@encrejs/core/studio/registration/nodes';
// import { extMap as coreExtMap } from '@encrejs/core/studio/ui';
// import { getRecordId as coreGetRecordId } from '@encrejs/core/utils/nanoid';

export const globalNodeRegistry = coreGlobalNodeRegistry;

export type RecordId = IRecordId;

// export function getRecordId() {
//   return coreGetRecordId();
// }

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
      | 'red'
      | 'orange'
      | 'gold'
      | 'yellow'
      | 'palmera'
      | 'green'
      | 'meadow'
      | 'cyan'
      | 'blue'
      | 'cornflower'
      | 'purple'
      | 'pink'
      | 'razzmatazz'
      | 'silver'
      | 'dark';
  };
};

export type CommentVisualInfo = VisualInfo & {
  content?: {
    horitontal?: 'center' | 'start' | 'end' | 'justify';
    vertical?: 'center' | 'start' | 'end';
    color?:
      | 'red'
      | 'orange'
      | 'gold'
      | 'yellow'
      | 'palmera'
      | 'green'
      | 'meadow'
      | 'cyan'
      | 'blue'
      | 'cornflower'
      | 'purple'
      | 'pink'
      | 'razzmatazz'
      | 'silver'
      | 'dark';
  };
};

export type NodeInputPortDef = INodeInputPortDef;

export type NodeOutputPortDef = INodeOutputPortDef;

export type NodePortFields = INodePortFields;

export interface BaseComment {
  id: string;

  visualInfo: CommentVisualInfo;

  title?: string | undefined;

  description?: string | undefined;
}

export interface PlainTextComment extends BaseComment {
  type: 'plain';
  text: string;
}

export interface MarkdownComment extends BaseComment {
  type: 'markdown';
  text: string;
}

export interface CodeComment extends BaseComment {
  type: 'code';
  text: string;

  language?: string;
  keywords?: string[];
}

export type GraphComment = PlainTextComment | MarkdownComment | CodeComment;

export interface Node extends INode {
  tags?: Array<string>;
  state?: 'init' | 'pending' | 'success' | 'failed';
  isDebug?: boolean;
}

export type NodeConnection = INodeConnection;

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
  properties?: string[];
  variables?: string[];
  isHoldingValues?: boolean;
};

export type BlobUIContext = {
  type: 'blob';
  blob: Array<ImageUIContext | AudioUIContext | FileUIContext>;
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

export type ImageUIContext = {
  type: 'image';
  mimeType: 'image/png' | 'image/jpeg' | 'image/gif' | 'image/svg+xml';
  data: Uint8Array;
};

export type AudioUIContext = {
  type: 'audio';
  mimeType: 'audio/mp3' | 'audio/wav' | 'audio/ogg';
  data: Uint8Array;
};

export type FileUIContext = {
  type: 'file';
  mimeType:
    | 'text/plain'
    | 'text/html'
    | 'text/javascript'
    | 'text/css'
    | 'application/json'
    | 'application/pdf'
    | 'application/xml';
  data: Uint8Array;
};

export type SerializedRuleMetadata = {
  left: SerializedRule;
  right?: SerializedRule;
  conjunction: 'and' | 'or';
};

export type SerializedRule = {
  _type: 'rule';
  _ruleType: string;
  description: string;
  func: string;
  variables?: Record<string, unknown>;
  metadata?: SerializedRuleMetadata;
};

export type SerializedRuleCollection = {
  _type: 'rule-collection';
  description: string;
  collection: Record<string, SerializedRule | SerializedRuleCollection>;
  conjunction: 'and' | 'or';
};

export type IfConditionUI = {
  type: 'if';
  description?: string;
  metadata?: SerializedRuleCollection;
  source?: string;
};

export type ElseIfConditionUI = {
  type: 'else-if';
  description?: string;
  metadata?: SerializedRuleCollection;
  source?: string;
};

export type OtherwiseConditionUI = {
  type: 'otherwise';
  source?: string;
};

export type ConditionUI =
  | IfConditionUI
  | ElseIfConditionUI
  | OtherwiseConditionUI;

export type ConditionUIContext = {
  type: 'condition';
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
  | ImageUIContext['mimeType']
  | AudioUIContext['mimeType']
  | FileUIContext['mimeType'],
  string
> = {
  'text/plain': 'bin',
  'text/html': 'html',
  'text/javascript': 'js',
  'text/css': 'css',
  'application/json': 'json',
  'application/pdf': 'pdf',
  'application/xml': 'xml',
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/gif': 'gif',
  'image/svg+xml': 'svg',
  'audio/mp3': 'mp3',
  'audio/ogg': 'ogg',
  'audio/wav': 'wav',
};
