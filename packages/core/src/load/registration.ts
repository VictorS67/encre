import { OpenAIEmbeddings } from '../events/embeddings/index.js';
import { OpenAIChat } from '../events/inference/chat/llms/openai/chat.js';
import { OpenAI } from '../events/inference/chat/llms/openai/text.js';
import { GeminiChat } from '../events/inference/chat/llms/vertexai/gemini/chat.js';
import { Gemini } from '../events/inference/chat/llms/vertexai/gemini/text.js';
import { VectorStoreRetriever } from '../events/inference/retrieve/embedding/vectorstore.js';
import {
  ArrayRule,
  BooleanRule,
  NumberRule,
  JSONObjectRule,
  StringRule,
} from '../events/inference/validate/guardrails/index.js';
import { VariableValidator } from '../events/inference/validate/validators/index.js';
import { PDFLoader } from '../events/input/load/docs/index.js';
import {
  BotMessage,
  ChatMessage,
  FunctionMessage,
  HumanMessage,
  SystemMessage,
} from '../events/input/load/msgs/index.js';
import {
  ChatPrompt,
  StringPrompt,
  StringPromptTemplate,
} from '../events/input/load/prompts/index.js';
import { BaseRuleCollection } from '../events/input/load/rules/index.js';
import { ChromaVectorStore } from '../events/input/load/vectorstore/index.js';
import {
  RecursiveTextSplitter,
  TextSplitter,
  TokenTextSplitter,
} from '../events/input/transform/index.js';
import { IfCondition } from '../studio/condition.js';
import { BaseInput } from '../studio/input.js';
import { OptionalImportMap, SecretMap } from './importType.js';

const globalImportMap: OptionalImportMap = {
  'events/embeddings/openai': { OpenAIEmbeddings },
  'events/input/load/docs/pdf': { PDFLoader },
  'events/input/load/msgs/human': { HumanMessage },
  'events/input/load/msgs/bot': { BotMessage },
  'events/input/load/msgs/system': { SystemMessage },
  'events/input/load/msgs/function': { FunctionMessage },
  'events/input/load/msgs/general': { ChatMessage },
  'events/input/load/prompts/text': { StringPrompt, StringPromptTemplate },
  'events/input/load/prompts/chat': { ChatPrompt },
  'events/input/load/rules': { BaseRuleCollection },
  'events/input/load/vectorstore/chroma': { ChromaVectorStore },
  'events/input/transform/splitter': {
    TextSplitter,
    RecursiveTextSplitter,
    TokenTextSplitter,
  },
  'events/inference/validate/guardrails/string': { StringRule },
  'events/inference/validate/guardrails/number': { NumberRule },
  'events/inference/validate/guardrails/boolean': { BooleanRule },
  'events/inference/validate/guardrails/object': { JSONObjectRule },
  'events/inference/validate/guardrails/array': { ArrayRule },
  'events/inference/validate/validator': { VariableValidator },
  'events/inference/chat/llms/openai': { OpenAI },
  'events/inference/chat/chatlms/openai': { OpenAIChat },
  'events/inference/chat/llms/gemini': { Gemini },
  'events/inference/chat/chatlms/gemini': { GeminiChat },
  'events/inference/retrieve/embedding/vectorstore': { VectorStoreRetriever },
  'studio/condition': { IfCondition },
  'studio/input': { BaseInput },
};

const globalSecretMap: SecretMap = {
  // GOOGLE_API_KEY: 'google-secret-placeholder',
  // OPENAI_API_KEY: 'openai-secret-placeholder',
  // OPENAI_ORGANIZATION: 'openai-org-placeholder',
};

export { globalImportMap, globalSecretMap };
