# Class: SubGraph

Represents a subgraph within a larger graph structure. This class extends the basic functionalities
of a BaseGraph to handle specific cases such as loading custom node registries and scheduling nodes
based on a more defined context or subgraph-specific logic.

## Example

```ts
// Initializing a new SubGraph with predefined nodes and connections.
const stringPromptNode = globalNodeRegistry.createDynamicRaw(
  new StringPrompt('Who are you?')
);

const openAINode = globalNodeRegistry.createDynamicRaw(
  new OpenAIChat({ modelName: 'gpt-3.5-turbo' })
);

const graph = new SubGraph({
  nodes: [stringPromptNode, openAINode],
  connections: [
    {
      fromNodeId: stringPromptNode.id,
      fromPortName: 'prompt',
      toNodeId: openAINode.id,
      toPortName: 'prompt',
    },
  ],
});

// Scheduling the nodes in the subGraph for execution.
const schedule = subGraph.schedule();
console.log('Execution Schedule:', schedule);
```

## Extends

- [`BaseGraph`](BaseGraph.md)

## Constructors

### new SubGraph()

> **new SubGraph**(`fields`?): [`SubGraph`](SubGraph.md)

Constructs a new instance of the BaseGraph, setting up initial configuration including
nodes, connections, and other parameters.

#### Parameters

• **fields?**: [`NodeGraph`](../interfaces/NodeGraph.md)

Initial fields to set up the graph.

#### Returns

[`SubGraph`](SubGraph.md)

#### Inherited from

