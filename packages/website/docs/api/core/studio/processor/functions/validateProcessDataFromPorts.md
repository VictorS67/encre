# Function: validateProcessDataFromPorts()

> **validateProcessDataFromPorts**(`processData`, `portFields`): `boolean`

Validates the provided process data against the specified port fields.
This function checks if all required port fields are present in the process data and if their data types match the expected types defined in the port fields.
It returns `true` if all conditions are met, otherwise `false`.

## Parameters

• **processData**: [`ProcessDataMap`](../type-aliases/ProcessDataMap.md)

A map of process data, where keys are port names and values are the data associated with those ports.

• **portFields**: [`NodePortFields`](../../nodes/type-aliases/NodePortFields.md)

A map defining the expected data types for each port.

## Returns

`boolean`

`true` if all port data is valid according to its definition in `portFields`, otherwise `false`.

## Example

```ts
// Define process data and port fields
const processData = {
  "input1": { type: "number", value: 42 },
  "input2": { type: "string", value: "hello" }
};
const portFields = {
  "input1": "number",
  "input2": "string"
};

// Validate process data
const isValid = validateProcessDataFromPorts(processData, portFields);
console.log(isValid); // Output: true
```

## Source

[packages/core/src/studio/processor.ts:2295](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/processor.ts#L2295)
