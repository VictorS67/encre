import { type Serializable } from '../../load/serializable.js';
import { type NodeImpl } from '../nodes/base.js';
import { type SerializableNode } from '../nodes/index.js';
import {
  GeminiChatNodeImpl,
  OpenAIChatNodeImpl,
} from '../nodes/inference/chat/chatlm.node.js';
import {
  GeminiNodeImpl,
  OpenAINodeImpl,
} from '../nodes/inference/chat/llm.node.js';
import { VariableValidatorNodeImpl } from '../nodes/inference/validate/validator.node.js';
import { PDFLoaderNodeImpl } from '../nodes/input/loader.node.js';
import {
  BotMessageNodeImpl,
  ChatMessageNodeImpl,
  FunctionMessageNodeImpl,
  HumanMessageNodeImpl,
  SystemMessageNodeImpl,
} from '../nodes/input/message.node.js';
import {
  ChatPromptNodeImpl,
  StringPromptNodeImpl,
} from '../nodes/input/prompt.node.js';
import {
  LanguageTextSplitterNodeImpl,
  RecursiveTextSplitterNodeImpl,
  TextSplitterNodeImpl,
  TokenTextSplitterNodeImpl,
} from '../nodes/input/splitter.node.js';
import { IfConditionNodeImpl } from '../nodes/utility/if.node.js';
import { InputNodeImpl } from '../nodes/utility/input.node.js';

type ExtractType<T> = T extends `${infer U}-${any}` ? U : never;

type ExtractSubType<T> = T extends `${any}-${infer U}` ? U : never;

/**
 * Provides a constructor interface for node implementations,
 * allowing creation of node instances and initialization from raw data.
 */
export interface NodeImplConstructor<T extends SerializableNode> {
  /**
   * Constructor that initializes with a node instance.
   */
  new (node: T): NodeImpl<T>;

  /**
   * Factory method to create a node with optional arguments.
   * @param args registry arguments for creating the specific node.
   */
  create(args?: Record<string, unknown>): T;

  /**
   * Initializes a node from a serializable object with optional arguments.
   * @param raw customized serializable to attach to the node's data.
   * @param args registry arguments for creating the specific node.
   */
  nodeFrom(raw: Serializable, args?: Record<string, unknown>): T;
}

/**
 * Manages registration and creation of various node types within a graph system,
 * supporting dynamic type and subtype management.
 */
export class NodeRegistration<
  NodeTypes extends string = never,
  NodeSubTypes extends string = never,
  Nodes extends SerializableNode = never,
