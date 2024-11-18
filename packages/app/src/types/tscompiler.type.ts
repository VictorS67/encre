import * as ts from "typescript";

export interface TsCompilerAPI {
  createSourceFile: typeof ts.createSourceFile;
  createProgram: typeof ts.createProgram;
  getDefaultLibFileName: typeof ts.getDefaultLibFileName;
  forEachChild: typeof ts.forEachChild;
  ScriptTarget: typeof ts.ScriptTarget;
  ScriptKind: typeof ts.ScriptKind;
  SyntaxKind: typeof ts.SyntaxKind;
  ModifierFlags: typeof ts.ModifierFlags;
  ModuleKind: typeof ts.ModuleKind;
  NodeFlags: typeof ts.NodeFlags;
  ObjectFlags: typeof ts.ObjectFlags;
  SymbolFlags: typeof ts.SymbolFlags;
  TypeFlags: typeof ts.TypeFlags;
  FlowFlags: typeof ts.FlowFlags;
  // Internal enum
  CheckFlags: object;
  // Internal enum
  TransformFlags: object;
  // Internal enum
  TypeMapKind: object;
  version: string;
  getLeadingCommentRanges: typeof ts.getLeadingCommentRanges;
  getTrailingCommentRanges: typeof ts.getTrailingCommentRanges;
}

export type TsNode = ts.Node;
export type TsType = ts.Type;
export type TsSignature = ts.Signature;
export type TsSourceFile = ts.SourceFile;
export type TsSymbol = ts.Symbol;
export type TsProgram = ts.Program;
export type TsTypeChecker = ts.TypeChecker;
export type TsCompilerOptions = ts.CompilerOptions;
export type TsScriptTarget = ts.ScriptTarget;
export type TsScriptKind = ts.ScriptKind;
export type TsNodeFlags = ts.NodeFlags;
export type TsObjectFlags = ts.ObjectFlags;
export type TsSymbolFlags = ts.SymbolFlags;
export type TsTypeFlags = ts.TypeFlags;
export type TsSyntaxKind = ts.SyntaxKind;
export type TsCompilerHost = ts.CompilerHost;
export type TsCommentRange = ts.CommentRange;
export type TsFlowNode = ts.FlowNode;