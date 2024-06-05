# Function: loadGraph()

> **loadGraph**(`uri`, `values`, `registry`?): `Promise` \<[`BaseGraph`](../../../graph/classes/BaseGraph.md)\>

Asynchronously loads a graph from a URI, typically a path to a file. This function wraps around
`loadGraphFromFile`, allowing for indirect graph loading through a URI, facilitating the separation
of graph loading logic from file handling.

## Parameters

• **uri**: `string`

A string URI pointing to the location of the graph data. This could be a file path or URL.

• **values**: `Record`\<`string`, `unknown`\>= `{}`

Optional. An object containing key-value pairs that may be required for initializing
              nodes within the graph based on the serialized data.

• **registry?**

Optional. An object containing `NodeRegistration` for node types and
                `GuardrailRegistration` for guardrails that may be needed during deserialization.

• **registry.guardrails?**: [`GuardrailRegistration`](../../../registration/guardrails/classes/GuardrailRegistration.md)\<`never`, `never`, `never`\>

• **registry.nodes?**: [`NodeRegistration`](../../../registration/nodes/classes/NodeRegistration.md)\<`never`, `never`, `never`\>

## Returns

`Promise` \<[`BaseGraph`](../../../graph/classes/BaseGraph.md)\>

A promise that resolves to an instance of `BaseGraph`.

## Example

```typescript
const graph = await loadGraph('/api/graphs/myGraph');
```

## Source

[packages/core/src/studio/utils/load.ts:54](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/utils/load.ts#L54)
