import fs from "fs";
import path from "path";
import { identifySecrets } from "./identify-secrets.js";

// const currentPath = process.cwd();
// console.log(`Current path: ${currentPath}`);
// console.log(`Parent path: ${path.dirname(currentPath)}`);

// This lists all the entrypoints for the library. Each key corresponds to an
// importable path, eg. `import { Callable } from "record/callable"`.
// The value is the path to the file in `src/` that exports the entrypoint.
// This is used to generate the `exports` field in package.json.
// Order is not important.
const entrypoints = {
  // load
  load: "load/index",
  "load/serializable": "load/serializable",
  // record
  "record/callable": "record/callable",
  // cache
  cache: "cache/index",
  "cache/base": "cache/base",
  // events/input/load/docs
  "events/input/load/docs/base": "events/input/load/docs/base",
  "events/input/load/docs/buffer": "events/input/load/docs/buffer",
  "events/input/load/docs/context": "events/input/load/docs/context",
  "events/input/load/docs/pdf": "events/input/load/docs/pdf",
  // events/input/load/msgs
  "events/input/load/msgs/base": "events/input/load/msgs/base",
  // events/input/load/prompts
  "events/input/load/prompts/base": "events/input/load/prompts/base",
  "events/input/load/prompts/chat": "events/input/load/prompts/chat",
  // events/output/provide
  "events/output/provide/base": "events/output/provide/base",
  "events/output/provide/file": "events/output/provide/file",
  "events/output/provide/generation": "events/output/provide/generation",
  "events/output/provide/llmresult": "events/output/provide/llmresult",
  "events/output/provide/message": "events/output/provide/message",
  // events/inference/chat/llms
  "events/inference/chat/llms/base": "events/inference/chat/llms/base",
  // utils
  "utils/nanoid": "utils/nanoid",
};

const deprecatedNodeOnly = [];

// Entrypoints in this list require an optional dependency to be installed.
const reuqiresOptionalDependency = [
  // record
  "record/callable",
  // cache
  "cache",
  "cache/base",
  // events/input/load/docs
  "events/input/load/docs/buffer",
  "events/input/load/docs/pdf",
  "events/input/load/docs/base",
  // events/input/load/msgs
  "events/input/load/msgs/base",
  // events/input/load/prompts
  "events/input/load/prompts/base",
  "events/input/load/prompts/chat",
  // events/output/provide
  "events/output/provide/base",
  "events/output/provide/file",
  "events/output/provide/llmresult",
  "events/output/provide/message"
];

// const testExports = [
//   [
//     "test-exports-esm",
//     (p) => `import * as ${p.replace(/\//g, "_")} from "./${p}";`,
//   ],
//   [
//     "test-exports-esbuild",
//     (p) => `import * as ${p.replace(/\//g, "_")} from "./${p}";`,
//   ],
//   [
//     "test-exports-cjs",
//     (p) => `const ${p.replace(/\//g, "_")} = require("./${p}");`,
//   ],
//   ["test-exports-cf", (p) => `export * from "./${p}";`],
//   ["test-exports-vercel", (p) => `export * from "./${p}";`],
//   ["test-exports-vite", (p) => `export * from "./${p}";`],
//   ["test-exports-bun", (p) => `export * from "./${p}";`],
// ];

const updateJSONFile = (relativePath, updateFunction) => {
  const contents = fs.readFileSync(relativePath).toString();
  // console.log(`updateJSONFile contents: ${contents}`);

  const res = updateFunction(JSON.parse(contents));
  fs.writeFileSync(relativePath, JSON.stringify(res, null, 2) + "\n");
};

const generateFiles = () => {
  const files = [...Object.entries(entrypoints), ["index", "index"]].flatMap(
    ([key, value]) => {
      const numOfParents = key.split("/").length - 1;
      const relativePath = "../".repeat(numOfParents) || "./";
      const compiledPath = `${relativePath}build/${value}.js`;
      return [
        [
          `${key}.cjs`,
          `module.exports = require('${relativePath}build/${value}.cjs');`,
        ],
        [`${key}.js`, `export * from '${compiledPath}'`],
        [`${key}.d.ts`, `export * from '${compiledPath}'`],
      ];
    }
  );

  return Object.fromEntries(files);
};

