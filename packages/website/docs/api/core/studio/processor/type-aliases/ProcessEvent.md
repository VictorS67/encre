# Type alias: ProcessEvent

> **ProcessEvent**: `{ [P in keyof ProcessEvents]: Object & ProcessEvents[P] }`\[keyof [`ProcessEvents`](../interfaces/ProcessEvents.md)\]

A utility type that helps in defining the structure of an event object where the type of the event
is determined by the key, and the structure of the event data is defined within ProcessEvents.

## Source

[packages/core/src/studio/processor.ts:637](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/processor.ts#L637)
