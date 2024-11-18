import fs from "fs";
import path from "path";
import ts from "typescript";
import { globSync } from "glob";
import { createMinifier } from "dts-minify";

import { getCompilerVersions } from './get-ts-versions.mjs';

const minifier = createMinifier(ts);

const LIB_FILE_PATH = './src/compiler/resources/libFiles';

const cleanGenerated = () => {
  const filesToDelete = globSync(`${LIB_FILE_PATH}/**/*.ts`);

  filesToDelete.forEach((fileName) => {
    try {
      fs.unlinkSync(fileName);
    } catch {}
  });
};

/**
 * @param {{ version: string; name: string }[]} versions
 */
const updateLibFiles = (versions) => {
  for (const version of versions) {
    const filePaths = globSync(`./node_modules/${version.name}/lib/lib*.d.ts`);
    filePaths.sort();

    const libVersionDir = path.resolve(LIB_FILE_PATH, version.name);
    if (!fs.existsSync(libVersionDir)) {
      fs.mkdirSync(libVersionDir, { recursive: true });
    }

    for (const filePath of filePaths) {
      const newFilePath = path.resolve(libVersionDir, `${path.basename(filePath, ".d.ts")}.ts`);
      const fileText = fs.readFileSync(filePath).toString("utf8");

      fs.writeFileSync(
        newFilePath,
        `const fileData = {\n` +
          `    fileName: \`/${path.basename(filePath)}\`,\n` +
          `    // File text is copyright Microsoft Corporation and is distributed under the Apache License, Version 2.0 (http://www.apache.org/licenses/LICENSE-2.0)\n` +
          `    text: \"${minifier.minify(fileText).replace(/\r?\n/g, "\\n").replace(/"/g, '\\"')}\"\n` +
          `};\n\n` +
          `export default fileData;`,
        { encoding: "utf8" },
      );
    }

    fs.writeFileSync(
      path.resolve(libVersionDir, "index.ts"),
      filePaths
        .map((p) => path.basename(p, ".d.ts"))
        .map((p, i) => "export { default as export" + i + ' } from "./' + p + '.js";').join("\n") + "\n",
      { encoding: "utf8" },
    );
  }
}

const versions = getCompilerVersions();

cleanGenerated();
updateLibFiles(versions);
