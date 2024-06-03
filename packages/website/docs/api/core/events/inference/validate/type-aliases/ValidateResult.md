# Type alias: ValidateResult

> **ValidateResult**: `object`

Type definition for the result of a validation operation.
If the validation does not pass (`isValid` is `false`), the `errorMessage` should describe the issue.

## Type declaration

### errorMessage?

> `optional` **errorMessage**: `string`

An optional string containing a message describing why the validation failed, present only when `isValid` is `false`.

### isValid

> **isValid**: `boolean`

A boolean indicating whether the validation passed.

## Source

[packages/core/src/events/inference/validate/index.ts:14](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/validate/index.ts#L14)
