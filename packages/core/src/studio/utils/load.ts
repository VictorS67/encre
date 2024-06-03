import { FileLoader, loadFromFile } from '../../utils/load.js';
import { parseFile } from '../../utils/parse.js';
import { BaseGraph } from '../graph.js';
import { GuardrailRegistration } from '../registration/guardrails.js';
import { NodeRegistration } from '../registration/nodes.js';

/**
 * Asynchronously loads a graph from a specified file. This function is designed to read
 * a graph's serialized data from a file, deserialize it, and instantiate a `BaseGraph` object.
 * 
 * @param file A string that represents the name or identifier of the file containing the graph data.
 * @param path The path where the file is located.
 * @param values Optional. An object containing key-value pairs that may be required for initializing
 *               nodes within the graph based on the serialized data.
 * @param registry Optional. An object containing `NodeRegistration` for node types and
 *                 `GuardrailRegistration` for guardrails that may be needed during deserialization.
 * @returns A promise that resolves to an instance of `BaseGraph`.
 * 
 * @example
 * ```typescript
 * const graph = await loadGraphFromFile('myApp.encre', '/graphs');
 * ```
 */
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

/**
 * Asynchronously loads a graph from a URI, typically a path to a file. This function wraps around
 * `loadGraphFromFile`, allowing for indirect graph loading through a URI, facilitating the separation
 * of graph loading logic from file handling.
 * 
 * @param uri A string URI pointing to the location of the graph data. This could be a file path or URL.
 * @param values Optional. An object containing key-value pairs that may be required for initializing
 *               nodes within the graph based on the serialized data.
 * @param registry Optional. An object containing `NodeRegistration` for node types and
 *                 `GuardrailRegistration` for guardrails that may be needed during deserialization.
 * @returns A promise that resolves to an instance of `BaseGraph`.
 * 
 * @example
 * ```typescript
 * const graph = await loadGraph('/api/graphs/myGraph');
 * ```
 */
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
