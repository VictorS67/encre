# Interface: SerializedMessageGeneration

Defines a structure for storing serialized message data along with generated text, typically used in recording and loading.

## Properties

### message?

> `optional` **message**: [`SerializedMessage`](SerializedMessage.md)

Optional serialized message, providing context or additional information related to the generated text.

#### Source

[packages/core/src/events/output/provide/message.ts:70](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/output/provide/message.ts#L70)

***

### text

> **text**: `string`

The text content generated, often representing the processed output of the message.

#### Source

[packages/core/src/events/output/provide/message.ts:65](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/output/provide/message.ts#L65)
