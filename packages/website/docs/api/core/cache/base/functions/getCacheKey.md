# Function: getCacheKey()

> **getCacheKey**(`keysStr`): `string`

Generates a unique key for cache entries based on an array of strings. This function uses the `object-hash` library
to create a consistent and unique hash from the concatenated string values, which serves as the cache key.

The hash function is designed to produce a repeatable output for the same input, ensuring that the keys are consistent
across different executions and environments.

## Parameters

• **keysStr**: `string`[]

An array of strings that will be concatenated with an underscore ('_') and hashed to form the cache key.

## Returns

`string`

A string representing the hashed value of the concatenated strings, used as the cache key.

## Source

[packages/core/src/cache/base.ts:43](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/cache/base.ts#L43)
