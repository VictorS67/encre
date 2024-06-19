# Function: getRecordId()

> **getRecordId**(): `RecordId`

Generates a unique identifier (RecordId) using a predefined alphabet and a fixed length.
This function uses the `customAlphabet` function from `nanoid` to ensure the ID is unique 
and suitable for record identification.

Usage example:
```typescript
const recordId = getRecordId();

console.log("Generated Record ID:", recordId);
// Generated Record ID:JNYep09tEidvz_e0F
```

## Returns

`RecordId`

A unique identifier suitable for use as a `RecordId`.

## Source

[packages/core/src/utils/nanoid.ts:85](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/utils/nanoid.ts#L85)
