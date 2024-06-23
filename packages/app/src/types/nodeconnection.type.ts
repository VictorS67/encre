import type { RecordId } from './studio.type';

export type PartialConnection = {
  nodeId: RecordId;
  portName: string;
  toX: number;
  toY: number;
};
