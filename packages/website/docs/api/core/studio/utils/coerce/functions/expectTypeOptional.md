# Function: expectTypeOptional()

> **expectTypeOptional**\<`T`\>(`data`, `type`): `Promise` \<[`ValueOf`](../../../data/type-aliases/ValueOf.md)\<`T`\>\[`"value"`\] \| `undefined`\>

Strictly expects the `Data` object to match a specified type and returns the value if it matches,
otherwise returns `undefined`. This is useful for validation scenarios where the data must match
a specific format.

## Type parameters

• **T** *extends* `"string"` \| `"number"` \| `"boolean"` \| `"object"` \| `"unknown"` \| `"blob"` \| `"context"` \| `"chat-message"` \| `"string[]"` \| `"number[]"` \| `"boolean[]"` \| `"object[]"` \| `"unknown[]"` \| `"blob[]"` \| `"context[]"` \| `"chat-message[]"`

## Parameters

• **data**: `undefined` \| [`Data`](../../../data/type-aliases/Data.md)

The `Data` object to validate.

• **type**: `T`

The `DataType` expected.

## Returns

`Promise` \<[`ValueOf`](../../../data/type-aliases/ValueOf.md)\<`T`\>\[`"value"`\] \| `undefined`\>

A promise that resolves to the expected value or `undefined`.

## Example

```typescript
const data = { type: 'number', value: 456 };
const number = await expectTypeOptional(data, 'number');
console.log(number); // Outputs: 456
```

## Source

[packages/core/src/studio/utils/coerce.ts:198](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/utils/coerce.ts#L198)
