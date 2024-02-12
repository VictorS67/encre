import { BaseMessage, HumanMessage } from '../msgs/base.js';
import {
  BasePrompt,
  BasePromptTemplate,
  BasePromptTemplateInput,
  PromptTemplateParams,
} from './base.js';

export class StringPrompt extends BasePrompt {
  _isSerializable = true;

  static _name(): string {
    return 'StringPrompt';
  }

  value: string;

  constructor(value: string, ...args) {
    super({
      value,
      ...args,
    });
    this.value = value;
  }

  _promptType(): string {
    return 'text';
  }

  toString(): string {
    return this.value;
  }

  toChatMessages(): BaseMessage[] {
    return [new HumanMessage(this.value)];
  }
}

export interface StringPromptTemplateParams extends PromptTemplateParams {
  prefix?: string;
  suffix?: string;
}

export class StringPromptTemplate
  extends BasePromptTemplate<BasePromptTemplateInput, StringPrompt>
  implements StringPromptTemplateParams
{
  _isSerializable = true;

  static _name(): string {
    return 'StringPromptTemplate';
  }

  prefix?: string;

  suffix?: string;

  constructor(fields: Partial<StringPromptTemplateParams>) {
    super(fields);

    this.prefix = fields.prefix;
    this.suffix = fields.suffix;
  }

  _templateType(): string {
    return 'text';
  }

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

  async formatPrompt(input: BasePromptTemplateInput): Promise<StringPrompt> {
    const formattedPrompt: string = await this.format(input);

    return new StringPrompt(formattedPrompt);
  }
}
