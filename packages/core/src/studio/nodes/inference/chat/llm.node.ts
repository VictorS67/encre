import {
  type BaseLLM,
  type BaseLMInput,
  isLMInput,
} from '../../../../events/inference/chat/index.js';
import { type OpenAICallOptions } from '../../../../events/inference/chat/llms/openai/index.js';
import { OpenAI } from '../../../../events/inference/chat/llms/openai/text.js';
import { Gemini } from '../../../../events/inference/chat/llms/vertexai/gemini/text.js';
import { type GeminiCallOptions } from '../../../../events/inference/chat/llms/vertexai/index.js';
import {
  type Generation,
  type LLMResult,
} from '../../../../events/output/provide/index.js';
import { load } from '../../../../load/index.js';
import {
  globalImportMap,
  globalSecretMap,
} from '../../../../load/registration.js';
import { getRecordId } from '../../../../utils/nanoid.js';
import { type Data } from '../../../data.js';
import {
  type ProcessInputMap,
  type ProcessContext,
  type ProcessOutputMap,
} from '../../../processor.js';
import { type SerializedNode } from '../../../serde.js';
import { coerceToData } from '../../../utils/coerce.js';
import { CallableNodeImpl } from '../../base.js';
import { type CallableNode } from '../../index.js';

/**
 * A type alias for a specialized callable node focused on language model (LM) operations,
 * specifically leveraging large language models (LLMs).
 * This node type is designed to handle complex text generation and processing tasks.
 */
export type LLMNode = CallableNode<'llm', BaseLLM>;

/**
 * An abstract class providing a base implementation for LLM nodes.
 * This class extends the callable node implementation to provide specialized functionalities
 * for interacting with large language models.
 */
export abstract class LLMNodeImpl extends CallableNodeImpl<LLMNode> {
  /**
   * Deserializes a serialized llm node representation into an executable llm node,
   * reconstituting the node with its operational parameters and data.
   *
   * @param serialized The serialized node data.
   * @returns A promise resolving to a deserialized llm node.
   */
  static async deserialize(serialized: SerializedNode): Promise<LLMNode> {
    const subType: string = serialized.subType;

    switch (subType) {
      case 'openai':
        return OpenAINodeImpl.deserialize(serialized);
      case 'gemini':
        return GeminiNodeImpl.deserialize(serialized);
      default:
        throw new Error('Plugin node is unsupported for now');
    }
  }

  /**
   * Preprocesses the input data to ensure it is in a valid format for the language model.
   * This step ensures that the input data is either a string or an array of chat messages,
   * suitable for processing by the language model.
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
   * Postprocesses the raw outputs from the language model, extracting the generated text
   * and any associated metadata such as token usage.
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
    const gen: Generation = generations[0];

    const output: string = gen.output as string;
    const info: Record<string, unknown> | undefined = gen.info;

    if (!llmOutput) {
      return {
        output: coerceToData(output),
        info: coerceToData(info),
        tokenUsage: coerceToData(undefined),
      };
    }

    return {
      output: coerceToData(output),
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
 * Implementation of an LLMNode specifically using OpenAI's language models.
 * This node handles the interaction with OpenAI's text models such as "text-davinci-003",
 * producing text responses based on provided prompts.
 *
 * ### Node Properties
 *
 * | Field       | Type              | Description                                                                      |
 * |-------------|-------------------|----------------------------------------------------------------------------------|
 * | `type`      | `'llm'`           | The type of the node, indicating it handles language model interactions.         |
 * | `subType`   | `'openai'`        | The subtype of the node, specifying that it uses OpenAI's language models.        |
 * | `data`      | {@link OpenAI}    | The callable used for interacting with OpenAI's language models.                  |
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
 * | `output`     | `string`                  | Outputs the text response from the model.                          |
 * | `info`       | `object`, `unknown`       | Outputs additional information about the generation, if available. |
 * | `tokenUsage` | `object`, `unknown`       | Outputs information on token usage during the generation process.  |
 *
 */
export class OpenAINodeImpl extends LLMNodeImpl {
  /**
   * Creates a LLMNode configuration from a OpenAI callable instance.
   * @param callable An instance of OpenAI defining the interaction logic with OpenAI's models.
   * @returns A fully configured LLMNode specialized for OpenAI operations.
   */
  static nodeFrom(callable: OpenAI): LLMNode {
    return {
      id: getRecordId(),
      type: 'llm',
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
        info: ['object', 'unknown'],
        tokenUsage: ['object', 'unknown'],
      },
    };
  }

  /**
   * Factory method to create a new instance of LLMNode.
   * This method initializes a new node with a OpenAI instance configured
   * for a specific model and API integration, providing a tailored approach to text generation.
   *
   * @returns An instance of OpenAI prepared with a OpenAI configured for openai's model.
   */
  static create(): LLMNode {
    const openai = new OpenAI({
      modelName: 'text-davinci-003',
      openAIApiKey: 'openai-secret-placeholder',
      maxTokens: 2048,
    });

    const node: LLMNode = OpenAINodeImpl.nodeFrom(openai);

    return node;
  }

