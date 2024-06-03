# Function: wrapGoogleGenerativeAIClientError()

> **wrapGoogleGenerativeAIClientError**(`e`): `Error`

Generative AI SDK wrap the error in a very simple way. The error message is logged as the
following format:
`[${response.status} ${response.statusText}] ${message}`

## Parameters

• **e**: `Error`

## Returns

`Error`

## See

https://github.com/google/generative-ai-js/blob/2be48f8e5427f2f6191f24bcb8000b450715a0de/packages/main/src/requests/request.ts#L88C50-L88C50

## Source

[packages/core/src/events/inference/chat/llms/vertexai/index.ts:410](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/chat/llms/vertexai/index.ts#L410)
