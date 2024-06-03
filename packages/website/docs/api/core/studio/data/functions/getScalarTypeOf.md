# Function: getScalarTypeOf()

> **getScalarTypeOf**(`type`): [`ScalarDataType`](../type-aliases/ScalarDataType.md)

Extracts the scalar type from a given data type, handling both scalar
and array types.

## Parameters

• **type**: `"string"` \| `"number"` \| `"boolean"` \| `"object"` \| `"unknown"` \| `"blob"` \| `"context"` \| `"chat-message"` \| `"string[]"` \| `"number[]"` \| `"boolean[]"` \| `"object[]"` \| `"unknown[]"` \| `"blob[]"` \| `"context[]"` \| `"chat-message[]"`

## Returns

[`ScalarDataType`](../type-aliases/ScalarDataType.md)

## Source

[packages/core/src/studio/data.ts:232](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/data.ts#L232)
