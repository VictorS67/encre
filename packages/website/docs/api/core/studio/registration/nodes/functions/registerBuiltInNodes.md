# Function: registerBuiltInNodes()

> **registerBuiltInNodes**(`registry`): [`NodeRegistration`](../classes/NodeRegistration.md)\<`"message"` \| `"input"` \| `"prompt"` \| `"chatlm"` \| `"llm"` \| `"variable-validator"` \| `"loader"` \| `"splitter"`, `string`, [`ChatLMNode`](../../../nodes/inference/chat/chatlm.node/type-aliases/ChatLMNode.md) \| [`LLMNode`](../../../nodes/inference/chat/llm.node/type-aliases/LLMNode.md) \| `VariableValidatorNode` \| [`LoaderNode`](../../../nodes/input/loader.node/type-aliases/LoaderNode.md) \| [`MessageNode`](../../../nodes/input/message.node/type-aliases/MessageNode.md) \| [`PromptNode`](../../../nodes/input/prompt.node/type-aliases/PromptNode.md) \| [`SplitterNode`](../../../nodes/input/splitter.node/type-aliases/SplitterNode.md) \| [`InputNode`](../../../nodes/utility/input.node/type-aliases/InputNode.md)\>

Registers all built-in nodes with a newly instantiated `NodeRegistration`.
This function centralizes the registration of all predefined nodes.

## Parameters

• **registry**: [`NodeRegistration`](../classes/NodeRegistration.md)\<`never`, `never`, `never`\>

The `NodeRegistration` instance to register nodes with.

## Returns

[`NodeRegistration`](../classes/NodeRegistration.md)\<`"message"` \| `"input"` \| `"prompt"` \| `"chatlm"` \| `"llm"` \| `"variable-validator"` \| `"loader"` \| `"splitter"`, `string`, [`ChatLMNode`](../../../nodes/inference/chat/chatlm.node/type-aliases/ChatLMNode.md) \| [`LLMNode`](../../../nodes/inference/chat/llm.node/type-aliases/LLMNode.md) \| `VariableValidatorNode` \| [`LoaderNode`](../../../nodes/input/loader.node/type-aliases/LoaderNode.md) \| [`MessageNode`](../../../nodes/input/message.node/type-aliases/MessageNode.md) \| [`PromptNode`](../../../nodes/input/prompt.node/type-aliases/PromptNode.md) \| [`SplitterNode`](../../../nodes/input/splitter.node/type-aliases/SplitterNode.md) \| [`InputNode`](../../../nodes/utility/input.node/type-aliases/InputNode.md)\>

The `NodeRegistration` instance after all built-in nodes have been registered.

## Source

[packages/core/src/studio/registration/nodes.ts:381](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/registration/nodes.ts#L381)
