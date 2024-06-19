# Function: saveGraph()

> **saveGraph**(`graph`, `cwd`): `Promise`\<`void`\>

Serializes a BaseGraph object and saves it as a YAML file. This function
converts the graph object into a JSON string, then translates this JSON
into YAML format for better readability and stores it in a file.

## Parameters

• **graph**: [`BaseGraph`](../../../graph/classes/BaseGraph.md)

The BaseGraph instance to be saved.

• **cwd**: `string`= `'./'`

The directory where the graph file will be saved. Defaults to the current directory.

### Usage Example:
```typescript
const myGraph = new SubGraoh(...);

// Save the graph to the default directory
await saveGraph(myGraph);

// Save the graph to a specific directory
await saveGraph(myGraph, '/path/to/save');
```

### Notes:
- The file name is derived from the graph's title or defaults to 'graph' if no title is provided.
- The file extension used is `.encre` to denote an encoded or serialized file format, potentially specific to the application.
- If an error occurs during file writing, it will be logged to the console.

## Returns

`Promise`\<`void`\>

## Source

packages/core/src/studio/utils/save.ts:31
