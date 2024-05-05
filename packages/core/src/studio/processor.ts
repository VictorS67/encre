import type { Opaque } from 'type-fest';
import { RecordId } from '../load/keymap.js';

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

  // In the memory, we store callable options for CallableNodes
  memory: Record<RecordId, unknown>;
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

    return validateProcessData(processValue, portType);
  });
}

export function validateProcessData(
  processData: Data | undefined,
  dataType: DataType | Readonly<DataType[]>
): boolean {
  // Check if this keyword can support multiple types of data
  if (Array.isArray(dataType)) {
    // Return true if the process data value and the type are both empty.
    if (!processData) {
      return (
        dataType.length === 0 || dataType.some((t: DataType) => t === 'unknown')
      );
    }

    // Return true if there is some type in the type array that can be valid.
    // TODO: think about if coerceTypeOptional can apply here
    return dataType.some((t: DataType) => processData['type'] === t);
  }

  // Return false if the process data value is empty and the type is non-empty.
  if (!processData) return dataType === 'unknown';

  // Validate the types
  // TODO: think about if coerceTypeOptional can apply here
  return processData['type'] === dataType;
}
