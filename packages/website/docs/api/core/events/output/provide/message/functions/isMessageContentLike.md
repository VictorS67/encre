# Function: isMessageContentLike()

> **isMessageContentLike**(`value`): `value is ContentLike`

Determines whether a given value qualifies as valid content for a message.
This function checks if the value is either a string or an object, aligning with the ContentLike type requirements.

## Parameters

• **value**: `unknown`

The value to be evaluated as potential message content.

## Returns

`value is ContentLike`

True if the value is a string or an object, false otherwise.

## Source

[packages/core/src/events/output/provide/message.ts:144](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/output/provide/message.ts#L144)
