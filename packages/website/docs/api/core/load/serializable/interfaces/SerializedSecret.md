# Interface: SerializedSecret

Structure for serializing secret keys in class objects.
Extends [BasedSerialized](../type-aliases/BasedSerialized.md) with type 'secret'.

## Extends

- [`BasedSerialized`](../type-aliases/BasedSerialized.md)\<`"secret"`\>

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

> **\_type**: `"secret"`

The serializable type. Different types have their own way of serializing data.

#### Inherited from

`BasedSerialized._type`

#### Source

[packages/core/src/load/serializable.ts:28](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/load/serializable.ts#L28)
