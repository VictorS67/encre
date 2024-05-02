import { FileLoader, loadFromFile } from '../../utils/load.js';
import { parseFile } from '../../utils/parse.js';
import { BaseGraph } from '../graph.js';
import { GuardrailRegistration } from '../registration/guardrails.js';
import { NodeRegistration } from '../registration/nodes.js';

export const loadGraphFromFile: FileLoader<BaseGraph> = async (
  file: string,
  path: string,
  values: Record<string, unknown> = {},
  registry?: {
    nodes?: NodeRegistration;
    guardrails?: GuardrailRegistration;
  }
): Promise<BaseGraph> => {
  const serialized = parseFile(file, path);
  return BaseGraph.deserialize(serialized, values, registry);
};

export const loadGraph = async (
  uri: string,
  values: Record<string, unknown> = {},
  registry?: {
    nodes?: NodeRegistration;
    guardrails?: GuardrailRegistration;
  }
): Promise<BaseGraph> => {
  return loadFromFile(uri, loadGraphFromFile, values, registry);
};
