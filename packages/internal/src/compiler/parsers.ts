import * as ts from "typescript";
import { getScalarTypeOf, isArrayDataType } from "@encrejs/api";

import { CompilerAPI } from "./types";
import { ENCRE_DATA_TYPES } from "../constants/encre";
import { COMPILABLE_ACTIONS, HIDDEN_NODE_ATTRS } from "../constants/studio";
import { Node, DataType, ScalarDataType, NodeAttrs } from "../types/encre";

export const validateNodeBody = (
  api: CompilerAPI,
  sourceFile: ts.SourceFile,
  program: ts.Program,
  checker: ts.TypeChecker,
  encreNode: Node,
  encreNodeAttrs: NodeAttrs,
): boolean => {
  if (!sourceFile) {
    return false;
  }

  let properties: ts.NodeArray<ts.ObjectLiteralElementLike> | undefined;
  if (sourceFile.statements.length > 0) {
    const node: ts.Statement = sourceFile.statements[0];
    if (
      !ts.isExpressionStatement(node) ||
      !node.expression ||
      !ts.isObjectLiteralExpression(node.expression)
    ) {
      return false;
    }
    properties = node.expression.properties;
  }

  if (properties) {
    return properties.every((property) =>
      validateNodeAttribute(
        encreNode,
        encreNodeAttrs,
        property,
        api,
        program,
        checker,
      ),
    );
  }
  return true;
};

const validateNodeAttribute = (
  encreNode: Node,
  encreNodeAttrs: NodeAttrs,
  node: ts.ObjectLiteralElementLike,
  api: CompilerAPI,
  program: ts.Program,
  checker: ts.TypeChecker,
): boolean => {
  const attrs: string[] = Object.keys(encreNodeAttrs.kwargs);
  if (ts.isShorthandPropertyAssignment(node)) {
    return isCompilableAction(node);
  } else if (ts.isPropertyAssignment(node)) {
    if (!isValidProperty(node, attrs) || !hasInitializer(node)) {
      return false;
    }
    const attrName: string | null = getAttrName(node.name);
    if (!attrName) {
      return false;
    }
    const isHiddenAttr: boolean = isHiddenAttribute(node); // no hidden attributes allowed
    const type: DataType = encreNodeAttrs.kwargs[attrName]!.type;

    return isValidInitializer(node, type, api);
  }
  return false;
};

const getAttrName = (node: ts.PropertyName): string | null => {
  if (ts.isIdentifier(node)) {
    return node.escapedText.toString();
  } else if (ts.isStringLiteral(node)) {
    return node.text;
  }
  return null;
};

const isCompilableAction = (node: ts.ShorthandPropertyAssignment): boolean => {
  return (
    node &&
    node.name &&
    COMPILABLE_ACTIONS.includes(node.name.escapedText.toString())
  );
};

const isHiddenAttribute = (node: ts.PropertyAssignment): boolean => {
  return (
    node &&
    node.name &&
    ts.isIdentifier(node.name) &&
    HIDDEN_NODE_ATTRS.includes(node.name.escapedText.toString())
  );
};

const isValidProperty = (
  node: ts.PropertyAssignment,
  attrs: string[],
): boolean => {
  const allowedProperties = new Set([...attrs, ...HIDDEN_NODE_ATTRS]);
  return (
    node &&
    node.name &&
    ts.isIdentifier(node.name) &&
    allowedProperties.has(node.name.escapedText.toString())
  );
};

const hasInitializer = (node: ts.PropertyAssignment): boolean => {
  return node && node.initializer && !!node.initializer.getText();
};

