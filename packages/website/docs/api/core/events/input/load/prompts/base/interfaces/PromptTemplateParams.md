# Interface: PromptTemplateParams

Interface defining the parameters for prompt templates.

## Extends

- [`BaseEventParams`](../../../../../base/interfaces/BaseEventParams.md)

## Extended by

- [`StringPromptTemplateParams`](../../text/interfaces/StringPromptTemplateParams.md)

## Properties

### callbacks?

> `optional` **callbacks**: `any`

not-implemented yet

#### Inherited from

[`BaseEventParams`](../../../../../base/interfaces/BaseEventParams.md) . [`callbacks`](../../../../../base/interfaces/BaseEventParams.md#callbacks)

#### Source

[packages/core/src/record/callable.ts:56](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L56)

***

### guardrails?

> `optional` **guardrails**: [`VariableRules`](../../../../../inference/validate/validators/variable/interfaces/VariableRules.md)

Optional rules for validating the input variables.

#### Source

[packages/core/src/events/input/load/prompts/base.ts:62](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/input/load/prompts/base.ts#L62)

***

### inputVariables

> **inputVariables**: `string`[]

List of input variables explicitly declared, used within the template.

#### Source

[packages/core/src/events/input/load/prompts/base.ts:57](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/input/load/prompts/base.ts#L57)

***

### metadata?

> `optional` **metadata**: [`CallableConfigFields`](../../../../../../record/callable/type-aliases/CallableConfigFields.md)

A dictionary containing metadata related to the callable, defined as [CallableConfigFields](../../../../../../record/callable/type-aliases/CallableConfigFields.md).

#### Inherited from

[`BaseEventParams`](../../../../../base/interfaces/BaseEventParams.md) . [`metadata`](../../../../../base/interfaces/BaseEventParams.md#metadata)

#### Source

[packages/core/src/record/callable.ts:51](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L51)

***

### name?

> `optional` **name**: `string`

The name of the callable, used for identification or logging. not-implemented yet

#### Inherited from

[`BaseEventParams`](../../../../../base/interfaces/BaseEventParams.md) . [`name`](../../../../../base/interfaces/BaseEventParams.md#name)

#### Source

[packages/core/src/record/callable.ts:41](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L41)

***

### tags?

> `optional` **tags**: `string`[]

An array of strings used for categorizing or filtering callables. not-implemented yet

#### Inherited from

[`BaseEventParams`](../../../../../base/interfaces/BaseEventParams.md) . [`tags`](../../../../../base/interfaces/BaseEventParams.md#tags)

#### Source

[packages/core/src/record/callable.ts:46](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L46)

***

### template

> **template**: `string`

Template string used to generate prompts.

#### Source

[packages/core/src/events/input/load/prompts/base.ts:52](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/input/load/prompts/base.ts#L52)

***

### verbose?

`Experimental`

> `optional` **verbose**: `boolean`

Specifies whether the event should provide verbose output, such as detailed logs or response texts.
This can be useful for debugging or detailed monitoring of event handling processes.

not-implement yet

#### Inherited from

[`BaseEventParams`](../../../../../base/interfaces/BaseEventParams.md) . [`verbose`](../../../../../base/interfaces/BaseEventParams.md#verbose)

#### Source

[packages/core/src/events/base.ts:23](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/base.ts#L23)