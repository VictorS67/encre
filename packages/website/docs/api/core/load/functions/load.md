# Function: load()

> **load**\<`T`\>(`text`, `secretsMap`, `optionalImportsMap`): `Promise`\<`T`\>

Asynchronously deserializes a JSON string into its complex object form with possible secrets and custom modules.
This function supports deserialization of complex object hierarchies, including those with custom behaviors
specified through the optionalImportsMap. It also supports decryption or secure handling of secrets specified
in the secretsMap. The function parses the JSON string, identifies objects that require special construction,
and invokes the appropriate constructors and methods based on the serialized metadata.

## Type parameters

• **T**

The expected type of the deserialized object, which should match the type of the root object
in the provided JSON string.

### Example
```typescript
// Example of a JSON string representing a serialized object graph
const jsonString = '{"_grp":1,"_type":"constructor","_id":["ExampleClass","ExampleNamespace"],"kwargs":{...}}';

// Example usage of the load function
const instance = await load<ExampleClass>(jsonString, { 'secretId': 'actualSecretValue' });
```

## Parameters

• **text**: `string`

The JSON string representing the serialized form of an object or a complex object graph.
This string must conform to the expected serialization structure with `_grp`, `_type`, `_id`, and optionally `_recordId` (deprecated).

• **secretsMap**: `SecretMap`= `{}`

An optional map of secrets where keys are secret identifiers used in the serialized form,
and values are the actual secrets (such as API keys). This map is used to replace placeholders in the serialized 
data with actual secrets during the deserialization process.

• **optionalImportsMap**: `OptionalImportMap`= `{}`

An optional map that provides instances of modules or constructors not available globally.
This is particularly useful for deserializing objects requiring custom handling or instantiation logic that
depends on runtime conditions or configurations.

## Returns

`Promise`\<`T`\>

A Promise resolving to the deserialized [Serializable](../serializable/classes/Serializable.md) object of type T. The actual type of T depends 
on the serialized data and the constructors available in the optionalImportsMap. The function ensures that the returned 
object is fully constructed and initialized according to the rules defined by its class and the provided serialized data.

## Throws

Errors in several scenarios:
- If the JSON parsing fails.
- If the serialized data structure does not meet the expected format.
- If required secrets or modules are missing from the provided maps.
- If the constructors or functions expected for object instantiation are missing or invalid.

## Source

[packages/core/src/load/index.ts:383](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/load/index.ts#L383)
