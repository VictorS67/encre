# Type alias: CallableLike\<CallInput, CallOutput\>

> **CallableLike**\<`CallInput`, `CallOutput`\>: [`Callable`](../classes/Callable.md)\<`CallInput`, `CallOutput`\> \| [`CallableFunc`](CallableFunc.md)\<`CallInput`, `CallOutput`\> \| `object`

A type union that defines various forms a callable can take: either as a [Callable](../classes/Callable.md) instance,
a function conforming to [CallableFunc](CallableFunc.md), or an object containing callable-like properties.

## Type parameters

• **CallInput** = `unknown`

The expected input type of the callable.

• **CallOutput** = `unknown`

The expected output type of the callable.

## Source

[packages/core/src/record/callable.ts:77](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L77)
