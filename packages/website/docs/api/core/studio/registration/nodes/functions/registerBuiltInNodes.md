# Function: registerBuiltInNodes()

> **registerBuiltInNodes**(`registry`): [`NodeRegistration`](../classes/NodeRegistration.md)\<`"message"` \| `"input"` \| `"if"` \| `"prompt"` \| `"splitter"` \| `"chatlm"` \| `"llm"` \| `"variable-validator"` \| `"loader"`, `string`, [`ChatLMNode`](../../../nodes/inference/chat/chatlm.node/type-aliases/ChatLMNode.md) \| [`LLMNode`](../../../nodes/inference/chat/llm.node/type-aliases/LLMNode.md) \| `VariableValidatorNode` \| [`LoaderNode`](../../../nodes/input/loader.node/type-aliases/LoaderNode.md) \| [`MessageNode`](../../../nodes/input/message.node/type-aliases/MessageNode.md) \| [`PromptNode`](../../../nodes/input/prompt.node/type-aliases/PromptNode.md) \| [`SplitterNode`](../../../nodes/input/splitter.node/type-aliases/SplitterNode.md) \| [`IfNode`](../../../nodes/utility/if.node/type-aliases/IfNode.md) \| [`InputNode`](../../../nodes/utility/input.node/type-aliases/InputNode.md)\>

Registers all built-in nodes with a newly instantiated `NodeRegistration`.
This function centralizes the registration of all predefined nodes.

## Parameters

• **registry**: [`NodeRegistration`](../classes/NodeRegistration.md)\<`never`, `never`, `never`\>

The `NodeRegistration` instance to register nodes with.

## Returns

[`NodeRegistration`](../classes/NodeRegistration.md)\<`"message"` \| `"input"` \| `"if"` \| `"prompt"` \| `"splitter"` \| `"chatlm"` \| `"llm"` \| `"variable-validator"` \| `"loader"`, `string`, [`ChatLMNode`](../../../nodes/inference/chat/chatlm.node/type-aliases/ChatLMNode.md) \| [`LLMNode`](../../../nodes/inference/chat/llm.node/type-aliases/LLMNode.md) \| `VariableValidatorNode` \| [`LoaderNode`](../../../nodes/input/loader.node/type-aliases/LoaderNode.md) \| [`MessageNode`](../../../nodes/input/message.node/type-aliases/MessageNode.md) \| [`PromptNode`](../../../nodes/input/prompt.node/type-aliases/PromptNode.md) \| [`SplitterNode`](../../../nodes/input/splitter.node/type-aliases/SplitterNode.md) \| [`IfNode`](../../../nodes/utility/if.node/type-aliases/IfNode.md) \| [`InputNode`](../../../nodes/utility/input.node/type-aliases/InputNode.md)\>

The `NodeRegistration` instance after all built-in nodes have been registered.

## Source

[packages/core/src/studio/registration/nodes.ts:381](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/registration/nodes.ts#L381)