const updateConfig = () => {
  // Update tsconfig.json `typedocOptions.entrypoints` fields

  updateJSONFile("./tsconfig.json", (json) => {
    // console.log(`json: ${JSON.stringify(json)}`);
    // console.log(
    //   `update json: ${{
    //     ...json,
    //     typedocOptions: {
    //       ...json.typedocOptions,
    //       entrypoints: [...Object.keys(entrypoints)]
    //         .filter((key) => !deprecatedNodeOnly.includes(key))
    //         .map((key) => `src/${entrypoints[key]}.ts`),
    //     },
    //   }}`
    // );
    return {
      ...json,
      typedocOptions: {
        ...json.typedocOptions,
        entrypoints: [...Object.keys(entrypoints)]
          .filter((key) => !deprecatedNodeOnly.includes(key))
          .map((key) => `src/${entrypoints[key]}.ts`),
      },
    };
  });

  const generatedFiles = generateFiles();
  const filenames = Object.keys(generatedFiles);

  // Update package.json `exports` and `files` fields
  updateJSONFile("./package.json", (json) => ({
    ...json,
    exports: Object.assign(
      Object.fromEntries(
        [...Object.keys(entrypoints)].map((key) => {
          let entryPoint = {
            types: `./${key}.d.ts`,
            import: `./${key}.js`,
            require: `./${key}.cjs`,
          };

          if (deprecatedNodeOnly.includes(key)) {
            entryPoint = {
              node: entryPoint,
            };
          }

          return [`./${key}`, entryPoint];
        })
      ),
      { "./package.json": "./package.json" }
    ),
    files: ["build/", ...filenames],
  }));

  // Write files
  Object.entries(generatedFiles).forEach(([filename, cotnent]) => {
    fs.mkdirSync(path.dirname(filename), { recursive: true });
    fs.writeFileSync(filename, cotnent);
  });

  // Update .gitignore
  fs.writeFileSync("./.gitignore", filenames.join("\n") + "\n");

  // Update test-exports-*/entrypoints.js
  // const entrypointsToTest = Object.keys(entrypoints)
  //   .filter((key) => !deprecatedNodeOnly.includes(key))
  //   .filter((key) => !reuqiresOptionalDependency.includes(key));

  // testExports.forEach(([pkg, importStatement]) => {
  //   const contents =
  //     entrypointsToTest.map((key) => importStatement(key)).join("\n") + "\n";
  //   fs.writeFileSync(`../core_env_tests/${pkg}/src/entrypoints.js`, contents);
  // });
};

const cleanGenerated = () => {
  const filenames = Object.keys(generateFiles());
  filenames.forEach((filename) => {
    try {
      fs.unlinkSync(filename);
    } catch {}
  });
};

const importMap = [
  (k, p) => `export * as ${k.replace(/\//g, "_")} from "../${p}.js";`,
  "src/load/importMap.ts",
];

const generatedImportMap = () => {
  // Generate import map
  const entrypointsToInclude = Object.keys(entrypoints)
    .filter((key) => key !== "load")
    .filter((key) => !deprecatedNodeOnly.includes(key))
    .filter((key) => !reuqiresOptionalDependency.includes(key));

  const [importStatement, importMapPath] = importMap;

  const contents =
    entrypointsToInclude
      .map((key) => importStatement(key, entrypoints[key]))
      .join("\n") + "\n";

  fs.writeFileSync(
    `./${importMapPath}`,
    "// This file is generated by `scripts/create-entrypoints.js`. DO NOT edit manually.\n\n" +
      contents
  );
};

const importTypes = [
  (k, p) =>
    `  "${k}"?:
    | typeof import("./${p}.js")
    | Promise<typeof import("./${p}.js")>;`,
  "src/load/importType.d.ts",
];

const generateImportTypes = () => {
  // Generate import types
  const [importStatement, importTypesPath] = importTypes;
  fs.writeFileSync(
    `./${importTypesPath}`,
    "// This file is generated by `scripts/create-entrypoints.js`. DO NOT edit manually.\n\n" +
      `export interface OptionalImportMap {
${Object.keys(entrypoints)
  .filter((key) => !deprecatedNodeOnly.includes(key))
  .filter((key) => reuqiresOptionalDependency.includes(key))
  .map((key) => importStatement(key, entrypoints[key]))
  .join("\n")}
}\n\n` +
      `export interface SecretMap {
${[...identifySecrets()]
  .sort()
  .map((secret) => `  ${secret}?: string;`)
  .join("\n")}
}`
  );
};

const importEndpoints = [(k) => `  "${k}"`, "src/load/importEndpoints.ts"];

const generateImportEndpoints = () => {
  // Generate import endpoints
  const entrypointsToInclude = Object.keys(entrypoints)
    .filter((key) => !deprecatedNodeOnly.includes(key))
    .filter((key) => reuqiresOptionalDependency.includes(key));

  const [importStatement, importEndpointsPath] = importEndpoints;

  console.log(``);

  const contents =
    entrypointsToInclude
      .map((key) => importStatement(key, entrypoints[key]))
      .join(",\n") + "\n] as string[];\n";

  fs.writeFileSync(
    `./${importEndpointsPath}`,
    "// This file is generated by `scripts/create-entrypoints.js`. DO NOT edit manually.\n\n" +
      "export const optionalImportEndpoints = [\n" +
      contents
  );
};

const command = process.argv[2];

if (command === "pre") {
  cleanGenerated();
  generatedImportMap();
  generateImportTypes();
  generateImportEndpoints();
} else {
  updateConfig();
}
