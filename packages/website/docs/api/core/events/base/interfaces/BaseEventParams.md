# Interface: BaseEventParams

Extends the CallableConfig to include parameters specific to event handling.
This interface allows for the configuration of verbosity and other event-specific settings,
making it suitable for systems that require detailed control over event behavior and output.

## Extends

- [`CallableConfig`](../../../record/callable/type-aliases/CallableConfig.md)

## Extended by

- [`BaseEmbeddingsCallOptions`](../../embeddings/base/interfaces/BaseEmbeddingsCallOptions.md)
- [`BaseEmbeddingsParams`](../../embeddings/base/interfaces/BaseEmbeddingsParams.md)
- [`BaseDocLoaderCallOptions`](../../input/load/docs/base/interfaces/BaseDocLoaderCallOptions.md)
- [`PromptTemplateParams`](../../input/load/prompts/base/interfaces/PromptTemplateParams.md)
- [`ContextSplitterParams`](../../input/transform/splitter/interfaces/ContextSplitterParams.md)
- [`VariableValidatorParams`](../../inference/validate/validators/variable/interfaces/VariableValidatorParams.md)
- [`BaseLMCallOptions`](../../inference/chat/base/interfaces/BaseLMCallOptions.md)
- [`BaseLMParams`](../../inference/chat/base/interfaces/BaseLMParams.md)
- [`BaseRetrieverCallOptions`](../../inference/retrieve/base/interfaces/BaseRetrieverCallOptions.md)
- [`BaseRetrieverParams`](../../inference/retrieve/base/interfaces/BaseRetrieverParams.md)

## Properties

### callbacks?

> `optional` **callbacks**: `any`

not-implemented yet

#### Inherited from

`CallableConfig.callbacks`

#### Source

[packages/core/src/record/callable.ts:56](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L56)

***

### metadata?

> `optional` **metadata**: [`CallableConfigFields`](../../../record/callable/type-aliases/CallableConfigFields.md)

A dictionary containing metadata related to the callable, defined as [CallableConfigFields](../../../record/callable/type-aliases/CallableConfigFields.md).

#### Inherited from

`CallableConfig.metadata`

#### Source

[packages/core/src/record/callable.ts:51](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L51)

***

### name?

> `optional` **name**: `string`

The name of the callable, used for identification or logging. not-implemented yet

#### Inherited from

`CallableConfig.name`

#### Source

[packages/core/src/record/callable.ts:41](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L41)

***

### tags?

> `optional` **tags**: `string`[]

An array of strings used for categorizing or filtering callables. not-implemented yet

#### Inherited from

`CallableConfig.tags`

#### Source

[packages/core/src/record/callable.ts:46](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L46)

***

### verbose?

`Experimental`

> `optional` **verbose**: `boolean`

Specifies whether the event should provide verbose output, such as detailed logs or response texts.
This can be useful for debugging or detailed monitoring of event handling processes.

not-implement yet

#### Source

[packages/core/src/events/base.ts:23](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/base.ts#L23)
