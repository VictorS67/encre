import { FileLoader, loadFromFile } from '../../utils/load.js';
import { parseFile } from '../../utils/parse.js';
import { BaseGraph } from '../graph.js';
import { NodeRegistration } from '../nodes/registration.js';

export const loadGraphFromFile: FileLoader<BaseGraph> = async (
  file: string,
  path: string,
  values: Record<string, unknown> = {},
  registry?: NodeRegistration
): Promise<BaseGraph> => {
  const serialized = parseFile(file, path);
  return BaseGraph.deserialize(serialized, values, registry);
};

export const loadGraph = async (
  uri: string,
  values: Record<string, unknown> = {},
  registry?: NodeRegistration
): Promise<BaseGraph> => {
  return loadFromFile(uri, loadGraphFromFile, values, registry);
};
