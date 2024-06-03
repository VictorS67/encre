# Class: NodeRegistration\<NodeTypes, NodeSubTypes, Nodes\>

Manages registration and creation of various node types within a graph system,
supporting dynamic type and subtype management.

## Type parameters

• **NodeTypes** *extends* `string` = `never`

• **NodeSubTypes** *extends* `string` = `never`

• **Nodes** *extends* [`SerializableNode`](../../../nodes/interfaces/SerializableNode.md) = `never`

## Constructors

### new NodeRegistration()

> **new NodeRegistration**\<`NodeTypes`, `NodeSubTypes`, `Nodes`\>(): [`NodeRegistration`](NodeRegistration.md)\<`NodeTypes`, `NodeSubTypes`, `Nodes`\>

#### Returns

[`NodeRegistration`](NodeRegistration.md)\<`NodeTypes`, `NodeSubTypes`, `Nodes`\>

## Properties

### implsMap

> **implsMap**: `Record`\<`string`, `object`\>

Maps type-subtype pairs to their corresponding node implementations and initialization data.

#### Source

[packages/core/src/studio/registration/nodes.ts:106](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/registration/nodes.ts#L106)

***

### info

> **info**: \{ \[P in \`$\{string\}-$\{string\}\`\]: Object \}

Stores implementation details for node types and subtypes.

#### Source

[packages/core/src/studio/registration/nodes.ts:95](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/registration/nodes.ts#L95)

***

### nodeTypePairs

> `readonly` **nodeTypePairs**: `{ [P in string]: NodeSubTypes[] }`

A dictionary where each key is a node type and the value is an array of subtypes associated with that type.
This structure is crucial for systems that require knowledge of the hierarchical organization of node types,
allowing them to access all subtypes related to a specific node type efficiently. It supports operations
such as dynamic node creation and validation by providing a clear map of how types are structured and related.

#### Source

[packages/core/src/studio/registration/nodes.ts:133](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/registration/nodes.ts#L133)

***

### nodeTypes

> `readonly` **nodeTypes**: `Set`\<`NodeTypes`\>

A set containing all distinct node types that have been registered. This set is used to quickly check
the existence of a node type within the system without needing to search through the complete registry.
It supports operations where type checking is necessary, providing a fast access point to determine
what types of nodes are available.

#### Source

[packages/core/src/studio/registration/nodes.ts:125](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/registration/nodes.ts#L125)

***

### rawImplsMap

> **rawImplsMap**: `Record`\<`string`, `object`\>

Maps serializable IDs to their node implementations for nodes that are initialized from raw data.

#### Source

[packages/core/src/studio/registration/nodes.ts:114](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/registration/nodes.ts#L114)

***

### registeredNodeTypePairs

`Internal`

> **registeredNodeTypePairs**: `{ [P in string]: NodeSubTypes[] }`

Maintains a mapping from node types to their subtypes.

#### Source

[packages/core/src/studio/registration/nodes.ts:90](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/registration/nodes.ts#L90)

***

### registeredNodeTypes

`Internal`

> **registeredNodeTypes**: `NodeTypes`

Tracks registered primary node types.

#### Source

[packages/core/src/studio/registration/nodes.ts:83](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/registration/nodes.ts#L83)

***

### registeredNodes

`Internal`

> **registeredNodes**: `Nodes`

Stores instances of registered nodes.

#### Source

[packages/core/src/studio/registration/nodes.ts:76](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/registration/nodes.ts#L76)

## Accessors

### dynamicImplsMap

> `get` **dynamicImplsMap**(): `Record`\<`string`, `object`\>

Provides access to a map of dynamically registered node implementations based on a composite key of `type-subType`.
This map is essential for retrieving specific node implementations dynamically,
facilitating operations such as node instantiation and processing based on type and subtype.

#### Returns

`Record`\<`string`, `object`\>

A map where each key is a string in the format `type-subType` and each value is an object containing the node implementation constructor and the initial node instance template.

#### Source

[packages/core/src/studio/registration/nodes.ts:150](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/registration/nodes.ts#L150)

***

### dynamicRawImplsMap

> `get` **dynamicRawImplsMap**(): `Record`\<`string`, `object`\>

Provides access to a map of dynamically registered node implementations based on the serializable ID of the node.
This map is particularly useful for instantiating nodes from serialized data where
the node type might not be directly known but can be inferred from the ID.

#### Returns

`Record`\<`string`, `object`\>

A map where each key is a serializable ID and each value is an object containing the node implementation constructor and the initial node instance template, facilitating node creation from serialized forms.

#### Source

[packages/core/src/studio/registration/nodes.ts:163](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/registration/nodes.ts#L163)

***

### nodeConstructors

> `get` **nodeConstructors**(): [`NodeImplConstructor`](../interfaces/NodeImplConstructor.md) \<[`SerializableNode`](../../../nodes/interfaces/SerializableNode.md)\<`string`, [`Serializable`](../../../../load/serializable/classes/Serializable.md)\>\>[]

Retrieves a list of all node implementation constructors registered in the system.
This list allows for dynamic instantiation of nodes where only the type is known at runtime.

#### Returns

[`NodeImplConstructor`](../interfaces/NodeImplConstructor.md) \<[`SerializableNode`](../../../nodes/interfaces/SerializableNode.md)\<`string`, [`Serializable`](../../../../load/serializable/classes/Serializable.md)\>\>[]

An array of node implementation constructors, enabling the creation of node instances dynamically.

#### Source

[packages/core/src/studio/registration/nodes.ts:140](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/registration/nodes.ts#L140)

## Methods

### create()

> **create**\<`T`, `U`\>(`type`, `subType`, `registerArgs`?): `Extract`\<`Nodes`, `object`\>

Creates an instance of a node based on the specified type and subtype,
using optional arguments for initialization.

#### Type parameters

• **T** *extends* `string`

• **U** *extends* `string`

#### Parameters

• **type**: `T`

The primary type of the node.

• **subType**: `U`

The subtype of the node.

• **registerArgs?**: `Record`\<`string`, `unknown`\>

Optional arguments for node initialization.

#### Returns

`Extract`\<`Nodes`, `object`\>

A new node instance of the specified type and subtype.

#### Throws

an error if the type-subtype pair is not registered.

#### Source

[packages/core/src/studio/registration/nodes.ts:239](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/registration/nodes.ts#L239)

***

### createDynamic()

> **createDynamic**(`type`, `subType`, `registerArgs`?): [`SerializableNode`](../../../nodes/interfaces/SerializableNode.md)\<`string`, [`Serializable`](../../../../load/serializable/classes/Serializable.md)\>

Dynamically creates an instance of a node based on the specified type and subtype.
This method allows for node creation using dynamic type information, which is useful in scenarios where node types and subtypes are determined at runtime.

#### Parameters

• **type**: `string`

The type of the node to create.

• **subType**: `string`

The subtype of the node to create.

• **registerArgs?**: `Record`\<`string`, `unknown`\>

Optional arguments for initializing the node.

#### Returns

[`SerializableNode`](../../../nodes/interfaces/SerializableNode.md)\<`string`, [`Serializable`](../../../../load/serializable/classes/Serializable.md)\>

A new instance of the specified node type and subtype.

#### Throws

An error if no implementation is registered for the specified type and subtype.

#### Source

[packages/core/src/studio/registration/nodes.ts:297](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/registration/nodes.ts#L297)

***

### createDynamicImpl()

> **createDynamicImpl**(`node`): [`NodeImpl`](../../../nodes/base/classes/NodeImpl.md) \<[`SerializableNode`](../../../nodes/interfaces/SerializableNode.md)\<`string`, [`Serializable`](../../../../load/serializable/classes/Serializable.md)\>, `string`, `string`\>

Creates a node implementation dynamically based on the type and subtype of the node.
This method is used to instantiate node implementations that are needed for node processing but are determined dynamically based on node data.

#### Parameters

• **node**: [`SerializableNode`](../../../nodes/interfaces/SerializableNode.md)\<`string`, [`Serializable`](../../../../load/serializable/classes/Serializable.md)\>

The node for which the implementation needs to be created.

#### Returns

[`NodeImpl`](../../../nodes/base/classes/NodeImpl.md) \<[`SerializableNode`](../../../nodes/interfaces/SerializableNode.md)\<`string`, [`Serializable`](../../../../load/serializable/classes/Serializable.md)\>, `string`, `string`\>

An instance of `NodeImpl` for the given node, enabling further interaction and processing.

#### Throws

An error if no implementation is registered for the node's type and subtype.

#### Source

[packages/core/src/studio/registration/nodes.ts:343](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/registration/nodes.ts#L343)

***

### createDynamicRaw()

> **createDynamicRaw**(`serializable`, `registerArgs`?): [`SerializableNode`](../../../nodes/interfaces/SerializableNode.md)\<`string`, [`Serializable`](../../../../load/serializable/classes/Serializable.md)\>

Dynamically creates a node instance from a raw serializable object.
This method is particularly useful when nodes need to be instantiated from serialized data or when node types are not known until runtime.

#### Parameters

• **serializable**: [`Serializable`](../../../../load/serializable/classes/Serializable.md)

A raw serializable object that represents the node's data.

• **registerArgs?**: `Record`\<`string`, `unknown`\>

Optional arguments for initializing the node.

#### Returns

[`SerializableNode`](../../../nodes/interfaces/SerializableNode.md)\<`string`, [`Serializable`](../../../../load/serializable/classes/Serializable.md)\>

A new node instance initialized from the provided serializable data.

#### Throws

An error if no implementation is found for the node's serializable ID.

#### Source

[packages/core/src/studio/registration/nodes.ts:320](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/registration/nodes.ts#L320)

***

### createImpl()

> **createImpl**\<`T`\>(`node`): [`NodeImpl`](../../../nodes/base/classes/NodeImpl.md)\<`T`, `T`\[`"type"`\], `T`\[`"subType"`\]\>

Instantiates a node implementation for a given node object.

#### Type parameters

• **T** *extends* [`SerializableNode`](../../../nodes/interfaces/SerializableNode.md)\<`string`, [`Serializable`](../../../../load/serializable/classes/Serializable.md)\>

#### Parameters

• **node**: `T`

The node instance to create an implementation for.

#### Returns

[`NodeImpl`](../../../nodes/base/classes/NodeImpl.md)\<`T`, `T`\[`"type"`\], `T`\[`"subType"`\]\>

A new node implementation instance.

#### Throws

an error if the node's type-subtype pair is unknown.

#### Source

[packages/core/src/studio/registration/nodes.ts:264](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/registration/nodes.ts#L264)

***

### isRegistered()

> **isRegistered**(`type`, `subType`): `boolean`

Determines if a type-subtype pair is registered in the system.

#### Parameters

• **type**: `string`

The node type to check.

• **subType**: `string`

The node subtype to check.

#### Returns

`boolean`

`true` if the type-subtype pair is registered, otherwise `false`.

#### Source

[packages/core/src/studio/registration/nodes.ts:368](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/registration/nodes.ts#L368)

***

### register()

> **register**\<`T`\>(`impl`, `registerArgs`?): [`NodeRegistration`](NodeRegistration.md)\<`NodeTypes` \| `T`\[`"type"`\], `NodeSubTypes` \| `T`\[`"subType"`\], `Nodes` \| `T`\>

Registers a new node implementation into the system, associating it with its type and subtype.
It updates the internal mappings to facilitate node creation and identification based on type and subtype.

#### Type parameters

• **T** *extends* [`SerializableNode`](../../../nodes/interfaces/SerializableNode.md)\<`string`, [`Serializable`](../../../../load/serializable/classes/Serializable.md)\>

#### Parameters

• **impl**: [`NodeImplConstructor`](../interfaces/NodeImplConstructor.md)\<`T`\>

The node implementation constructor to register.

• **registerArgs?**: `Record`\<`string`, `unknown`\>

Optional arguments for initializing the node.

#### Returns

[`NodeRegistration`](NodeRegistration.md)\<`NodeTypes` \| `T`\[`"type"`\], `NodeSubTypes` \| `T`\[`"subType"`\], `Nodes` \| `T`\>

An updated instance of `NodeRegistration` reflecting the new node registration.

#### Source

[packages/core/src/studio/registration/nodes.ts:177](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/registration/nodes.ts#L177)
