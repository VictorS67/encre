import type { Opaque } from 'type-fest';

import { Data, DataType } from './data.js';

import { NodePortFields } from './nodes/index.js';

export type ProcessId = Opaque<string, 'ProcessId'>;

export type ProcessInputMap = Record<string, Data | undefined>;
export type ProcessOutputMap = Record<string, Data | undefined>;

export type ProcessDataMap = ProcessInputMap | ProcessOutputMap;

export type ProcessContext = {
  processId: ProcessId;

  signal: AbortSignal;

  contextData: Record<string, Data>;

  graphInputs: Record<string, Data>;

  graphOutputs: Record<string, Data>;
};

/**
 * Validate whether the ports are full-filled with the process data.
 */
export function validateProcessDataFromPorts(
  processData: ProcessDataMap,
  portFields: NodePortFields
): boolean {
  const keywords: string[] = Object.keys(portFields);

  return keywords.every((keyword: string): boolean => {
    // Return false if there is no such a port keyword in the process data.
    if (!Object.prototype.hasOwnProperty.call(processData, keyword)) {
      return false;
    }

    const processValue: Data | undefined = processData[keyword];
    const portType: DataType | Readonly<DataType[]> = portFields[keyword];

    // Check if this keyword can support multiple types of data
    if (Array.isArray(portType)) {
      // Return true if the process data value and the type are both empty.
      if (!processValue) {
        return portType.length === 0 || portType.some((t: DataType) => t === 'unknown');
      }

      // Return true if there is some type in the type array that can be valid.
      // TODO: think about if coerceTypeOptional can apply here
      return portType.some((t: DataType) => processValue['type'] === t);
    }

    // Return false if the process data value is empty and the type is non-empty.
    if (!processValue) return portType === 'unknown';

    // Validate the types
    // TODO: think about if coerceTypeOptional can apply here
    return processValue['type'] === portType;
  });
}
