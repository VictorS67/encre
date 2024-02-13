import fs from "fs";
import { rollup } from "rollup";

const packageJson = JSON.parse(fs.readFileSync("./package.json"));

export function listEntrypoints(packageJson) {
  const exports = packageJson.exports ?? {};
  return Object.entries(exports)
    .filter(([key, value]) => key !== "./package.json")
    .flatMap(([_, value]) =>
      typeof value === "string" ? [value] : value.import ? [value.import] : []
    );
}

export function listExternals(packageJson) {
  return [
    ...Object.keys(packageJson.dependencies || {}),
    ...Object.keys(packageJson.peerDependencies || {}),
    // Add external dependencies here
    /node\:/,
    "nanoid/non-secure",
    "p-retry",
    "js-tiktoken/lite",
    "js-tiktoken",
    "fs",
    "ts-pattern"
  ];
}

export async function checkTreeShaking() {
  const externals = listExternals(packageJson);
  const entrypoints = listEntrypoints(packageJson);
  const reportMap = new Map();
  const basedConsoleLogFunc = console.log;

  for (const entrypoint of entrypoints) {
    let sideEffects = "";

    console.log = function (...args) {
      const line = args.join(" ").trim();
      if (line.startsWith("First side effect in")) {
        sideEffects += line + "\n";
      }
    };

    await rollup({
      external: externals,
      input: entrypoint,
      experimentalLogSideEffects: true,
    });

    reportMap.set(entrypoint, {
      log: sideEffects,
      hasSideEffects: sideEffects.length > 0,
    });
  }

  console.log = basedConsoleLogFunc;

  let failed = false;
  for (const [entrypoint, report] of reportMap) {
    if (report.hasSideEffects) {
      failed = true;
      console.log("---------------------------------");
      console.log(`Tree shaking failed for ${entrypoint}`);
      console.log(report.log);
    }
  }

  if (failed) {
    process.exit(1);
  } else {
    console.log("Tree shaking checks passed!");
  }
}

checkTreeShaking();
