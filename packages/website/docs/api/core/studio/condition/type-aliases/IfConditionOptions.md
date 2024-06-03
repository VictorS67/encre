# Type alias: IfConditionOptions

> **IfConditionOptions**: [`CallableConfig`](../../../record/callable/type-aliases/CallableConfig.md) & `object`

Extends CallableConfig to include optional variables that can be passed to each condition field.

## Example

```
const conditionOptions: IfConditionOptions = {
  variables: {
    eligibility: [{ userData: { country: "US" } }]
  }
};
```

## Type declaration

### variables?

> `optional` **variables**: `object`

Optional detailed variables that may influence the behavior of the callable conditions.

#### Index signature

 \[`target`: `string`\]: ([`ConditionFieldVariables`](ConditionFieldVariables.md) \| `undefined`)[]

## Source

[packages/core/src/studio/condition.ts:154](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/condition.ts#L154)
