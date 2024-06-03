# Function: validateProcessData()

> **validateProcessData**(`processData`, `dataType`): `boolean`

Validates a single piece of process data against a specified data type or an array of data types.
It checks whether the type of the provided data matches any of the acceptable data types.

## Parameters

• **processData**: `undefined` \| [`Data`](../../data/type-aliases/Data.md)

The process data to validate. This could be undefined, in which case the function checks if 'unknown' is a valid type.

• **dataType**: `"string"` \| `"number"` \| `"boolean"` \| `"object"` \| `"unknown"` \| `"blob"` \| `"context"` \| `"chat-message"` \| `"string[]"` \| `"number[]"` \| `"boolean[]"` \| `"object[]"` \| `"unknown[]"` \| `"blob[]"` \| `"context[]"` \| `"chat-message[]"` \| readonly (`"string"` \| `"number"` \| `"boolean"` \| `"object"` \| `"unknown"` \| `"blob"` \| `"context"` \| `"chat-message"` \| `"string[]"` \| `"number[]"` \| `"boolean[]"` \| `"object[]"` \| `"unknown[]"` \| `"blob[]"` \| `"context[]"` \| `"chat-message[]"`)[]

The expected data type or an array of expected data types. The process data must match one of these types to be considered valid.

## Returns

`boolean`

`true` if the data is of an expected type or if both the data and expected types are undefined; otherwise, `false`.

## Example

```ts
// Validate a single data entry against multiple acceptable types
const data = { type: "string", value: "example" };
const validTypes = ["string", "text"];

// Check if the data type is valid
const isValid = validateProcessData(data, validTypes);
console.log(isValid); // Output: true
```

## Source

[packages/core/src/studio/processor.ts:2331](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/processor.ts#L2331)
