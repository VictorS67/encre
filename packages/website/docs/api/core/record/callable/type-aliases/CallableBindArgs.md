# Type alias: CallableBindArgs\<CallInput, CallOutput, CallOptions\>

> **CallableBindArgs**\<`CallInput`, `CallOutput`, `CallOptions`\>: `object`

Type for the arguments passed to the constructor of a [CallableBind](../classes/CallableBind.md).

## Type parameters

• **CallInput**

• **CallOutput**

• **CallOptions** *extends* [`CallableConfig`](CallableConfig.md)

## Type declaration

### bound

> **bound**: [`Callable`](../classes/Callable.md)\<`CallInput`, `CallOutput`, `CallOptions`\>

The underlying callable to which this bind configuration will apply.

### config

> **config**: [`CallableConfig`](CallableConfig.md)

Additional configuration applied to the callable.

### kwargs

> **kwargs**: `Partial`\<`CallOptions`\>

Keyword arguments for modifying the callable's configuration dynamically.

## Source

[packages/core/src/record/callable.ts:96](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L96)
