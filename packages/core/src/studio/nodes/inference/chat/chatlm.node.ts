import {
  BaseChatLM,
  BaseLMInput,
  isLMInput,
} from '../../../../events/inference/chat/base.js';
import { OpenAIChat } from '../../../../events/inference/chat/llms/openai/chat.js';
import { OpenAIChatCallOptions } from '../../../../events/inference/chat/llms/openai/index.js';
import { GeminiChat } from '../../../../events/inference/chat/llms/vertexai/gemini/chat.js';
import { GeminiCallOptions } from '../../../../events/inference/chat/llms/vertexai/index.js';
import { BaseMessage } from '../../../../events/input/load/msgs/base.js';
import { LLMResult } from '../../../../events/output/provide/llmresult.js';
import { ChatGenerationChunk } from '../../../../events/output/provide/message.js';
import { getRecordId } from '../../../../utils/nanoid.js';
import { Data } from '../../../data.js';
import {
  ProcessInputMap,
  ProcessContext,
  ProcessOutputMap,
} from '../../../processor.js';
import { coerceToData } from '../../../utils/coerce.js';
import { CallableNodeImpl } from '../../base.js';
import { CallableNode } from '../../index.js';

/**
 * A type alias for a specialized callable node focused on chat language model (ChatLM) operations.
 * This node type is specialized for handling interactions using a language model to generate chat responses.
 */
export type ChatLMNode = CallableNode<'chatlm', BaseChatLM>;

/**
 * An abstract class providing a base implementation for chat language model nodes.
 * This class extends the callable node implementation to provide specialized
 * functionalities for chat generation using language models.
 */
export abstract class ChatLMNodeImpl extends CallableNodeImpl<ChatLMNode> {
  /**
   * Preprocesses the input data to ensure it is in a valid format for the language model.
   * This step ensures that the input data is either a string or an array of chat messages.
   *
   * @param inputs The map containing input data for the node.
   * @param context The processing context, not actively used here.
   * @returns The validated and cast input data as BaseLMInput.
   * @throws Error if the inputs are not valid.
   * @internal
   */
  protected async _preprocess(
    inputs: ProcessInputMap,
    context: ProcessContext
  ): Promise<BaseLMInput> {
    const prompt: Data | undefined = inputs['prompt'];

    if (
      !prompt ||
      !(prompt.type === 'string' || prompt.type === 'chat-message[]')
    ) {
      throw new Error(
        `${this.type} Node ${this.title} failed in preprocess because of invalid inputs.`
      );
    }

    return prompt.value;
  }

  /**
   * Postprocesses the raw outputs from the language model, extracting the generated chat responses
   * and any associated metadata.
   *
   * @param rawOutputs The raw outputs from the language model invocation.
   * @param context The processing context, not actively used here.
   * @returns A map of process outputs keyed by their output port names.
   * @internal
   */
  protected async _postprocess(
    rawOutputs: LLMResult,
    context: ProcessContext
  ): Promise<ProcessOutputMap> {
    const { generations, llmOutput } = rawOutputs;
    const gen: ChatGenerationChunk = generations[0] as ChatGenerationChunk;

    const output: string = gen.output;
    const message: BaseMessage = gen.message;
    const info: Record<string, unknown> | undefined = gen.info;

    if (!llmOutput) {
      return {
        output: coerceToData(output),
        message: coerceToData(message),
        info: coerceToData(info),
        tokenUsage: coerceToData(undefined),
      };
    }

    return {
      output: coerceToData(output),
      message: coerceToData(message),
      info: coerceToData(info),
      tokenUsage: coerceToData(llmOutput['tokenUsage']),
    };
  }

  /**
   * Invokes the language model with the given input under the provided options.
   * This method directly interfaces with the language model's callable mechanism.
   *
   * @param input The input data for the language model, expected to be BaseLMInput.
   * @param options Optional additional settings for the language model call.
   * @returns The output from the language model as specified by the callable's output type.
   */
  async invoke<CallInput, CallOutput, CallOptions>(
    input: CallInput,
    options?: Partial<CallOptions> | undefined
  ): Promise<CallOutput> {
    if (!isLMInput(input)) {
      throw new Error(
        `${this.type} Node ${this.title} failed in invoke because of invalid inputs.`
      );
    }

    return this.data.invoke(input, options) as CallOutput;
  }
}

