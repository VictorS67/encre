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

[packages/core/src/record/callable.ts:134](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L134)
