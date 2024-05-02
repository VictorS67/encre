import { NodeImpl } from '../nodes/base.js';
import { SerializableNode } from '../nodes/index.js';
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
import { SubGraphNodeImpl } from '../nodes/utility/graph.node.js';

type ExtractType<T> = T extends `${infer U}-${any}` ? U : never;

type ExtractSubType<T> = T extends `${any}-${infer U}` ? U : never;

export interface NodeImplConstructor<T extends SerializableNode> {
  new (node: T): NodeImpl<T>;
  create(args?: Record<string, unknown>): T;
}

export class NodeRegistration<
  NodeTypes extends string = never,
  NodeSubTypes extends string = never,
  Nodes extends SerializableNode = never,
> {
  registeredNodes: Nodes = undefined!;

  registeredNodeTypes: NodeTypes = undefined!;

  registeredNodeTypePairs: { [P in NodeTypes]: NodeSubTypes[] } = undefined!;

  info = {} as {
    [P in `${NodeTypes}-${NodeSubTypes}`]: {
      impl: NodeImplConstructor<
        Extract<Nodes, { type: ExtractType<P>; subType: ExtractSubType<P> }>
      >;
    };
  };

  implsMap = {} as Record<
    string,
    { impl: NodeImplConstructor<SerializableNode>; init: SerializableNode }
  >;

  readonly nodeTypes = new Set<NodeTypes>();

  readonly nodeTypePairs = {} as { [P in NodeTypes]: NodeSubTypes[] };

  get nodeConstructors(): NodeImplConstructor<SerializableNode>[] {
    return Object.values(this.implsMap).map((nodeImpl) => nodeImpl.impl);
  }

  get dynamicImplsMap(): Record<
    string,
    { impl: NodeImplConstructor<SerializableNode> }
  > {
    return this.implsMap;
  }

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

    newRegistration.nodeTypes.add(type);

    if (newRegistration.nodeTypePairs[type]) {
      newRegistration.nodeTypePairs[type].push(subType);
    } else {
      newRegistration.nodeTypePairs[type] = [subType];
    }

    return newRegistration;
  }

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

  isRegistered(type: string, subType: string): boolean {
    const key = [type, subType].join('-');

    return this.info[key] !== undefined;
  }
}

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
    .register(VariableValidatorNodeImpl);
}

let globalNodeRegistry = registerBuiltInNodes(new NodeRegistration());

export { globalNodeRegistry };

export type BuiltInNodes = typeof globalNodeRegistry.registeredNodes;

export type BuiltInNodeTypes = typeof globalNodeRegistry.registeredNodeTypes;

export type BuiltInNodeTypePairs =
  typeof globalNodeRegistry.registeredNodeTypePairs;

export type NodeOf<T extends BuiltInNodeTypes> = Extract<
  BuiltInNodes,
  { type: T }
>;

export function resetNodeRegistry() {
  globalNodeRegistry = registerBuiltInNodes(new NodeRegistration());
}
