# Class: MemoryCache\<T\>

A generic caching mechanism that stores data in memory using a `Map`.
This cache is suitable for applications needing rapid access to precomputed data,
such as generated outputs or processed results, reducing the need for repetitive computations.

## Example

```typescript
const cache = new MemoryCache(new Map([['key_1', 'value1']]));
const result = await cache.lookup(['key', '1']);
console.log(result); // Output: 'value1'
```

## Extends

- [`BaseCache`](../base/classes/BaseCache.md)\<`T`\>

## Type parameters

• **T** = [`Generation`](../../events/output/provide/generation/interfaces/Generation.md)[]

The type of data stored in the cache. Defaults to an array of [Generation](../../events/output/provide/generation/interfaces/Generation.md) objects.

## Constructors

### new MemoryCache()

> **new MemoryCache**\<`T`\>(`map`?): [`MemoryCache`](MemoryCache.md)\<`T`\>

Constructs a new instance of MemoryCache.

#### Parameters

• **map?**: `Map`\<`string`, `T`\>

An optional pre-existing map to initialize the cache, allowing for shared or isolated cache instances.

#### Returns

[`MemoryCache`](MemoryCache.md)\<`T`\>

#### Overrides

[`BaseCache`](../base/classes/BaseCache.md) . [`constructor`](../base/classes/BaseCache.md#constructors)

#### Source

[packages/core/src/cache/index.ts:30](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/cache/index.ts#L30)

## Properties

### \_cache

> `private` **\_cache**: `Map`\<`string`, `T`\>

The internal map that stores cached values. The keys are string identifiers, and the values are of type T.

#### Source

[packages/core/src/cache/index.ts:24](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/cache/index.ts#L24)

## Methods

### lookup()

> **lookup**(`keysStr`): `Promise`\<`null` \| `T`\>

Looks up a value in the cache based on an array of strings that are concatenated to form a cache key.
The lookup is a fast operation, leveraging the map's native get method.

#### Parameters

• **keysStr**: `string`[]

An array of strings that will be concatenated and hashed to form the cache key.

#### Returns

`Promise`\<`null` \| `T`\>

A promise that resolves to the cached value or null if the key is not present in the cache.

#### Overrides

[`BaseCache`](../base/classes/BaseCache.md) . [`lookup`](../base/classes/BaseCache.md#lookup)

#### Source

[packages/core/src/cache/index.ts:42](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/cache/index.ts#L42)

***

### update()

> **update**(`keysStr`, `value`): `Promise`\<`void`\>

Updates or adds a new value in the cache with the specified key formed from the array of strings.
This operation is also fast and ensures that subsequent retrievals using the same key will return the updated value.

#### Parameters

• **keysStr**: `string`[]

An array of strings that will be concatenated and hashed to form the cache key.

• **value**: `T`

The value to store in the cache.

#### Returns

`Promise`\<`void`\>

A promise that resolves once the value is set in the cache.

#### Overrides

[`BaseCache`](../base/classes/BaseCache.md) . [`update`](../base/classes/BaseCache.md#update)

#### Source

[packages/core/src/cache/index.ts:54](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/cache/index.ts#L54)

***

### global()

> `static` **global**\<`T`\>(): [`MemoryCache`](MemoryCache.md)\<`T`\>

Provides a static method to access a global shared cache instance. This is useful for scenarios where
a single cache instance is sufficient and shared across different parts of the application.

#### Type parameters

• **T**

The type of data the global cache will store.

#### Returns

[`MemoryCache`](MemoryCache.md)\<`T`\>

An instance of MemoryCache with a global shared map.

#### Source

[packages/core/src/cache/index.ts:65](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/cache/index.ts#L65)
