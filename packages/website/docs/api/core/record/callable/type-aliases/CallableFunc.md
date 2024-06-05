# Type alias: CallableFunc()\<CallInput, CallOutput\>

> **CallableFunc**\<`CallInput`, `CallOutput`\>: (`input`) => `CallOutput` \| `Promise`\<`CallOutput`\>

Represents a function type that acts like a callable, taking an input and optionally returning a
promise that resolves to an output.

## Type parameters

• **CallInput**

The type of input the function accepts.

• **CallOutput**

The type of output the function returns, which may be wrapped in a Promise.

## Parameters

• **input**: `CallInput`

## Returns

`CallOutput` \| `Promise`\<`CallOutput`\>

## Source

[packages/core/src/record/callable.ts:89](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L89)
