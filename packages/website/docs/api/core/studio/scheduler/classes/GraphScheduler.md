# Class: GraphScheduler

`GraphScheduler` is responsible for scheduling nodes within a graph.
It organizes nodes into groups based on dependencies and critical paths to optimize execution order.
The scheduler uses topological sorting to determine execution order and attempts to merge groups to minimize cross-group communication.

## Constructors

### new GraphScheduler()

> **new GraphScheduler**(`graph`): [`GraphScheduler`](GraphScheduler.md)

Constructs a `GraphScheduler` for a given graph.

#### Parameters

• **graph**: [`BaseGraph`](../../graph/classes/BaseGraph.md)

The graph to schedule.

#### Returns

[`GraphScheduler`](GraphScheduler.md)

#### Source

[packages/core/src/studio/scheduler.ts:64](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/scheduler.ts#L64)

## Properties

### #graph

> `private` `readonly` **#graph**: [`BaseGraph`](../../graph/classes/BaseGraph.md)

The graph associated with the scheduler instance. This property holds a reference
to the `BaseGraph` instance that the scheduler operates on. It provides the necessary
graph structure and node information required for scheduling tasks.

#### Source

[packages/core/src/studio/scheduler.ts:50](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/scheduler.ts#L50)

***

### #groupLimit

> `private` `readonly` **#groupLimit**: `number` = `100`

The maximum number of nodes that can be grouped together in a single scheduling set.
This limit is used to ensure that groups are kept to a manageable size, optimizing
the scheduling and execution of tasks within the graph. The default value is set to 100,
balancing the complexity and performance of the scheduling process.

#### Source

[packages/core/src/studio/scheduler.ts:58](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/scheduler.ts#L58)

## Methods

### #findSet()

`Internal`

> `private` **#findSet**(`nodeId`, `groupSet`): `RecordId`[]

Finds the group set that contains the specified node ID.

#### Parameters

• **nodeId**: `RecordId`

The node ID to search for within the group sets.

• **groupSet**: `RecordId`[][]

The array of current group sets.

#### Returns

`RecordId`[]

The group set containing the node ID.

#### Throws

Error if the node ID is not found in any group set.

#### Source

[packages/core/src/studio/scheduler.ts:383](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/scheduler.ts#L383)

***

### #getLongestDis()

`Internal`

> `private` **#getLongestDis**(`distVecMap`): [`number`, `undefined` \| `RecordId`]

Determines the longest distance from the start node to any node in the graph.
This distance helps identify the end of the critical path in the graph.

#### Parameters

• **distVecMap**: `Record`\<`RecordId`, `DistanceVector`\>

A map of node IDs to their distance vectors.

#### Returns

[`number`, `undefined` \| `RecordId`]

A tuple of the maximum distance and the node ID at that distance.

#### Source

[packages/core/src/studio/scheduler.ts:293](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/scheduler.ts#L293)

***

### #getNodeRunTime()

`Internal`

> `private` **#getNodeRunTime**(`nodeId`): `number`

Retrieves the estimated runtime for a node within the graph.
If the node is part of a subgraph, aggregates runtimes of all subgraph nodes.

#### Parameters

• **nodeId**: `RecordId`

The node ID whose runtime is requested.

#### Returns

`number`

The runtime of the node in milliseconds.

#### Throws

Error if the node does not exist in the graph.

#### Source

[packages/core/src/studio/scheduler.ts:402](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/scheduler.ts#L402)

***

### #grouping()

`Internal`

> `private` **#grouping**(): [`RecordId`[][], `Set`\<`RecordId`\>]

Groups nodes in the graph while identifying the critical path.
This method uses topological sorting to organize nodes into executable groups
and identifies the critical path which influences the overall processing time.

#### Returns

[`RecordId`[][], `Set`\<`RecordId`\>]

A tuple containing an array of node groups and a set of nodes forming the critical path.

#### Source

[packages/core/src/studio/scheduler.ts:87](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/scheduler.ts#L87)

***

### #initGraph()

`Internal`

> `private` **#initGraph**(`groupSet`): `Record`\<`RecordId`, `number`\>

Initializes the graph for scheduling by setting up initial groups and calculating in-degrees of nodes.
Nodes with zero in-degree are added to the scheduling queue as starting points.

#### Parameters

• **groupSet**: `RecordId`[][]

An array to accumulate initial groups of node IDs.

#### Returns

`Record`\<`RecordId`, `number`\>

A map of node IDs to their respective in-degrees.

#### Source

[packages/core/src/studio/scheduler.ts:150](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/scheduler.ts#L150)

***

### #mergePath()

`Internal`

> `private` **#mergePath**(`critVecEntries`, `groupSet`): `boolean`

Attempts to merge nodes along the critical path into a single group to minimize inter-group communication.

#### Parameters

• **critVecEntries**: [`string`, `PreviousVector`][]

Sorted entries of nodes on the critical path by descending edge weight.

• **groupSet**: `RecordId`[][]

The current set of node groups.

#### Returns

`boolean`

`true` if any path was merged successfully; otherwise, `false`.

#### Source

[packages/core/src/studio/scheduler.ts:317](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/scheduler.ts#L317)

***

### #mergeable()

`Internal`

> `private` **#mergeable**(`node1`, `node2`, `groupSet`): `boolean`

Checks if two nodes can be merged into the same execution group.
Merging is feasible if the combined size of the groups for the two nodes does not exceed the group limit.

#### Parameters

• **node1**: `RecordId`

The first node ID to consider for merging.

• **node2**: `RecordId`

The second node ID to consider for merging.

• **groupSet**: `RecordId`[][]

The current set of node groups.

#### Returns

`boolean`

`true` if the nodes are mergeable; otherwise, `false`.

#### Source

[packages/core/src/studio/scheduler.ts:346](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/scheduler.ts#L346)

***

### #topoSearch()

`Internal`

> `private` **#topoSearch**(`inDegreeVecMap`, `groupSet`): [`Record`\<`RecordId`, `DistanceVector`\>, `Record`\<`RecordId`, `undefined` \| `PreviousVector`\>]

Performs a topological search to calculate the longest distance to each node from the start nodes.
This method helps in scheduling by determining the critical order of node execution.

#### Parameters

• **inDegreeVecMap**: `Record`\<`RecordId`, `number`\>

A map of node IDs to their current in-degree counts.

• **groupSet**: `RecordId`[][]

The current set of node groups.

#### Returns

[`Record`\<`RecordId`, `DistanceVector`\>, `Record`\<`RecordId`, `undefined` \| `PreviousVector`\>]

A tuple containing maps for node distances and previous node vectors for path reconstruction.

#### Source

[packages/core/src/studio/scheduler.ts:200](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/scheduler.ts#L200)

***

### schedule()

> **schedule**(): [`string`, `RecordId`[]][]

Schedules the nodes of the graph into groups for execution.
Nodes are grouped to maximize parallel execution while respecting dependencies.

#### Returns

[`string`, `RecordId`[]][]

An array of tuples, each containing a unique processor ID and an array of node IDs assigned to that processor.

#### Source

[packages/core/src/studio/scheduler.ts:73](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/scheduler.ts#L73)