const isValidInitializer = (
  node: ts.PropertyAssignment,
  type: DataType,
  api: CompilerAPI,
): boolean => {
  if (!ENCRE_DATA_TYPES.includes(type)) {
    return false;
  }
  const isArrayData: boolean = isArrayDataType(type);
  const _type: ScalarDataType = getScalarTypeOf(type);
  const initializer: ts.Expression = node.initializer;
  if (isArrayData && !ts.isArrayLiteralExpression(initializer)) {
    return false;
  }
  if (ts.isArrayLiteralExpression(initializer)) {
    return initializer.elements.every((el) => hasValidDataType(el, _type, api));
  }
  return hasValidDataType(initializer, _type, api);
};

const hasValidDataType = (
  node: ts.Expression,
  type: ScalarDataType,
  api: CompilerAPI,
) => {
  switch (type) {
    case "string":
      return isValidString(node);
    case "number":
      return isValidNumber(node);
    case "boolean":
      return isValidBoolean(node, api);
    case "object":
      return isValidObject(node, api);
    case "unknown":
      return isValidUnknown(node, api);
    case "blob":
    case "context":
    case "chat-message":
      return isNonEmpty(node);
    default:
      return false;
  }
};

const isNonEmpty = (node: ts.Expression): boolean => {
  return !!node.getText() && node.getText() !== "";
};

const isValidString = (node: ts.Expression): boolean => {
  return ts.isStringLiteralLike(node);
};

const isValidNumber = (node: ts.Expression): boolean => {
  return ts.isNumericLiteral(node) || ts.isBinaryExpression(node);
};

const isValidBoolean = (node: ts.Expression, api: CompilerAPI): boolean => {
  const isNumberToCoerce: boolean =
    ts.isNumericLiteral(node) && (node.text === "0" || node.text === "1");
  const isBoolean: boolean =
    node.kind === api.SyntaxKind.TrueKeyword ||
    node.kind === api.SyntaxKind.FalseKeyword;
  return isNumberToCoerce || isBoolean;
};

const isValidObject = (node: ts.Expression, api: CompilerAPI): boolean => {
  const isNull: boolean = node.kind === api.SyntaxKind.NullKeyword;
  const isValidJSON: boolean =
    ts.isObjectLiteralExpression(node) && isValidJSONObject(node, api);
  return isNull || isValidJSON;
};

const isValidJSONObject = (
  node: ts.ObjectLiteralExpression,
  api: CompilerAPI,
): boolean => {
  return node.properties.every((property) => {
    if (!ts.isPropertyAssignment(property)) {
      return false;
    }
    const isValidFormat: boolean =
      !!property &&
      !!property.getText() &&
      !!property.getText().match(/.+:.+/) &&
      !!property.name &&
      !!property.initializer;
    return (
      isValidFormat &&
      isValidJSONKey(property) &&
      isValidJSONValue(property, api)
    );
  });
};

const isValidJSONKey = (node: ts.PropertyAssignment): boolean => {
  const isValidIdentifier: boolean =
    ts.isIdentifier(node.name) && node.name.escapedText.toString() !== "";
  const isValidStringLiteral: boolean =
    ts.isStringLiteral(node.name) && node.getText() !== "";
  return isValidIdentifier || isValidStringLiteral;
};

const isValidJSONValue = (
  node: ts.PropertyAssignment,
  api: CompilerAPI,
): boolean => {
  if (node.initializer) {
    const isUndefined: boolean =
      ts.isIdentifier(node.initializer) &&
      node.initializer.escapedText.toString() === "undefined";
    return (
      isUndefined ||
      isValidString(node.initializer) ||
      isValidNumber(node.initializer) ||
      isValidBoolean(node.initializer, api) ||
      isValidObject(node.initializer, api)
    );
  }
  return false;
};

const isValidUnknown = (node: ts.Expression, api: CompilerAPI): boolean => {
  const isUndefined: boolean =
    ts.isIdentifier(node) && node.escapedText.toString() === "undefined";
  return (
    isUndefined ||
    isNonEmpty(node) ||
    isValidString(node) ||
    isValidNumber(node) ||
    isValidBoolean(node, api) ||
    isValidObject(node, api)
  );
};

export const parseNodeBody = () => {};