> {
  /**
   * Stores instances of registered nodes.
   *
   * @internal
   */
  registeredNodes: Nodes = undefined!;

  /**
   * Tracks registered primary node types.
   *
   * @internal
   */
  registeredNodeTypes: NodeTypes = undefined!;

  /**
   * Maintains a mapping from node types to their subtypes.
   *
   * @internal
   */
  registeredNodeTypePairs: { [P in NodeTypes]: NodeSubTypes[] } = undefined!;

  /**
   * Stores implementation details for node types and subtypes.
   */
  info = {} as {
    [P in `${NodeTypes}-${NodeSubTypes}`]: {
      impl: NodeImplConstructor<
        Extract<Nodes, { type: ExtractType<P>; subType: ExtractSubType<P> }>
      >;
    };
  };

  /**
   * Maps type-subtype pairs to their corresponding node implementations and initialization data.
   */
  implsMap = {} as Record<
    string,
    { impl: NodeImplConstructor<SerializableNode>; init: SerializableNode }
  >;

  /**
   * Maps serializable IDs to their node implementations for nodes that are initialized from raw data.
   */
  rawImplsMap = {} as Record<
    string,
    { impl: NodeImplConstructor<SerializableNode>; init: SerializableNode }
  >;

  /**
   * A set containing all distinct node types that have been registered. This set is used to quickly check
   * the existence of a node type within the system without needing to search through the complete registry.
   * It supports operations where type checking is necessary, providing a fast access point to determine
   * what types of nodes are available.
   */
  readonly nodeTypes = new Set<NodeTypes>();

  /**
   * A dictionary where each key is a node type and the value is an array of subtypes associated with that type.
   * This structure is crucial for systems that require knowledge of the hierarchical organization of node types,
   * allowing them to access all subtypes related to a specific node type efficiently. It supports operations
   * such as dynamic node creation and validation by providing a clear map of how types are structured and related.
   */
  readonly nodeTypePairs = {} as { [P in NodeTypes]: NodeSubTypes[] };

  /**
   * Retrieves a list of all node implementation constructors registered in the system.
   * This list allows for dynamic instantiation of nodes where only the type is known at runtime.
   * @returns An array of node implementation constructors, enabling the creation of node instances dynamically.
   */
  get nodeConstructors(): NodeImplConstructor<SerializableNode>[] {
    return Object.values(this.implsMap).map((nodeImpl) => nodeImpl.impl);
  }

  /**
   * Provides access to a map of dynamically registered node implementations based on a composite key of `type-subType`.
   * This map is essential for retrieving specific node implementations dynamically,
   * facilitating operations such as node instantiation and processing based on type and subtype.
   * @returns A map where each key is a string in the format `type-subType` and each value is an object containing the node implementation constructor and the initial node instance template.
   */
  get dynamicImplsMap(): Record<
    string,
    { impl: NodeImplConstructor<SerializableNode>; init: SerializableNode }
  > {
    return this.implsMap;
  }

  /**
   * Provides access to a map of dynamically registered node implementations based on the serializable ID of the node.
   * This map is particularly useful for instantiating nodes from serialized data where
   * the node type might not be directly known but can be inferred from the ID.
   * @returns A map where each key is a serializable ID and each value is an object containing the node implementation constructor and the initial node instance template, facilitating node creation from serialized forms.
   */
  get dynamicRawImplsMap(): Record<
    string,
    { impl: NodeImplConstructor<SerializableNode>; init: SerializableNode }
  > {
    return this.rawImplsMap;
  }

  /**
   * Registers a new node implementation into the system, associating it with its type and subtype.
   * It updates the internal mappings to facilitate node creation and identification based on type and subtype.
   * @param impl The node implementation constructor to register.
   * @param registerArgs Optional arguments for initializing the node.
   * @returns An updated instance of `NodeRegistration` reflecting the new node registration.
   */
  register<T extends SerializableNode>(
    impl: NodeImplConstructor<T>,
    registerArgs?: Record<string, unknown>
  ): NodeRegistration<
    NodeTypes | T['type'],
    NodeSubTypes | T['subType'],
    Nodes | T
  > {
    const newRegistration = this as NodeRegistration<
      NodeTypes | T['type'],
      NodeSubTypes | T['subType'],
      Nodes | T
    >;

    const node = impl.create(registerArgs);
    const type = node.type as T['type'];
    const subType = node.subType as T['subType'];

    const key = [type, subType].join('-');

    if (newRegistration.info[key]) {
      throw new Error(`Duplicate node type pair: ${key}`);
    }

    newRegistration.info[key] = {
      impl: impl as any,
    };

    newRegistration.implsMap[key] = {
      impl: impl as any,
      init: node,
    };

    const serializableId = node.data._id.join('-');
    if (!newRegistration.rawImplsMap[serializableId]) {
      newRegistration.rawImplsMap[serializableId] = {
        impl: impl as any,
        init: node,
      };
    }

    newRegistration.nodeTypes.add(type);

    if (newRegistration.nodeTypePairs[type]) {
      newRegistration.nodeTypePairs[type].push(subType);
    } else {
      newRegistration.nodeTypePairs[type] = [subType];
    }

    return newRegistration;
  }

  /**
   * Creates an instance of a node based on the specified type and subtype,
   * using optional arguments for initialization.
   *
   * @param type The primary type of the node.
   * @param subType The subtype of the node.
   * @param registerArgs Optional arguments for node initialization.
   * @returns A new node instance of the specified type and subtype.
   * @throws an error if the type-subtype pair is not registered.
   */
  create<T extends NodeTypes, U extends NodeSubTypes>(
    type: T,
    subType: U,
    registerArgs?: Record<string, unknown>
  ): Extract<Nodes, { type: T; subType: U }> {
    const key = [type, subType].join('-');

    const nodeImpl = this.info[key] as {
      impl: NodeImplConstructor<Extract<Nodes, { type: T; subType: U }>>;
    };

    if (!nodeImpl) {
      throw new Error(`Unknown node type pair: ${type}-${subType}`);
    }

    return nodeImpl.impl.create(registerArgs);
  }

  /**
   * Instantiates a node implementation for a given node object.
   *
   * @param node The node instance to create an implementation for.
   * @returns A new node implementation instance.
   * @throws an error if the node's type-subtype pair is unknown.
   */
  createImpl<T extends Nodes>(node: T): NodeImpl<T> {
    const key = [node.type, node.subType].join('-');

    const nodeImpl = this.info[key] as {
      impl: NodeImplConstructor<
        Extract<Nodes, { type: T['type']; subType: T['subType'] }>
      >;
    };

    if (!nodeImpl) {
      throw new Error(`Unknown node type pair: ${key}`);
    }

    const { impl: Impl } = nodeImpl;

    const newNodeImpl = new Impl(node as any) as unknown as NodeImpl<T>;

    if (!newNodeImpl) {
      throw new Error(`Unknown node type pair: ${key}`);
    }

    return newNodeImpl;
  }

  /**
   * Dynamically creates an instance of a node based on the specified type and subtype.
   * This method allows for node creation using dynamic type information, which is useful in scenarios where node types and subtypes are determined at runtime.
   * @param type The type of the node to create.
   * @param subType The subtype of the node to create.
   * @param registerArgs Optional arguments for initializing the node.
   * @throws An error if no implementation is registered for the specified type and subtype.
   * @returns A new instance of the specified node type and subtype.
   */
  createDynamic(
    type: string,
    subType: string,
    registerArgs?: Record<string, unknown>
  ): SerializableNode {
    const implClass = this.dynamicImplsMap[`${type}-${subType}`];
    if (!implClass) {
      throw new Error(
        `createDynamic: Unknown node - type: ${type}, subType: ${subType}`
      );
    }

    return implClass.impl.create(registerArgs);
  }

  /**
   * Dynamically creates a node instance from a raw serializable object.
   * This method is particularly useful when nodes need to be instantiated from serialized data or when node types are not known until runtime.
   * @param serializable A raw serializable object that represents the node's data.
   * @param registerArgs Optional arguments for initializing the node.
   * @throws An error if no implementation is found for the node's serializable ID.
   * @returns A new node instance initialized from the provided serializable data.
   */
  createDynamicRaw(
    serializable: Serializable,
    registerArgs?: Record<string, unknown>
  ): SerializableNode {
    const implClass = this.dynamicRawImplsMap[serializable._id.join('-')];
    if (!implClass) {
      throw new Error(
        `createDynamicRaw: Unknown node - name: ${
          serializable._id[serializable._id.length - 1]
        }`
      );
    }

    return implClass.impl.nodeFrom(serializable, registerArgs);
  }

  /**
   * Creates a node implementation dynamically based on the type and subtype of the node.
   * This method is used to instantiate node implementations that are needed for node processing but are determined dynamically based on node data.
   * @param node The node for which the implementation needs to be created.
   * @throws An error if no implementation is registered for the node's type and subtype.
   * @returns An instance of `NodeImpl` for the given node, enabling further interaction and processing.
   */
  createDynamicImpl(node: SerializableNode): NodeImpl<SerializableNode> {
    const { type, subType } = node;
    const implClass = this.dynamicImplsMap[`${type}-${subType}`];
    if (!implClass) {
      throw new Error(
        `createDynamicImpl: Unknown node - type: ${type}, subType: ${subType}`
      );
    }

    const newNodeImpl = new implClass.impl(node);
    if (!newNodeImpl) {
      throw new Error(
        `createDynamicImpl: Unknown node - type: ${type}, subType: ${subType}`
      );
    }

    return newNodeImpl;
  }

  /**
   * Determines if a type-subtype pair is registered in the system.
   * @param type The node type to check.
   * @param subType The node subtype to check.
   * @returns `true` if the type-subtype pair is registered, otherwise `false`.
   */
  isRegistered(type: string, subType: string): boolean {
    const key = [type, subType].join('-');

    return this.info[key] !== undefined;
  }
}

