import { importCompilerAPI, importLibFiles } from "./resources/api/imports";
import { CompilerPackageNames } from "./resources/api/versions";
import { CompilerAPI } from "./types";

const compilerTypes: { [name: string]: Promise<CompilerAPI> } = {};
const compilerTypesLoaded: { [name: string]: true } = {};

/* eslint-disable  @typescript-eslint/no-explicit-any */
async function loadCompilerAPI(packageName: CompilerPackageNames) {
  const libFilesPromise = importLibFiles(packageName);
  const compilerApiPromise = importCompilerAPI(packageName);
  const api = { ...((await compilerApiPromise) as any as CompilerAPI) };

  api.packageName = packageName;
  api.cachedSourceFiles = {};
  const libFiles = await libFilesPromise;

  for (const sourceFile of getLibSourceFiles()) {
    api.cachedSourceFiles[sourceFile.fileName] = sourceFile;
  }

  compilerTypesLoaded[packageName] = true;
  return api;

  function getLibSourceFiles() {
    return Object.keys(libFiles)
      .map(
        (key) => (libFiles as any)[key] as { fileName: string; text: string },
      )
      .map((libFile) =>
        api.createSourceFile(
          libFile.fileName,
          libFile.text,
          api.ScriptTarget.Latest,
          false,
          api.ScriptKind.TS,
        ),
      );
  }
}

export function getCompilerAPI(
  packageName: CompilerPackageNames,
): Promise<CompilerAPI> {
  if (compilerTypes[packageName] == null) {
    compilerTypes[packageName] = loadCompilerAPI(packageName);
    compilerTypes[packageName].catch(() => delete compilerTypes[packageName]);
  }
  return compilerTypes[packageName];
}
