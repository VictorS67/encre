import { OpenAIEmbeddings } from '../events/embeddings/index.js';
import { OpenAIChat } from '../events/inference/chat/llms/openai/chat.js';
import { OpenAI } from '../events/inference/chat/llms/openai/text.js';
import { GeminiChat } from '../events/inference/chat/llms/vertexai/gemini/chat.js';
import { Gemini } from '../events/inference/chat/llms/vertexai/gemini/text.js';
import { VectorStoreRetriever } from '../events/inference/retrieve/embedding/vectorstore.js';
import { ArrayRule } from '../events/inference/validate/guardrails/array.js';
import { BooleanRule } from '../events/inference/validate/guardrails/boolean.js';
import { NumberRule } from '../events/inference/validate/guardrails/number.js';
import { JSONObjectRule } from '../events/inference/validate/guardrails/object.js';
import { StringRule } from '../events/inference/validate/guardrails/string.js';
import { VariableValidator } from '../events/inference/validate/validators/variable.js';
import { PDFLoader } from '../events/input/load/docs/pdf.js';
import { BotMessage } from '../events/input/load/msgs/bot.js';
import { ChatMessage } from '../events/input/load/msgs/chat.js';
import { FunctionMessage } from '../events/input/load/msgs/function.js';
import { HumanMessage } from '../events/input/load/msgs/human.js';
import { SystemMessage } from '../events/input/load/msgs/system.js';
import { ChatPrompt } from '../events/input/load/prompts/chat.js';
import {
  StringPrompt,
  StringPromptTemplate,
} from '../events/input/load/prompts/text.js';
import { BaseRuleCollection } from '../events/input/load/rules/base.js';
import { ChromaVectorStore } from '../events/input/load/vectorstore/chroma.js';
import {
  RecursiveTextSplitter,
  TextSplitter,
  TokenTextSplitter,
} from '../events/input/transform/splitter.js';
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
  'studio/input': { BaseInput }
};

const globalSecretMap: SecretMap = {
  GOOGLE_API_KEY: 'google-secret-placeholder',
  OPENAI_API_KEY: 'openai-secret-placeholder',
  OPENAI_ORGANIZATION: 'openai-org-placeholder',
};

export { globalImportMap, globalSecretMap };