/**
 * Registers all built-in nodes with a newly instantiated `NodeRegistration`.
 * This function centralizes the registration of all predefined nodes.
 * @param registry The `NodeRegistration` instance to register nodes with.
 * @returns The `NodeRegistration` instance after all built-in nodes have been registered.
 */
export function registerBuiltInNodes(registry: NodeRegistration) {
  return registry
    .register(PDFLoaderNodeImpl)
    .register(ChatMessageNodeImpl)
    .register(HumanMessageNodeImpl)
    .register(BotMessageNodeImpl)
    .register(SystemMessageNodeImpl)
    .register(FunctionMessageNodeImpl)
    .register(StringPromptNodeImpl)
    .register(ChatPromptNodeImpl)
    .register(TextSplitterNodeImpl)
    .register(RecursiveTextSplitterNodeImpl)
    .register(LanguageTextSplitterNodeImpl, { language: 'cpp' })
    .register(LanguageTextSplitterNodeImpl, { language: 'go' })
    .register(LanguageTextSplitterNodeImpl, { language: 'java' })
    .register(LanguageTextSplitterNodeImpl, { language: 'js' })
    .register(LanguageTextSplitterNodeImpl, { language: 'php' })
    .register(LanguageTextSplitterNodeImpl, { language: 'proto' })
    .register(LanguageTextSplitterNodeImpl, { language: 'python' })
    .register(LanguageTextSplitterNodeImpl, { language: 'rst' })
    .register(LanguageTextSplitterNodeImpl, { language: 'ruby' })
    .register(LanguageTextSplitterNodeImpl, { language: 'rust' })
    .register(LanguageTextSplitterNodeImpl, { language: 'scala' })
    .register(LanguageTextSplitterNodeImpl, { language: 'markdown' })
    .register(LanguageTextSplitterNodeImpl, { language: 'latex' })
    .register(LanguageTextSplitterNodeImpl, { language: 'html' })
    .register(LanguageTextSplitterNodeImpl, { language: 'sol' })
    .register(TokenTextSplitterNodeImpl)
    .register(OpenAINodeImpl)
    .register(GeminiNodeImpl)
    .register(OpenAIChatNodeImpl)
    .register(GeminiChatNodeImpl)
    .register(VariableValidatorNodeImpl)
    .register(InputNodeImpl)
    .register(IfConditionNodeImpl);
}

