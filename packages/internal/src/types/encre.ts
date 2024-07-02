import type {
  RecordId as IRecordId,
  BaseComment as IBaseComment,
  PlainTextComment as IPlainTextComment,
  MarkdownComment as IMarkdownComment,
  CodeComment as ICodeComment,
  GraphComment as IGraphComment,
  SerializableNode as INode,
  NodeConnection as INodeConnection,
  NodeInputPortDef as INodeInputPortDef,
  NodeOutputPortDef as INodeOutputPortDef,
  NodePortFields as INodePortFields,
  NodePortSizes as INodePortSizes,
  MessageRole as IMessageRole,
  Context as IContext,
  ContentLike as IContentLike,
  BaseMessage as IBaseMessage,
  BaseMessageLike as IBaseMessageLike,
  StringData as IStringData,
  NumberData as INumberData,
  BooleanData as IBooleanData,
  UnknownData as IUnknownData,
  JSONObjectData as IJSONObjectData,
  BlobData as IBlobData,
  ContextData as IContextData,
  ChatMessageData as IChatMessageData,
  ScalarData as IScalarData,
  ArrayData as IArrayData,
  Data as IData,
  DataType as IDataType,
  UIContext as IUIContext,
  BaseUIContext as IBaseUIContext,
  PlainUIContext as IPlainUIContext,
  CodeUIContext as ICodeUIContext,
  BlobUIContext as IBlobUIContext,
  MarkdownUIContext as IMarkdownUIContext,
  ContextUIContext as IContextUIContext,
  MessageUIContext as IMessageUIContext,
  ImageUIContext as IImageUIContext,
  AudioUIContext as IAudioUIContext,
  FileUIContext as IFileUIContext,
  IfConditionUI as IIfConditionUI,
  ElseIfConditionUI as IElseIfConditionUI,
  OtherwiseConditionUI as IOtherwiseConditionUI,
  ConditionUI as IConditionUI,
  ConditionUIContext as IConditionUIContext,
  NodeRegistration as INodeRegistration,
  BuiltInNodeTypes as IBuiltInNodeTypes,
  BuiltInNodeTypePairs as IBuiltInNodeTypePairs,
  SerializedRuleMetadata as ISerializedRuleMetadata,
  SerializedRule as ISerializedRule,
  SerializedRuleCollection as ISerializedRuleCollection,
} from "@encrejs/core";
import { extMap as coreExtMap } from "@encrejs/core/studio/ui";
import { getRecordId as coreGetRecordId } from "@encrejs/core/utils/nanoid";
import { dataTypes as coreDataTypes } from "@encrejs/core/studio/data";

export type RecordId = IRecordId;

export function getRecordId() {
  return coreGetRecordId() as RecordId;
}

export type NodeRegistration = INodeRegistration;
export type BuiltInNodeTypes = IBuiltInNodeTypes;
export type BuiltInNodeTypePairs = IBuiltInNodeTypePairs;

// TODO: update encre/core
export interface Node extends INode {
  tags?: Array<string>;
  state?: "init" | "pending" | "success" | "failed";
  isDebug?: boolean;
}
export type VisualInfo = INode["visualInfo"];
export type NodePortSizes = INodePortSizes;
export type NodeConnection = INodeConnection;
export type NodeInputPortDef = INodeInputPortDef;
export type NodeOutputPortDef = INodeOutputPortDef;
export type NodePortFields = INodePortFields;
export type NodeBody = string | UIContext | UIContext[] | undefined;

export type CommentVisualInfo = IBaseComment["visualInfo"];
export type BaseComment = IBaseComment;
export type PlainTextComment = IPlainTextComment;
export type MarkdownComment = IMarkdownComment;
export type CodeComment = ICodeComment;
export type GraphComment = IGraphComment;

export interface Context extends IContext {}
export type MessageRole = IMessageRole;
export type ContentLike = IContentLike;

export interface BaseMessage extends IBaseMessage {}
export type BaseMessageLike = IBaseMessageLike;

export type StringData = IStringData;
export type NumberData = INumberData;
export type BooleanData = IBooleanData;
export type UnknownData = IUnknownData;
export type JSONObjectData = IJSONObjectData;
export type BlobData = IBlobData;
export type ContextData = IContextData;
export type ChatMessageData = IChatMessageData;

export type ScalarData = IScalarData;
export type ArrayData = IArrayData;
export type Data = IData;
export type DataType = IDataType;

export const dataTypes = coreDataTypes;

export interface Guardrail {
  id: string;
  name: string;
  detail: string;
  type: string;
  dataType: DataType | Readonly<DataType[]>;
}

export type BaseUIContext = IBaseUIContext;
export type PlainUIContext = IPlainUIContext;
export type MarkdownUIContext = IMarkdownUIContext;
// TODO: update encre/core
export type CodeUIContext = ICodeUIContext & {
  properties?: string[];
  variables?: string[];
};
export type BlobUIContext = IBlobUIContext;
export type ContextUIContext = IContextUIContext;
export type MessageUIContext = IMessageUIContext;
export type ImageUIContext = IImageUIContext;
export type AudioUIContext = IAudioUIContext;
export type FileUIContext = IFileUIContext;
export type ConditionUIContext = IConditionUIContext;
export type UIContext = IUIContext;

export type IfConditionUI = IIfConditionUI;
export type ElseIfConditionUI = IElseIfConditionUI;
export type OtherwiseConditionUI = IOtherwiseConditionUI;
export type ConditionUI = IConditionUI;

export const extMap = coreExtMap;

export type SerializedRuleMetadata = ISerializedRuleMetadata;
export type SerializedRule = ISerializedRule;
export type SerializedRuleCollection = ISerializedRuleCollection;
