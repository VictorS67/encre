import fs from "fs";

const keyRegEx = /^typescript(-[0-9]+\.[0-9]+\.[0-9]+)?$/;
const versionRegEx = /[0-9]+\.[0-9]+\.[0-9]+/;

/**
 * @param {{ version: string; name: string }[]} versions
 * @param {{ [x: string]: any; }} dependencies
 */
function findVersions(versions, dependencies) {
  for (const key of Object.keys(dependencies)) {
    if (!keyRegEx.test(key)) {
      continue;
    }

    const matches = versionRegEx.exec(dependencies[key] ?? '');

    if (matches) {
      versions.push({ version: matches[0], name: key });
    }
  }
}

export function getCompilerVersions() {
  const fileData = JSON.parse(fs.readFileSync("./package.json", "utf-8"));
  
  /**
   * @type {{ version: string; name: string; }[]}
   */
  const versions = [];

  findVersions(versions, fileData['dependencies']);
  findVersions(versions, fileData["devDependencies"]);

  return versions.sort((a, b) => {
    if (a.version.startsWith("@next")) {
      return 1;
    }
    if (b.version.startsWith("@next")) {
      return -1;
    }
    return a.version > b.version ? -1 : 1;
  });
}
