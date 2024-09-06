# Class: `abstract` BaseCache\<T\>

An abstract class that defines the basic operations for a caching system.
Implementations of this class must provide methods for looking up and updating cache entries.
This class facilitates the creation of various types of caches by defining a consistent interface.

## Extended by

- [`MemoryCache`](../../classes/MemoryCache.md)

## Type parameters

• **T** = [`Generation`](../../../events/output/provide/generation/interfaces/Generation.md)[]

The type of data stored in the cache. By default, it is an array of [Generation](../../../events/output/provide/generation/interfaces/Generation.md) objects,
but it can be any type depending on the implementation's requirements.

## Constructors

### new BaseCache()

> **new BaseCache**\<`T`\>(): [`BaseCache`](BaseCache.md)\<`T`\>

#### Returns

[`BaseCache`](BaseCache.md)\<`T`\>

## Methods

### lookup()

> `abstract` **lookup**(`keysStr`): `Promise`\<`null` \| `T`\>

Retrieves a value from the cache based on a generated key from an array of strings.
Implementations must define how the lookup is handled, including how keys are translated and how missing keys are treated.

#### Parameters

• **keysStr**: `string`[]

An array of strings that uniquely identifies the cache entry.

#### Returns

`Promise`\<`null` \| `T`\>

A promise that resolves to the cached value if found, or null if no entry exists for the provided key.

#### Source

[packages/core/src/cache/base.ts:20](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/cache/base.ts#L20)

***

### update()

> `abstract` **update**(`keysStr`, `value`): `Promise`\<`void`\>

Updates or adds a value in the cache identified by a generated key from an array of strings.
Implementations must define how updates are managed, ensuring that existing entries are replaced or new entries are added.

#### Parameters

• **keysStr**: `string`[]

An array of strings that uniquely identifies the cache entry.

• **value**: `T`

The value to be stored in the cache.

#### Returns

`Promise`\<`void`\>

A promise that resolves once the cache is updated.

#### Source

[packages/core/src/cache/base.ts:30](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/cache/base.ts#L30)
