import { Serializable } from '../../../../load/serializable.js';
import { CallableConfig } from '../../../../record/callable.js';
import { BaseEvent, BaseEventParams } from '../../../base.js';
import { ValidateResult } from '../../../inference/validate/index.js';
import {
  VariableRules,
  VariableValidator,
} from '../../../inference/validate/validators/variable.js';
import { BaseMessage } from '../msgs/base.js';

/**
 * Abstract base class representing a generic prompt. This class must be extended to provide specific types of prompts.
 * The class is serializable and defines the namespace and type of the prompt.
 */
export abstract class BasePrompt extends Serializable {
  _isSerializable = false;

  _namespace: string[] = [
    'events',
    'input',
    'load',
    'prompts',
    this._promptType(),
  ];

  /**
   * Abstract method to return the specific type of prompt.
   * @returns The prompt type as a string.
   */
  abstract _promptType(): string;

  /**
   * Converts the prompt to a string representation.
   * @returns A string representing the prompt.
   */
  abstract toString(): string;

  /**
   * Converts the prompt to an array of chat messages.
   * @returns An array of BaseMessage instances representing the prompt in chat form.
   */
  abstract toChatMessages(): BaseMessage[];
}

/**
 * Interface defining the parameters for prompt templates.
 */
export interface PromptTemplateParams extends BaseEventParams {
  /**
   * Template string used to generate prompts.
   */
  template: string;

  /**
   * List of input variables explicitly declared, used within the template.
   */
  inputVariables: string[];

  /**
   * Optional rules for validating the input variables.
   */
  guardrails?: VariableRules;
}

/**
 * Interface defining the template input, keys are the input names,
 * values are corresponding input values.
 */
export interface BasePromptTemplateInput {
  [key: string]: unknown;
}

/**
 * Abstract base class for prompt templates that generate specific types of prompts based on input data.
 * This class extends BaseEvent to handle input-output operations with validation capabilities.
 */
export abstract class BasePromptTemplate<
    CallInput extends BasePromptTemplateInput = BasePromptTemplateInput,
    CallOutput extends BasePrompt = BasePrompt,
    CallOptions extends CallableConfig = CallableConfig,
  >
  extends BaseEvent<CallInput, CallOutput, CallOptions>
  implements PromptTemplateParams
{
  static _name(): string {
    return 'BasePromptTemplate';
  }

  _eventNamespace(): string[] {
    return ['input', 'load', 'prompts', this._templateType()];
  }

  /**
   * Template string used to generate prompts.
   */
  template = '';

  /**
   * List of input variables explicitly declared, used within the template.
   */
  inputVariables: string[] = [];

  /**
   * Optional rules for validating the input variables.
   */
  guardrails?: VariableRules;

  constructor(fields?: Partial<PromptTemplateParams>) {
    super(fields ?? {});

    this.template = fields?.template ?? this.template;

    this.inputVariables = fields?.inputVariables ?? this.inputVariables;

    this.guardrails = fields?.guardrails;

    if (this.template && this.inputVariables) {
      this._isInputExists(this.template, this.inputVariables);
    }
  }

  /**
   * Returns the specific template type.
   * @returns The type of the template.
   */
  abstract _templateType(): string;

  /**
   * Ensures that all declared input variables are used in the template.
   * Throws an error if a declared variable is not used.
   * @param template The template string.
   * @param inputVariables The list of declared input variables.
   * @throws Error if a variable is declared but not used.
   * @internal
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

  /**
   * Invokes the template processing with input validation. Returns the generated prompt.
   * @param input The input data for generating the prompt.
   * @param options Optional configuration.
   * @returns A promise resolving to the generated prompt.
   * @throws Error if input validation fails.
   */
  async invoke(
    input: CallInput,
    options?: Partial<CallOptions>
  ): Promise<CallOutput> {
    const validateResult = await this.validate(input);

    if (!validateResult.isValid) {
      throw new Error(
        `CANNOT format prompt because of error - ${validateResult.errorMessage}`
      );
    }

    return this.formatPrompt(input);
  }

  /**
   * Validates the input data using any configured guardrails.
   * @param input The input data to validate.
   * @returns A promise resolving to a validation result.
   */
  async validate(input: CallInput): Promise<ValidateResult> {
    if (!this.guardrails) return { isValid: true };

    const validator = new VariableValidator({
      variables: this._getAllVariables(),
      rules: this.guardrails,
    });

    return validator.invoke(input);
  }

  /**
   * Abstract method to format the provided input into a string.
   * @param input The input data.
   * @returns A promise resolving to the formatted string.
   */
  abstract format(input: CallInput): Promise<string>;

  /**
   * Abstract method to format the provided input into a prompt.
   * @param input The input data.
   * @returns A promise resolving to the generated prompt.
   */
  abstract formatPrompt(input: CallInput): Promise<CallOutput>;

  /**
   * Retrieves all unique variable names used in the input and guardrails.
   * @returns An array of unique variable names.
   * @internal
   */
  private _getAllVariables(): string[] {
    return [...new Set(this.inputVariables)];
  }
}