[`BaseGraph`](BaseGraph.md) . [`constructor`](BaseGraph.md#constructors)

#### Source

[packages/core/src/studio/graph.ts:179](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/graph.ts#L179)

## Properties

### \_isSerializable

> **\_isSerializable**: `boolean` = `true`

Indicates if the instance is serializable. If false, toJSON returns a non-implementable serialization.

#### Inherited from

[`BaseGraph`](BaseGraph.md) . [`_isSerializable`](BaseGraph.md#_isserializable)

#### Source

[packages/core/src/studio/graph.ts:72](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/graph.ts#L72)

***

### \_kwargs

> **\_kwargs**: `SerializedFields`

Key-value pairs of properties to be serialized.

#### Inherited from

[`BaseGraph`](BaseGraph.md) . [`_kwargs`](BaseGraph.md#_kwargs)

#### Source

[packages/core/src/load/serializable.ts:168](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/load/serializable.ts#L168)

***

### \_namespace

> **\_namespace**: `string`[]

Unique namespace identifier for the serialized object, represented as an array of strings.

#### Inherited from

[`BaseGraph`](BaseGraph.md) . [`_namespace`](BaseGraph.md#_namespace)

#### Source

[packages/core/src/studio/graph.ts:74](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/graph.ts#L74)

***

### comments

> **comments**: [`GraphComment`](../../comments/type-aliases/GraphComment.md)[]

Optional comments associated with the graph, for user notes or documentation purposes.

#### Inherited from

[`BaseGraph`](BaseGraph.md) . [`comments`](BaseGraph.md#comments)

#### Source

[packages/core/src/studio/graph.ts:106](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/graph.ts#L106)

***

### connections

> **connections**: [`NodeConnection`](../../nodes/type-aliases/NodeConnection.md)[]

Connections between nodes within the graph, specifying data flow from node to node.
Connections can be connected to/from `SubGraphNode`.

#### Inherited from

[`BaseGraph`](BaseGraph.md) . [`connections`](BaseGraph.md#connections)

#### Source

[packages/core/src/studio/graph.ts:101](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/graph.ts#L101)

***

### description

> **description**: `string`

Description of the graph's purpose and contents.

#### Inherited from

[`BaseGraph`](BaseGraph.md) . [`description`](BaseGraph.md#description)

#### Source

[packages/core/src/studio/graph.ts:89](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/graph.ts#L89)

***

### flattenConnections

> `readonly` **flattenConnections**: [`NodeConnection`](../../nodes/type-aliases/NodeConnection.md)[]

#### Inherited from

[`BaseGraph`](BaseGraph.md) . [`flattenConnections`](BaseGraph.md#flattenconnections)

#### Source

[packages/core/src/studio/graph.ts:112](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/graph.ts#L112)

***

### flattenNodes

> `readonly` **flattenNodes**: [`SerializableNode`](../../nodes/interfaces/SerializableNode.md)\<`string`, [`Serializable`](../../../load/serializable/classes/Serializable.md)\>[]

#### Inherited from

[`BaseGraph`](BaseGraph.md) . [`flattenNodes`](BaseGraph.md#flattennodes)

#### Source

[packages/core/src/studio/graph.ts:109](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/graph.ts#L109)

***

### graphEndNodeIds

> `readonly` **graphEndNodeIds**: `RecordId`[]

#### Inherited from

[`BaseGraph`](BaseGraph.md) . [`graphEndNodeIds`](BaseGraph.md#graphendnodeids)

#### Source

[packages/core/src/studio/graph.ts:136](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/graph.ts#L136)

***

### graphInputNameMap

> `readonly` **graphInputNameMap**: `Record`\<`string`, `object`\>

#### Inherited from

[`BaseGraph`](BaseGraph.md) . [`graphInputNameMap`](BaseGraph.md#graphinputnamemap)

#### Source

[packages/core/src/studio/graph.ts:122](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/graph.ts#L122)

***

### graphInputs

> `readonly` **graphInputs**: `Record`\<`string`, `"string"` \| `"number"` \| `"boolean"` \| `"object"` \| `"unknown"` \| `"blob"` \| `"context"` \| `"chat-message"` \| `"string[]"` \| `"number[]"` \| `"boolean[]"` \| `"object[]"` \| `"unknown[]"` \| `"blob[]"` \| `"context[]"` \| `"chat-message[]"` \| readonly (`"string"` \| `"number"` \| `"boolean"` \| `"object"` \| `"unknown"` \| `"blob"` \| `"context"` \| `"chat-message"` \| `"string[]"` \| `"number[]"` \| `"boolean[]"` \| `"object[]"` \| `"unknown[]"` \| `"blob[]"` \| `"context[]"` \| `"chat-message[]"`)[]\>

#### Inherited from

[`BaseGraph`](BaseGraph.md) . [`graphInputs`](BaseGraph.md#graphinputs)

#### Source

[packages/core/src/studio/graph.ts:115](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/graph.ts#L115)

***

### graphOutputNameMap

> `readonly` **graphOutputNameMap**: `Record`\<`string`, `object`\>

#### Inherited from

[`BaseGraph`](BaseGraph.md) . [`graphOutputNameMap`](BaseGraph.md#graphoutputnamemap)

#### Source

[packages/core/src/studio/graph.ts:131](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/graph.ts#L131)

***

### graphOutputs

> `readonly` **graphOutputs**: `Record`\<`string`, `"string"` \| `"number"` \| `"boolean"` \| `"object"` \| `"unknown"` \| `"blob"` \| `"context"` \| `"chat-message"` \| `"string[]"` \| `"number[]"` \| `"boolean[]"` \| `"object[]"` \| `"unknown[]"` \| `"blob[]"` \| `"context[]"` \| `"chat-message[]"` \| readonly (`"string"` \| `"number"` \| `"boolean"` \| `"object"` \| `"unknown"` \| `"blob"` \| `"context"` \| `"chat-message"` \| `"string[]"` \| `"number[]"` \| `"boolean[]"` \| `"object[]"` \| `"unknown[]"` \| `"blob[]"` \| `"context[]"` \| `"chat-message[]"`)[]\>

#### Inherited from

[`BaseGraph`](BaseGraph.md) . [`graphOutputs`](BaseGraph.md#graphoutputs)

#### Source

[packages/core/src/studio/graph.ts:118](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/graph.ts#L118)

***

### graphStartNodeIds

> `readonly` **graphStartNodeIds**: `RecordId`[]

#### Inherited from

[`BaseGraph`](BaseGraph.md) . [`graphStartNodeIds`](BaseGraph.md#graphstartnodeids)

#### Source

[packages/core/src/studio/graph.ts:127](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/graph.ts#L127)

***

### id

> **id**: `RecordId`

Unique identifier for the graph.

#### Inherited from

[`BaseGraph`](BaseGraph.md) . [`id`](BaseGraph.md#id)

#### Source

[packages/core/src/studio/graph.ts:79](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/graph.ts#L79)

***

### nodeConnMap

> `readonly` **nodeConnMap**: `Record`\<`RecordId`, [`NodeConnection`](../../nodes/type-aliases/NodeConnection.md)[]\>

#### Inherited from

[`BaseGraph`](BaseGraph.md) . [`nodeConnMap`](BaseGraph.md#nodeconnmap)

#### Source

[packages/core/src/studio/graph.ts:148](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/graph.ts#L148)

***

### nodeImplMap

> `readonly` **nodeImplMap**: `Record`\<`RecordId`, [`NodeImpl`](../../nodes/base/classes/NodeImpl.md) \<[`SerializableNode`](../../nodes/interfaces/SerializableNode.md)\<`string`, [`Serializable`](../../../load/serializable/classes/Serializable.md)\>, `string`, `string`\>\>

#### Inherited from

[`BaseGraph`](BaseGraph.md) . [`nodeImplMap`](BaseGraph.md#nodeimplmap)

#### Source

[packages/core/src/studio/graph.ts:144](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/graph.ts#L144)

***

### nodeMap

> `readonly` **nodeMap**: `Record`\<`RecordId`, [`SerializableNode`](../../nodes/interfaces/SerializableNode.md)\<`string`, [`Serializable`](../../../load/serializable/classes/Serializable.md)\>\>

#### Inherited from

[`BaseGraph`](BaseGraph.md) . [`nodeMap`](BaseGraph.md#nodemap)

#### Source

[packages/core/src/studio/graph.ts:140](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/graph.ts#L140)

***

### nodePortDefMap

> `readonly` **nodePortDefMap**: `Record`\<`RecordId`, `object`\>

#### Inherited from

[`BaseGraph`](BaseGraph.md) . [`nodePortDefMap`](BaseGraph.md#nodeportdefmap)

#### Source

[packages/core/src/studio/graph.ts:153](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/graph.ts#L153)

***

### nodeProcessInfoMap

> **nodeProcessInfoMap**: `Record`\<`RecordId`, [`NodeProcessInfo`](../type-aliases/NodeProcessInfo.md)\>

#### Inherited from

[`BaseGraph`](BaseGraph.md) . [`nodeProcessInfoMap`](BaseGraph.md#nodeprocessinfomap)

#### Source

[packages/core/src/studio/graph.ts:164](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/graph.ts#L164)

***

### nodes

> **nodes**: [`SerializableNode`](../../nodes/interfaces/SerializableNode.md)\<`string`, [`Serializable`](../../../load/serializable/classes/Serializable.md)\>[]

Collection of nodes that compose the graph. Nodes can be of any type
derived from `SerializableNode`, including `SubGraphNode`.

#### Inherited from

[`BaseGraph`](BaseGraph.md) . [`nodes`](BaseGraph.md#nodes)

#### Source

[packages/core/src/studio/graph.ts:95](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/graph.ts#L95)

***

### registry

> `readonly` **registry**: [`NodeRegistration`](../../registration/nodes/classes/NodeRegistration.md)\<`never`, `never`, `never`\>

#### Inherited from

[`BaseGraph`](BaseGraph.md) . [`registry`](BaseGraph.md#registry)

#### Source

[packages/core/src/studio/graph.ts:159](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/graph.ts#L159)

***

### title

> **title**: `string`

Human-readable title for the graph.

#### Inherited from

[`BaseGraph`](BaseGraph.md) . [`title`](BaseGraph.md#title)

#### Source

[packages/core/src/studio/graph.ts:84](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/graph.ts#L84)

## Accessors

### \_aliases

> `get` **\_aliases**(): `undefined` \| `SerializedFields`

Retrieves alias mappings for the object's attribute names.

#### Returns

`undefined` \| `SerializedFields`

An object representing key aliases, or undefined if none are defined.

#### Source

[packages/core/src/load/serializable.ts:217](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/load/serializable.ts#L217)

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

[packages/core/src/studio/graph.ts:166](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/graph.ts#L166)

***

### \_id

> `get` **\_id**(): `string`[]

Retrieves the name of the class. This provides a unique identifier for serialization.

#### Returns

`string`[]

The path of serializable.

#### Source

[packages/core/src/load/serializable.ts:187](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/load/serializable.ts#L187)

***

### \_secrets

> `get` **\_secrets**(): `undefined` \| `SecretFields`

Retrieves any secrets defined in the object.

#### Returns

`undefined` \| `SecretFields`

An object representing secret fields, or undefined if none are defined.

#### Source

[packages/core/src/load/serializable.ts:199](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/load/serializable.ts#L199)

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

[`BaseGraph`](BaseGraph.md) . [`getAttributes`](BaseGraph.md#getattributes)

#### Source

[packages/core/src/load/serializable.ts:430](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/load/serializable.ts#L430)

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

#### Inherited from

[`BaseGraph`](BaseGraph.md) . [`getFromNodes`](BaseGraph.md#getfromnodes)

#### Source

[packages/core/src/studio/graph.ts:351](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/graph.ts#L351)

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

#### Inherited from

[`BaseGraph`](BaseGraph.md) . [`getToNodes`](BaseGraph.md#gettonodes)

#### Source

[packages/core/src/studio/graph.ts:378](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/graph.ts#L378)

***

### loadRegistry()

> **loadRegistry**(`registry`): [`SubGraph`](SubGraph.md)

Loads a given node registry into the subgraph, allowing the subgraph to update its internal structures
to accommodate changes in node definitions or behaviors. If no registry is provided, the method returns
the current instance without making any changes.

#### Parameters

• **registry**: `undefined` \| [`NodeRegistration`](../../registration/nodes/classes/NodeRegistration.md)\<`never`, `never`, `never`\>

The node registration to load into the subgraph.

#### Returns

[`SubGraph`](SubGraph.md)

Returns a new instance of SubGraph if a registry is provided, otherwise returns the current instance.

#### Overrides

[`BaseGraph`](BaseGraph.md) . [`loadRegistry`](BaseGraph.md#loadregistry)

#### Source

[packages/core/src/studio/graph.ts:835](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/graph.ts#L835)

***

### schedule()

> **schedule**(): [`string`, `RecordId`[]][]

Schedules the execution of nodes within the subgraph. This method utilizes a GraphScheduler to determine
the order of node execution based on dependencies and other scheduling criteria defined within the subgraph.
It returns an array of tuples where each tuple consists of a processor ID and an array of node IDs, indicating
the order of execution.

#### Returns

[`string`, `RecordId`[]][]

An array of tuples, each containing a processor ID and an array of node IDs, representing the execution order of the nodes.

#### Overrides

[`BaseGraph`](BaseGraph.md) . [`schedule`](BaseGraph.md#schedule)

#### Example

```typescript
const subGraph = new SubGraph({ ... });
const executionSchedule = subGraph.schedule();
console.log(executionSchedule);
// Output might look like:
// [
//   ['<processor-id-1>', ['<node-id-1>', '<node-id-2>']],
//   ['<processor-id-2>', ['<node-id-3>']],
//   ['<processor-id-3>', ['<node-id-4>']]
// ]
```

#### Source

[packages/core/src/studio/graph.ts:874](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/graph.ts#L874)

***

### serialize()

> **serialize**(): `Promise` \<[`SerializedGraph`](../../serde/type-aliases/SerializedGraph.md)\>

Serializes the current state of the graph into a format that can be easily stored or transmitted.
This method facilitates the conversion of complex graph structures into a standardized JSON format,
ensuring that all relevant details are preserved and can be reconstructed later.

#### Returns

`Promise` \<[`SerializedGraph`](../../serde/type-aliases/SerializedGraph.md)\>

Returns a promise that resolves to a serialized representation of the graph.

#### Inherited from

[`BaseGraph`](BaseGraph.md) . [`serialize`](BaseGraph.md#serialize)

#### Source

[packages/core/src/studio/graph.ts:728](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/graph.ts#L728)

***

### toJSON()

> **toJSON**(): [`Serialized`](../../../load/serializable/type-aliases/Serialized.md)

Converts the object to a serialized representation based on the object's current state. This method determines whether to use a 'not implemented' or 'constructor' format based on the object's serializability.

#### Returns

[`Serialized`](../../../load/serializable/type-aliases/Serialized.md)

A serialized representation of the object.

#### Inherited from

[`BaseGraph`](BaseGraph.md) . [`toJSON`](BaseGraph.md#tojson)

#### Source

[packages/core/src/load/serializable.ts:665](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/load/serializable.ts#L665)

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

[`BaseGraph`](BaseGraph.md) . [`toJSONConstructor`](BaseGraph.md#tojsonconstructor)

#### Source

[packages/core/src/load/serializable.ts:478](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/load/serializable.ts#L478)

***

### toJSONNotImplemented()

> **toJSONNotImplemented**(): [`Serialized`](../../../load/serializable/type-aliases/Serialized.md)

Converts the object to a serialized format that is not implemented. This method should be overridden in subclasses to provide specific serialization behavior.

#### Returns

[`Serialized`](../../../load/serializable/type-aliases/Serialized.md)

A serialized representation of the object.

#### Inherited from

[`BaseGraph`](BaseGraph.md) . [`toJSONNotImplemented`](BaseGraph.md#tojsonnotimplemented)

#### Source

[packages/core/src/load/serializable.ts:448](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/load/serializable.ts#L448)

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

[`BaseGraph`](BaseGraph.md) . [`toJSONSecret`](BaseGraph.md#tojsonsecret)

#### Source

[packages/core/src/load/serializable.ts:462](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/load/serializable.ts#L462)

***

### \_name()

> `static` **\_name**(): `string`

Generates a unique name for the class, typically used for serialization identification.

#### Returns

`string`

#### Inherited from

[`BaseGraph`](BaseGraph.md) . [`_name`](BaseGraph.md#_name)

#### Source

[packages/core/src/load/serializable.ts:178](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/load/serializable.ts#L178)

***

### deserialize()

> `static` **deserialize**(`serialized`, `values`, `registry`?): `Promise` \<[`BaseGraph`](BaseGraph.md)\>

Converts a serialized graph object back into an instance of `BaseGraph`, restoring its structure and state
from a previously serialized form. This method is static and typically used to rehydrate a graph from
data stored in a database or received over a network.

#### Parameters

• **serialized**: [`SerializedGraph`](../../serde/type-aliases/SerializedGraph.md)

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

#### Inherited from

[`BaseGraph`](BaseGraph.md) . [`deserialize`](BaseGraph.md#deserialize)

#### Throws

Throws an error if the serialized object does not represent a graph.

#### Source

[packages/core/src/studio/graph.ts:680](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/graph.ts#L680)

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

#### Inherited from

[`BaseGraph`](BaseGraph.md) . [`flattenGraph`](BaseGraph.md#flattengraph)

#### Source

[packages/core/src/studio/graph.ts:420](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/graph.ts#L420)

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

#### Inherited from

[`BaseGraph`](BaseGraph.md) . [`getGraphPorts`](BaseGraph.md#getgraphports)

#### Source

[packages/core/src/studio/graph.ts:553](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/graph.ts#L553)
