# Class: `abstract` BaseVectorStore

An abstract class representing the basic functionality of a vector store. Vector stores
are used to manage and retrieve high-dimensional vector data typically used in search
and machine learning applications. This class provides a common interface for adding,
deleting, and searching vectors within a store.

## Implements

A marker interface for additional fields.

## Extends

- [`Serializable`](../../../../../../load/serializable/classes/Serializable.md)

## Extended by

- [`ChromaVectorStore`](../../chroma/classes/ChromaVectorStore.md)
- [`MemoryVectorStore`](../../memory/classes/MemoryVectorStore.md)

## Implements

- [`BaseVectorStoreField`](../interfaces/BaseVectorStoreField.md)

## Constructors

### new BaseVectorStore()

> **new BaseVectorStore**(`fields`?): [`BaseVectorStore`](BaseVectorStore.md)

#### Parameters

• **fields?**: `Partial` \<[`BaseVectorStoreField`](../interfaces/BaseVectorStoreField.md)\>

#### Returns

[`BaseVectorStore`](BaseVectorStore.md)

#### Overrides

[`Serializable`](../../../../../../load/serializable/classes/Serializable.md) . [`constructor`](../../../../../../load/serializable/classes/Serializable.md#constructors)

#### Source

[packages/core/src/events/input/load/vectorstore/base.ts:35](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/vectorstore/base.ts#L35)

## Properties

### FilterType

> **FilterType**: `string` \| `object`

Defines the filter type used in vector operations. This can be an object or a string,
depending on the subclass implementation, to support various filtering strategies.

#### Source

[packages/core/src/events/input/load/vectorstore/base.ts:23](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/vectorstore/base.ts#L23)

***

### \_isSerializable

> **\_isSerializable**: `boolean` = `false`

Indicates if the instance is serializable. If false, toJSON returns a non-implementable serialization.

#### Overrides

[`Serializable`](../../../../../../load/serializable/classes/Serializable.md) . [`_isSerializable`](../../../../../../load/serializable/classes/Serializable.md#_isserializable)

#### Source

[packages/core/src/events/input/load/vectorstore/base.ts:25](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/vectorstore/base.ts#L25)

***

### \_kwargs

> **\_kwargs**: `SerializedFields`

Key-value pairs of properties to be serialized.

#### Inherited from

[`Serializable`](../../../../../../load/serializable/classes/Serializable.md) . [`_kwargs`](../../../../../../load/serializable/classes/Serializable.md#_kwargs)

#### Source

[packages/core/src/load/serializable.ts:168](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/load/serializable.ts#L168)

***

### \_namespace

> **\_namespace**: `string`[]

Unique namespace identifier for the serialized object, represented as an array of strings.

#### Overrides

[`Serializable`](../../../../../../load/serializable/classes/Serializable.md) . [`_namespace`](../../../../../../load/serializable/classes/Serializable.md#_namespace)

#### Source

[packages/core/src/events/input/load/vectorstore/base.ts:27](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/vectorstore/base.ts#L27)

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

> `abstract` **\_vectorstoreType**(): `string`

Returns the type of the vector store.

#### Returns

`string`

#### Source

[packages/core/src/events/input/load/vectorstore/base.ts:42](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/vectorstore/base.ts#L42)

***

### addVectors()

> `abstract` **addVectors**(`embeddings`, `context`, `options`?): `Promise`\<`void`\>

Adds vectors to the store along with their associated context data.

#### Parameters

• **embeddings**: `number`[][]

An array of numerical arrays representing the vector embeddings to be added.

• **context**: [`Context`](../../../docs/context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[]

An array of `Context` objects associated with each embedding.

• **options?**: `Record`\<`string`, `unknown`\>

Optional parameters for the add operation.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the vectors have been added.

#### Source

[packages/core/src/events/input/load/vectorstore/base.ts:51](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/vectorstore/base.ts#L51)

***

### deleteVectors()

> `abstract` **deleteVectors**(`params`?): `Promise`\<`void`\>

Deletes vectors from the store based on specified parameters.

#### Parameters

• **params?**: `Record`\<`string`, `unknown`\>

Optional parameters to specify which vectors to delete.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the vectors have been deleted.

#### Source

[packages/core/src/events/input/load/vectorstore/base.ts:62](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/vectorstore/base.ts#L62)

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

[`Serializable`](../../../../../../load/serializable/classes/Serializable.md) . [`getAttributes`](../../../../../../load/serializable/classes/Serializable.md#getattributes)

#### Source

[packages/core/src/load/serializable.ts:430](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/load/serializable.ts#L430)

***

### maxMarginalRelevanceSearch()

> `abstract` **maxMarginalRelevanceSearch**(`query`, `topK`, `lambda`, `filter`?): `Promise` \<[[`Context`](../../../docs/context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>, `number`][]\>

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

• **filter?**: `string` \| `object`

Optional filter to apply during the search.

#### Returns

`Promise` \<[[`Context`](../../../docs/context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>, `number`][]\>

A promise that resolves to an array of tuples,
        each containing a `Context` object and a relevance score.

#### Source

[packages/core/src/events/input/load/vectorstore/base.ts:89](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/vectorstore/base.ts#L89)

***

### similaritySearch()

> `abstract` **similaritySearch**(`query`, `topK`, `filter`?): `Promise` \<[[`Context`](../../../docs/context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>, `number`][]\>

Performs a similarity search to find vectors closest to the given query vector.

#### Parameters

• **query**: `number`[]

A numerical array representing the query vector.

• **topK**: `number`

The number of top similar results to return.

• **filter?**: `string` \| `object`

Optional filter to apply to the search.

#### Returns

`Promise` \<[[`Context`](../../../docs/context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>, `number`][]\>

A promise that resolves to an array of tuples,
        each containing a `Context` object and a similarity score.

#### Source

[packages/core/src/events/input/load/vectorstore/base.ts:72](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/vectorstore/base.ts#L72)

***

### toJSON()

> **toJSON**(): [`Serialized`](../../../../../../load/serializable/type-aliases/Serialized.md)

Converts the object to a serialized representation based on the object's current state. This method determines whether to use a 'not implemented' or 'constructor' format based on the object's serializability.

#### Returns

[`Serialized`](../../../../../../load/serializable/type-aliases/Serialized.md)

A serialized representation of the object.

#### Inherited from

[`Serializable`](../../../../../../load/serializable/classes/Serializable.md) . [`toJSON`](../../../../../../load/serializable/classes/Serializable.md#tojson)

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

[`Serializable`](../../../../../../load/serializable/classes/Serializable.md) . [`toJSONConstructor`](../../../../../../load/serializable/classes/Serializable.md#tojsonconstructor)

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

[`Serializable`](../../../../../../load/serializable/classes/Serializable.md) . [`toJSONNotImplemented`](../../../../../../load/serializable/classes/Serializable.md#tojsonnotimplemented)

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

[`Serializable`](../../../../../../load/serializable/classes/Serializable.md) . [`toJSONSecret`](../../../../../../load/serializable/classes/Serializable.md#tojsonsecret)

#### Source

[packages/core/src/load/serializable.ts:462](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/load/serializable.ts#L462)

***

### \_name()

> `static` **\_name**(): `string`

Generates a unique name for the class, typically used for serialization identification.

#### Returns

`string`

#### Inherited from

[`Serializable`](../../../../../../load/serializable/classes/Serializable.md) . [`_name`](../../../../../../load/serializable/classes/Serializable.md#_name)

#### Source

[packages/core/src/load/serializable.ts:178](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/load/serializable.ts#L178)
