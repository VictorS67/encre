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
  // serde
  serde: "serde",
  // load
  load: "load/index",
  "load/serializable": "load/serializable",
  "load/registration": "load/registration",
  // record
  "record/callable": "record/index",
  // cache
  cache: "cache/index",
  "cache/base": "cache/base",
  "cache/memory": "cache/memory",
  // events
  events: "events/index",
  "events/base": "events/base",
  // events/embeddings
  "events/embeddings": "events/embeddings/index",
  "events/embeddings/base": "events/embeddings/base",
  "events/embeddings/openai": "events/embeddings/openai",
  // events/input/load/docs
  "events/input/load/docs": "events/input/load/docs/index",
  "events/input/load/docs/base": "events/input/load/docs/base",
  "events/input/load/docs/buffer": "events/input/load/docs/buffer",
  "events/input/load/docs/context": "events/input/load/docs/context",
  "events/input/load/docs/pdf": "events/input/load/docs/pdf",
  // events/input/load/msgs
  "events/input/load/msgs": "events/input/load/msgs/index",
  "events/input/load/msgs/base": "events/input/load/msgs/base",
  "events/input/load/msgs/bot": "events/input/load/msgs/bot",
  "events/input/load/msgs/human": "events/input/load/msgs/human",
  "events/input/load/msgs/system": "events/input/load/msgs/system",
  "events/input/load/msgs/function": "events/input/load/msgs/function",
  "events/input/load/msgs/general": "events/input/load/msgs/chat",
  // events/input/load/prompts
  "events/input/load/prompts": "events/input/load/prompts/index",
  "events/input/load/prompts/base": "events/input/load/prompts/base",
  "events/input/load/prompts/text": "events/input/load/prompts/text",
  "events/input/load/prompts/chat": "events/input/load/prompts/chat",
  // events/input/load/rules
  "events/input/load/rules": "events/input/load/rules/index",
  // events/input/load/vectorstore
  "events/input/load/vectorstore": "events/input/load/vectorstore/index",
  "events/input/load/vectorstore/base": "events/input/load/vectorstore/base",
  "events/input/load/vectorstore/chroma":
    "events/input/load/vectorstore/chroma",
  "events/input/load/vectorstore/memory":
    "events/input/load/vectorstore/memory",
  // events/input/transform
  "events/input/transform/splitter": "events/input/transform/splitter",
  // events/output/provide
  "events/output/provide": "events/output/provide/index",
  "events/output/provide/base": "events/output/provide/base",
  "events/output/provide/embedresult": "events/output/provide/embedresult",
  "events/output/provide/file": "events/output/provide/file",
  "events/output/provide/generation": "events/output/provide/generation",
  "events/output/provide/llmresult": "events/output/provide/llmresult",
  "events/output/provide/message": "events/output/provide/message",
  "events/output/provide/serde": "events/output/provide/serde",
  // events/inference/validate
  "events/inference/validate": "events/inference/validate/index",
  // events/inference/validate/guardrails
  "events/inference/validate/guardrails":
    "events/inference/validate/guardrails/index",
  "events/inference/validate/guardrails/base":
    "events/inference/validate/guardrails/base",
  "events/inference/validate/guardrails/array":
    "events/inference/validate/guardrails/array",
  "events/inference/validate/guardrails/boolean":
    "events/inference/validate/guardrails/boolean",
  "events/inference/validate/guardrails/object":
    "events/inference/validate/guardrails/object",
  "events/inference/validate/guardrails/number":
    "events/inference/validate/guardrails/number",
  "events/inference/validate/guardrails/string":
    "events/inference/validate/guardrails/string",
  // events/inference/validate/validators
  "events/inference/validate/validator":
    "events/inference/validate/validators/index",
  // events/inference/chat
  "events/inference/chat/base": "events/inference/chat/base",
  "events/inference/chat": "events/inference/chat/index",
  // events/inference/chat/llms/openai
  "events/inference/chat/openai": "events/inference/chat/llms/openai/index",
  "events/inference/chat/llms/openai": "events/inference/chat/llms/openai/text",
  "events/inference/chat/chatlms/openai":
    "events/inference/chat/llms/openai/chat",
  // events/inference/chat/llms/vertexai
  "events/inference/chat/vertexai": "events/inference/chat/llms/vertexai/index",
  // events/inference/chat/llms/vertexai/gemini
  "events/inference/chat/llms/gemini":
    "events/inference/chat/llms/vertexai/gemini/text",
  "events/inference/chat/chatlms/gemini":
    "events/inference/chat/llms/vertexai/gemini/chat",
  // events/inference/retrieve
  "events/inference/retrieve/base": "events/inference/retrieve/base",
  // events/inference/retrieve/text
  "events/inference/retrieve/text/remote/base":
    "events/inference/retrieve/text/remote/base",
  "events/inference/retrieve/text/remote":
    "events/inference/retrieve/text/remote/index",
  // events/inference/retrieve/embedding
  "events/inference/retrieve/embedding/vectorstore":
    "events/inference/retrieve/embedding/vectorstore",
  "events/inference/retrieve/embedding":
    "events/inference/retrieve/embedding/index",
  // studio
  "studio/condition": "studio/condition",
  "studio/graph": "studio/graph",
  "studio/input": "studio/input",
  "studio/data": "studio/data",
  "studio/processor": "studio/processor",
  "studio/scheduler": "studio/scheduler",
  "studio/serde": "studio/serde",
  "studio/ui": "studio/ui",
  // studio/comments
  "studio/comments": "studio/comments/index",
  // studio/guardrails
  "studio/guardrails/base": "studio/guardrails/base",
  "studio/guardrails": "studio/guardrails/index",
  // studio/guardrails/data
  "studio/guardrails/data/array": "studio/guardrails/data/array.guard",
  "studio/guardrails/data/boolean": "studio/guardrails/data/boolean.guard",
  "studio/guardrails/data/number": "studio/guardrails/data/number.guard",
  "studio/guardrails/data/object": "studio/guardrails/data/object.guard",
  "studio/guardrails/data/string": "studio/guardrails/data/string.guard",
  // studio/nodes
  "studio/nodes": "studio/nodes/index",
  "studio/nodes/base": "studio/nodes/base",
  // studio/nodes/inference/chat
  "studio/nodes/inference/chat/chatlm":
    "studio/nodes/inference/chat/chatlm.node",
  "studio/nodes/inference/chat/llm": "studio/nodes/inference/chat/llm.node",
  // studio/nodes/inference/validate
  "studio/nodes/inference/validate":
    "studio/nodes/inference/validate/validator.node",
  // studio/nodes/input
  "studio/nodes/input/loader": "studio/nodes/input/loader.node",
  "studio/nodes/input/message": "studio/nodes/input/message.node",
  "studio/nodes/input/prompt": "studio/nodes/input/prompt.node",
  "studio/nodes/input/splitter": "studio/nodes/input/splitter.node",
  // studio/nodes/utility
  "studio/nodes/utility/graph": "studio/nodes/utility/graph.node",
  "studio/nodes/utility/if": "studio/nodes/utility/if.node",
  "studio/nodes/utility/input": "studio/nodes/utility/input.node",
  // studio/registration
  "studio/registration": "studio/registration/index",
  "studio/registration/guardrails": "studio/registration/guardrails",
  "studio/registration/nodes": "studio/registration/nodes",
  // studio/utils
  "studio/utils/coerce": "studio/utils/coerce",
  "studio/utils/display": "studio/utils/display",
  "studio/utils/load": "studio/utils/load",
  "studio/utils/save": "studio/utils/save",
  // utils
  "utils/nanoid": "utils/nanoid",
};

