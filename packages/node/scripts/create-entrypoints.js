import fs from "fs";
import path from "path";

// const currentPath = process.cwd();
// console.log(`Current path: ${currentPath}`);
// console.log(`Parent path: ${path.dirname(currentPath)}`);

// This lists all the entrypoints for the library. Each key corresponds to an
// importable path, eg. `import { Callable } from "record/callable"`.
// The value is the path to the file in `src/` that exports the entrypoint.
// This is used to generate the `exports` field in package.json.
// Order is not important.
const entrypoints = {
  // api
  api: "api",
};

const deprecatedNodeOnly = [];

// Entrypoints in this list require an optional dependency to be installed.
const reuqiresOptionalDependency = [];

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

const command = process.argv[2];

if (command === "pre") {
  cleanGenerated();
} else {
  updateConfig();
}
