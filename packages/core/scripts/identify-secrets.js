import ts from "typescript";
import fs from "fs";

function getSecrets(node, fileName) {
  // look for get _secrets()
  const secrets = new Set();

  switch (node.kind) {
    case ts.SyntaxKind.GetAccessor: {
      const property = node;
      if (property.name.getText() === "_secrets") {
        // look for return { ... }
        property.body.statements.forEach((statement) => {
          if (
            statement.kind === ts.SyntaxKind.ReturnStatement &&
            statement.expression.kind === ts.SyntaxKind.ObjectLiteralExpression
          ) {
            // collect secret identifier
            statement.expression.properties.forEach((element) => {
              if (element.initializer.kind === ts.SyntaxKind.StringLiteral) {
                const secret = element.initializer.text;

                if (secret.toUpperCase() !== secret) {
                  throw new Error(
                    `Secret identifier must be uppercase: ${secret} at ${fileName}`
                  );
                }

                if (/\s/.test(secret)) {
                  throw new Error(
                    `Secret identifier must not contain whitespace: ${secret} at ${fileName}`
                  );
                }

                secrets.add(secret);
              }
            });
          }
        });
      }
      break;
    }
  }

  return secrets;
}

export function identifySecrets() {
  const secrets = new Set();

  const tsConfig = ts.parseJsonConfigFileContent(
    ts.readJsonConfigFile("./tsconfig.json", (p) =>
      fs.readFileSync(p, "utf-8")
    ),
    ts.sys,
    "./src/"
  );

  for (const fileName of tsConfig.fileNames.filter(
    (fn) => !fn.endsWith("test.ts")
  )) {
    const sourceFile = ts.createSourceFile(
      fileName,
      fs.readFileSync(fileName, "utf-8"),
      tsConfig.options.target,
      true
    );

    sourceFile.forEachChild((node) => {
      switch (node.kind) {
        case ts.SyntaxKind.ClassDeclaration:
        case ts.SyntaxKind.ClassExpression: {
          node.forEachChild((node) => {
            getSecrets(node, fileName).forEach((secret) => {
              secrets.add(secret);
            });
          });
          break;
        }
      }
    });
  }

  return secrets;
}
