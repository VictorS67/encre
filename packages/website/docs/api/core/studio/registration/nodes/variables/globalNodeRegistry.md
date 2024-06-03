# Variable: globalNodeRegistry

> **globalNodeRegistry**: [`NodeRegistration`](../classes/NodeRegistration.md)\<`"message"` \| `"input"` \| `"prompt"` \| `"chatlm"` \| `"llm"` \| `"variable-validator"` \| `"loader"` \| `"splitter"`, `string`, [`ChatLMNode`](../../../nodes/inference/chat/chatlm.node/type-aliases/ChatLMNode.md) \| [`LLMNode`](../../../nodes/inference/chat/llm.node/type-aliases/LLMNode.md) \| `VariableValidatorNode` \| [`LoaderNode`](../../../nodes/input/loader.node/type-aliases/LoaderNode.md) \| [`MessageNode`](../../../nodes/input/message.node/type-aliases/MessageNode.md) \| [`PromptNode`](../../../nodes/input/prompt.node/type-aliases/PromptNode.md) \| [`SplitterNode`](../../../nodes/input/splitter.node/type-aliases/SplitterNode.md) \| [`InputNode`](../../../nodes/utility/input.node/type-aliases/InputNode.md)\>

The `globalNodeRegistry` is a global singleton instance that holds registrations
for all the built-in node types within the system. It facilitates the dynamic creation,
configuration, and management of nodes based on predefined implementations. This registry
is utilized to instantiate nodes directly from serialized data or via type and subtype specifications,
ensuring that node creation is consistent and follows the defined specifications.

## Example

#### Creating a Node Directly
This example shows how to create a node directly using the registry:
```typescript
const pdfLoader = new PDFLoader();
const chatNode = globalNodeRegistry.createDynamicRaw(pdfLoader);
```

#### Using Node in a Type-Safe Manner
For type-safe node creation, particularly when the node type and subtype are known:
```typescript
const pdfNode = globalNodeRegistry.createDynamic('pdf', 'loader');
```

#### Resetting the Registry
In scenarios such as testing or when starting a new session where a clean registry state is needed:
```typescript
resetNodeRegistry();
```

## Source

[packages/core/src/studio/registration/nodes.ts:444](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/registration/nodes.ts#L444)
