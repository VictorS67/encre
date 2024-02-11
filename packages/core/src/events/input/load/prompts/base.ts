import { Serializable } from '../../../../load/serializable.js';
import { CallableConfig } from '../../../../record/callable.js';
import { VariableValidator } from '../../../../utils/promptTemplateValidator/variableValidator.js';
import { BaseEvent, BaseEventParams } from '../../../base.js';
import { BaseMessage } from '../msgs/base.js';

export abstract class BasePrompt extends Serializable {
  _isSerializable = false;

  _namespace: string[] = ['input', 'load', 'prompts', this._promptType()];

  abstract _promptType(): string;

  abstract toString(): string;

  abstract toChatMessages(): BaseMessage[];
}

export interface PromptTemplateParams extends BaseEventParams {
  /**
   * the template string
   */
  template: string;

  /**
   * Clearly declare the input variables inside the template
   */
  inputVariables: string[];

  partialVariables: string[];

  validator?: VariableValidator;
}

export interface BasePromptTemplateInput {
  [key: string]: unknown;
};

export abstract class BasePromptTemplate<
    CallInput extends BasePromptTemplateInput = BasePromptTemplateInput,
    CallOutput extends BasePrompt = BasePrompt,
    CallOptions extends CallableConfig = CallableConfig,
  >
  extends BaseEvent<CallInput, CallOutput, CallOptions>
  implements PromptTemplateParams
{
  _namespace: string[] = ['input', 'load', 'prompts', this._templateType()];

  static _name(): string {
    return 'BasePromptTemplate';
  }

  template = '';

  inputVariables: string[] = [];

  partialVariables: string[] = [];

  validator?: VariableValidator;

  constructor(fields?: Partial<PromptTemplateParams>) {
    super(fields ?? {});

    this.template = fields?.template ?? this.template;

    this.inputVariables = fields?.inputVariables ?? this.inputVariables;
    this.partialVariables = fields?.partialVariables ?? this.partialVariables;

    this.validator = fields?.validator ?? this.validator;

    if (this.template && this.inputVariables) {
      this._isInputExists(this.template, this.inputVariables);
    }
  }

  abstract _templateType(): string;

  /**
   * To validate whether the inputVariables is valid
   * @param template
   * @param inputVariables
   */
  private _isInputExists(template: string, inputVariables: string[]): void {
    const variablePattern = /\{\{([^}]+)\}\}/g;
    let match: RegExpExecArray | null;
    const foundVariables: Set<string> = new Set();

    while ((match = variablePattern.exec(template)) !== null) {
      foundVariables.add(match[1]);
    }

    inputVariables.forEach((variable) => {
      if (!foundVariables.has(variable)) {
        throw new Error(
          `Variable '${variable}' is declared but not used in the template.`
        );
      }
    });
  }

  async invoke(
    input: CallInput,
    options?: Partial<CallOptions>
  ): Promise<CallOutput> {
    if (!this.validate(input)) {
      throw new Error('the validation for inputValue failed');
    }

    return this.formatPrompt(input);
  }

  validate(input: CallInput): boolean {
    if (this.validator) {
      const validationResult = this.validator.validate(input);
      if (!validationResult.isValid) {
        return false;
      }
    }
    return true;
  }

  abstract format(input: CallInput): Promise<string>;

  abstract formatPrompt(input: CallInput): Promise<CallOutput>;
}
