import { type BaseMessage, HumanMessage } from '../msgs/index.js';
import {
  BasePrompt,
  BasePromptTemplate,
  type BasePromptTemplateInput,
  type PromptTemplateParams,
} from './base.js';

/**
 * A concrete implementation of BasePrompt for text-based prompts. This class stores a string value
 * and provides methods to output this value as a string or a chat message.
 */
export class StringPrompt extends BasePrompt {
  _isSerializable = true;

  static _name(): string {
    return 'StringPrompt';
  }

  /**
   * The textual value of the prompt.
   */
  value: string;

  /**
   * Constructs a new StringPrompt instance.
   * @param value The string value of the prompt.
   */
  constructor(value: string, ...args) {
    super({ value, ...args });
    this.value = value;
  }

  _promptType(): string {
    return 'text';
  }

  /**
   * Returns the string value of the prompt.
   * @returns The string value.
   */
  toString(): string {
    return this.value;
  }

  /**
   * Converts this prompt into an array of chat messages.
   * @returns An array containing a single HumanMessage with the prompt's value.
   */
  toChatMessages(): BaseMessage[] {
    return [new HumanMessage(this.value)];
  }
}

/**
 * Interface defining additional parameters for StringPromptTemplate.
 */
export interface StringPromptTemplateParams extends PromptTemplateParams {
  /**
   * Optional prefix to be added before the formatted template string.
   */
  prefix?: string;

  /**
   * Optional suffix to be added after the formatted template string.
   */
  suffix?: string;
}

/**
 * A template class for creating string-based prompts, capable of formatting input data into a structured prompt
 * using a template with optional prefix and suffix.
 */
export class StringPromptTemplate
  extends BasePromptTemplate<BasePromptTemplateInput, StringPrompt>
  implements StringPromptTemplateParams
{
  _isSerializable = true;

  static _name(): string {
    return 'StringPromptTemplate';
  }

  /**
   * Optional prefix to be added before the formatted template string.
   */
  prefix?: string;

  /**
   * Optional suffix to be added after the formatted template string.
   */
  suffix?: string;

  constructor(fields: Partial<StringPromptTemplateParams>) {
    super(fields);

    this.prefix = fields.prefix;
    this.suffix = fields.suffix;
  }

  _templateType(): string {
    return 'text';
  }

  /**
   * Formats the input data into a string based on the template, with any specified prefix or suffix.
   * @param input The input data containing variables for the template.
   * @returns A promise resolving to the fully formatted string.
   * @throws Error if a required variable is missing in the input.
   * @example
   * const template = new StringPromptTemplate({
   *   template: "Hello, {{name}}!",
   *   inputVariables: ["name"],
   *   prefix: "Greeting: ",
   *   suffix: " Have a nice day."
   * });
   * const formatted = await template.format({ name: "John" });
   * console.log(formatted);
   * // Outputs: "Greeting: Hello, John! Have a nice day."
   */
  async format(input: BasePromptTemplateInput): Promise<string> {
    let formattedTemplate: string = this.template;

    // Iterate through each input variable and replace placeholders with actual values
    this.inputVariables?.forEach((variable: string) => {
      if (!Object.prototype.hasOwnProperty.call(input, variable)) {
        // If a required variable is missing in the input, throw an error
        throw new Error(`Missing value for variable '${variable}'`);
      }

      const regex = new RegExp(`\\{\\{${variable}\\}\\}`, 'g');
      formattedTemplate = formattedTemplate.replace(
        regex,
        String(input[variable])
      );
    });

    return [this.prefix ?? '', formattedTemplate, this.suffix ?? ''].join('');
  }

  /**
   * Formats the input data and creates a StringPrompt from the resulting string.
   * @param input The input data containing variables for the template.
   * @returns A promise resolving to a StringPrompt constructed from the formatted string.
   */
  async formatPrompt(input: BasePromptTemplateInput): Promise<StringPrompt> {
    const formattedPrompt: string = await this.format(input);

    return new StringPrompt(formattedPrompt);
  }
}
