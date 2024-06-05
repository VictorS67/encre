# Interface: SerializedNotImplemented

Represents a non-implementable serialization type, used for objects that cannot be serialized.
Extends [BasedSerialized](../type-aliases/BasedSerialized.md) with type 'not_implemented'.

## Extends

- [`BasedSerialized`](../type-aliases/BasedSerialized.md)\<`"not_implemented"`\>

## Properties

### \_grp

> **\_grp**: `number`

The serializable group.

#### Inherited from

`BasedSerialized._grp`

#### Source

[packages/core/src/load/serializable.ts:23](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/load/serializable.ts#L23)

***

### \_id

> **\_id**: `string`[]

The path of serializable.

#### Inherited from

`BasedSerialized._id`

#### Source

[packages/core/src/load/serializable.ts:33](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/load/serializable.ts#L33)

***

### \_type

> **\_type**: `"not_implemented"`

The serializable type. Different types have their own way of serializing data.

#### Inherited from

`BasedSerialized._type`

#### Source

[packages/core/src/load/serializable.ts:28](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/load/serializable.ts#L28)
