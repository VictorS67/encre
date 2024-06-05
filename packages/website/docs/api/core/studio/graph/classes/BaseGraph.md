# Class: `abstract` BaseGraph

Represents a base class for creating and managing a graph structure consisting of nodes,
connections, and comments. This class provides functionalities for graph operations,
node registration, and data integrity validation across a potentially complex network of nodes.

## Extends

- [`Serializable`](../../../load/serializable/classes/Serializable.md)

## Extended by

- [`SubGraph`](SubGraph.md)

## Implements

- [`NodeGraph`](../interfaces/NodeGraph.md)

## Constructors

### new BaseGraph()

> **new BaseGraph**(`fields`?): [`BaseGraph`](BaseGraph.md)

Constructs a new instance of the BaseGraph, setting up initial configuration including
nodes, connections, and other parameters.

#### Parameters

• **fields?**: [`NodeGraph`](../interfaces/NodeGraph.md)

Initial fields to set up the graph.

#### Returns

[`BaseGraph`](BaseGraph.md)

#### Overrides

[`Serializable`](../../../load/serializable/classes/Serializable.md) . [`constructor`](../../../load/serializable/classes/Serializable.md#constructors)

#### Source

[packages/core/src/studio/graph.ts:178](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/graph.ts#L178)

## Properties

### \_isSerializable

> **\_isSerializable**: `boolean` = `true`

Indicates if the instance is serializable. If false, toJSON returns a non-implementable serialization.

#### Overrides

[`Serializable`](../../../load/serializable/classes/Serializable.md) . [`_isSerializable`](../../../load/serializable/classes/Serializable.md#_isserializable)

#### Source

[packages/core/src/studio/graph.ts:71](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/graph.ts#L71)

***

### \_kwargs

> **\_kwargs**: `SerializedFields`

Key-value pairs of properties to be serialized.

#### Inherited from

[`Serializable`](../../../load/serializable/classes/Serializable.md) . [`_kwargs`](../../../load/serializable/classes/Serializable.md#_kwargs)

#### Source

[packages/core/src/load/serializable.ts:168](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/load/serializable.ts#L168)

***

### \_namespace

> **\_namespace**: `string`[]

Unique namespace identifier for the serialized object, represented as an array of strings.

#### Overrides

[`Serializable`](../../../load/serializable/classes/Serializable.md) . [`_namespace`](../../../load/serializable/classes/Serializable.md#_namespace)

#### Source

[packages/core/src/studio/graph.ts:73](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/graph.ts#L73)

***

### comments

> **comments**: [`GraphComment`](../../comments/type-aliases/GraphComment.md)[]

Optional comments associated with the graph, for user notes or documentation purposes.

#### Implementation of

[`NodeGraph`](../interfaces/NodeGraph.md) . [`comments`](../interfaces/NodeGraph.md#comments)

#### Source

[packages/core/src/studio/graph.ts:105](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/graph.ts#L105)

***

### connections

> **connections**: [`NodeConnection`](../../nodes/type-aliases/NodeConnection.md)[]

Connections between nodes within the graph, specifying data flow from node to node.
Connections can be connected to/from `SubGraphNode`.

#### Implementation of

[`NodeGraph`](../interfaces/NodeGraph.md) . [`connections`](../interfaces/NodeGraph.md#connections)

#### Source

[packages/core/src/studio/graph.ts:100](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/graph.ts#L100)

***

### description

> **description**: `string`

Description of the graph's purpose and contents.

#### Implementation of

[`NodeGraph`](../interfaces/NodeGraph.md) . [`description`](../interfaces/NodeGraph.md#description)

#### Source

[packages/core/src/studio/graph.ts:88](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/graph.ts#L88)

***

### flattenConnections

> `readonly` **flattenConnections**: [`NodeConnection`](../../nodes/type-aliases/NodeConnection.md)[]

#### Source

[packages/core/src/studio/graph.ts:111](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/graph.ts#L111)

***

### flattenNodes

> `readonly` **flattenNodes**: [`SerializableNode`](../../nodes/interfaces/SerializableNode.md)\<`string`, [`Serializable`](../../../load/serializable/classes/Serializable.md)\>[]

#### Source

[packages/core/src/studio/graph.ts:108](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/graph.ts#L108)

***

### graphEndNodeIds

> `readonly` **graphEndNodeIds**: `RecordId`[]

#### Source

[packages/core/src/studio/graph.ts:135](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/graph.ts#L135)

***

### graphInputNameMap

> `readonly` **graphInputNameMap**: `Record`\<`string`, `object`\>

#### Source

[packages/core/src/studio/graph.ts:121](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/graph.ts#L121)

***

### graphInputs

> `readonly` **graphInputs**: `Record`\<`string`, `"string"` \| `"number"` \| `"boolean"` \| `"object"` \| `"unknown"` \| `"blob"` \| `"context"` \| `"chat-message"` \| `"string[]"` \| `"number[]"` \| `"boolean[]"` \| `"object[]"` \| `"unknown[]"` \| `"blob[]"` \| `"context[]"` \| `"chat-message[]"` \| readonly (`"string"` \| `"number"` \| `"boolean"` \| `"object"` \| `"unknown"` \| `"blob"` \| `"context"` \| `"chat-message"` \| `"string[]"` \| `"number[]"` \| `"boolean[]"` \| `"object[]"` \| `"unknown[]"` \| `"blob[]"` \| `"context[]"` \| `"chat-message[]"`)[]\>

#### Source

[packages/core/src/studio/graph.ts:114](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/graph.ts#L114)

***

### graphOutputNameMap

> `readonly` **graphOutputNameMap**: `Record`\<`string`, `object`\>

#### Source

[packages/core/src/studio/graph.ts:130](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/graph.ts#L130)

***

### graphOutputs

> `readonly` **graphOutputs**: `Record`\<`string`, `"string"` \| `"number"` \| `"boolean"` \| `"object"` \| `"unknown"` \| `"blob"` \| `"context"` \| `"chat-message"` \| `"string[]"` \| `"number[]"` \| `"boolean[]"` \| `"object[]"` \| `"unknown[]"` \| `"blob[]"` \| `"context[]"` \| `"chat-message[]"` \| readonly (`"string"` \| `"number"` \| `"boolean"` \| `"object"` \| `"unknown"` \| `"blob"` \| `"context"` \| `"chat-message"` \| `"string[]"` \| `"number[]"` \| `"boolean[]"` \| `"object[]"` \| `"unknown[]"` \| `"blob[]"` \| `"context[]"` \| `"chat-message[]"`)[]\>

#### Source

[packages/core/src/studio/graph.ts:117](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/graph.ts#L117)

***

### graphStartNodeIds

> `readonly` **graphStartNodeIds**: `RecordId`[]

#### Source

[packages/core/src/studio/graph.ts:126](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/graph.ts#L126)

***

### id

> **id**: `RecordId`

Unique identifier for the graph.

#### Implementation of

[`NodeGraph`](../interfaces/NodeGraph.md) . [`id`](../interfaces/NodeGraph.md#id)

#### Source

[packages/core/src/studio/graph.ts:78](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/graph.ts#L78)

***

### nodeConnMap

> `readonly` **nodeConnMap**: `Record`\<`RecordId`, [`NodeConnection`](../../nodes/type-aliases/NodeConnection.md)[]\>

#### Source

[packages/core/src/studio/graph.ts:147](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/graph.ts#L147)

***

### nodeImplMap

> `readonly` **nodeImplMap**: `Record`\<`RecordId`, [`NodeImpl`](../../nodes/base/classes/NodeImpl.md) \<[`SerializableNode`](../../nodes/interfaces/SerializableNode.md)\<`string`, [`Serializable`](../../../load/serializable/classes/Serializable.md)\>, `string`, `string`\>\>

#### Source

[packages/core/src/studio/graph.ts:143](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/graph.ts#L143)

***

### nodeMap

> `readonly` **nodeMap**: `Record`\<`RecordId`, [`SerializableNode`](../../nodes/interfaces/SerializableNode.md)\<`string`, [`Serializable`](../../../load/serializable/classes/Serializable.md)\>\>

#### Source

[packages/core/src/studio/graph.ts:139](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/graph.ts#L139)

***

### nodePortDefMap

> `readonly` **nodePortDefMap**: `Record`\<`RecordId`, `object`\>

#### Source

[packages/core/src/studio/graph.ts:152](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/graph.ts#L152)

***

### nodeProcessInfoMap

> **nodeProcessInfoMap**: `Record`\<`RecordId`, [`NodeProcessInfo`](../type-aliases/NodeProcessInfo.md)\>

#### Source

[packages/core/src/studio/graph.ts:163](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/graph.ts#L163)

***

### nodes

> **nodes**: [`SerializableNode`](../../nodes/interfaces/SerializableNode.md)\<`string`, [`Serializable`](../../../load/serializable/classes/Serializable.md)\>[]

Collection of nodes that compose the graph. Nodes can be of any type
derived from `SerializableNode`, including `SubGraphNode`.

#### Implementation of

[`NodeGraph`](../interfaces/NodeGraph.md) . [`nodes`](../interfaces/NodeGraph.md#nodes)

#### Source

[packages/core/src/studio/graph.ts:94](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/graph.ts#L94)

***

### registry

> `readonly` **registry**: [`NodeRegistration`](../../registration/nodes/classes/NodeRegistration.md)\<`never`, `never`, `never`\>

#### Implementation of

[`NodeGraph`](../interfaces/NodeGraph.md) . [`registry`](../interfaces/NodeGraph.md#registry)

#### Source

[packages/core/src/studio/graph.ts:158](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/graph.ts#L158)

***

### title

> **title**: `string`

Human-readable title for the graph.

#### Implementation of

[`NodeGraph`](../interfaces/NodeGraph.md) . [`title`](../interfaces/NodeGraph.md#title)

#### Source

[packages/core/src/studio/graph.ts:83](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/graph.ts#L83)

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

> `get` **\_attributes**(): `object`

Retrieves attributes of the object.

#### Returns

`object`

An object representing attributes, or undefined if none are defined.

##### connections

> **connections**: `never`[] = `[]`

##### nodes

> **nodes**: `never`[] = `[]`

#### Source

[packages/core/src/studio/graph.ts:165](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/graph.ts#L165)

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

[`Serializable`](../../../load/serializable/classes/Serializable.md) . [`getAttributes`](../../../load/serializable/classes/Serializable.md#getattributes)

#### Source

[packages/core/src/load/serializable.ts:430](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/load/serializable.ts#L430)

***

### getFromNodes()

> **getFromNodes**(`node`): [`SerializableNode`](../../nodes/interfaces/SerializableNode.md)\<`string`, [`Serializable`](../../../load/serializable/classes/Serializable.md)\>[]

Get all nodes that push data toward the current node.

#### Parameters

• **node**: [`SerializableNode`](../../nodes/interfaces/SerializableNode.md)\<`string`, [`Serializable`](../../../load/serializable/classes/Serializable.md)\>

the current node

#### Returns

[`SerializableNode`](../../nodes/interfaces/SerializableNode.md)\<`string`, [`Serializable`](../../../load/serializable/classes/Serializable.md)\>[]

all nodes that push data toward the current node

#### Source

[packages/core/src/studio/graph.ts:350](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/graph.ts#L350)

***

### getToNodes()

> **getToNodes**(`node`): [`SerializableNode`](../../nodes/interfaces/SerializableNode.md)\<`string`, [`Serializable`](../../../load/serializable/classes/Serializable.md)\>[]

Get all nodes that receive data from the current node.

#### Parameters

• **node**: [`SerializableNode`](../../nodes/interfaces/SerializableNode.md)\<`string`, [`Serializable`](../../../load/serializable/classes/Serializable.md)\>

the current node

#### Returns

[`SerializableNode`](../../nodes/interfaces/SerializableNode.md)\<`string`, [`Serializable`](../../../load/serializable/classes/Serializable.md)\>[]

all nodes that receive data from the current node

#### Source

[packages/core/src/studio/graph.ts:377](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/graph.ts#L377)

***

### loadRegistry()

> `abstract` **loadRegistry**(`registry`): [`BaseGraph`](BaseGraph.md)

Abstract method to load a node registry into the graph. Implementations should handle
the specifics of registry integration.

#### Parameters

• **registry**: `undefined` \| [`NodeRegistration`](../../registration/nodes/classes/NodeRegistration.md)\<`never`, `never`, `never`\>

The node registry to integrate.

#### Returns

[`BaseGraph`](BaseGraph.md)

#### Source

[packages/core/src/studio/graph.ts:342](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/graph.ts#L342)

***

### schedule()

> `abstract` **schedule**(): [`string`, `RecordId`[]][]

Abstract method to define the scheduling of node execution within the graph. This method should be implemented
by subclasses to specify the order in which nodes should be processed based on dependencies or other criteria.

Implementations should return an ordered array of tuples, where each tuple represents a scheduled group of nodes.
Each group is identified by a processor ID and an array of node IDs that can be executed in parallel or sequence,
depending on the graph's logic and node interdependencies.

#### Returns

[`string`, `RecordId`[]][]

An array of tuples, where each tuple contains a processor ID and an array of node IDs scheduled for execution.

#### Source

[packages/core/src/studio/graph.ts:800](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/graph.ts#L800)

***

### serialize()

> **serialize**(): `Promise` \<[`SerializedGraph`](../../serde/interfaces/SerializedGraph.md)\>

Serializes the current state of the graph into a format that can be easily stored or transmitted.
This method facilitates the conversion of complex graph structures into a standardized JSON format,
ensuring that all relevant details are preserved and can be reconstructed later.

#### Returns

`Promise` \<[`SerializedGraph`](../../serde/interfaces/SerializedGraph.md)\>

Returns a promise that resolves to a serialized representation of the graph.

#### Source

[packages/core/src/studio/graph.ts:727](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/graph.ts#L727)

***

### toJSON()

> **toJSON**(): [`Serialized`](../../../load/serializable/type-aliases/Serialized.md)

Converts the object to a serialized representation based on the object's current state. This method determines whether to use a 'not implemented' or 'constructor' format based on the object's serializability.

#### Returns

[`Serialized`](../../../load/serializable/type-aliases/Serialized.md)

A serialized representation of the object.

#### Overrides

[`Serializable`](../../../load/serializable/classes/Serializable.md) . [`toJSON`](../../../load/serializable/classes/Serializable.md#tojson)

#### Source

[packages/core/src/studio/graph.ts:780](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/graph.ts#L780)

***

### toJSONConstructor()

> **toJSONConstructor**(`aliases`, `secrets`, `kwargs`): [`Serialized`](../../../load/serializable/type-aliases/Serialized.md)

Converts the object to a serialized constructor format. This method provides a way to serialize object construction details, including any aliases or secrets.

#### Parameters

• **aliases**: `SerializedKeyAlias`

Key aliases to include in the serialized output.

• **secrets**: `SecretFields`

Secrets to be secured in the serialized output.

• **kwargs**: `SerializedFields`

Additional keyword arguments to include in the serialized output.

#### Returns

[`Serialized`](../../../load/serializable/type-aliases/Serialized.md)

A serialized representation of the object as a constructor.

#### Inherited from

[`Serializable`](../../../load/serializable/classes/Serializable.md) . [`toJSONConstructor`](../../../load/serializable/classes/Serializable.md#tojsonconstructor)

#### Source

[packages/core/src/load/serializable.ts:478](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/load/serializable.ts#L478)

***

### toJSONNotImplemented()

> **toJSONNotImplemented**(): [`Serialized`](../../../load/serializable/type-aliases/Serialized.md)

Converts the object to a serialized format that is not implemented. This method should be overridden in subclasses to provide specific serialization behavior.

#### Returns

[`Serialized`](../../../load/serializable/type-aliases/Serialized.md)

A serialized representation of the object.

#### Inherited from

[`Serializable`](../../../load/serializable/classes/Serializable.md) . [`toJSONNotImplemented`](../../../load/serializable/classes/Serializable.md#tojsonnotimplemented)

#### Source

[packages/core/src/load/serializable.ts:448](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/load/serializable.ts#L448)

***

### toJSONSecret()

> **toJSONSecret**(`secretKey`): [`Serialized`](../../../load/serializable/type-aliases/Serialized.md)

Converts a secret key to its serialized format. This method is typically used for serializing secrets in a secure manner.

#### Parameters

• **secretKey**: `string`

The secret key to serialize.

#### Returns

[`Serialized`](../../../load/serializable/type-aliases/Serialized.md)

A serialized representation of the secret key.

#### Inherited from

[`Serializable`](../../../load/serializable/classes/Serializable.md) . [`toJSONSecret`](../../../load/serializable/classes/Serializable.md#tojsonsecret)

#### Source

[packages/core/src/load/serializable.ts:462](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/load/serializable.ts#L462)

***

### \_name()

> `static` **\_name**(): `string`

Generates a unique name for the class, typically used for serialization identification.

#### Returns

`string`

#### Inherited from

[`Serializable`](../../../load/serializable/classes/Serializable.md) . [`_name`](../../../load/serializable/classes/Serializable.md#_name)

#### Source

[packages/core/src/load/serializable.ts:178](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/load/serializable.ts#L178)

***

### deserialize()

> `static` **deserialize**(`serialized`, `values`, `registry`?): `Promise` \<[`BaseGraph`](BaseGraph.md)\>

Converts a serialized graph object back into an instance of `BaseGraph`, restoring its structure and state
from a previously serialized form. This method is static and typically used to rehydrate a graph from
data stored in a database or received over a network.

#### Parameters

• **serialized**: [`SerializedGraph`](../../serde/interfaces/SerializedGraph.md)

The serialized representation of the graph.

• **values**: `Record`\<`string`, `unknown`\>= `{}`

Additional values that might be necessary for fully restoring the serialized nodes within the graph.

• **registry?**

Optional registries for nodes and guardrails that may be needed during deserialization.

• **registry.guardrails?**: [`GuardrailRegistration`](../../registration/guardrails/classes/GuardrailRegistration.md)\<`never`, `never`, `never`\>

• **registry.nodes?**: [`NodeRegistration`](../../registration/nodes/classes/NodeRegistration.md)\<`never`, `never`, `never`\>

#### Returns

`Promise` \<[`BaseGraph`](BaseGraph.md)\>

Returns a promise that resolves to an instance of `BaseGraph`.

#### Throws

Throws an error if the serialized object does not represent a graph.

#### Source

[packages/core/src/studio/graph.ts:679](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/graph.ts#L679)

***

### flattenGraph()

> `static` **flattenGraph**(`graphId`, `nodes`, `connections`): `object`

Flatten a graph by exploding the nodes and connections in any subgraph
node in the graph. Since the original connections use the subgraph node
id and port name, these will be replaced with the inner node id and port
name

In addition, get graph ports for the start nodes and end nodes in the
flatten graph

#### Parameters

• **graphId**: `RecordId`

graph id

• **nodes**: [`SerializableNode`](../../nodes/interfaces/SerializableNode.md)\<`string`, [`Serializable`](../../../load/serializable/classes/Serializable.md)\>[]

all of the nodes in the graph, this allows subgraph nodes

• **connections**: [`NodeConnection`](../../nodes/type-aliases/NodeConnection.md)[]

all of the connections in the graph, this allows the
connection with subgraph nodes

#### Returns

`object`

`flattenNodes` are all of the non-subgraph nodes in the graph,
`flattenConnections` are all of the connections after removing subgraph
nodes in the graph,`inputs` are input port fields, `outputs` are output
port fields, `inputNameMap` and `outputNameMap` are the pointer to the
original node id and port name for reversing the name to the original,
`startNodeIds` are the start non-subgraph node ids, `endNodeIds` are the
end non-subgraph node ids.

##### endNodeIds

> **endNodeIds**: `RecordId`[]

##### flattenConnections

> **flattenConnections**: [`NodeConnection`](../../nodes/type-aliases/NodeConnection.md)[]

##### flattenNodes

> **flattenNodes**: [`SerializableNode`](../../nodes/interfaces/SerializableNode.md)\<`string`, [`Serializable`](../../../load/serializable/classes/Serializable.md)\>[]

##### inputNameMap

> **inputNameMap**: `Record`\<`string`, `object`\>

##### inputs

> **inputs**: `Record`\<`string`, `"string"` \| `"number"` \| `"boolean"` \| `"object"` \| `"unknown"` \| `"blob"` \| `"context"` \| `"chat-message"` \| `"string[]"` \| `"number[]"` \| `"boolean[]"` \| `"object[]"` \| `"unknown[]"` \| `"blob[]"` \| `"context[]"` \| `"chat-message[]"` \| readonly (`"string"` \| `"number"` \| `"boolean"` \| `"object"` \| `"unknown"` \| `"blob"` \| `"context"` \| `"chat-message"` \| `"string[]"` \| `"number[]"` \| `"boolean[]"` \| `"object[]"` \| `"unknown[]"` \| `"blob[]"` \| `"context[]"` \| `"chat-message[]"`)[]\>

##### outputNameMap

> **outputNameMap**: `Record`\<`string`, `object`\>

##### outputs

> **outputs**: `Record`\<`string`, `"string"` \| `"number"` \| `"boolean"` \| `"object"` \| `"unknown"` \| `"blob"` \| `"context"` \| `"chat-message"` \| `"string[]"` \| `"number[]"` \| `"boolean[]"` \| `"object[]"` \| `"unknown[]"` \| `"blob[]"` \| `"context[]"` \| `"chat-message[]"` \| readonly (`"string"` \| `"number"` \| `"boolean"` \| `"object"` \| `"unknown"` \| `"blob"` \| `"context"` \| `"chat-message"` \| `"string[]"` \| `"number[]"` \| `"boolean[]"` \| `"object[]"` \| `"unknown[]"` \| `"blob[]"` \| `"context[]"` \| `"chat-message[]"`)[]\>

##### startNodeIds

> **startNodeIds**: `RecordId`[]

#### Source

[packages/core/src/studio/graph.ts:419](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/graph.ts#L419)

***

### getGraphPorts()

> `static` **getGraphPorts**(`nodes`, `connections`): `object`

Get all input and output ports in the graph. The graph input ports are the
unconnected input ports in the nodes, and the graph output ports are the
unconnected output ports in the nodes.

Note: when merging the input and output port names, it is possible that multiple
ports share the same port name. We will change the port name in the format of
`${nodeTitle} ${portName}`. However, sometimes the node titles are the same in
those identical port names, then we will use an identifying number to make the
name unique, for example, the name will be `${nodeTitle} ${number} ${portName}`.

#### Parameters

• **nodes**: [`SerializableNode`](../../nodes/interfaces/SerializableNode.md)\<`string`, [`Serializable`](../../../load/serializable/classes/Serializable.md)\>[]

all of the nodes in the graph, this allows subgraph nodes

• **connections**: [`NodeConnection`](../../nodes/type-aliases/NodeConnection.md)[]

all of the connections in the graph, this allows the
connection with subgraph nodes

#### Returns

`object`

`inputs` are input port fields, `outputs` are output port fields,
`inputNameMap` and `outputNameMap` are the pointer to the original node id and
port name for reversing the name to the original, `startNodeIds` are the start
node ids, `endNodeIds` are the end node ids.

##### endNodeIds

> **endNodeIds**: `RecordId`[]

##### inputNameMap

> **inputNameMap**: `Record`\<`string`, `object`\>

##### inputs

> **inputs**: `Record`\<`string`, `"string"` \| `"number"` \| `"boolean"` \| `"object"` \| `"unknown"` \| `"blob"` \| `"context"` \| `"chat-message"` \| `"string[]"` \| `"number[]"` \| `"boolean[]"` \| `"object[]"` \| `"unknown[]"` \| `"blob[]"` \| `"context[]"` \| `"chat-message[]"` \| readonly (`"string"` \| `"number"` \| `"boolean"` \| `"object"` \| `"unknown"` \| `"blob"` \| `"context"` \| `"chat-message"` \| `"string[]"` \| `"number[]"` \| `"boolean[]"` \| `"object[]"` \| `"unknown[]"` \| `"blob[]"` \| `"context[]"` \| `"chat-message[]"`)[]\>

##### outputNameMap

> **outputNameMap**: `Record`\<`string`, `object`\>

##### outputs

> **outputs**: `Record`\<`string`, `"string"` \| `"number"` \| `"boolean"` \| `"object"` \| `"unknown"` \| `"blob"` \| `"context"` \| `"chat-message"` \| `"string[]"` \| `"number[]"` \| `"boolean[]"` \| `"object[]"` \| `"unknown[]"` \| `"blob[]"` \| `"context[]"` \| `"chat-message[]"` \| readonly (`"string"` \| `"number"` \| `"boolean"` \| `"object"` \| `"unknown"` \| `"blob"` \| `"context"` \| `"chat-message"` \| `"string[]"` \| `"number[]"` \| `"boolean[]"` \| `"object[]"` \| `"unknown[]"` \| `"blob[]"` \| `"context[]"` \| `"chat-message[]"`)[]\>

##### startNodeIds

> **startNodeIds**: `RecordId`[]

#### Source

[packages/core/src/studio/graph.ts:552](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/graph.ts#L552)
