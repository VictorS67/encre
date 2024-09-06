# Function: coerceToData()

> **coerceToData**(`value`): [`Data`](../../../data/type-aliases/Data.md)

Converts a value of unknown type into a structured `Data` type, which categorizes the value by a
recognizable type tag for further processing or validation. This function helps in standardizing
various input types into a predictable format that can be processed uniformly.

## Parameters

• **value**: `unknown`

The input value of unknown type.

## Returns

[`Data`](../../../data/type-aliases/Data.md)

A `Data` object categorized by type.

## Example

```typescript
const input = "example string";
const structuredData = coerceToData(input);
console.log(structuredData);
// Outputs: { type: 'string', value: 'example string' }
```

## Source

[packages/core/src/studio/utils/coerce.ts:43](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/utils/coerce.ts#L43)
