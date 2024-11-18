import { TsCompilerAPI, TsScriptKind, TsScriptTarget } from "../types/tscompiler.type";

export function createSourceFile(
  code: string,
  api: TsCompilerAPI,
  scriptTarget: TsScriptTarget,
  scriptKind: TsScriptKind
) {
  const filePath = `/dummy.ts`;
  const sourceFile = api.createSourceFile(filePath, code, scriptTarget, false, scriptKind);
}

function getExtension(api: TsCompilerAPI, scriptKind: TsScriptKind) {
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
    default:
      return "";
  }
}