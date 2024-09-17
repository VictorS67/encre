// Import DataType from your types
import { DataType } from '../types/studio.type';

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

  // Find all common data types
  const sharedDataTypes = fromDataTypes.filter(dataType => toDataTypes.includes(dataType));

  // Handle multiple shared data types
  if (sharedDataTypes.length > 1) {
    // Use the color for multiple data types
    return getCSSVariableValue(multiDataTypeCssVariable);
  }

  // Handle a single shared data type
  if (sharedDataTypes.length === 1) {
    const cssVariableName = dataTypeCssVariables[sharedDataTypes[0]];
    return getCSSVariableValue(cssVariableName);
  }

  // If no shared data types, use the unique CSS variable
  return getCSSVariableValue(multiDataTypeCssVariable);
};