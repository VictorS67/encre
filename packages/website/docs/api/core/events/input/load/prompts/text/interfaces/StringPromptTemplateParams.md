# Interface: StringPromptTemplateParams

Interface defining additional parameters for StringPromptTemplate.

## Extends

- [`PromptTemplateParams`](../../base/interfaces/PromptTemplateParams.md)

## Properties

### callbacks?

> `optional` **callbacks**: `any`

not-implemented yet

#### Inherited from

[`PromptTemplateParams`](../../base/interfaces/PromptTemplateParams.md) . [`callbacks`](../../base/interfaces/PromptTemplateParams.md#callbacks)

#### Source

[packages/core/src/record/callable.ts:56](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L56)

***

### guardrails?

> `optional` **guardrails**: [`VariableRules`](../../../../../inference/validate/validators/variable/interfaces/VariableRules.md)

Optional rules for validating the input variables.

#### Inherited from

[`PromptTemplateParams`](../../base/interfaces/PromptTemplateParams.md) . [`guardrails`](../../base/interfaces/PromptTemplateParams.md#guardrails)

#### Source

[packages/core/src/events/input/load/prompts/base.ts:62](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/prompts/base.ts#L62)

***

### inputVariables

> **inputVariables**: `string`[]

List of input variables explicitly declared, used within the template.

#### Inherited from

[`PromptTemplateParams`](../../base/interfaces/PromptTemplateParams.md) . [`inputVariables`](../../base/interfaces/PromptTemplateParams.md#inputvariables)

#### Source

[packages/core/src/events/input/load/prompts/base.ts:57](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/prompts/base.ts#L57)

***

### metadata?

> `optional` **metadata**: [`CallableConfigFields`](../../../../../../record/callable/type-aliases/CallableConfigFields.md)

A dictionary containing metadata related to the callable, defined as [CallableConfigFields](../../../../../../record/callable/type-aliases/CallableConfigFields.md).

#### Inherited from

[`PromptTemplateParams`](../../base/interfaces/PromptTemplateParams.md) . [`metadata`](../../base/interfaces/PromptTemplateParams.md#metadata)

#### Source

[packages/core/src/record/callable.ts:51](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L51)

***

### name?

> `optional` **name**: `string`

The name of the callable, used for identification or logging. not-implemented yet

#### Inherited from

[`PromptTemplateParams`](../../base/interfaces/PromptTemplateParams.md) . [`name`](../../base/interfaces/PromptTemplateParams.md#name)

#### Source

[packages/core/src/record/callable.ts:41](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L41)

***

### prefix?

> `optional` **prefix**: `string`

Optional prefix to be added before the formatted template string.

#### Source

[packages/core/src/events/input/load/prompts/text.ts:63](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/prompts/text.ts#L63)

***

### suffix?

> `optional` **suffix**: `string`

Optional suffix to be added after the formatted template string.

#### Source

[packages/core/src/events/input/load/prompts/text.ts:68](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/prompts/text.ts#L68)

***

### tags?

> `optional` **tags**: `string`[]

An array of strings used for categorizing or filtering callables. not-implemented yet

#### Inherited from

[`PromptTemplateParams`](../../base/interfaces/PromptTemplateParams.md) . [`tags`](../../base/interfaces/PromptTemplateParams.md#tags)

#### Source

[packages/core/src/record/callable.ts:46](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L46)

***

### template

> **template**: `string`

Template string used to generate prompts.

#### Inherited from

[`PromptTemplateParams`](../../base/interfaces/PromptTemplateParams.md) . [`template`](../../base/interfaces/PromptTemplateParams.md#template)

#### Source

[packages/core/src/events/input/load/prompts/base.ts:52](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/prompts/base.ts#L52)

***

### verbose?

`Experimental`

> `optional` **verbose**: `boolean`

Specifies whether the event should provide verbose output, such as detailed logs or response texts.
This can be useful for debugging or detailed monitoring of event handling processes.

not-implement yet

#### Inherited from

[`PromptTemplateParams`](../../base/interfaces/PromptTemplateParams.md) . [`verbose`](../../base/interfaces/PromptTemplateParams.md#verbose)

#### Source

[packages/core/src/events/base.ts:23](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/base.ts#L23)
