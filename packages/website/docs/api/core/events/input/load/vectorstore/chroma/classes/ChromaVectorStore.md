# Class: ChromaVectorStore

The ChromaVectorStore class provides an in-memory vector store that integrates
with a Chroma backend service for storing and retrieving vector embeddings associated with content.
It supports operations like adding vectors, deleting vectors based on IDs or filters, and conducting
similarity and maximal marginal relevance searches.

## Example

```typescript
// Instantiate the ChromaVectorStore
const vectorStore = new ChromaVectorStore({
  url: 'my-chroma-instance-url',
  collectionName: 'myVectorCollection'
});

// Example embeddings and associated contexts
const embeddings = [
  [0.1, 0.2, 0.3],
  [0.4, 0.5, 0.6]
];
const contexts = [
  new Context({ pageContent: "Content about AI", metadata: { topic: "AI" }}),
  new Context({ pageContent: "Content about ML", metadata: { topic: "ML" }})
];

// Add vectors to the store
await vectorStore.addVectors(embeddings, contexts);

// Perform a similarity search
const queryEmbedding = [0.15, 0.25, 0.35];
const topK = 1;
const similarityResults = await vectorStore.similaritySearch(queryEmbedding, topK);

// Display the results
console.log("Similarity Search Results:", similarityResults.map(r => ({
  content: r[0].pageContent,
  similarityScore: r[1]
})));

// Optionally, delete vectors
await vectorStore.deleteVectors({ ids: [similarityResults[0][0].id] });
```

## Extends

- [`BaseVectorStore`](../../base/classes/BaseVectorStore.md)

## Implements

- [`ChromaVectorStoreField`](../interfaces/ChromaVectorStoreField.md)

## Constructors

### new ChromaVectorStore()

> **new ChromaVectorStore**(`fields`?): [`ChromaVectorStore`](ChromaVectorStore.md)

#### Parameters

• **fields?**: `Partial` \<[`ChromaVectorStoreField`](../interfaces/ChromaVectorStoreField.md)\>

#### Returns

[`ChromaVectorStore`](ChromaVectorStore.md)

#### Overrides

