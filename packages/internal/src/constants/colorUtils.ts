// Import DataType from your types
import { DataType } from '../../../app/src/types/studio.type';

// Define CSS variable names for each data type
const dataTypeCssVariables: Record<DataType, string> = {
  'string': '--string-color',
  'string[]': '--string-array-color',
  'number': '--number-color',
  'number[]': '--number-array-color',
  'prompt': '--prompt-color',
  'prompt[]': '--prompt-array-color',
  'boolean': '--boolean-color',
  'boolean[]': '--boolean-array-color',
  'unknown': '--unknown-color',
  'unknown[]': '--unknown-array-color',
  'object': '--object-color',
  'object[]': '--object-array-color',
  'blob': '--blob-color',
  'blob[]': '--blob-array-color',
  'context': '--context-color',
  'context[]': '--context-array-color',
  'chat-message': '--chat-message-color',
  'chat-message[]': '--chat-message-array-color',
};

// CSS variable for connections that support multiple data types
const multiDataTypeCssVariable = '--multi-datatype-color';

// Cache for CSS variable values to improve performance
const cssVariableCache: Record<string, string> = {};

// Utility function to get the value of a CSS variable
const getCSSVariableValue = (variableName: string, defaultValue: string = '#000000'): string => {
  if (cssVariableCache[variableName]) {
    return cssVariableCache[variableName];
  }
  const value = getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
  const finalValue = value || defaultValue;
  cssVariableCache[variableName] = finalValue;
  return finalValue;
};

// Utility function to determine the wire color
export const getWireColor = (
  fromDataType: DataType | DataType[],
  toDataType: DataType | DataType[]
): string => {
  const fromDataTypes = Array.isArray(fromDataType) ? fromDataType : [fromDataType];
  const toDataTypes = Array.isArray(toDataType) ? toDataType : [toDataType];

  // Determine if either port supports multiple data types
  const isMultipleFrom = fromDataTypes.length > 1;
  const isMultipleTo = toDataTypes.length > 1;

  // If either port supports multiple data types, use the unique CSS variable
  if (isMultipleFrom || isMultipleTo) {
    return getCSSVariableValue(multiDataTypeCssVariable);
  }

  // Find a common data type
  const commonDataType = fromDataTypes.find(dataType => toDataTypes.includes(dataType));
  if (commonDataType) {
    const cssVariableName = dataTypeCssVariables[commonDataType];
    return getCSSVariableValue(cssVariableName);
  }

  // If no common data type, use the unique CSS variable
  return getCSSVariableValue(multiDataTypeCssVariable);
};
