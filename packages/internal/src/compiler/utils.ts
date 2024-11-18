import * as ts from "typescript";
import { CompilerAPI } from "./types";

export function getExtension(api: CompilerAPI, scriptKind: ts.ScriptKind) {
  switch (scriptKind) {
    case api.ScriptKind.TS:
      return ".ts";
    case api.ScriptKind.TSX:
      return ".tsx";
    case api.ScriptKind.JS:
      return ".js";
    case api.ScriptKind.JSX:
      return ".jsx";
    case api.ScriptKind.JSON:
      return ".json";
    case api.ScriptKind.External:
    case api.ScriptKind.Deferred:
    case api.ScriptKind.Unknown:
      return "";
    default:
      throw new Error(`Not implemented ScriptKind: ${api.ScriptKind[scriptKind]}`);
  }
}