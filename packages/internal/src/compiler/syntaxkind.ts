import * as ts from "typescript";
import { CompilerAPI } from "./types";

const kindCache: { [packageName: string]: { [kind: number]: string } } = {};

function getKindCacheForAPI(api: CompilerAPI) {
  if (kindCache[api.packageName] == null) {
    kindCache[api.packageName] = getKindNamesForAPI(api);
  }
  return kindCache[api.packageName];
}

/* eslint-disable  @typescript-eslint/no-explicit-any */
function getKindNamesForAPI(api: CompilerAPI) {
  // some SyntaxKinds are repeated, so only use the first one
  const kindNames: { [kind: number]: string } = {};
  for (const name of Object.keys(api.SyntaxKind).filter((k) =>
    isNaN(parseInt(k, 10)),
  )) {
    const value = (api.SyntaxKind as any)[name] as number;
    if (kindNames[value] == null) {
      kindNames[value] = name;
    }
  }
  return kindNames;
}

export function getSyntaxKindName(api: CompilerAPI, kind: ts.SyntaxKind) {
  return getKindCacheForAPI(api)[kind];
}
