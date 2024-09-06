# Type alias: CallableWithFallbacksArg\<CallInput, CallOutput\>

> **CallableWithFallbacksArg**\<`CallInput`, `CallOutput`\>: `object`

Type for defining the argument structure for callable with fallbacks.

## Type parameters

• **CallInput**

• **CallOutput**

## Type declaration

### callable

> **callable**: [`Callable`](../classes/Callable.md)\<`CallInput`, `CallOutput`\>

The primary callable to be invoked initially.

### fallbacks

> **fallbacks**: [`Callable`](../classes/Callable.md)\<`CallInput`, `CallOutput`\>[]

An array of fallback callables to be invoked in order if the primary callable fails.

## Source

[packages/core/src/record/callable.ts:134](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L134)
