import { type RecordId } from '../load/keymap.js';
import { type Serialized } from '../load/serializable.js';
import { type NodePortFields, type NodePortSizes } from './nodes/index.js';

/**
 * Represents a serialized version of a graph, including metadata and details about its nodes.
 * This structure is used for storing graph data in a format that can be easily transferred or saved.
 *
 * @interface
 * @property _type Identifies the type of serialization; always 'graph'.
 * @property id Unique identifier for the graph.
 * @property title Human-readable title of the graph.
 * @property description Detailed description of the graph's purpose and functionality.
 * @property nodes Array of `SerializedNode` representing the nodes within the graph.
 */
export type SerializedGraph = {
  _type: 'graph';
  id: RecordId;
  title: string;
  description: string;
  nodes: SerializedNode[];
};

/**
 * Represents a serialized node within a graph, containing all necessary details to reconstruct
 * or interpret the node outside of its execution environment.
 *
 * @interface
 * @property _type Identifies the type of serialization; always 'node'.
 * @property id Unique identifier of the node.
 * @property type General classification of the node.
 * @property subType More specific classification or subtype of the node.
 * @property registerArgs Arguments used to register or configure the node in its environment.
 * @property title Human-readable title of the node.
 * @property description Description of what the node does and its role in the graph.
 * @property runtime Estimated or measured runtime of the node in milliseconds.
 * @property memory Estimated or measured memory usage of the node in megabytes.
 * @property data Serialized form of the node's internal state or configuration.
 * @property visualInfo Contains position and size information for visual representations.
 * @property inputs Definitions of input ports, if any.
 * @property outputs Definitions of output ports, if any.
 * @property outputSizes Optional sizes of outputs, used in certain graph visualizations or calculations.
 * @property outgoingConnections Mapping of output port names to connections leading to other nodes.
 */
export type SerializedNode = {
  _type: 'node';
  id: RecordId;
  type: string;
  subType: string;
  registerArgs?: Record<string, unknown>;
  title: string;
  description: string;
  runtime: number;
  memory: number;
  data: Serialized;
  visualInfo: {
    position: {
      x: number;
      y: number;
      zIndex?: number;
    };
    size: {
      width: number;
      height: number;
    };
  };
  inputs: NodePortFields | undefined;
  outputs: NodePortFields | undefined;
  outputSizes?: NodePortSizes | undefined;
  outgoingConnections: {
    [key in string]: {
      toNodeId: RecordId;
      toPortName: string;
    };
  };
};

/**
 * Represents metadata for a rule, providing additional structure for complex logical expressions.
 * This metadata can define relationships between rules using conjunctions.
 *
 * @interface
 * @property left The left-hand side of the rule expression.
 * @property right Optional right-hand side of the rule expression; used for binary operations.
 * @property conjunction Specifies the logical operation ('and' or 'or') to apply between `left` and `right`.
 */
export type SerializedRuleMetadata = {
  left: SerializedRule;
  right?: SerializedRule;
  conjunction: 'and' | 'or';
};

/**
 * Represents a serialized rule, capturing the logic and conditions that define the rule's behavior.
 * This can include a function name and associated variables, along with a description and optional metadata.
 *
 * @interface
 * @property _type Identifies the type of serialization; always 'rule'.
 * @property _ruleType The type of rule, typically indicating the nature or purpose of the rule.
 * @property description Descriptive text explaining what the rule checks or enforces.
 * @property func The function name associated with the rule's logic.
 * @property variables Variables or parameters used within the rule's logic.
 * @property metadata Optional metadata providing additional structure or relationships with other rules.
 */
export type SerializedRule = {
  _type: 'rule';
  _ruleType: string;
  description: string;
  func: string;
  variables?: Record<string, unknown>;
  metadata?: SerializedRuleMetadata;
};

/**
 * Represents a collection of rules grouped together, often used to apply a set of related rules
 * collectively. This collection can include individual rules or other nested rule collections.
 *
 * @interface
 * @property _type Identifies the type of serialization; always 'rule-collection'.
 * @property description Description of the collection's purpose and the context in which it is used.
 * @property collection A record containing rules or other rule collections, indexed by a key.
 * @property conjunction Specifies how rules within the collection are logically combined ('and' or 'or').
 */
export type SerializedRuleCollection = {
  _type: 'rule-collection';
  description: string;
  collection: Record<string, SerializedRule | SerializedRuleCollection>;
  conjunction: 'and' | 'or';
};