/**
 * Implementation of a ChatLMNode specifically using OpenAI's language models.
 * This node handles the interaction with OpenAI's chat models like gpt-3.5-turbo,
 * producing chat responses based on provided prompts.
 *
 * ### Node Properties
 *
 * | Field       | Type                | Description                                                                      |
 * |-------------|---------------------|----------------------------------------------------------------------------------|
 * | `type`      | `'chatlm'`          | The type of the node, indicating it handles chat interactions via language models.|
 * | `subType`   | `'openai'`          | The subtype of the node, specifying that it uses OpenAI's language models.        |
 * | `data`      | {@link OpenAIChat}  | The callable used for interacting with OpenAI's language models.                  |
 *
 * ### Input Ports
 *
 * | Port Name   | Supported Types          | Description                                                         |
 * |-------------|--------------------------|---------------------------------------------------------------------|
 * | `prompt`    | `string`, `chat-message[]` | Accepts a string or an array of chat messages as input to the model.|
 *
 * ### Output Ports
 *
 * | Port Name    | Supported Types           | Description                                                         |
 * |--------------|---------------------------|---------------------------------------------------------------------|
 * | `output`     | `string`                  | Outputs the string response from the chat model.                    |
 * | `message`    | `chat-message`            | Outputs the chat message object as a structured response.           |
 * | `info`       | `object`, `unknown`       | Outputs additional information about the generation, if available.  |
 * | `tokenUsage` | `object`, `unknown`       | Outputs information on token usage during the generation process.   |
 *
 */
export class OpenAIChatNodeImpl extends ChatLMNodeImpl {
  /**
   * Creates a ChatLMNode configuration from a OpenAIChat callable instance.
   * @param callable An instance of OpenAIChat defining the openai chat model.
   * @returns A fully configured ChatLMNode specialized for openai chat model.
   */
  static nodeFrom(callable: OpenAIChat): ChatLMNode {
    return {
      id: getRecordId(),
      type: 'chatlm',
      subType: 'openai',
      data: callable,
      visualInfo: {
        position: {
          x: 0,
          y: 0,
        },
        size: {
          width: 300,
          height: 500,
        },
      },
      inputs: {
        prompt: ['string', 'chat-message[]'],
      },
      outputs: {
        output: 'string',
        message: 'chat-message',
        info: ['object', 'unknown'],
        tokenUsage: ['object', 'unknown'],
      },
    };
  }

  /**
   * Factory method to create a new instance of ChatLMNode.
   * This method provides a simple way to instantiate a chatlm node with default settings,
   * preparing it for use in requesting openai chat model.
   *
   * @returns An instance of ChatLMNode prepared with a default OpenAIChat.
   */
  static create(): ChatLMNode {
    const openaiChat = new OpenAIChat({
      modelName: 'gpt-3.5-turbo',
      maxTokens: 2048,
    });

    const node: ChatLMNode = OpenAIChatNodeImpl.nodeFrom(openaiChat);

    return node;
  }

  /**
   * Main process method that orchestrates the full lifecycle of chat generation using a language model.
   * This method integrates input validation, preprocessing, language model invocation, and postprocessing.
   *
   * @param inputs A map containing all inputs to the node.
   * @param context The current processing context.
   * @returns A map of outputs as processed by the node, including the generated output, any structured messages, and additional info.
   * @throws Error if inputs are not valid or if any stage of processing fails.
   */
  async process(
    inputs: ProcessInputMap,
    context: ProcessContext
  ): Promise<ProcessOutputMap> {
    if (!this.validateInputs(inputs)) {
      throw new Error(`${this.type} Node ${this.title} has invalid inputs`);
    }

    const rawInputs: BaseLMInput = await this._preprocess(inputs, context);

    const rawOutputs: LLMResult = await this.invoke<
      BaseLMInput,
      LLMResult,
      OpenAIChatCallOptions
    >(rawInputs);

    return this._postprocess(rawOutputs, context);
  }
}

