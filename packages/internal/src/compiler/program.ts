import * as ts from "typescript";
import { BindingTools, CompilerAPI } from "./types";
import { getExtension } from "./utils";

export function createSourceFile(
  api: CompilerAPI,
  id: string,
  code: string,
  scriptTarget: ts.ScriptTarget,
  scriptKind: ts.ScriptKind,
) {
  const fakeFile = `/${id}${getExtension(api, scriptKind)}`;
  const sourceFile = api.createSourceFile(
    fakeFile,
    code,
    scriptTarget,
    false,
    scriptKind,
  );

  let bindingToolInstance: BindingTools | undefined;

  return { sourceFile, bindingTools: getBindingTools };

  // binding may be disabled, so make this deferred
  function getBindingTools() {
    if (bindingToolInstance == null) {
      bindingToolInstance = getBindingResult();
    }
    return bindingToolInstance;
  }

  function getBindingResult() {
    const options: ts.CompilerOptions = {
      strict: true,
      target: scriptTarget,
      allowJs: true,
      module: api.ModuleKind.ESNext,
    };
    const files: { [name: string]: ts.SourceFile | undefined } = {
      [fakeFile]: sourceFile,
    };

    const compilerHost: ts.CompilerHost = {
      getSourceFile: (
        fileName: string,
        _languageVersion: ts.ScriptTarget,
        _onError?: (message: string) => void,
      ) => {
        return files[fileName];
      },
      // getSourceFileByPath: (...) => {}, // not providing these will force it to use the file name as the file path
      // getDefaultLibLocation: (...) => {},
      getDefaultLibFileName: (defaultLibOptions: ts.CompilerOptions) =>
        "/" + api.getDefaultLibFileName(defaultLibOptions),
      writeFile: () => {
        // do nothing
      },
      getCurrentDirectory: () => "/",
      getDirectories: (_path: string) => [],
      fileExists: (fileName: string) => files[fileName] != null,
      readFile: (fileName: string) =>
        files[fileName] != null ? files[fileName]!.getFullText() : undefined,
      getCanonicalFileName: (fileName: string) => fileName,
      useCaseSensitiveFileNames: () => true,
      getNewLine: () => "\n",
      getEnvironmentVariable: () => "",
    };
    const program = api.createProgram(
      [...Object.keys(files)],
      options,
      compilerHost,
    );
    const checker = program.getTypeChecker();

    return { checker, program };
  }
}
