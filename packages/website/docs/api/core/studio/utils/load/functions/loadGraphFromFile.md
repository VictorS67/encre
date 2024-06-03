# Function: loadGraphFromFile()

> **loadGraphFromFile**(`file`, `path`, `values`, ...`args`): `Promise` \<[`BaseGraph`](../../../graph/classes/BaseGraph.md)\>

Asynchronously loads a graph from a specified file. This function is designed to read
a graph's serialized data from a file, deserialize it, and instantiate a `BaseGraph` object.

## Parameters

• **file**: `string`

A string that represents the name or identifier of the file containing the graph data.

• **path**: `string`

The path where the file is located.

• **values**: `Record`\<`string`, `unknown`\>

Optional. An object containing key-value pairs that may be required for initializing
              nodes within the graph based on the serialized data.

• ...**args**: `any`[]

## Returns

`Promise` \<[`BaseGraph`](../../../graph/classes/BaseGraph.md)\>

A promise that resolves to an instance of `BaseGraph`.

## Example

```typescript
const graph = await loadGraphFromFile('myApp.encre', '/graphs');
```

## Source

[packages/core/src/studio/utils/load.ts:24](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/utils/load.ts#L24)
