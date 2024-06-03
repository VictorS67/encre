// @ts-check
/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const typedocSidebar = { items: [
  {
    "type": "category",
    "label": "cache",
    "items": [
      {
        "type": "doc",
        "id": "api/core/cache/classes/MemoryCache",
        "label": "MemoryCache"
      }
    ],
    "link": {
      "type": "doc",
      "id": "api/core/cache/index"
    }
  },
  {
    "type": "category",
    "label": "cache/base",
    "items": [
      {
        "type": "doc",
        "id": "api/core/cache/base/classes/BaseCache",
        "label": "BaseCache"
      },
      {
        "type": "doc",
        "id": "api/core/cache/base/functions/getCacheKey",
        "label": "getCacheKey"
      }
    ],
    "link": {
      "type": "doc",
      "id": "api/core/cache/base/index"
    }
  },
  {
    "type": "category",
    "label": "events/base",
    "items": [
      {
        "type": "doc",
        "id": "api/core/events/base/classes/BaseEvent",
        "label": "BaseEvent"
      },
      {
        "type": "doc",
        "id": "api/core/events/base/interfaces/BaseEventParams",
        "label": "BaseEventParams"
      }
    ],
    "link": {
      "type": "doc",
      "id": "api/core/events/base/index"
    }
  },
  {
    "type": "category",
    "label": "events/embeddings/base",
    "items": [
      {
        "type": "doc",
        "id": "api/core/events/embeddings/base/classes/BaseEmbeddings",
        "label": "BaseEmbeddings"
      },
      {
        "type": "doc",
        "id": "api/core/events/embeddings/base/interfaces/BaseEmbeddingsCallOptions",
        "label": "BaseEmbeddingsCallOptions"
      },
      {
        "type": "doc",
        "id": "api/core/events/embeddings/base/interfaces/BaseEmbeddingsParams",
        "label": "BaseEmbeddingsParams"
      }
    ],
    "link": {
      "type": "doc",
      "id": "api/core/events/embeddings/base/index"
    }
  },
  {
    "type": "category",
    "label": "events/embeddings/openai",
    "items": [
      {
        "type": "doc",
        "id": "api/core/events/embeddings/openai/classes/OpenAIEmbeddings",
        "label": "OpenAIEmbeddings"
      },
      {
        "type": "doc",
        "id": "api/core/events/embeddings/openai/interfaces/OpenAIEmbeddingsCallOptions",
        "label": "OpenAIEmbeddingsCallOptions"
      },
      {
        "type": "doc",
        "id": "api/core/events/embeddings/openai/interfaces/OpenAIEmbeddingsParams",
        "label": "OpenAIEmbeddingsParams"
      }
    ],
    "link": {
      "type": "doc",
      "id": "api/core/events/embeddings/openai/index"
    }
  },
  {
    "type": "category",
    "label": "events/inference/chat",
    "items": [
      {
        "type": "doc",
        "id": "api/core/events/inference/chat/interfaces/TokenUsage",
        "label": "TokenUsage"
      }
    ],
    "link": {
      "type": "doc",
      "id": "api/core/events/inference/chat/index"
    }
  },
  {
    "type": "category",
    "label": "events/inference/chat/base",
    "items": [
      {
        "type": "doc",
        "id": "api/core/events/inference/chat/base/classes/BaseChatLM",
        "label": "BaseChatLM"
      },
      {
        "type": "doc",
        "id": "api/core/events/inference/chat/base/classes/BaseLLM",
        "label": "BaseLLM"
      },
      {
        "type": "doc",
        "id": "api/core/events/inference/chat/base/classes/BaseLM",
        "label": "BaseLM"
      },
      {
        "type": "doc",
        "id": "api/core/events/inference/chat/base/interfaces/BaseChatLMCallOptions",
        "label": "BaseChatLMCallOptions"
      },
      {
        "type": "doc",
        "id": "api/core/events/inference/chat/base/interfaces/BaseChatLMParams",
        "label": "BaseChatLMParams"
      },
      {
        "type": "doc",
        "id": "api/core/events/inference/chat/base/interfaces/BaseLLMCallOptions",
        "label": "BaseLLMCallOptions"
      },
      {
        "type": "doc",
        "id": "api/core/events/inference/chat/base/interfaces/BaseLLMParams",
        "label": "BaseLLMParams"
      },
      {
        "type": "doc",
        "id": "api/core/events/inference/chat/base/interfaces/BaseLMCallOptions",
        "label": "BaseLMCallOptions"
      },
      {
        "type": "doc",
        "id": "api/core/events/inference/chat/base/interfaces/BaseLMParams",
        "label": "BaseLMParams"
      },
      {
        "type": "doc",
        "id": "api/core/events/inference/chat/base/type-aliases/BaseLMInput",
        "label": "BaseLMInput"
      },
      {
        "type": "doc",
        "id": "api/core/events/inference/chat/base/functions/calculateMaxToken",
        "label": "calculateMaxToken"
      },
      {
        "type": "doc",
        "id": "api/core/events/inference/chat/base/functions/getModelContextSize",
        "label": "getModelContextSize"
      },
      {
        "type": "doc",
        "id": "api/core/events/inference/chat/base/functions/isLMInput",
        "label": "isLMInput"
      }
    ],
    "link": {
      "type": "doc",
      "id": "api/core/events/inference/chat/base/index"
    }
  },
  {
    "type": "category",
    "label": "events/inference/chat/llms/openai/chat",
    "items": [
      {
        "type": "doc",
        "id": "api/core/events/inference/chat/llms/openai/chat/classes/OpenAIChat",
        "label": "OpenAIChat"
      },
      {
        "type": "doc",
        "id": "api/core/events/inference/chat/llms/openai/chat/type-aliases/OpenAIMessageRole",
        "label": "OpenAIMessageRole"
      }
    ],
    "link": {
      "type": "doc",
      "id": "api/core/events/inference/chat/llms/openai/chat/index"
    }
  },
  {
    "type": "category",
    "label": "events/inference/chat/llms/openai/text",
    "items": [
      {
        "type": "doc",
        "id": "api/core/events/inference/chat/llms/openai/text/classes/OpenAI",
        "label": "OpenAI"
      }
    ],
    "link": {
      "type": "doc",
      "id": "api/core/events/inference/chat/llms/openai/text/index"
    }
  },
  {
    "type": "category",
    "label": "events/inference/chat/llms/vertexai",
    "items": [
      {
        "type": "doc",
        "id": "api/core/events/inference/chat/llms/vertexai/enumerations/GeminiMimeType",
        "label": "GeminiMimeType"
      },
      {
        "type": "doc",
        "id": "api/core/events/inference/chat/llms/vertexai/interfaces/GeminiCallOptions",
        "label": "GeminiCallOptions"
      },
      {
        "type": "doc",
        "id": "api/core/events/inference/chat/llms/vertexai/interfaces/GeminiContent",
        "label": "GeminiContent"
      },
      {
        "type": "doc",
        "id": "api/core/events/inference/chat/llms/vertexai/interfaces/GeminiFunction",
        "label": "GeminiFunction"
      },
      {
        "type": "doc",
        "id": "api/core/events/inference/chat/llms/vertexai/interfaces/GeminiInlineData",
        "label": "GeminiInlineData"
      },
      {
        "type": "doc",
        "id": "api/core/events/inference/chat/llms/vertexai/interfaces/GeminiInput",
        "label": "GeminiInput"
      },
      {
        "type": "doc",
        "id": "api/core/events/inference/chat/llms/vertexai/interfaces/GeminiInputPart",
        "label": "GeminiInputPart"
      },
      {
        "type": "doc",
        "id": "api/core/events/inference/chat/llms/vertexai/interfaces/GeminiSafetySetting",
        "label": "GeminiSafetySetting"
      },
      {
        "type": "doc",
        "id": "api/core/events/inference/chat/llms/vertexai/interfaces/GeminiTool",
        "label": "GeminiTool"
      },
      {
        "type": "doc",
        "id": "api/core/events/inference/chat/llms/vertexai/interfaces/VertexAIBaseInput",
        "label": "VertexAIBaseInput"
      },
      {
        "type": "doc",
        "id": "api/core/events/inference/chat/llms/vertexai/interfaces/VertexAICallOptions",
        "label": "VertexAICallOptions"
      },
      {
        "type": "doc",
        "id": "api/core/events/inference/chat/llms/vertexai/type-aliases/GeminiContentRole",
        "label": "GeminiContentRole"
      },
      {
        "type": "doc",
        "id": "api/core/events/inference/chat/llms/vertexai/functions/checkModelForGemini",
        "label": "checkModelForGemini"
      },
      {
        "type": "doc",
        "id": "api/core/events/inference/chat/llms/vertexai/functions/checkModelForGeminiVision",
        "label": "checkModelForGeminiVision"
      },
      {
        "type": "doc",
        "id": "api/core/events/inference/chat/llms/vertexai/functions/wrapGoogleGenerativeAIClientError",
        "label": "wrapGoogleGenerativeAIClientError"
      }
    ],
    "link": {
      "type": "doc",
      "id": "api/core/events/inference/chat/llms/vertexai/index"
    }
  },
  {
    "type": "category",
    "label": "events/inference/chat/llms/vertexai/gemini/chat",
    "items": [
      {
        "type": "doc",
        "id": "api/core/events/inference/chat/llms/vertexai/gemini/chat/classes/GeminiChat",
        "label": "GeminiChat"
      },
      {
        "type": "doc",
        "id": "api/core/events/inference/chat/llms/vertexai/gemini/chat/interfaces/GeminiChatParamsBase",
        "label": "GeminiChatParamsBase"
      },
      {
        "type": "doc",
        "id": "api/core/events/inference/chat/llms/vertexai/gemini/chat/interfaces/GeminiChatParamsNonStreaming",
        "label": "GeminiChatParamsNonStreaming"
      },
      {
        "type": "doc",
        "id": "api/core/events/inference/chat/llms/vertexai/gemini/chat/interfaces/GeminiChatParamsStreaming",
        "label": "GeminiChatParamsStreaming"
      },
      {
        "type": "doc",
        "id": "api/core/events/inference/chat/llms/vertexai/gemini/chat/type-aliases/GeminiChatParams",
        "label": "GeminiChatParams"
      }
    ],
    "link": {
      "type": "doc",
      "id": "api/core/events/inference/chat/llms/vertexai/gemini/chat/index"
    }
  },
  {
    "type": "category",
    "label": "events/inference/chat/llms/vertexai/gemini/text",
    "items": [
      {
        "type": "doc",
        "id": "api/core/events/inference/chat/llms/vertexai/gemini/text/classes/Gemini",
        "label": "Gemini"
      },
      {
        "type": "doc",
        "id": "api/core/events/inference/chat/llms/vertexai/gemini/text/interfaces/GeminiParamsBase",
        "label": "GeminiParamsBase"
      },
      {
        "type": "doc",
        "id": "api/core/events/inference/chat/llms/vertexai/gemini/text/interfaces/GeminiParamsNonStreaming",
        "label": "GeminiParamsNonStreaming"
      },
      {
        "type": "doc",
        "id": "api/core/events/inference/chat/llms/vertexai/gemini/text/interfaces/GeminiParamsStreaming",
        "label": "GeminiParamsStreaming"
      },
      {
        "type": "doc",
        "id": "api/core/events/inference/chat/llms/vertexai/gemini/text/type-aliases/GeminiParams",
        "label": "GeminiParams"
      },
      {
        "type": "doc",
        "id": "api/core/events/inference/chat/llms/vertexai/gemini/text/type-aliases/GeminiTextCandidate",
        "label": "GeminiTextCandidate"
      }
    ],
    "link": {
      "type": "doc",
      "id": "api/core/events/inference/chat/llms/vertexai/gemini/text/index"
    }
  },
  {
    "type": "category",
    "label": "events/inference/chat/llms/vertexai/gemini/utils",
    "items": [
      {
        "type": "doc",
        "id": "api/core/events/inference/chat/llms/vertexai/gemini/utils/functions/getContentFromMessage",
        "label": "getContentFromMessage"
      },
      {
        "type": "doc",
        "id": "api/core/events/inference/chat/llms/vertexai/gemini/utils/functions/getGeminiRoleFromMessage",
        "label": "getGeminiRoleFromMessage"
      },
      {
        "type": "doc",
        "id": "api/core/events/inference/chat/llms/vertexai/gemini/utils/functions/getInlinePartFromInlineData",
        "label": "getInlinePartFromInlineData"
      },
      {
        "type": "doc",
        "id": "api/core/events/inference/chat/llms/vertexai/gemini/utils/functions/getMessageFromContent",
        "label": "getMessageFromContent"
      },
      {
        "type": "doc",
        "id": "api/core/events/inference/chat/llms/vertexai/gemini/utils/functions/getMessageFromContentWithRole",
        "label": "getMessageFromContentWithRole"
      },
      {
        "type": "doc",
        "id": "api/core/events/inference/chat/llms/vertexai/gemini/utils/functions/getPartsFromMessage",
        "label": "getPartsFromMessage"
      },
      {
        "type": "doc",
        "id": "api/core/events/inference/chat/llms/vertexai/gemini/utils/functions/getTextPart",
        "label": "getTextPart"
      },
      {
        "type": "doc",
        "id": "api/core/events/inference/chat/llms/vertexai/gemini/utils/functions/isInlineData",
        "label": "isInlineData"
      },
      {
        "type": "doc",
        "id": "api/core/events/inference/chat/llms/vertexai/gemini/utils/functions/isModalityRequiredInMessage",
        "label": "isModalityRequiredInMessage"
      },
      {
        "type": "doc",
        "id": "api/core/events/inference/chat/llms/vertexai/gemini/utils/functions/isTextData",
        "label": "isTextData"
      },
      {
        "type": "doc",
        "id": "api/core/events/inference/chat/llms/vertexai/gemini/utils/functions/isValidMime",
        "label": "isValidMime"
      }
    ],
    "link": {
      "type": "doc",
      "id": "api/core/events/inference/chat/llms/vertexai/gemini/utils/index"
    }
  },
  {
    "type": "category",
    "label": "events/inference/retrieve/base",
    "items": [
      {
        "type": "doc",
        "id": "api/core/events/inference/retrieve/base/classes/BaseEmbeddingRetriever",
        "label": "BaseEmbeddingRetriever"
      },
      {
        "type": "doc",
        "id": "api/core/events/inference/retrieve/base/classes/BaseRetriever",
        "label": "BaseRetriever"
      },
      {
        "type": "doc",
        "id": "api/core/events/inference/retrieve/base/classes/BaseTextRetriever",
        "label": "BaseTextRetriever"
      },
      {
        "type": "doc",
        "id": "api/core/events/inference/retrieve/base/interfaces/BaseEmbeddingRetrieverCallOptions",
        "label": "BaseEmbeddingRetrieverCallOptions"
      },
      {
        "type": "doc",
        "id": "api/core/events/inference/retrieve/base/interfaces/BaseEmbeddingRetrieverParams",
        "label": "BaseEmbeddingRetrieverParams"
      },
      {
        "type": "doc",
        "id": "api/core/events/inference/retrieve/base/interfaces/BaseRetrieverCallOptions",
        "label": "BaseRetrieverCallOptions"
      },
      {
        "type": "doc",
        "id": "api/core/events/inference/retrieve/base/interfaces/BaseRetrieverParams",
        "label": "BaseRetrieverParams"
      },
      {
        "type": "doc",
        "id": "api/core/events/inference/retrieve/base/interfaces/BaseTextRetrieverCallOptions",
        "label": "BaseTextRetrieverCallOptions"
      },
      {
        "type": "doc",
        "id": "api/core/events/inference/retrieve/base/interfaces/BaseTextRetrieverParams",
        "label": "BaseTextRetrieverParams"
      }
    ],
    "link": {
      "type": "doc",
      "id": "api/core/events/inference/retrieve/base/index"
    }
  },
  {
    "type": "category",
    "label": "events/inference/retrieve/embedding",
    "items": [
      {
        "type": "doc",
        "id": "api/core/events/inference/retrieve/embedding/type-aliases/MaxMarginalRelevanceSearch",
        "label": "MaxMarginalRelevanceSearch"
      },
      {
        "type": "doc",
        "id": "api/core/events/inference/retrieve/embedding/type-aliases/SimilaritySearch",
        "label": "SimilaritySearch"
      },
      {
        "type": "doc",
        "id": "api/core/events/inference/retrieve/embedding/type-aliases/VectorStoreRetrieverSearch",
        "label": "VectorStoreRetrieverSearch"
      }
    ],
    "link": {
      "type": "doc",
      "id": "api/core/events/inference/retrieve/embedding/index"
    }
  },
  {
    "type": "category",
    "label": "events/inference/retrieve/embedding/vectorstore",
    "items": [
      {
        "type": "doc",
        "id": "api/core/events/inference/retrieve/embedding/vectorstore/classes/VectorStoreRetriever",
        "label": "VectorStoreRetriever"
      },
      {
        "type": "doc",
        "id": "api/core/events/inference/retrieve/embedding/vectorstore/interfaces/VectorStoreRetrieverParams",
        "label": "VectorStoreRetrieverParams"
      }
    ],
    "link": {
      "type": "doc",
      "id": "api/core/events/inference/retrieve/embedding/vectorstore/index"
    }
  },
  {
    "type": "category",
    "label": "events/inference/retrieve/text/remote",
    "items": [
      {
        "type": "doc",
        "id": "api/core/events/inference/retrieve/text/remote/type-aliases/RemoteRetrieverAuth",
        "label": "RemoteRetrieverAuth"
      },
      {
        "type": "doc",
        "id": "api/core/events/inference/retrieve/text/remote/type-aliases/RemoteRetrieverValues",
        "label": "RemoteRetrieverValues"
      }
    ],
    "link": {
      "type": "doc",
      "id": "api/core/events/inference/retrieve/text/remote/index"
    }
  },
  {
    "type": "category",
    "label": "events/inference/retrieve/text/remote/base",
    "items": [
      {
        "type": "doc",
        "id": "api/core/events/inference/retrieve/text/remote/base/classes/RemoteRetriever",
        "label": "RemoteRetriever"
      },
      {
        "type": "doc",
        "id": "api/core/events/inference/retrieve/text/remote/base/interfaces/RemoteRetrieverParams",
        "label": "RemoteRetrieverParams"
      }
    ],
    "link": {
      "type": "doc",
      "id": "api/core/events/inference/retrieve/text/remote/base/index"
    }
  },
  {
    "type": "category",
    "label": "events/inference/validate",
    "items": [
      {
        "type": "doc",
        "id": "api/core/events/inference/validate/type-aliases/ValidateFunc",
        "label": "ValidateFunc"
      },
      {
        "type": "doc",
        "id": "api/core/events/inference/validate/type-aliases/ValidateResult",
        "label": "ValidateResult"
      }
    ],
    "link": {
      "type": "doc",
      "id": "api/core/events/inference/validate/index"
    }
  },
  {
    "type": "category",
    "label": "events/inference/validate/guardrails/array",
    "items": [
      {
        "type": "doc",
        "id": "api/core/events/inference/validate/guardrails/array/classes/ArrayRule",
        "label": "ArrayRule"
      }
    ],
    "link": {
      "type": "doc",
      "id": "api/core/events/inference/validate/guardrails/array/index"
    }
  },
  {
    "type": "category",
    "label": "events/inference/validate/guardrails/base",
    "items": [
      {
        "type": "doc",
        "id": "api/core/events/inference/validate/guardrails/base/classes/BaseRule",
        "label": "BaseRule"
      },
      {
        "type": "doc",
        "id": "api/core/events/inference/validate/guardrails/base/classes/GeneralRule",
        "label": "GeneralRule"
      },
      {
        "type": "doc",
        "id": "api/core/events/inference/validate/guardrails/base/interfaces/BaseRuleFields",
        "label": "BaseRuleFields"
      },
      {
        "type": "doc",
        "id": "api/core/events/inference/validate/guardrails/base/type-aliases/RuleMetadata",
        "label": "RuleMetadata"
      }
    ],
    "link": {
      "type": "doc",
      "id": "api/core/events/inference/validate/guardrails/base/index"
    }
  },
  {
    "type": "category",
    "label": "events/inference/validate/guardrails/boolean",
    "items": [
      {
        "type": "doc",
        "id": "api/core/events/inference/validate/guardrails/boolean/classes/BooleanRule",
        "label": "BooleanRule"
      }
    ],
    "link": {
      "type": "doc",
      "id": "api/core/events/inference/validate/guardrails/boolean/index"
    }
  },
  {
    "type": "category",
    "label": "events/inference/validate/guardrails/number",
    "items": [
      {
        "type": "doc",
        "id": "api/core/events/inference/validate/guardrails/number/classes/NumberRule",
        "label": "NumberRule"
      }
    ],
    "link": {
      "type": "doc",
      "id": "api/core/events/inference/validate/guardrails/number/index"
    }
  },
  {
    "type": "category",
    "label": "events/inference/validate/guardrails/object",
    "items": [
      {
        "type": "doc",
        "id": "api/core/events/inference/validate/guardrails/object/classes/JSONObjectRule",
        "label": "JSONObjectRule"
      }
    ],
    "link": {
      "type": "doc",
      "id": "api/core/events/inference/validate/guardrails/object/index"
    }
  },
  {
    "type": "category",
    "label": "events/inference/validate/guardrails/string",
    "items": [
      {
        "type": "doc",
        "id": "api/core/events/inference/validate/guardrails/string/classes/StringRule",
        "label": "StringRule"
      }
    ],
    "link": {
      "type": "doc",
      "id": "api/core/events/inference/validate/guardrails/string/index"
    }
  },
  {
    "type": "category",
    "label": "events/inference/validate/utils",
    "items": [
      {
        "type": "doc",
        "id": "api/core/events/inference/validate/utils/functions/swapKeysInVariables",
        "label": "swapKeysInVariables"
      },
      {
        "type": "doc",
        "id": "api/core/events/inference/validate/utils/functions/swapVariableNameInDescription",
        "label": "swapVariableNameInDescription"
      },
      {
        "type": "doc",
        "id": "api/core/events/inference/validate/utils/functions/wrapDescription",
        "label": "wrapDescription"
      }
    ],
    "link": {
      "type": "doc",
      "id": "api/core/events/inference/validate/utils/index"
    }
  },
  {
    "type": "category",
    "label": "events/inference/validate/validators/variable",
    "items": [
      {
        "type": "doc",
        "id": "api/core/events/inference/validate/validators/variable/classes/VariableValidator",
        "label": "VariableValidator"
      },
      {
        "type": "doc",
        "id": "api/core/events/inference/validate/validators/variable/interfaces/VariableRules",
        "label": "VariableRules"
      },
      {
        "type": "doc",
        "id": "api/core/events/inference/validate/validators/variable/interfaces/VariableValidatorParams",
        "label": "VariableValidatorParams"
      }
    ],
    "link": {
      "type": "doc",
      "id": "api/core/events/inference/validate/validators/variable/index"
    }
  },
  {
    "type": "category",
    "label": "events/input/load/docs/base",
    "items": [
      {
        "type": "doc",
        "id": "api/core/events/input/load/docs/base/classes/BaseLoader",
        "label": "BaseLoader"
      },
      {
        "type": "doc",
        "id": "api/core/events/input/load/docs/base/interfaces/BaseDocLoaderCallOptions",
        "label": "BaseDocLoaderCallOptions"
      },
      {
        "type": "doc",
        "id": "api/core/events/input/load/docs/base/interfaces/BaseLoaderParams",
        "label": "BaseLoaderParams"
      },
      {
        "type": "doc",
        "id": "api/core/events/input/load/docs/base/interfaces/DocLoader",
        "label": "DocLoader"
      }
    ],
    "link": {
      "type": "doc",
      "id": "api/core/events/input/load/docs/base/index"
    }
  },
  {
    "type": "category",
    "label": "events/input/load/docs/buffer",
    "items": [
      {
        "type": "doc",
        "id": "api/core/events/input/load/docs/buffer/classes/BufferLoader",
        "label": "BufferLoader"
      }
    ],
    "link": {
      "type": "doc",
      "id": "api/core/events/input/load/docs/buffer/index"
    }
  },
  {
    "type": "category",
    "label": "events/input/load/docs/context",
    "items": [
      {
        "type": "doc",
        "id": "api/core/events/input/load/docs/context/classes/Context",
        "label": "Context"
      },
      {
        "type": "doc",
        "id": "api/core/events/input/load/docs/context/interfaces/ContextInput",
        "label": "ContextInput"
      },
      {
        "type": "doc",
        "id": "api/core/events/input/load/docs/context/type-aliases/ContextLike",
        "label": "ContextLike"
      },
      {
        "type": "doc",
        "id": "api/core/events/input/load/docs/context/functions/isContextLike",
        "label": "isContextLike"
      }
    ],
    "link": {
      "type": "doc",
      "id": "api/core/events/input/load/docs/context/index"
    }
  },
  {
    "type": "category",
    "label": "events/input/load/docs/pdf",
    "items": [
      {
        "type": "doc",
        "id": "api/core/events/input/load/docs/pdf/classes/PDFLoader",
        "label": "PDFLoader"
      },
      {
        "type": "doc",
        "id": "api/core/events/input/load/docs/pdf/interfaces/PDFLoaderParams",
        "label": "PDFLoaderParams"
      }
    ],
    "link": {
      "type": "doc",
      "id": "api/core/events/input/load/docs/pdf/index"
    }
  },
  {
    "type": "category",
    "label": "events/input/load/msgs/base",
    "items": [
      {
        "type": "doc",
        "id": "api/core/events/input/load/msgs/base/classes/BaseMessage",
        "label": "BaseMessage"
      },
      {
        "type": "doc",
        "id": "api/core/events/input/load/msgs/base/interfaces/BaseMessageFields",
        "label": "BaseMessageFields"
      },
      {
        "type": "doc",
        "id": "api/core/events/input/load/msgs/base/type-aliases/BaseMessageLike",
        "label": "BaseMessageLike"
      },
      {
        "type": "doc",
        "id": "api/core/events/input/load/msgs/base/type-aliases/ContentLike",
        "label": "ContentLike"
      },
      {
        "type": "doc",
        "id": "api/core/events/input/load/msgs/base/type-aliases/Message",
        "label": "Message"
      },
      {
        "type": "doc",
        "id": "api/core/events/input/load/msgs/base/type-aliases/MessageRole",
        "label": "MessageRole"
      }
    ],
    "link": {
      "type": "doc",
      "id": "api/core/events/input/load/msgs/base/index"
    }
  },
  {
    "type": "category",
    "label": "events/input/load/msgs/bot",
    "items": [
      {
        "type": "doc",
        "id": "api/core/events/input/load/msgs/bot/classes/BotMessage",
        "label": "BotMessage"
      }
    ],
    "link": {
      "type": "doc",
      "id": "api/core/events/input/load/msgs/bot/index"
    }
  },
  {
    "type": "category",
    "label": "events/input/load/msgs/chat",
    "items": [
      {
        "type": "doc",
        "id": "api/core/events/input/load/msgs/chat/classes/ChatMessage",
        "label": "ChatMessage"
      },
      {
        "type": "doc",
        "id": "api/core/events/input/load/msgs/chat/interfaces/ChatMessageFields",
        "label": "ChatMessageFields"
      }
    ],
    "link": {
      "type": "doc",
      "id": "api/core/events/input/load/msgs/chat/index"
    }
  },
  {
    "type": "category",
    "label": "events/input/load/msgs/function",
    "items": [
      {
        "type": "doc",
        "id": "api/core/events/input/load/msgs/function/classes/FunctionMessage",
        "label": "FunctionMessage"
      }
    ],
    "link": {
      "type": "doc",
      "id": "api/core/events/input/load/msgs/function/index"
    }
  },
  {
    "type": "category",
    "label": "events/input/load/msgs/human",
    "items": [
      {
        "type": "doc",
        "id": "api/core/events/input/load/msgs/human/classes/HumanMessage",
        "label": "HumanMessage"
      }
    ],
    "link": {
      "type": "doc",
      "id": "api/core/events/input/load/msgs/human/index"
    }
  },
  {
    "type": "category",
    "label": "events/input/load/msgs/system",
    "items": [
      {
        "type": "doc",
        "id": "api/core/events/input/load/msgs/system/classes/SystemMessage",
        "label": "SystemMessage"
      }
    ],
    "link": {
      "type": "doc",
      "id": "api/core/events/input/load/msgs/system/index"
    }
  },
  {
    "type": "category",
    "label": "events/input/load/prompts/base",
    "items": [
      {
        "type": "doc",
        "id": "api/core/events/input/load/prompts/base/classes/BasePrompt",
        "label": "BasePrompt"
      },
      {
        "type": "doc",
        "id": "api/core/events/input/load/prompts/base/classes/BasePromptTemplate",
        "label": "BasePromptTemplate"
      },
      {
        "type": "doc",
        "id": "api/core/events/input/load/prompts/base/interfaces/BasePromptTemplateInput",
        "label": "BasePromptTemplateInput"
      },
      {
        "type": "doc",
        "id": "api/core/events/input/load/prompts/base/interfaces/PromptTemplateParams",
        "label": "PromptTemplateParams"
      }
    ],
    "link": {
      "type": "doc",
      "id": "api/core/events/input/load/prompts/base/index"
    }
  },
  {
    "type": "category",
    "label": "events/input/load/prompts/chat",
    "items": [
      {
        "type": "doc",
        "id": "api/core/events/input/load/prompts/chat/classes/ChatPrompt",
        "label": "ChatPrompt"
      },
      {
        "type": "doc",
        "id": "api/core/events/input/load/prompts/chat/interfaces/ChatPromptFields",
        "label": "ChatPromptFields"
      }
    ],
    "link": {
      "type": "doc",
      "id": "api/core/events/input/load/prompts/chat/index"
    }
  },
  {
    "type": "category",
    "label": "events/input/load/prompts/text",
    "items": [
      {
        "type": "doc",
        "id": "api/core/events/input/load/prompts/text/classes/StringPrompt",
        "label": "StringPrompt"
      },
      {
        "type": "doc",
        "id": "api/core/events/input/load/prompts/text/classes/StringPromptTemplate",
        "label": "StringPromptTemplate"
      },
      {
        "type": "doc",
        "id": "api/core/events/input/load/prompts/text/interfaces/StringPromptTemplateParams",
        "label": "StringPromptTemplateParams"
      }
    ],
    "link": {
      "type": "doc",
      "id": "api/core/events/input/load/prompts/text/index"
    }
  },
  {
    "type": "category",
    "label": "events/input/load/rules/base",
    "items": [
      {
        "type": "doc",
        "id": "api/core/events/input/load/rules/base/classes/BaseRuleCollection",
        "label": "BaseRuleCollection"
      },
      {
        "type": "doc",
        "id": "api/core/events/input/load/rules/base/interfaces/BaseRuleCollectionField",
        "label": "BaseRuleCollectionField"
      }
    ],
    "link": {
      "type": "doc",
      "id": "api/core/events/input/load/rules/base/index"
    }
  },
  {
    "type": "category",
    "label": "events/input/load/vectorstore/base",
    "items": [
      {
        "type": "doc",
        "id": "api/core/events/input/load/vectorstore/base/classes/BaseVectorStore",
        "label": "BaseVectorStore"
      },
      {
        "type": "doc",
        "id": "api/core/events/input/load/vectorstore/base/interfaces/BaseVectorStoreField",
        "label": "BaseVectorStoreField"
      }
    ],
    "link": {
      "type": "doc",
      "id": "api/core/events/input/load/vectorstore/base/index"
    }
  },
  {
    "type": "category",
    "label": "events/input/load/vectorstore/chroma",
    "items": [
      {
        "type": "doc",
        "id": "api/core/events/input/load/vectorstore/chroma/classes/ChromaVectorStore",
        "label": "ChromaVectorStore"
      },
      {
        "type": "doc",
        "id": "api/core/events/input/load/vectorstore/chroma/interfaces/ChromaDeleteParams",
        "label": "ChromaDeleteParams"
      },
      {
        "type": "doc",
        "id": "api/core/events/input/load/vectorstore/chroma/interfaces/ChromaVectorStoreField",
        "label": "ChromaVectorStoreField"
      },
      {
        "type": "doc",
        "id": "api/core/events/input/load/vectorstore/chroma/type-aliases/ChromaVectorStoreFilterType",
        "label": "ChromaVectorStoreFilterType"
      }
    ],
    "link": {
      "type": "doc",
      "id": "api/core/events/input/load/vectorstore/chroma/index"
    }
  },
  {
    "type": "category",
    "label": "events/input/load/vectorstore/memory",
    "items": [
      {
        "type": "doc",
        "id": "api/core/events/input/load/vectorstore/memory/classes/MemoryVectorStore",
        "label": "MemoryVectorStore"
      },
      {
        "type": "doc",
        "id": "api/core/events/input/load/vectorstore/memory/interfaces/MemoryDeleteParams",
        "label": "MemoryDeleteParams"
      },
      {
        "type": "doc",
        "id": "api/core/events/input/load/vectorstore/memory/interfaces/MemoryVectorStoreField",
        "label": "MemoryVectorStoreField"
      },
      {
        "type": "doc",
        "id": "api/core/events/input/load/vectorstore/memory/type-aliases/MemoryVectorStoreFilterType",
        "label": "MemoryVectorStoreFilterType"
      },
      {
        "type": "doc",
        "id": "api/core/events/input/load/vectorstore/memory/type-aliases/Vector",
        "label": "Vector"
      }
    ],
    "link": {
      "type": "doc",
      "id": "api/core/events/input/load/vectorstore/memory/index"
    }
  },
  {
    "type": "category",
    "label": "events/input/transform/splitter",
    "items": [
      {
        "type": "doc",
        "id": "api/core/events/input/transform/splitter/classes/ContextSplitter",
        "label": "ContextSplitter"
      },
      {
        "type": "doc",
        "id": "api/core/events/input/transform/splitter/classes/RecursiveTextSplitter",
        "label": "RecursiveTextSplitter"
      },
      {
        "type": "doc",
        "id": "api/core/events/input/transform/splitter/classes/TextSplitter",
        "label": "TextSplitter"
      },
      {
        "type": "doc",
        "id": "api/core/events/input/transform/splitter/classes/TokenTextSplitter",
        "label": "TokenTextSplitter"
      },
      {
        "type": "doc",
        "id": "api/core/events/input/transform/splitter/interfaces/ContextSplitterParams",
        "label": "ContextSplitterParams"
      },
      {
        "type": "doc",
        "id": "api/core/events/input/transform/splitter/interfaces/RecursiveTextSplitterParams",
        "label": "RecursiveTextSplitterParams"
      },
      {
        "type": "doc",
        "id": "api/core/events/input/transform/splitter/interfaces/TextSplitterParams",
        "label": "TextSplitterParams"
      },
      {
        "type": "doc",
        "id": "api/core/events/input/transform/splitter/interfaces/TokenTextSplitterParams",
        "label": "TokenTextSplitterParams"
      },
      {
        "type": "doc",
        "id": "api/core/events/input/transform/splitter/type-aliases/SupportedLanguageForSplit",
        "label": "SupportedLanguageForSplit"
      }
    ],
    "link": {
      "type": "doc",
      "id": "api/core/events/input/transform/splitter/index"
    }
  },
  {
    "type": "category",
    "label": "events/output/provide/base",
    "items": [
      {
        "type": "doc",
        "id": "api/core/events/output/provide/base/classes/BaseSourceProvider",
        "label": "BaseSourceProvider"
      },
      {
        "type": "doc",
        "id": "api/core/events/output/provide/base/interfaces/SourceProvider",
        "label": "SourceProvider"
      }
    ],
    "link": {
      "type": "doc",
      "id": "api/core/events/output/provide/base/index"
    }
  },
  {
    "type": "category",
    "label": "events/output/provide/embedresult",
    "items": [
      {
        "type": "doc",
        "id": "api/core/events/output/provide/embedresult/type-aliases/EmbedResult",
        "label": "EmbedResult"
      }
    ],
    "link": {
      "type": "doc",
      "id": "api/core/events/output/provide/embedresult/index"
    }
  },
  {
    "type": "category",
    "label": "events/output/provide/file",
    "items": [
      {
        "type": "doc",
        "id": "api/core/events/output/provide/file/classes/FileProvider",
        "label": "FileProvider"
      },
      {
        "type": "doc",
        "id": "api/core/events/output/provide/file/classes/GenerationFileChunk",
        "label": "GenerationFileChunk"
      },
      {
        "type": "doc",
        "id": "api/core/events/output/provide/file/type-aliases/GenerationFileChunkField",
        "label": "GenerationFileChunkField"
      }
    ],
    "link": {
      "type": "doc",
      "id": "api/core/events/output/provide/file/index"
    }
  },
  {
    "type": "category",
    "label": "events/output/provide/generation",
    "items": [
      {
        "type": "doc",
        "id": "api/core/events/output/provide/generation/classes/GenerationChunk",
        "label": "GenerationChunk"
      },
      {
        "type": "doc",
        "id": "api/core/events/output/provide/generation/interfaces/Generation",
        "label": "Generation"
      },
      {
        "type": "doc",
        "id": "api/core/events/output/provide/generation/type-aliases/GenerationChunkField",
        "label": "GenerationChunkField"
      }
    ],
    "link": {
      "type": "doc",
      "id": "api/core/events/output/provide/generation/index"
    }
  },
  {
    "type": "category",
    "label": "events/output/provide/llmresult",
    "items": [
      {
        "type": "doc",
        "id": "api/core/events/output/provide/llmresult/type-aliases/LLMResult",
        "label": "LLMResult"
      }
    ],
    "link": {
      "type": "doc",
      "id": "api/core/events/output/provide/llmresult/index"
    }
  },
  {
    "type": "category",
    "label": "events/output/provide/message",
    "items": [
      {
        "type": "doc",
        "id": "api/core/events/output/provide/message/classes/ChatGenerationChunk",
        "label": "ChatGenerationChunk"
      },
      {
        "type": "doc",
        "id": "api/core/events/output/provide/message/interfaces/ChatGeneration",
        "label": "ChatGeneration"
      },
      {
        "type": "doc",
        "id": "api/core/events/output/provide/message/interfaces/ChatGenerationChunkField",
        "label": "ChatGenerationChunkField"
      },
      {
        "type": "doc",
        "id": "api/core/events/output/provide/message/interfaces/MessageGeneration",
        "label": "MessageGeneration"
      },
      {
        "type": "doc",
        "id": "api/core/events/output/provide/message/interfaces/SerializedMessage",
        "label": "SerializedMessage"
      },
      {
        "type": "doc",
        "id": "api/core/events/output/provide/message/interfaces/SerializedMessageData",
        "label": "SerializedMessageData"
      },
      {
        "type": "doc",
        "id": "api/core/events/output/provide/message/interfaces/SerializedMessageGeneration",
        "label": "SerializedMessageGeneration"
      },
      {
        "type": "doc",
        "id": "api/core/events/output/provide/message/functions/deserializeMessageGeneration",
        "label": "deserializeMessageGeneration"
      },
      {
        "type": "doc",
        "id": "api/core/events/output/provide/message/functions/isMessageContentLike",
        "label": "isMessageContentLike"
      },
      {
        "type": "doc",
        "id": "api/core/events/output/provide/message/functions/isSerializedMessage",
        "label": "isSerializedMessage"
      },
      {
        "type": "doc",
        "id": "api/core/events/output/provide/message/functions/mapSerializedMessageToChatMessage",
        "label": "mapSerializedMessageToChatMessage"
      },
      {
        "type": "doc",
        "id": "api/core/events/output/provide/message/functions/serializeMessageGeneration",
        "label": "serializeMessageGeneration"
      }
    ],
    "link": {
      "type": "doc",
      "id": "api/core/events/output/provide/message/index"
    }
  },
  {
    "type": "category",
    "label": "load",
    "items": [
      {
        "type": "doc",
        "id": "api/core/load/functions/load",
        "label": "load"
      }
    ],
    "link": {
      "type": "doc",
      "id": "api/core/load/index"
    }
  },
  {
    "type": "category",
    "label": "load/serializable",
    "items": [
      {
        "type": "doc",
        "id": "api/core/load/serializable/classes/Serializable",
        "label": "Serializable"
      },
      {
        "type": "doc",
        "id": "api/core/load/serializable/interfaces/SerializedConstructor",
        "label": "SerializedConstructor"
      },
      {
        "type": "doc",
        "id": "api/core/load/serializable/interfaces/SerializedNotImplemented",
        "label": "SerializedNotImplemented"
      },
      {
        "type": "doc",
        "id": "api/core/load/serializable/interfaces/SerializedSecret",
        "label": "SerializedSecret"
      },
      {
        "type": "doc",
        "id": "api/core/load/serializable/type-aliases/BasedSerialized",
        "label": "BasedSerialized"
      },
      {
        "type": "doc",
        "id": "api/core/load/serializable/type-aliases/Serialized",
        "label": "Serialized"
      }
    ],
    "link": {
      "type": "doc",
      "id": "api/core/load/serializable/index"
    }
  },
  {
    "type": "category",
    "label": "record/callable",
    "items": [
      {
        "type": "doc",
        "id": "api/core/record/callable/classes/Callable",
        "label": "Callable"
      },
      {
        "type": "doc",
        "id": "api/core/record/callable/classes/CallableBind",
        "label": "CallableBind"
      },
      {
        "type": "doc",
        "id": "api/core/record/callable/classes/CallableEach",
        "label": "CallableEach"
      },
      {
        "type": "doc",
        "id": "api/core/record/callable/classes/CallableIf",
        "label": "CallableIf"
      },
      {
        "type": "doc",
        "id": "api/core/record/callable/classes/CallableLambda",
        "label": "CallableLambda"
      },
      {
        "type": "doc",
        "id": "api/core/record/callable/classes/CallableMap",
        "label": "CallableMap"
      },
      {
        "type": "doc",
        "id": "api/core/record/callable/classes/CallableSequence",
        "label": "CallableSequence"
      },
      {
        "type": "doc",
        "id": "api/core/record/callable/classes/CallableWithFallbacks",
        "label": "CallableWithFallbacks"
      },
      {
        "type": "doc",
        "id": "api/core/record/callable/type-aliases/CallableBatchOptions",
        "label": "CallableBatchOptions"
      },
      {
        "type": "doc",
        "id": "api/core/record/callable/type-aliases/CallableBindArgs",
        "label": "CallableBindArgs"
      },
      {
        "type": "doc",
        "id": "api/core/record/callable/type-aliases/CallableConfig",
        "label": "CallableConfig"
      },
      {
        "type": "doc",
        "id": "api/core/record/callable/type-aliases/CallableConfigFields",
        "label": "CallableConfigFields"
      },
      {
        "type": "doc",
        "id": "api/core/record/callable/type-aliases/CallableEachArgs",
        "label": "CallableEachArgs"
      },
      {
        "type": "doc",
        "id": "api/core/record/callable/type-aliases/CallableFunc",
        "label": "CallableFunc"
      },
      {
        "type": "doc",
        "id": "api/core/record/callable/type-aliases/CallableIfConfig",
        "label": "CallableIfConfig"
      },
      {
        "type": "doc",
        "id": "api/core/record/callable/type-aliases/CallableLike",
        "label": "CallableLike"
      },
      {
        "type": "doc",
        "id": "api/core/record/callable/type-aliases/CallableWithFallbacksArg",
        "label": "CallableWithFallbacksArg"
      },
      {
        "type": "doc",
        "id": "api/core/record/callable/type-aliases/SerializedCallableFields",
        "label": "SerializedCallableFields"
      }
    ],
    "link": {
      "type": "doc",
      "id": "api/core/record/callable/index"
    }
  },
  {
    "type": "category",
    "label": "studio/comments",
    "items": [
      {
        "type": "doc",
        "id": "api/core/studio/comments/interfaces/BaseComment",
        "label": "BaseComment"
      },
      {
        "type": "doc",
        "id": "api/core/studio/comments/interfaces/CodeComment",
        "label": "CodeComment"
      },
      {
        "type": "doc",
        "id": "api/core/studio/comments/interfaces/MarkdownComment",
        "label": "MarkdownComment"
      },
      {
        "type": "doc",
        "id": "api/core/studio/comments/interfaces/PlainTextComment",
        "label": "PlainTextComment"
      },
      {
        "type": "doc",
        "id": "api/core/studio/comments/type-aliases/GraphComment",
        "label": "GraphComment"
      }
    ],
    "link": {
      "type": "doc",
      "id": "api/core/studio/comments/index"
    }
  },
  {
    "type": "category",
    "label": "studio/condition",
    "items": [
      {
        "type": "doc",
        "id": "api/core/studio/condition/classes/BaseIfCondition",
        "label": "BaseIfCondition"
      },
      {
        "type": "doc",
        "id": "api/core/studio/condition/classes/IfCondition",
        "label": "IfCondition"
      },
      {
        "type": "doc",
        "id": "api/core/studio/condition/interfaces/IfConditionParams",
        "label": "IfConditionParams"
      },
      {
        "type": "doc",
        "id": "api/core/studio/condition/type-aliases/ConditionField",
        "label": "ConditionField"
      },
      {
        "type": "doc",
        "id": "api/core/studio/condition/type-aliases/ConditionFieldVariables",
        "label": "ConditionFieldVariables"
      },
      {
        "type": "doc",
        "id": "api/core/studio/condition/type-aliases/ElseConditionField",
        "label": "ElseConditionField"
      },
      {
        "type": "doc",
        "id": "api/core/studio/condition/type-aliases/ElseIfConditionField",
        "label": "ElseIfConditionField"
      },
      {
        "type": "doc",
        "id": "api/core/studio/condition/type-aliases/IfConditionField",
        "label": "IfConditionField"
      },
      {
        "type": "doc",
        "id": "api/core/studio/condition/type-aliases/IfConditionOptions",
        "label": "IfConditionOptions"
      },
      {
        "type": "doc",
        "id": "api/core/studio/condition/type-aliases/IfConditionSource",
        "label": "IfConditionSource"
      },
      {
        "type": "doc",
        "id": "api/core/studio/condition/type-aliases/IfConditionTarget",
        "label": "IfConditionTarget"
      },
      {
        "type": "doc",
        "id": "api/core/studio/condition/type-aliases/OtherwiseConditionField",
        "label": "OtherwiseConditionField"
      }
    ],
    "link": {
      "type": "doc",
      "id": "api/core/studio/condition/index"
    }
  },
  {
    "type": "category",
    "label": "studio/data",
    "items": [
      {
        "type": "doc",
        "id": "api/core/studio/data/type-aliases/ArrayData",
        "label": "ArrayData"
      },
      {
        "type": "doc",
        "id": "api/core/studio/data/type-aliases/ArrayDataType",
        "label": "ArrayDataType"
      },
      {
        "type": "doc",
        "id": "api/core/studio/data/type-aliases/ArrayOf",
        "label": "ArrayOf"
      },
      {
        "type": "doc",
        "id": "api/core/studio/data/type-aliases/BlobData",
        "label": "BlobData"
      },
      {
        "type": "doc",
        "id": "api/core/studio/data/type-aliases/BooleanData",
        "label": "BooleanData"
      },
      {
        "type": "doc",
        "id": "api/core/studio/data/type-aliases/ChatMessageData",
        "label": "ChatMessageData"
      },
      {
        "type": "doc",
        "id": "api/core/studio/data/type-aliases/ContextData",
        "label": "ContextData"
      },
      {
        "type": "doc",
        "id": "api/core/studio/data/type-aliases/Data",
        "label": "Data"
      },
      {
        "type": "doc",
        "id": "api/core/studio/data/type-aliases/DataDef",
        "label": "DataDef"
      },
      {
        "type": "doc",
        "id": "api/core/studio/data/type-aliases/DataFields",
        "label": "DataFields"
      },
      {
        "type": "doc",
        "id": "api/core/studio/data/type-aliases/DataType",
        "label": "DataType"
      },
      {
        "type": "doc",
        "id": "api/core/studio/data/type-aliases/JSONObjectData",
        "label": "JSONObjectData"
      },
      {
        "type": "doc",
        "id": "api/core/studio/data/type-aliases/NumberData",
        "label": "NumberData"
      },
      {
        "type": "doc",
        "id": "api/core/studio/data/type-aliases/ScalarData",
        "label": "ScalarData"
      },
      {
        "type": "doc",
        "id": "api/core/studio/data/type-aliases/ScalarDataType",
        "label": "ScalarDataType"
      },
      {
        "type": "doc",
        "id": "api/core/studio/data/type-aliases/StringData",
        "label": "StringData"
      },
      {
        "type": "doc",
        "id": "api/core/studio/data/type-aliases/TypeOf",
        "label": "TypeOf"
      },
      {
        "type": "doc",
        "id": "api/core/studio/data/type-aliases/UnknownData",
        "label": "UnknownData"
      },
      {
        "type": "doc",
        "id": "api/core/studio/data/type-aliases/ValueOf",
        "label": "ValueOf"
      },
      {
        "type": "doc",
        "id": "api/core/studio/data/variables/dataTypes",
        "label": "dataTypes"
      },
      {
        "type": "doc",
        "id": "api/core/studio/data/variables/scalarDefaults",
        "label": "scalarDefaults"
      },
      {
        "type": "doc",
        "id": "api/core/studio/data/variables/scalarTypes",
        "label": "scalarTypes"
      },
      {
        "type": "doc",
        "id": "api/core/studio/data/functions/arrayizeData",
        "label": "arrayizeData"
      },
      {
        "type": "doc",
        "id": "api/core/studio/data/functions/getDefaultValue",
        "label": "getDefaultValue"
      },
      {
        "type": "doc",
        "id": "api/core/studio/data/functions/getScalarTypeOf",
        "label": "getScalarTypeOf"
      },
      {
        "type": "doc",
        "id": "api/core/studio/data/functions/isArrayData",
        "label": "isArrayData"
      },
      {
        "type": "doc",
        "id": "api/core/studio/data/functions/isArrayDataType",
        "label": "isArrayDataType"
      },
      {
        "type": "doc",
        "id": "api/core/studio/data/functions/isScalarData",
        "label": "isScalarData"
      },
      {
        "type": "doc",
        "id": "api/core/studio/data/functions/isScalarDataType",
        "label": "isScalarDataType"
      },
      {
        "type": "doc",
        "id": "api/core/studio/data/functions/toArrayFromScalar",
        "label": "toArrayFromScalar"
      },
      {
        "type": "doc",
        "id": "api/core/studio/data/functions/toScalarFromArray",
        "label": "toScalarFromArray"
      }
    ],
    "link": {
      "type": "doc",
      "id": "api/core/studio/data/index"
    }
  },
  {
    "type": "category",
    "label": "studio/graph",
    "items": [
      {
        "type": "doc",
        "id": "api/core/studio/graph/classes/BaseGraph",
        "label": "BaseGraph"
      },
      {
        "type": "doc",
        "id": "api/core/studio/graph/classes/SubGraph",
        "label": "SubGraph"
      },
      {
        "type": "doc",
        "id": "api/core/studio/graph/interfaces/NodeGraph",
        "label": "NodeGraph"
      },
      {
        "type": "doc",
        "id": "api/core/studio/graph/type-aliases/NodeProcessInfo",
        "label": "NodeProcessInfo"
      }
    ],
    "link": {
      "type": "doc",
      "id": "api/core/studio/graph/index"
    }
  },
  {
    "type": "category",
    "label": "studio/guardrails",
    "items": [
      {
        "type": "doc",
        "id": "api/core/studio/guardrails/interfaces/BaseGuardrail",
        "label": "BaseGuardrail"
      },
      {
        "type": "doc",
        "id": "api/core/studio/guardrails/interfaces/Guardrail",
        "label": "Guardrail"
      }
    ],
    "link": {
      "type": "doc",
      "id": "api/core/studio/guardrails/index"
    }
  },
  {
    "type": "category",
    "label": "studio/guardrails/base",
    "items": [
      {
        "type": "doc",
        "id": "api/core/studio/guardrails/base/classes/GuardrailImpl",
        "label": "GuardrailImpl"
      }
    ],
    "link": {
      "type": "doc",
      "id": "api/core/studio/guardrails/base/index"
    }
  },
  {
    "type": "category",
    "label": "studio/guardrails/data/array.guard",
    "items": [
      {
        "type": "doc",
        "id": "api/core/studio/guardrails/data/array.guard/classes/ArrayGuardrailImpl",
        "label": "ArrayGuardrailImpl"
      },
      {
        "type": "doc",
        "id": "api/core/studio/guardrails/data/array.guard/type-aliases/ArrayGuard",
        "label": "ArrayGuard"
      }
    ],
    "link": {
      "type": "doc",
      "id": "api/core/studio/guardrails/data/array.guard/index"
    }
  },
  {
    "type": "category",
    "label": "studio/guardrails/data/boolean.guard",
    "items": [
      {
        "type": "doc",
        "id": "api/core/studio/guardrails/data/boolean.guard/classes/BooleanGuardrailImpl",
        "label": "BooleanGuardrailImpl"
      },
      {
        "type": "doc",
        "id": "api/core/studio/guardrails/data/boolean.guard/type-aliases/BooleanGuard",
        "label": "BooleanGuard"
      }
    ],
    "link": {
      "type": "doc",
      "id": "api/core/studio/guardrails/data/boolean.guard/index"
    }
  },
  {
    "type": "category",
    "label": "studio/guardrails/data/number.guard",
    "items": [
      {
        "type": "doc",
        "id": "api/core/studio/guardrails/data/number.guard/classes/NumberGuardrailImpl",
        "label": "NumberGuardrailImpl"
      },
      {
        "type": "doc",
        "id": "api/core/studio/guardrails/data/number.guard/type-aliases/NumberGuard",
        "label": "NumberGuard"
      }
    ],
    "link": {
      "type": "doc",
      "id": "api/core/studio/guardrails/data/number.guard/index"
    }
  },
  {
    "type": "category",
    "label": "studio/guardrails/data/object.guard",
    "items": [
      {
        "type": "doc",
        "id": "api/core/studio/guardrails/data/object.guard/classes/JSONObjectGuardrailImpl",
        "label": "JSONObjectGuardrailImpl"
      },
      {
        "type": "doc",
        "id": "api/core/studio/guardrails/data/object.guard/type-aliases/JSONObjectGuard",
        "label": "JSONObjectGuard"
      }
    ],
    "link": {
      "type": "doc",
      "id": "api/core/studio/guardrails/data/object.guard/index"
    }
  },
  {
    "type": "category",
    "label": "studio/guardrails/data/string.guard",
    "items": [
      {
        "type": "doc",
        "id": "api/core/studio/guardrails/data/string.guard/classes/StringGuardrailImpl",
        "label": "StringGuardrailImpl"
      },
      {
        "type": "doc",
        "id": "api/core/studio/guardrails/data/string.guard/type-aliases/StringGuard",
        "label": "StringGuard"
      }
    ],
    "link": {
      "type": "doc",
      "id": "api/core/studio/guardrails/data/string.guard/index"
    }
  },
  {
    "type": "category",
    "label": "studio/input",
    "items": [
      {
        "type": "doc",
        "id": "api/core/studio/input/classes/BaseInput",
        "label": "BaseInput"
      }
    ],
    "link": {
      "type": "doc",
      "id": "api/core/studio/input/index"
    }
  },
  {
    "type": "category",
    "label": "studio/nodes",
    "items": [
      {
        "type": "doc",
        "id": "api/core/studio/nodes/interfaces/BaseNode",
        "label": "BaseNode"
      },
      {
        "type": "doc",
        "id": "api/core/studio/nodes/interfaces/CallableNode",
        "label": "CallableNode"
      },
      {
        "type": "doc",
        "id": "api/core/studio/nodes/interfaces/SerializableNode",
        "label": "SerializableNode"
      },
      {
        "type": "doc",
        "id": "api/core/studio/nodes/type-aliases/NodeBody",
        "label": "NodeBody"
      },
      {
        "type": "doc",
        "id": "api/core/studio/nodes/type-aliases/NodeConnection",
        "label": "NodeConnection"
      },
      {
        "type": "doc",
        "id": "api/core/studio/nodes/type-aliases/NodeInputPortDef",
        "label": "NodeInputPortDef"
      },
      {
        "type": "doc",
        "id": "api/core/studio/nodes/type-aliases/NodeOutputPortDef",
        "label": "NodeOutputPortDef"
      },
      {
        "type": "doc",
        "id": "api/core/studio/nodes/type-aliases/NodePortDef",
        "label": "NodePortDef"
      },
      {
        "type": "doc",
        "id": "api/core/studio/nodes/type-aliases/NodePortFields",
        "label": "NodePortFields"
      },
      {
        "type": "doc",
        "id": "api/core/studio/nodes/type-aliases/NodePortSizes",
        "label": "NodePortSizes"
      }
    ],
    "link": {
      "type": "doc",
      "id": "api/core/studio/nodes/index"
    }
  },
  {
    "type": "category",
    "label": "studio/nodes/base",
    "items": [
      {
        "type": "doc",
        "id": "api/core/studio/nodes/base/classes/CallableNodeImpl",
        "label": "CallableNodeImpl"
      },
      {
        "type": "doc",
        "id": "api/core/studio/nodes/base/classes/NodeImpl",
        "label": "NodeImpl"
      }
    ],
    "link": {
      "type": "doc",
      "id": "api/core/studio/nodes/base/index"
    }
  },
  {
    "type": "category",
    "label": "studio/nodes/inference/chat/chatlm.node",
    "items": [
      {
        "type": "doc",
        "id": "api/core/studio/nodes/inference/chat/chatlm.node/classes/ChatLMNodeImpl",
        "label": "ChatLMNodeImpl"
      },
      {
        "type": "doc",
        "id": "api/core/studio/nodes/inference/chat/chatlm.node/classes/GeminiChatNodeImpl",
        "label": "GeminiChatNodeImpl"
      },
      {
        "type": "doc",
        "id": "api/core/studio/nodes/inference/chat/chatlm.node/classes/OpenAIChatNodeImpl",
        "label": "OpenAIChatNodeImpl"
      },
      {
        "type": "doc",
        "id": "api/core/studio/nodes/inference/chat/chatlm.node/type-aliases/ChatLMNode",
        "label": "ChatLMNode"
      }
    ],
    "link": {
      "type": "doc",
      "id": "api/core/studio/nodes/inference/chat/chatlm.node/index"
    }
  },
  {
    "type": "category",
    "label": "studio/nodes/inference/chat/llm.node",
    "items": [
      {
        "type": "doc",
        "id": "api/core/studio/nodes/inference/chat/llm.node/classes/GeminiNodeImpl",
        "label": "GeminiNodeImpl"
      },
      {
        "type": "doc",
        "id": "api/core/studio/nodes/inference/chat/llm.node/classes/LLMNodeImpl",
        "label": "LLMNodeImpl"
      },
      {
        "type": "doc",
        "id": "api/core/studio/nodes/inference/chat/llm.node/classes/OpenAINodeImpl",
        "label": "OpenAINodeImpl"
      },
      {
        "type": "doc",
        "id": "api/core/studio/nodes/inference/chat/llm.node/type-aliases/LLMNode",
        "label": "LLMNode"
      }
    ],
    "link": {
      "type": "doc",
      "id": "api/core/studio/nodes/inference/chat/llm.node/index"
    }
  },
  {
    "type": "category",
    "label": "studio/nodes/input/loader.node",
    "items": [
      {
        "type": "doc",
        "id": "api/core/studio/nodes/input/loader.node/classes/LoaderNodeImpl",
        "label": "LoaderNodeImpl"
      },
      {
        "type": "doc",
        "id": "api/core/studio/nodes/input/loader.node/classes/PDFLoaderNodeImpl",
        "label": "PDFLoaderNodeImpl"
      },
      {
        "type": "doc",
        "id": "api/core/studio/nodes/input/loader.node/type-aliases/LoaderNode",
        "label": "LoaderNode"
      }
    ],
    "link": {
      "type": "doc",
      "id": "api/core/studio/nodes/input/loader.node/index"
    }
  },
  {
    "type": "category",
    "label": "studio/nodes/input/message.node",
    "items": [
      {
        "type": "doc",
        "id": "api/core/studio/nodes/input/message.node/classes/BotMessageNodeImpl",
        "label": "BotMessageNodeImpl"
      },
      {
        "type": "doc",
        "id": "api/core/studio/nodes/input/message.node/classes/ChatMessageNodeImpl",
        "label": "ChatMessageNodeImpl"
      },
      {
        "type": "doc",
        "id": "api/core/studio/nodes/input/message.node/classes/FunctionMessageNodeImpl",
        "label": "FunctionMessageNodeImpl"
      },
      {
        "type": "doc",
        "id": "api/core/studio/nodes/input/message.node/classes/HumanMessageNodeImpl",
        "label": "HumanMessageNodeImpl"
      },
      {
        "type": "doc",
        "id": "api/core/studio/nodes/input/message.node/classes/MessageNodeImpl",
        "label": "MessageNodeImpl"
      },
      {
        "type": "doc",
        "id": "api/core/studio/nodes/input/message.node/classes/SystemMessageNodeImpl",
        "label": "SystemMessageNodeImpl"
      },
      {
        "type": "doc",
        "id": "api/core/studio/nodes/input/message.node/type-aliases/MessageNode",
        "label": "MessageNode"
      }
    ],
    "link": {
      "type": "doc",
      "id": "api/core/studio/nodes/input/message.node/index"
    }
  },
  {
    "type": "category",
    "label": "studio/nodes/input/prompt.node",
    "items": [
      {
        "type": "doc",
        "id": "api/core/studio/nodes/input/prompt.node/classes/ChatPromptNodeImpl",
        "label": "ChatPromptNodeImpl"
      },
      {
        "type": "doc",
        "id": "api/core/studio/nodes/input/prompt.node/classes/PromptNodeImpl",
        "label": "PromptNodeImpl"
      },
      {
        "type": "doc",
        "id": "api/core/studio/nodes/input/prompt.node/classes/StringPromptNodeImpl",
        "label": "StringPromptNodeImpl"
      },
      {
        "type": "doc",
        "id": "api/core/studio/nodes/input/prompt.node/type-aliases/PromptNode",
        "label": "PromptNode"
      }
    ],
    "link": {
      "type": "doc",
      "id": "api/core/studio/nodes/input/prompt.node/index"
    }
  },
  {
    "type": "category",
    "label": "studio/nodes/input/splitter.node",
    "items": [
      {
        "type": "doc",
        "id": "api/core/studio/nodes/input/splitter.node/classes/LanguageTextSplitterNodeImpl",
        "label": "LanguageTextSplitterNodeImpl"
      },
      {
        "type": "doc",
        "id": "api/core/studio/nodes/input/splitter.node/classes/RecursiveTextSplitterNodeImpl",
        "label": "RecursiveTextSplitterNodeImpl"
      },
      {
        "type": "doc",
        "id": "api/core/studio/nodes/input/splitter.node/classes/SplitterNodeImpl",
        "label": "SplitterNodeImpl"
      },
      {
        "type": "doc",
        "id": "api/core/studio/nodes/input/splitter.node/classes/TextSplitterNodeImpl",
        "label": "TextSplitterNodeImpl"
      },
      {
        "type": "doc",
        "id": "api/core/studio/nodes/input/splitter.node/classes/TokenTextSplitterNodeImpl",
        "label": "TokenTextSplitterNodeImpl"
      },
      {
        "type": "doc",
        "id": "api/core/studio/nodes/input/splitter.node/type-aliases/SplitterNode",
        "label": "SplitterNode"
      }
    ],
    "link": {
      "type": "doc",
      "id": "api/core/studio/nodes/input/splitter.node/index"
    }
  },
  {
    "type": "category",
    "label": "studio/nodes/utility/graph.node",
    "items": [
      {
        "type": "doc",
        "id": "api/core/studio/nodes/utility/graph.node/classes/GraphNodeImpl",
        "label": "GraphNodeImpl"
      },
      {
        "type": "doc",
        "id": "api/core/studio/nodes/utility/graph.node/classes/SubGraphNodeImpl",
        "label": "SubGraphNodeImpl"
      },
      {
        "type": "doc",
        "id": "api/core/studio/nodes/utility/graph.node/type-aliases/GraphNode",
        "label": "GraphNode"
      }
    ],
    "link": {
      "type": "doc",
      "id": "api/core/studio/nodes/utility/graph.node/index"
    }
  },
  {
    "type": "category",
    "label": "studio/nodes/utility/if.node",
    "items": [
      {
        "type": "doc",
        "id": "api/core/studio/nodes/utility/if.node/classes/IfConditionNodeImpl",
        "label": "IfConditionNodeImpl"
      },
      {
        "type": "doc",
        "id": "api/core/studio/nodes/utility/if.node/classes/IfNodeImpl",
        "label": "IfNodeImpl"
      },
      {
        "type": "doc",
        "id": "api/core/studio/nodes/utility/if.node/type-aliases/IfNode",
        "label": "IfNode"
      }
    ],
    "link": {
      "type": "doc",
      "id": "api/core/studio/nodes/utility/if.node/index"
    }
  },
  {
    "type": "category",
    "label": "studio/nodes/utility/input.node",
    "items": [
      {
        "type": "doc",
        "id": "api/core/studio/nodes/utility/input.node/classes/InputNodeImpl",
        "label": "InputNodeImpl"
      },
      {
        "type": "doc",
        "id": "api/core/studio/nodes/utility/input.node/type-aliases/InputNode",
        "label": "InputNode"
      }
    ],
    "link": {
      "type": "doc",
      "id": "api/core/studio/nodes/utility/input.node/index"
    }
  },
  {
    "type": "category",
    "label": "studio/processor",
    "items": [
      {
        "type": "doc",
        "id": "api/core/studio/processor/classes/GraphProcessor",
        "label": "GraphProcessor"
      },
      {
        "type": "doc",
        "id": "api/core/studio/processor/interfaces/ProcessEvents",
        "label": "ProcessEvents"
      },
      {
        "type": "doc",
        "id": "api/core/studio/processor/type-aliases/GraphInputs",
        "label": "GraphInputs"
      },
      {
        "type": "doc",
        "id": "api/core/studio/processor/type-aliases/GraphOutputs",
        "label": "GraphOutputs"
      },
      {
        "type": "doc",
        "id": "api/core/studio/processor/type-aliases/NodeResults",
        "label": "NodeResults"
      },
      {
        "type": "doc",
        "id": "api/core/studio/processor/type-aliases/ProcessContext",
        "label": "ProcessContext"
      },
      {
        "type": "doc",
        "id": "api/core/studio/processor/type-aliases/ProcessDataMap",
        "label": "ProcessDataMap"
      },
      {
        "type": "doc",
        "id": "api/core/studio/processor/type-aliases/ProcessEvent",
        "label": "ProcessEvent"
      },
      {
        "type": "doc",
        "id": "api/core/studio/processor/type-aliases/ProcessId",
        "label": "ProcessId"
      },
      {
        "type": "doc",
        "id": "api/core/studio/processor/type-aliases/ProcessInputMap",
        "label": "ProcessInputMap"
      },
      {
        "type": "doc",
        "id": "api/core/studio/processor/type-aliases/ProcessOutputMap",
        "label": "ProcessOutputMap"
      },
      {
        "type": "doc",
        "id": "api/core/studio/processor/functions/validateProcessData",
        "label": "validateProcessData"
      },
      {
        "type": "doc",
        "id": "api/core/studio/processor/functions/validateProcessDataFromPorts",
        "label": "validateProcessDataFromPorts"
      }
    ],
    "link": {
      "type": "doc",
      "id": "api/core/studio/processor/index"
    }
  },
  {
    "type": "category",
    "label": "studio/registration/guardrails",
    "items": [
      {
        "type": "doc",
        "id": "api/core/studio/registration/guardrails/classes/GuardrailRegistration",
        "label": "GuardrailRegistration"
      },
      {
        "type": "doc",
        "id": "api/core/studio/registration/guardrails/interfaces/GuardrailImplConstructor",
        "label": "GuardrailImplConstructor"
      },
      {
        "type": "doc",
        "id": "api/core/studio/registration/guardrails/type-aliases/BuiltInGuardrailTypePairs",
        "label": "BuiltInGuardrailTypePairs"
      },
      {
        "type": "doc",
        "id": "api/core/studio/registration/guardrails/type-aliases/BuiltInGuardrailTypes",
        "label": "BuiltInGuardrailTypes"
      },
      {
        "type": "doc",
        "id": "api/core/studio/registration/guardrails/type-aliases/BuiltInGuardrails",
        "label": "BuiltInGuardrails"
      },
      {
        "type": "doc",
        "id": "api/core/studio/registration/guardrails/type-aliases/GuardrailOf",
        "label": "GuardrailOf"
      },
      {
        "type": "doc",
        "id": "api/core/studio/registration/guardrails/variables/globalGuardrailRegistry",
        "label": "globalGuardrailRegistry"
      },
      {
        "type": "doc",
        "id": "api/core/studio/registration/guardrails/functions/registerBuiltInGuardrails",
        "label": "registerBuiltInGuardrails"
      },
      {
        "type": "doc",
        "id": "api/core/studio/registration/guardrails/functions/resetGuardrailRegistry",
        "label": "resetGuardrailRegistry"
      }
    ],
    "link": {
      "type": "doc",
      "id": "api/core/studio/registration/guardrails/index"
    }
  },
  {
    "type": "category",
    "label": "studio/registration/nodes",
    "items": [
      {
        "type": "doc",
        "id": "api/core/studio/registration/nodes/classes/NodeRegistration",
        "label": "NodeRegistration"
      },
      {
        "type": "doc",
        "id": "api/core/studio/registration/nodes/interfaces/NodeImplConstructor",
        "label": "NodeImplConstructor"
      },
      {
        "type": "doc",
        "id": "api/core/studio/registration/nodes/type-aliases/BuiltInNodeTypePairs",
        "label": "BuiltInNodeTypePairs"
      },
      {
        "type": "doc",
        "id": "api/core/studio/registration/nodes/type-aliases/BuiltInNodeTypes",
        "label": "BuiltInNodeTypes"
      },
      {
        "type": "doc",
        "id": "api/core/studio/registration/nodes/type-aliases/BuiltInNodes",
        "label": "BuiltInNodes"
      },
      {
        "type": "doc",
        "id": "api/core/studio/registration/nodes/type-aliases/NodeOf",
        "label": "NodeOf"
      },
      {
        "type": "doc",
        "id": "api/core/studio/registration/nodes/variables/globalNodeRegistry",
        "label": "globalNodeRegistry"
      },
      {
        "type": "doc",
        "id": "api/core/studio/registration/nodes/functions/registerBuiltInNodes",
        "label": "registerBuiltInNodes"
      },
      {
        "type": "doc",
        "id": "api/core/studio/registration/nodes/functions/resetNodeRegistry",
        "label": "resetNodeRegistry"
      }
    ],
    "link": {
      "type": "doc",
      "id": "api/core/studio/registration/nodes/index"
    }
  },
  {
    "type": "category",
    "label": "studio/scheduler",
    "items": [
      {
        "type": "doc",
        "id": "api/core/studio/scheduler/classes/GraphScheduler",
        "label": "GraphScheduler"
      }
    ],
    "link": {
      "type": "doc",
      "id": "api/core/studio/scheduler/index"
    }
  },
  {
    "type": "category",
    "label": "studio/serde",
    "items": [
      {
        "type": "doc",
        "id": "api/core/studio/serde/type-aliases/SerializedGraph",
        "label": "SerializedGraph"
      },
      {
        "type": "doc",
        "id": "api/core/studio/serde/type-aliases/SerializedNode",
        "label": "SerializedNode"
      },
      {
        "type": "doc",
        "id": "api/core/studio/serde/type-aliases/SerializedRule",
        "label": "SerializedRule"
      },
      {
        "type": "doc",
        "id": "api/core/studio/serde/type-aliases/SerializedRuleCollection",
        "label": "SerializedRuleCollection"
      },
      {
        "type": "doc",
        "id": "api/core/studio/serde/type-aliases/SerializedRuleMetadata",
        "label": "SerializedRuleMetadata"
      }
    ],
    "link": {
      "type": "doc",
      "id": "api/core/studio/serde/index"
    }
  },
  {
    "type": "category",
    "label": "studio/ui",
    "items": [
      {
        "type": "doc",
        "id": "api/core/studio/ui/type-aliases/AudioUIContext",
        "label": "AudioUIContext"
      },
      {
        "type": "doc",
        "id": "api/core/studio/ui/type-aliases/BaseUIContext",
        "label": "BaseUIContext"
      },
      {
        "type": "doc",
        "id": "api/core/studio/ui/type-aliases/BlobUIContext",
        "label": "BlobUIContext"
      },
      {
        "type": "doc",
        "id": "api/core/studio/ui/type-aliases/CodeUIContext",
        "label": "CodeUIContext"
      },
      {
        "type": "doc",
        "id": "api/core/studio/ui/type-aliases/ConditionUI",
        "label": "ConditionUI"
      },
      {
        "type": "doc",
        "id": "api/core/studio/ui/type-aliases/ConditionUIContext",
        "label": "ConditionUIContext"
      },
      {
        "type": "doc",
        "id": "api/core/studio/ui/type-aliases/ContextUIContext",
        "label": "ContextUIContext"
      },
      {
        "type": "doc",
        "id": "api/core/studio/ui/type-aliases/ElseIfConditionUI",
        "label": "ElseIfConditionUI"
      },
      {
        "type": "doc",
        "id": "api/core/studio/ui/type-aliases/FileUIContext",
        "label": "FileUIContext"
      },
      {
        "type": "doc",
        "id": "api/core/studio/ui/type-aliases/IfConditionUI",
        "label": "IfConditionUI"
      },
      {
        "type": "doc",
        "id": "api/core/studio/ui/type-aliases/ImageUIContext",
        "label": "ImageUIContext"
      },
      {
        "type": "doc",
        "id": "api/core/studio/ui/type-aliases/MarkdownUIContext",
        "label": "MarkdownUIContext"
      },
      {
        "type": "doc",
        "id": "api/core/studio/ui/type-aliases/MessageUIContext",
        "label": "MessageUIContext"
      },
      {
        "type": "doc",
        "id": "api/core/studio/ui/type-aliases/OtherwiseConditionUI",
        "label": "OtherwiseConditionUI"
      },
      {
        "type": "doc",
        "id": "api/core/studio/ui/type-aliases/PlainUIContext",
        "label": "PlainUIContext"
      },
      {
        "type": "doc",
        "id": "api/core/studio/ui/type-aliases/UIContext",
        "label": "UIContext"
      },
      {
        "type": "doc",
        "id": "api/core/studio/ui/variables/UIDataTypesMap",
        "label": "UIDataTypesMap"
      },
      {
        "type": "doc",
        "id": "api/core/studio/ui/variables/audioTypes",
        "label": "audioTypes"
      },
      {
        "type": "doc",
        "id": "api/core/studio/ui/variables/extMap",
        "label": "extMap"
      },
      {
        "type": "doc",
        "id": "api/core/studio/ui/variables/fileTypes",
        "label": "fileTypes"
      },
      {
        "type": "doc",
        "id": "api/core/studio/ui/variables/imageTypes",
        "label": "imageTypes"
      }
    ],
    "link": {
      "type": "doc",
      "id": "api/core/studio/ui/index"
    }
  },
  {
    "type": "category",
    "label": "studio/utils/coerce",
    "items": [
      {
        "type": "doc",
        "id": "api/core/studio/utils/coerce/functions/coerceToData",
        "label": "coerceToData"
      },
      {
        "type": "doc",
        "id": "api/core/studio/utils/coerce/functions/coerceTypeOptional",
        "label": "coerceTypeOptional"
      },
      {
        "type": "doc",
        "id": "api/core/studio/utils/coerce/functions/expectTypeOptional",
        "label": "expectTypeOptional"
      }
    ],
    "link": {
      "type": "doc",
      "id": "api/core/studio/utils/coerce/index"
    }
  },
  {
    "type": "category",
    "label": "studio/utils/display",
    "items": [
      {
        "type": "doc",
        "id": "api/core/studio/utils/display/functions/displayConditionUI",
        "label": "displayConditionUI"
      },
      {
        "type": "doc",
        "id": "api/core/studio/utils/display/functions/displayUIFromDataFields",
        "label": "displayUIFromDataFields"
      },
      {
        "type": "doc",
        "id": "api/core/studio/utils/display/functions/displayUIFromSecretFields",
        "label": "displayUIFromSecretFields"
      }
    ],
    "link": {
      "type": "doc",
      "id": "api/core/studio/utils/display/index"
    }
  },
  {
    "type": "category",
    "label": "studio/utils/load",
    "items": [
      {
        "type": "doc",
        "id": "api/core/studio/utils/load/functions/loadGraph",
        "label": "loadGraph"
      },
      {
        "type": "doc",
        "id": "api/core/studio/utils/load/functions/loadGraphFromFile",
        "label": "loadGraphFromFile"
      }
    ],
    "link": {
      "type": "doc",
      "id": "api/core/studio/utils/load/index"
    }
  },
  {
    "type": "category",
    "label": "utils/nanoid",
    "items": [
      {
        "type": "doc",
        "id": "api/core/utils/nanoid/classes/IdProvider",
        "label": "IdProvider"
      },
      {
        "type": "doc",
        "id": "api/core/utils/nanoid/functions/getRecordId",
        "label": "getRecordId"
      }
    ],
    "link": {
      "type": "doc",
      "id": "api/core/utils/nanoid/index"
    }
  }
]};
module.exports = typedocSidebar.items;