  static async deserialize(serialized: SerializedNode): Promise<LLMNode> {
    const {
      id,
      type,
      subType,
      registerArgs,
      data,
      visualInfo,
      inputs,
      outputs,
      runtime,
      memory,
      outputSizes,
    } = serialized;

    if (type !== 'llm') {
      throw new Error(`CANNOT deserialize this type in llm node: ${type}`);
    }

    const openaiStr = JSON.stringify(data);
    const openai = await load<OpenAI>(
      openaiStr,
      globalSecretMap,
      globalImportMap
    );

    return {
      id,
      type,
      subType,
      registerArgs,
      data: openai,
      visualInfo,
      inputs,
      outputs,
      runtime,
      memory,
      outputSizes,
    };
  }

  /**
   * Main process method that orchestrates the full lifecycle of text generation using OpenAI's language model.
   * This method integrates input validation, preprocessing, language model invocation, and postprocessing,
   * ensuring a seamless interaction tailored to the specifics of the OpenAI model capabilities.
   *
   * @param inputs A map containing all inputs to the node.
   * @param context The current processing context.
   * @returns A map of outputs as processed by the node, including the generated output, any additional information, and token usage details.
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
      OpenAICallOptions
    >(rawInputs);

    return this._postprocess(rawOutputs, context);
  }
}

/**
 * Implementation of an LLMNode specifically using Gemini's language models.
 * This node facilitates interactions with Gemini's advanced language models, known as "gemini-pro",
 * for generating text based on input prompts. It supports integrations with Google APIs, leveraging
 * specific API keys for enhanced functionalities.
 *
 * ### Node Properties
 *
 * | Field       | Type          | Description                                                                      |
 * |-------------|---------------|----------------------------------------------------------------------------------|
 * | `type`      | `'llm'`       | The type of the node, indicating it handles language model interactions.         |
 * | `subType`   | `'gemini'`    | The subtype of the node, specifying that it uses Gemini's language models.       |
 * | `data`      | {@link Gemini}| The callable used for interacting with Gemini's language models.                  |
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
 * | `output`     | `string`                  | Outputs the text response generated by the model.                  |
 * | `info`       | `object`                  | Outputs detailed information about the generation process.         |
 * | `tokenUsage` | `object`, `unknown`       | Outputs information on token usage during the generation process.  |
 *
 */
export class GeminiNodeImpl extends LLMNodeImpl {
  /**
   * Creates an LLMNode configuration from a Gemini callable instance.
   * @param callable An instance of Gemini defining the interaction logic with Gemini's language models.
   * @returns A fully configured LLMNode specialized for Gemini operations.
   */
  static nodeFrom(callable: Gemini): LLMNode {
    return {
      id: getRecordId(),
      type: 'llm',
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
        info: 'object',
        tokenUsage: ['object', 'unknown'],
      },
    };
  }

  /**
   * Factory method to create a new instance of LLMNode.
   * This method initializes a new node with a Gemini instance configured for the "gemini-pro" model,
   * providing a tailored approach to text generation that incorporates Google API integrations.
   *
   * @returns An instance of LLMNode prepared with a Gemini configured for advanced language model operations.
   */
  static create(): LLMNode {
    const gemini = new Gemini({
      modelName: 'gemini-pro',
      googleApiKey: 'google-secret-placeholder',
      maxOutputTokens: 2048,
    });

    const node: LLMNode = GeminiNodeImpl.nodeFrom(gemini);

    return node;
  }

  static async deserialize(serialized: SerializedNode): Promise<LLMNode> {
    const {
      id,
      type,
      subType,
      registerArgs,
      data,
      visualInfo,
      inputs,
      outputs,
      runtime,
      memory,
      outputSizes,
    } = serialized;

    if (type !== 'llm') {
      throw new Error(`CANNOT deserialize this type in llm node: ${type}`);
    }

    const geminiStr = JSON.stringify(data);
    const gemini = await load<Gemini>(
      geminiStr,
      globalSecretMap,
      globalImportMap
    );

    return {
      id,
      type,
      subType,
      registerArgs,
      data: gemini,
      visualInfo,
      inputs,
      outputs,
      runtime,
      memory,
      outputSizes,
    };
  }

  /**
   * Main process method that orchestrates the full lifecycle of text generation using Gemini's language model.
   * This method integrates input validation, preprocessing, language model invocation, and postprocessing,
   * ensuring a seamless interaction tailored to the specifics of the Gemini model capabilities.
   *
   * @param inputs A map containing all inputs to the node.
   * @param context The current processing context.
   * @returns A map of outputs as processed by the node, including the generated output, additional information, and token usage details.
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
