# Function: getMessageFromContent()

> **getMessageFromContent**(`content`): [`BaseMessage`](../../../../../../../input/load/msgs/base/classes/BaseMessage.md)

Creates a BaseMessage instance from a Gemini content object, determining the message type 
based on the role provided in the content.

## Parameters

• **content**: `Content`

The content object containing the message parts and role.

## Returns

[`BaseMessage`](../../../../../../../input/load/msgs/base/classes/BaseMessage.md)

A BaseMessage instance derived from the content's role and text.

## Example

```typescript
const content: Content = { role: 'model', parts: [{ text: 'Welcome to our service!' }] };
const message = getMessageFromContent(content);
console.log(message); // Outputs a BotMessage with the provided text.
```

## Source

[packages/core/src/events/inference/chat/llms/vertexai/gemini/utils.ts:65](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/llms/vertexai/gemini/utils.ts#L65)
