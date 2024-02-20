import { NodeImpl, NodeImplConstructor } from './base.js';
import {
  GeminiChatNodeImpl,
  OpenAIChatNodeImpl,
} from './inference/chat/chatlm.node.js';
import { GeminiNodeImpl, OpenAINodeImpl } from './inference/chat/llm.node.js';
import { PDFLoaderNodeImpl } from './input/loader.node.js';
import {
  BotMessageNodeImpl,
  ChatMessageNodeImpl,
  FunctionMessageNodeImpl,
  HumanMessageNodeImpl,
  SystemMessageNodeImpl,
} from './input/message.node.js';
import {
  ChatPromptNodeImpl,
  StringPromptNodeImpl,
} from './input/prompt.node.js';
import {
  LanguageTextSplitterNodeImpl,
  RecursiveTextSplitterNodeImpl,
  TextSplitterNodeImpl,
  TokenTextSplitterNodeImpl,
} from './input/splitter.node.js';
import { SerializableNode } from './index.js';

type ExtractType<T> = T extends `${infer U}-${any}` ? U : never;

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
      impl: NodeImplConstructor<Extract<Nodes, { type: ExtractType<P> }>>;
    };
  };

  implsMap = {} as Record<
    string,
    { impl: NodeImplConstructor<SerializableNode> }
  >;

  readonly nodeTypes = new Set<NodeTypes>();

  readonly nodeTypePairs = {} as { [P in NodeTypes]: NodeSubTypes[] };

  get nodeConstructors(): NodeImplConstructor<SerializableNode>[] {
    return Object.values(this.implsMap).map((nodeImpl) => nodeImpl.impl);
  }

  register<T extends SerializableNode>(
    impl: NodeImplConstructor<T>,
    args?: Record<string, unknown>
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

    const node = impl.create(args);
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
    };

    newRegistration.nodeTypes.add(type);

    if (newRegistration.nodeTypePairs[type]) {
      newRegistration.nodeTypePairs[type].push(subType);
    } else {
      newRegistration.nodeTypePairs[type] = [subType];
    }

    return newRegistration;
  }

  create<T extends NodeTypes>(
    type: T,
    subType: string,
    args?: Record<string, unknown>
  ): Extract<Nodes, { type: T }> {
    const key = [type, subType].join('-');

    const nodeImpl = this.info[key] as {
      impl: NodeImplConstructor<Extract<Nodes, { type: T }>>;
    };

    if (!nodeImpl) {
      throw new Error(`Unknown node type pair: ${key}`);
    }

    return nodeImpl.impl.create(args);
  }

  createImpl<T extends Nodes>(node: T): NodeImpl<T> {
    const type = node.type as Extract<NodeTypes, T['type']>;
    const subType: string = node.subType;

    const key = [type, subType].join('-');

    const nodeImpl = this.info[key] as {
      impl: NodeImplConstructor<Extract<Nodes, { type: T }>>;
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
    .register(GeminiChatNodeImpl);
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