/**
 * Implementation of a ChatLMNode specifically using Gemini's language models.
 * This node handles interactions with Gemini's chat models, such as "gemini-pro-vision",
 * to produce chat responses based on provided prompts. It is tailored to integrate with Gemini's
 * API capabilities, including using a Google API key for certain integrations.
 *
 * ### Node Properties
 *
 * | Field       | Type             | Description                                                                      |
 * |-------------|------------------|----------------------------------------------------------------------------------|
 * | `type`      | `'chatlm'`       | The type of the node, indicating it handles chat interactions via language models.|
 * | `subType`   | `'gemini'`       | The subtype of the node, specifying that it uses Gemini's language models.        |
 * | `data`      | {@link GeminiChat} | The callable used for interacting with Gemini's language models.                 |
 *
 * ### Input Ports
 *
 * | Port Name   | Supported Types          | Description                                                         |
 * |-------------|--------------------------|---------------------------------------------------------------------|
 * | `prompt`    | `string`, `chat-message[]` | Accepts a string or an array of chat messages as input to the model.|
 *
 * ### Output Ports
 *
 * | Port Name    | Supported Types           | Description                                                         |
 * |--------------|---------------------------|---------------------------------------------------------------------|
 * | `output`     | `string`                  | Outputs the string response from the chat model.                    |
 * | `message`    | `chat-message`            | Outputs the chat message object as a structured response.           |
 * | `info`       | `object`, `unknown`       | Outputs additional information about the generation, if available.  |
 * | `tokenUsage` | `object`, `unknown`       | Outputs information on token usage during the generation process.   |
 *
 */
export class GeminiChatNodeImpl extends ChatLMNodeImpl {
  /**
   * Creates a ChatLMNode configuration from a GeminiChat callable instance.
   * @param callable An instance of GeminiChat defining the interaction logic with Gemini's chat models.
   * @returns A fully configured ChatLMNode specialized for Gemini operations.
   */
  static nodeFrom(callable: GeminiChat): ChatLMNode {
    return {
      id: getRecordId(),
      type: 'chatlm',
      subType: 'gemini',
      data: callable,
      visualInfo: {
        position: {
          x: 0,
          y: 0,
        },
        size: {
          width: 300,
          height: 500,
        },
      },
      inputs: {
        prompt: ['string', 'chat-message[]'],
      },
      outputs: {
        output: 'string',
        message: 'chat-message',
        info: ['object', 'unknown'],
        tokenUsage: ['object', 'unknown'],
      },
    };
  }

  /**
   * Factory method to create a new instance of ChatLMNode.
   * This method initializes a new node with a GeminiChat instance configured
   * for a specific model and API integration, providing a tailored approach to chat generation.
   *
   * @returns An instance of ChatLMNode prepared with a GeminiChat configured for "gemini-pro-vision" model.
   */
  static create(): ChatLMNode {
    const geminiChat = new GeminiChat({
      modelName: 'gemini-pro-vision',
      googleApiKey: 'google-secret-placeholder',
      maxOutputTokens: 2048,
    });

    const node: ChatLMNode = GeminiChatNodeImpl.nodeFrom(geminiChat);

    return node;
  }

  /**
   * Main process method that orchestrates the full lifecycle of chat generation using Gemini's language model.
   * This method integrates input validation, preprocessing, language model invocation, and postprocessing,
   * ensuring a seamless interaction tailored to the specifics of the Gemini model capabilities.
   *
   * @param inputs A map containing all inputs to the node.
   * @param context The current processing context.
   * @returns A map of outputs as processed by the node, including the generated output, any structured messages, and additional info.
   * @throws Error if inputs are not valid or if any stage of processing fails.
   */
  async process(
    inputs: ProcessInputMap,
    context: ProcessContext
  ): Promise<ProcessOutputMap> {
    if (!this.validateInputs(inputs)) {
      throw new Error(`${this.type} Node ${this.title} has invalid inputs`);
    }

    const rawInputs: BaseLMInput = await this._preprocess(inputs, context);

    const rawOutputs: LLMResult = await this.invoke<
      BaseLMInput,
      LLMResult,
      GeminiCallOptions
    >(rawInputs);

    return this._postprocess(rawOutputs, context);
  }
}