const deprecatedNodeOnly = [];

// Entrypoints in this list require an optional dependency to be installed.
const reuqiresOptionalDependency = [
  // events/embeddings
  "events/embeddings/openai",
  // events/input/load/docs
  "events/input/load/docs/pdf",
  // events/input/load/msgs
  "events/input/load/msgs/bot",
  "events/input/load/msgs/human",
  "events/input/load/msgs/system",
  "events/input/load/msgs/function",
  "events/input/load/msgs/general",
  // events/input/load/prompts
  "events/input/load/prompts/text",
  "events/input/load/prompts/chat",
  // events/input/load/rules
  "events/input/load/rules",
  // events/input/load/vectorstore
  "events/input/load/vectorstore/chroma",
  // events/input/transform
  "events/input/transform/splitter",
  // events/inference/validate/guardrails
  "events/inference/validate/guardrails/array",
  "events/inference/validate/guardrails/boolean",
  "events/inference/validate/guardrails/object",
  "events/inference/validate/guardrails/number",
  "events/inference/validate/guardrails/string",
  // events/inference/validate/validator
  "events/inference/validate/validator",
  // events/inference/chat/llms
  "events/inference/chat/llms/openai",
  "events/inference/chat/llms/gemini",
  "events/inference/chat/chatlms/openai",
  "events/inference/chat/chatlms/gemini",
  // events/inference/retrieve/embedding
  "events/inference/retrieve/embedding/vectorstore",
  // studio
  "studio/graph",
  "studio/condition",
  "studio/input",
  "studio/nodes/inference/chat/chatlm",
  "studio/nodes/inference/chat/llm",
  "studio/nodes/inference/validate",
  "studio/nodes/input/loader",
  "studio/nodes/input/message",
  "studio/nodes/input/prompt",
  "studio/nodes/input/splitter",
  "studio/nodes/utility/graph",
  "studio/nodes/utility/if",
  "studio/nodes/utility/input",
  "studio/registration/nodes",
  "studio/utils/load"
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
        entryPoints: [...Object.keys(entrypoints)]
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
  fs.writeFileSync(
    "./.gitignore",
    ["docs/*.md", "docs/**/*.md", ...filenames].join("\n") + "\n"
  );

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
