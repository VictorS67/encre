import * as ts from "typescript";
import { CompilerPackageNames } from "./resources/api/versions.js";

export interface CompilerAPI {
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
  // Internal enum
  CheckFlags: object;
  // Internal enum
  TransformFlags: object;
  // Internal enum
  TypeMapKind: object;
  packageName: CompilerPackageNames;
  cachedSourceFiles: { [name: string]: ts.SourceFile | undefined };
  version: string;
  getLeadingCommentRanges: typeof ts.getLeadingCommentRanges;
  getTrailingCommentRanges: typeof ts.getTrailingCommentRanges;
}

export interface BindingTools {
  program: ts.Program;
  checker: ts.TypeChecker;
}
