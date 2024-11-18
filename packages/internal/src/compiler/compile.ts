import * as ts from "typescript";
import { CompilerPackageNames } from "./resources/api/versions";
import { getCompilerAPI } from "./api";
import { createSourceFile } from "./program";

export async function compile(
  id: string, 
  code: string, 
  packageName: CompilerPackageNames = "typescript",
  scriptTarget: ts.ScriptTarget = 99 /* Latest */,
  scriptKind: ts.ScriptKind = 6 /* JSON */
) {
  const api = await getCompilerAPI(packageName);
  const { sourceFile, bindingTools } = createSourceFile(api, id, code, scriptTarget, scriptKind);
  const { program, checker } = bindingTools();
  return { api, sourceFile, program, checker };
}