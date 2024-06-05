# Function: coerceTypeOptional()

> **coerceTypeOptional**\<`T`\>(`data`, `type`): `Promise` \<[`ValueOf`](../../../data/type-aliases/ValueOf.md)\<`T`\>\[`"value"`\] \| `undefined`\>

Attempts to convert a `Data` object to a specified type, optionally returning the coerced
value or `undefined` if the coercion is not possible. This allows for type-safe operations
across various data structures.

## Type parameters

• **T** *extends* `"string"` \| `"number"` \| `"boolean"` \| `"object"` \| `"unknown"` \| `"blob"` \| `"context"` \| `"chat-message"` \| `"string[]"` \| `"number[]"` \| `"boolean[]"` \| `"object[]"` \| `"unknown[]"` \| `"blob[]"` \| `"context[]"` \| `"chat-message[]"`

## Parameters

• **data**: `undefined` \| [`Data`](../../../data/type-aliases/Data.md)

The `Data` object to be coerced.

• **type**: `T`

The target `DataType` to convert to.

## Returns

`Promise` \<[`ValueOf`](../../../data/type-aliases/ValueOf.md)\<`T`\>\[`"value"`\] \| `undefined`\>

A promise that resolves to the coerced value or `undefined`.

## Example

```typescript
const data = { type: 'number', value: 123 };
const coercedString = await coerceTypeOptional(data, 'string');
console.log(coercedString); // Outputs: '123'
```

## Source

[packages/core/src/studio/utils/coerce.ts:127](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/utils/coerce.ts#L127)
