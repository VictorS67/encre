# Function: getScalarTypeOf()

> **getScalarTypeOf**(`type`): [`ScalarDataType`](../type-aliases/ScalarDataType.md)

Extracts the scalar type from a given data type, handling both scalar
and array types.

## Parameters

• **type**: `"string"` \| `"number"` \| `"boolean"` \| `"object"` \| `"unknown"` \| `"blob"` \| `"context"` \| `"chat-message"` \| `"string[]"` \| `"number[]"` \| `"boolean[]"` \| `"object[]"` \| `"unknown[]"` \| `"blob[]"` \| `"context[]"` \| `"chat-message[]"`

## Returns

[`ScalarDataType`](../type-aliases/ScalarDataType.md)

## Source

[packages/core/src/studio/data.ts:232](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/data.ts#L232)
