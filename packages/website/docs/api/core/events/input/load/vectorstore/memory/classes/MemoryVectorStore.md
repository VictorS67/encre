# Class: MemoryVectorStore

Provides an in-memory implementation of a vector store that supports operations such as adding,
deleting, and searching vectors based on similarity or relevance. This class is suitable for
lightweight applications or environments where persistence is not required.

## Example

```typescript
// Create an instance of the MemoryVectorStore
const vectorStore = new MemoryVectorStore();

// Example embeddings and contexts
const embeddings = [
  [0.1, 0.2, 0.3],
  [0.4, 0.5, 0.6],
  [0.7, 0.8, 0.9]
];
const contexts = [
  new Context({ pageContent: "First context", metadata: { topic: "Science" }}),
  new Context({ pageContent: "Second context", metadata: { topic: "Technology" }}),
  new Context({ pageContent: "Third context", metadata: { topic: "Mathematics" }})
];

// Add vectors to the store
await vectorStore.addVectors(embeddings, contexts);

// Perform a similarity search
const query = [0.1, 0.1, 0.1];
const topK = 2;
const searchResults = await vectorStore.similaritySearch(query, topK);

// Log the search results
console.log("Search Results:", searchResults.map(r => ({ content: r[0].pageContent, score: r[1] })));
```

## Extends

- [`BaseVectorStore`](../../base/classes/BaseVectorStore.md)

## Implements

- [`MemoryVectorStoreField`](../interfaces/MemoryVectorStoreField.md)

## Constructors

### new MemoryVectorStore()

> **new MemoryVectorStore**(`fields`?): [`MemoryVectorStore`](MemoryVectorStore.md)

#### Parameters

• **fields?**: `Partial` \<[`MemoryVectorStoreField`](../interfaces/MemoryVectorStoreField.md)\>

#### Returns

[`MemoryVectorStore`](MemoryVectorStore.md)

#### Overrides