[`BaseVectorStore`](../../base/classes/BaseVectorStore.md) . [`constructor`](../../base/classes/BaseVectorStore.md#constructors)

#### Source

[packages/core/src/events/input/load/vectorstore/chroma.ts:199](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/vectorstore/chroma.ts#L199)

## Properties

### FilterType

> **FilterType**: [`ChromaVectorStoreFilterType`](../type-aliases/ChromaVectorStoreFilterType.md)

Defines the filter type used in vector operations. This can be an object or a string,
depending on the subclass implementation, to support various filtering strategies.

#### Overrides

[`BaseVectorStore`](../../base/classes/BaseVectorStore.md) . [`FilterType`](../../base/classes/BaseVectorStore.md#filtertype)

#### Source

[packages/core/src/events/input/load/vectorstore/chroma.ts:160](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/vectorstore/chroma.ts#L160)

***

### \_client

`Internal`

> `private` **\_client**: `ChromaClient`

Chroma API Client.

#### Source

[packages/core/src/events/input/load/vectorstore/chroma.ts:193](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/vectorstore/chroma.ts#L193)

***

### \_isSerializable

> **\_isSerializable**: `boolean` = `true`

Indicates if the instance is serializable. If false, toJSON returns a non-implementable serialization.

#### Overrides

[`BaseVectorStore`](../../base/classes/BaseVectorStore.md) . [`_isSerializable`](../../base/classes/BaseVectorStore.md#_isserializable)

#### Source

[packages/core/src/events/input/load/vectorstore/chroma.ts:162](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/vectorstore/chroma.ts#L162)

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

### collectionMetadata?

> `optional` **collectionMetadata**: `CollectionMetadata`

Additional metadata related to the collection.

#### Implementation of

[`ChromaVectorStoreField`](../interfaces/ChromaVectorStoreField.md) . [`collectionMetadata`](../interfaces/ChromaVectorStoreField.md#collectionmetadata)

#### Source

[packages/core/src/events/input/load/vectorstore/chroma.ts:182](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/vectorstore/chroma.ts#L182)

***

### collectionName?

> `optional` **collectionName**: `string`

Name of the collection within Chroma where vectors are stored.

#### Implementation of

[`ChromaVectorStoreField`](../interfaces/ChromaVectorStoreField.md) . [`collectionName`](../interfaces/ChromaVectorStoreField.md#collectionname)

#### Source

[packages/core/src/events/input/load/vectorstore/chroma.ts:177](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/vectorstore/chroma.ts#L177)

***

### filter?

> `optional` **filter**: [`ChromaVectorStoreFilterType`](../type-aliases/ChromaVectorStoreFilterType.md)

Optional filter settings that can be applied during search operations.

#### Implementation of

[`ChromaVectorStoreField`](../interfaces/ChromaVectorStoreField.md) . [`filter`](../interfaces/ChromaVectorStoreField.md#filter)

#### Source

[packages/core/src/events/input/load/vectorstore/chroma.ts:187](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/vectorstore/chroma.ts#L187)

***

### numDimensions?

> `optional` **numDimensions**: `number`

Number of dimensions for each embedding vector.

#### Implementation of

[`ChromaVectorStoreField`](../interfaces/ChromaVectorStoreField.md) . [`numDimensions`](../interfaces/ChromaVectorStoreField.md#numdimensions)

#### Source

[packages/core/src/events/input/load/vectorstore/chroma.ts:172](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/vectorstore/chroma.ts#L172)

***

### url

> **url**: `string`

Base URL of the Chroma backend service.

#### Implementation of

[`ChromaVectorStoreField`](../interfaces/ChromaVectorStoreField.md) . [`url`](../interfaces/ChromaVectorStoreField.md#url)

#### Source

[packages/core/src/events/input/load/vectorstore/chroma.ts:167](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/vectorstore/chroma.ts#L167)

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

### \_getCollection()

`Internal`

> **\_getCollection**(): `Promise`\<`Collection`\>

Retrieves a collection from the Chroma backend. If the collection does not exist, it creates a new one using
the specified collection name and optional metadata. This method ensures that the required collection is available
for storing and retrieving vector embeddings.

#### Returns

`Promise`\<`Collection`\>

A promise that resolves to the ChromaCollection object, allowing for further interaction with the collection.

#### Throws

An error if the Chroma service fails to create or retrieve the collection.

#### Example

```typescript
const vectorStore = new ChromaVectorStore({
  url: 'my-chroma-instance-url',
  collectionName: 'myVectorCollection'
});
try {
  const collection = await vectorStore._getCollection();
  console.log('Collection ready for use:', collection);
} catch (error) {
  console.error('Failed to access or create the collection:', error);
}
```

#### Source

[packages/core/src/events/input/load/vectorstore/chroma.ts:465](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/vectorstore/chroma.ts#L465)

***

### \_getCollectionName()

`Internal`

> `private` **\_getCollectionName**(): `string`

Generates a unique collection name based on the `collectionName` field. If `collectionName` is not set,
it generates a random UUID as the collection name. This method ensures a consistent naming strategy for
collections used within the Chroma service.

#### Returns

`string`

The name of the collection as a string.

#### Source

[packages/core/src/events/input/load/vectorstore/chroma.ts:493](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/vectorstore/chroma.ts#L493)

***

### \_vectorstoreType()

> **\_vectorstoreType**(): `string`

Returns the type of the vector store.

#### Returns

`string`

#### Overrides

[`BaseVectorStore`](../../base/classes/BaseVectorStore.md) . [`_vectorstoreType`](../../base/classes/BaseVectorStore.md#_vectorstoretype)

#### Source

[packages/core/src/events/input/load/vectorstore/chroma.ts:195](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/vectorstore/chroma.ts#L195)

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

[packages/core/src/events/input/load/vectorstore/chroma.ts:209](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/vectorstore/chroma.ts#L209)

***

### deleteVectors()

> **deleteVectors**(`params`?): `Promise`\<`void`\>

Deletes vectors from the store based on specified parameters.

#### Parameters

• **params?**: [`ChromaDeleteParams`](../interfaces/ChromaDeleteParams.md) \<[`ChromaVectorStoreFilterType`](../type-aliases/ChromaVectorStoreFilterType.md)\>

Optional parameters to specify which vectors to delete.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the vectors have been deleted.

#### Overrides

[`BaseVectorStore`](../../base/classes/BaseVectorStore.md) . [`deleteVectors`](../../base/classes/BaseVectorStore.md#deletevectors)

#### Source

[packages/core/src/events/input/load/vectorstore/chroma.ts:308](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/vectorstore/chroma.ts#L308)

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

• **filter?**: [`ChromaVectorStoreFilterType`](../type-aliases/ChromaVectorStoreFilterType.md)

Optional filter to apply during the search.

#### Returns

`Promise` \<[[`Context`](../../../docs/context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>, `number`][]\>

A promise that resolves to an array of tuples,
        each containing a `Context` object and a relevance score.

#### Overrides

[`BaseVectorStore`](../../base/classes/BaseVectorStore.md) . [`maxMarginalRelevanceSearch`](../../base/classes/BaseVectorStore.md#maxmarginalrelevancesearch)

#### Source

[packages/core/src/events/input/load/vectorstore/chroma.ts:406](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/vectorstore/chroma.ts#L406)

***

### similaritySearch()

> **similaritySearch**(`query`, `topK`, `filter`?): `Promise` \<[[`Context`](../../../docs/context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>, `number`][]\>

Performs a similarity search to find vectors closest to the given query vector.

#### Parameters

• **query**: `number`[]

A numerical array representing the query vector.

• **topK**: `number`

The number of top similar results to return.

• **filter?**: [`ChromaVectorStoreFilterType`](../type-aliases/ChromaVectorStoreFilterType.md)

Optional filter to apply to the search.

#### Returns

`Promise` \<[[`Context`](../../../docs/context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>, `number`][]\>

A promise that resolves to an array of tuples,
        each containing a `Context` object and a similarity score.

#### Overrides

[`BaseVectorStore`](../../base/classes/BaseVectorStore.md) . [`similaritySearch`](../../base/classes/BaseVectorStore.md#similaritysearch)

#### Source

[packages/core/src/events/input/load/vectorstore/chroma.ts:329](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/vectorstore/chroma.ts#L329)

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