/**
 * The `globalNodeRegistry` is a global singleton instance that holds registrations
 * for all the built-in node types within the system. It facilitates the dynamic creation,
 * configuration, and management of nodes based on predefined implementations. This registry
 * is utilized to instantiate nodes directly from serialized data or via type and subtype specifications,
 * ensuring that node creation is consistent and follows the defined specifications.
 *
 * @example
 * #### Creating a Node Directly
 * This example shows how to create a node directly using the registry:
 * ```typescript
 * const pdfLoader = new PDFLoader();
 * const chatNode = globalNodeRegistry.createDynamicRaw(pdfLoader);
 * ```
 *
 * #### Using Node in a Type-Safe Manner
 * For type-safe node creation, particularly when the node type and subtype are known:
 * ```typescript
 * const pdfNode = globalNodeRegistry.createDynamic('pdf', 'loader');
 * ```
 *
 * #### Resetting the Registry
 * In scenarios such as testing or when starting a new session where a clean registry state is needed:
 * ```typescript
 * await resetNodeRegistry();
 * ```
 */
let globalNodeRegistry = registerBuiltInNodes(new NodeRegistration());

export { globalNodeRegistry };

/**
 * Represents the type for all nodes that are registered by default within the system. This type is derived
 * from the nodes registered in the global node registry. It encompasses a variety of node types, each tailored
 * to specific functionalities within the system, ensuring that any operation or transformation that nodes
 * might undergo can be strongly typed.
 */
export type BuiltInNodes = typeof globalNodeRegistry.registeredNodes;

/**
 * Represents the distinct node types that are available within the built-in registry. This type is useful for
 * operations that require a reference to the types of nodes without needing to know the specifics of their
 * implementation or internal structure. It enhances type safety by ensuring that only valid node types are
 * referenced within typed operations.
 */
export type BuiltInNodeTypes = typeof globalNodeRegistry.registeredNodeTypes;

/**
 * Represents the mapping of each built-in node type to its corresponding subtypes. This type is crucial for
 * understanding and accessing the full structure of node types within the system. It is used in contexts where
 * operations depend on the subtype of a node, such as during node creation or when performing type-specific
 * logic.
 */
export type BuiltInNodeTypePairs =
  typeof globalNodeRegistry.registeredNodeTypePairs;

/**
 * A utility type that extracts nodes of a specific type from the built-in nodes based on the provided node type.
 * This type is particularly useful when you need to obtain a subset of nodes that match a given type, allowing
 * for operations that are specific to that type while maintaining type safety.
 *
 * @template T - The type of the node to extract from the built-in nodes.
 */
export type NodeOf<T extends BuiltInNodeTypes> = Extract<
  BuiltInNodes,
  { type: T }
>;

/**
 * Resets the global node registry by re-initializing and re-registering all built-in nodes.
 * Useful for resetting the state in environments where node configurations may change dynamically.
 */
export function resetNodeRegistry() {
  globalNodeRegistry = registerBuiltInNodes(new NodeRegistration());
}