[`BaseVectorStore`](../../base/classes/BaseVectorStore.md) . [`constructor`](../../base/classes/BaseVectorStore.md#constructors)

#### Source

[packages/core/src/events/input/load/vectorstore/memory.ts:171](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/vectorstore/memory.ts#L171)

## Properties

### FilterType

> **FilterType**: [`MemoryVectorStoreFilterType`](../type-aliases/MemoryVectorStoreFilterType.md)

Defines the filter type for the MemoryVectorStore. Filters can include a function to
determine inclusion based on context, and an option to include embeddings in the returned data.

#### Overrides

[`BaseVectorStore`](../../base/classes/BaseVectorStore.md) . [`FilterType`](../../base/classes/BaseVectorStore.md#filtertype)

#### Source

[packages/core/src/events/input/load/vectorstore/memory.ts:145](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/vectorstore/memory.ts#L145)

***

### \_isSerializable

> **\_isSerializable**: `boolean` = `true`

Indicates if the instance is serializable. If false, toJSON returns a non-implementable serialization.

#### Overrides

[`BaseVectorStore`](../../base/classes/BaseVectorStore.md) . [`_isSerializable`](../../base/classes/BaseVectorStore.md#_isserializable)

#### Source

[packages/core/src/events/input/load/vectorstore/memory.ts:147](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/vectorstore/memory.ts#L147)

***

### \_kwargs

> **\_kwargs**: `SerializedFields`

Key-value pairs of properties to be serialized.

#### Inherited from

[`BaseVectorStore`](../../base/classes/BaseVectorStore.md) . [`_kwargs`](../../base/classes/BaseVectorStore.md#_kwargs)

#### Source

[packages/core/src/load/serializable.ts:168](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/load/serializable.ts#L168)

***

### \_namespace

> **\_namespace**: `string`[]

Unique namespace identifier for the serialized object, represented as an array of strings.

#### Inherited from

[`BaseVectorStore`](../../base/classes/BaseVectorStore.md) . [`_namespace`](../../base/classes/BaseVectorStore.md#_namespace)

#### Source

[packages/core/src/events/input/load/vectorstore/base.ts:27](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/vectorstore/base.ts#L27)

***

### filter?

> `optional` **filter**: [`MemoryVectorStoreFilterType`](../type-aliases/MemoryVectorStoreFilterType.md)

Optional filters that can be applied during vector retrieval operations to limit the
results based on custom logic.

#### Implementation of

[`MemoryVectorStoreField`](../interfaces/MemoryVectorStoreField.md) . [`filter`](../interfaces/MemoryVectorStoreField.md#filter)

#### Source

[packages/core/src/events/input/load/vectorstore/memory.ts:165](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/vectorstore/memory.ts#L165)

***

### similarity()

> **similarity**: (`a`, `b`) => `number`

The function used to calculate the similarity between two vectors. This is typically a
cosine similarity function from a machine learning library.

#### Parameters

• **a**: `NumberArray`

• **b**: `NumberArray`

#### Returns

`number`

#### Implementation of

[`MemoryVectorStoreField`](../interfaces/MemoryVectorStoreField.md) . [`similarity`](../interfaces/MemoryVectorStoreField.md#similarity)

#### Source

[packages/core/src/events/input/load/vectorstore/memory.ts:159](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/vectorstore/memory.ts#L159)

***

### vectors

> **vectors**: [`Vector`](../type-aliases/Vector.md)[]

A list of all vectors currently stored in the memory. Each vector includes its content,
embedding, and metadata.

#### Implementation of

[`MemoryVectorStoreField`](../interfaces/MemoryVectorStoreField.md) . [`vectors`](../interfaces/MemoryVectorStoreField.md#vectors)

#### Source

[packages/core/src/events/input/load/vectorstore/memory.ts:153](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/vectorstore/memory.ts#L153)

## Accessors

### \_aliases

> `get` **\_aliases**(): `undefined` \| `SerializedFields`

Retrieves alias mappings for the object's attribute names.

#### Returns

`undefined` \| `SerializedFields`

An object representing key aliases, or undefined if none are defined.

#### Source

[packages/core/src/load/serializable.ts:217](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/load/serializable.ts#L217)

***

### \_attributes

> `get` **\_attributes**(): `undefined` \| `SerializedFields`

Retrieves attributes of the object.

#### Returns

`undefined` \| `SerializedFields`

An object representing attributes, or undefined if none are defined.

#### Source

[packages/core/src/load/serializable.ts:208](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/load/serializable.ts#L208)

***

### \_id

> `get` **\_id**(): `string`[]

Retrieves the name of the class. This provides a unique identifier for serialization.

#### Returns

`string`[]

The path of serializable.

#### Source

[packages/core/src/load/serializable.ts:187](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/load/serializable.ts#L187)

***

### \_secrets

> `get` **\_secrets**(): `undefined` \| `SecretFields`

Retrieves any secrets defined in the object.

#### Returns

`undefined` \| `SecretFields`

An object representing secret fields, or undefined if none are defined.

#### Source

[packages/core/src/load/serializable.ts:199](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/load/serializable.ts#L199)

## Methods

### \_vectorstoreType()

> **\_vectorstoreType**(): `string`

Returns the type of the vector store.

#### Returns

`string`

#### Overrides

[`BaseVectorStore`](../../base/classes/BaseVectorStore.md) . [`_vectorstoreType`](../../base/classes/BaseVectorStore.md#_vectorstoretype)

#### Source

[packages/core/src/events/input/load/vectorstore/memory.ts:167](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/vectorstore/memory.ts#L167)

***

### addVectors()

> **addVectors**(`embeddings`, `context`, `options`?): `Promise`\<`void`\>

Adds vectors to the store along with their associated context data.

#### Parameters

• **embeddings**: `number`[][]

An array of numerical arrays representing the vector embeddings to be added.

• **context**: [`Context`](../../../docs/context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[]

An array of `Context` objects associated with each embedding.

• **options?**

Optional parameters for the add operation.

• **options.ids?**: `string`[]

#### Returns

`Promise`\<`void`\>

A promise that resolves when the vectors have been added.

#### Overrides

[`BaseVectorStore`](../../base/classes/BaseVectorStore.md) . [`addVectors`](../../base/classes/BaseVectorStore.md#addvectors)

#### Source

[packages/core/src/events/input/load/vectorstore/memory.ts:179](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/vectorstore/memory.ts#L179)

***

### deleteVectors()

> **deleteVectors**(`params`?): `Promise`\<`void`\>

Deletes vectors from the store based on specified parameters.

#### Parameters

• **params?**: [`MemoryDeleteParams`](../interfaces/MemoryDeleteParams.md) \<[`MemoryVectorStoreFilterType`](../type-aliases/MemoryVectorStoreFilterType.md)\>

Optional parameters to specify which vectors to delete.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the vectors have been deleted.

#### Overrides

[`BaseVectorStore`](../../base/classes/BaseVectorStore.md) . [`deleteVectors`](../../base/classes/BaseVectorStore.md#deletevectors)

#### Source

[packages/core/src/events/input/load/vectorstore/memory.ts:225](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/vectorstore/memory.ts#L225)

***

### getAttributes()

> **getAttributes**(): `object`

Retrieves a comprehensive representation of the object's attributes, secrets, and aliases.

#### Returns

`object`

An object containing aliases, secrets, and keyword arguments.

##### aliases

> **aliases**: `SerializedKeyAlias`

##### kwargs

> **kwargs**: `SerializedFields`

##### secrets

> **secrets**: `SecretFields`

#### Inherited from

[`BaseVectorStore`](../../base/classes/BaseVectorStore.md) . [`getAttributes`](../../base/classes/BaseVectorStore.md#getattributes)

#### Source

[packages/core/src/load/serializable.ts:430](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/load/serializable.ts#L430)

***

### maxMarginalRelevanceSearch()

> **maxMarginalRelevanceSearch**(`query`, `topK`, `lambda`, `filter`?): `Promise` \<[[`Context`](../../../docs/context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>, `number`][]\>

Performs a Max Marginal Relevance (MMR) search to diversify the results of a similarity search.
This method helps in retrieving not just the most similar items, but also the most diverse
ones from the top results.

#### Parameters

• **query**: `number`[]

A numerical array representing the query vector.

• **topK**: `number`

The number of top results to consider for diversification.

• **lambda**: `number`

A parameter controlling the trade-off between similarity and diversity.

• **filter?**: [`MemoryVectorStoreFilterType`](../type-aliases/MemoryVectorStoreFilterType.md)

Optional filter to apply during the search.

#### Returns

`Promise` \<[[`Context`](../../../docs/context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>, `number`][]\>

A promise that resolves to an array of tuples,
        each containing a `Context` object and a relevance score.

#### Overrides

[`BaseVectorStore`](../../base/classes/BaseVectorStore.md) . [`maxMarginalRelevanceSearch`](../../base/classes/BaseVectorStore.md#maxmarginalrelevancesearch)

#### Source

[packages/core/src/events/input/load/vectorstore/memory.ts:314](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/vectorstore/memory.ts#L314)

***

### similaritySearch()

> **similaritySearch**(`query`, `topK`, `filter`?): `Promise` \<[[`Context`](../../../docs/context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>, `number`][]\>

Performs a similarity search to find vectors closest to the given query vector.

#### Parameters

• **query**: `number`[]

A numerical array representing the query vector.

• **topK**: `number`

The number of top similar results to return.

• **filter?**: [`MemoryVectorStoreFilterType`](../type-aliases/MemoryVectorStoreFilterType.md)

Optional filter to apply to the search.

#### Returns

`Promise` \<[[`Context`](../../../docs/context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>, `number`][]\>

A promise that resolves to an array of tuples,
        each containing a `Context` object and a similarity score.

#### Overrides

[`BaseVectorStore`](../../base/classes/BaseVectorStore.md) . [`similaritySearch`](../../base/classes/BaseVectorStore.md#similaritysearch)

#### Source

[packages/core/src/events/input/load/vectorstore/memory.ts:268](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/vectorstore/memory.ts#L268)

***

### toJSON()

> **toJSON**(): [`Serialized`](../../../../../../load/serializable/type-aliases/Serialized.md)

Converts the object to a serialized representation based on the object's current state. This method determines whether to use a 'not implemented' or 'constructor' format based on the object's serializability.

#### Returns

[`Serialized`](../../../../../../load/serializable/type-aliases/Serialized.md)

A serialized representation of the object.

#### Inherited from

[`BaseVectorStore`](../../base/classes/BaseVectorStore.md) . [`toJSON`](../../base/classes/BaseVectorStore.md#tojson)

#### Source

[packages/core/src/load/serializable.ts:665](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/load/serializable.ts#L665)

***

### toJSONConstructor()

> **toJSONConstructor**(`aliases`, `secrets`, `kwargs`): [`Serialized`](../../../../../../load/serializable/type-aliases/Serialized.md)

Converts the object to a serialized constructor format. This method provides a way to serialize object construction details, including any aliases or secrets.

#### Parameters

• **aliases**: `SerializedKeyAlias`

Key aliases to include in the serialized output.

• **secrets**: `SecretFields`

Secrets to be secured in the serialized output.

• **kwargs**: `SerializedFields`

Additional keyword arguments to include in the serialized output.

#### Returns

[`Serialized`](../../../../../../load/serializable/type-aliases/Serialized.md)

A serialized representation of the object as a constructor.

#### Inherited from

[`BaseVectorStore`](../../base/classes/BaseVectorStore.md) . [`toJSONConstructor`](../../base/classes/BaseVectorStore.md#tojsonconstructor)

#### Source

[packages/core/src/load/serializable.ts:478](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/load/serializable.ts#L478)

***

### toJSONNotImplemented()

> **toJSONNotImplemented**(): [`Serialized`](../../../../../../load/serializable/type-aliases/Serialized.md)

Converts the object to a serialized format that is not implemented. This method should be overridden in subclasses to provide specific serialization behavior.

#### Returns

[`Serialized`](../../../../../../load/serializable/type-aliases/Serialized.md)

A serialized representation of the object.

#### Inherited from

[`BaseVectorStore`](../../base/classes/BaseVectorStore.md) . [`toJSONNotImplemented`](../../base/classes/BaseVectorStore.md#tojsonnotimplemented)

#### Source

[packages/core/src/load/serializable.ts:448](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/load/serializable.ts#L448)

***

### toJSONSecret()

> **toJSONSecret**(`secretKey`): [`Serialized`](../../../../../../load/serializable/type-aliases/Serialized.md)

Converts a secret key to its serialized format. This method is typically used for serializing secrets in a secure manner.

#### Parameters

• **secretKey**: `string`

The secret key to serialize.

#### Returns

[`Serialized`](../../../../../../load/serializable/type-aliases/Serialized.md)

A serialized representation of the secret key.

#### Inherited from

[`BaseVectorStore`](../../base/classes/BaseVectorStore.md) . [`toJSONSecret`](../../base/classes/BaseVectorStore.md#tojsonsecret)

#### Source

[packages/core/src/load/serializable.ts:462](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/load/serializable.ts#L462)

***

### \_name()

> `static` **\_name**(): `string`

Generates a unique name for the class, typically used for serialization identification.

#### Returns

`string`

#### Inherited from

[`BaseVectorStore`](../../base/classes/BaseVectorStore.md) . [`_name`](../../base/classes/BaseVectorStore.md#_name)

#### Source

[packages/core/src/load/serializable.ts:178](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/load/serializable.ts#L178)
