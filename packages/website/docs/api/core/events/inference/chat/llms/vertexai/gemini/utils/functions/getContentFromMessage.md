# Function: getContentFromMessage()

> **getContentFromMessage**(`message`): `Content`

Transforms a BaseMessage into a Gemini content structure, suitable for sending to the 
Gemini API.

## Parameters

• **message**: [`BaseMessage`](../../../../../../../input/load/msgs/base/classes/BaseMessage.md)

The message to transform into Gemini content format.

## Returns

`Content`

A Content object representing the original message in a format accepted by Gemini.

## Example

```typescript
const message = new HumanMessage({ content: 'Hello, world!' });
const content = getContentFromMessage(message);
console.log(content); // Outputs Content with role 'user' and text 'Hello, world!'
```

## Source

[packages/core/src/events/inference/chat/llms/vertexai/gemini/utils.ts:96](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/llms/vertexai/gemini/utils.ts#L96)
