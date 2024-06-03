# Function: getMessageFromContentWithRole()

> **getMessageFromContentWithRole**(`content`, `defaultRole`?): [`BaseMessage`](../../../../../../../input/load/msgs/base/classes/BaseMessage.md)

Converts a Gemini content structure to a BaseMessage based on the specified role.
If no role is provided, it defaults to the role specified in the content.

## Parameters

• **content**: `Content`

The content object from Gemini API containing parts and roles.

• **defaultRole?**: [`GeminiContentRole`](../../../type-aliases/GeminiContentRole.md)

Optional. Default role to assume if the content does not specify one.

## Returns

[`BaseMessage`](../../../../../../../input/load/msgs/base/classes/BaseMessage.md)

A BaseMessage instance appropriate to the content's role.

## Example

```typescript
const geminiContent: Content = { role: 'user', parts: [{ text: 'Hello, how can I assist you today?' }] };
const message = getMessageFromContentWithRole(geminiContent, 'user');
console.log(message); // Outputs a HumanMessage with the content text.
```

## Source

[packages/core/src/events/inference/chat/llms/vertexai/gemini/utils.ts:30](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/chat/llms/vertexai/gemini/utils.ts#L30)
