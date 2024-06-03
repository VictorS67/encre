import { Serializable } from '../../../../load/serializable.js';
import { CallableLambda } from '../../../../record/callable.js';
import {
  convertLambdaFuncFromStr,
  formatLambdaFuncStr,
  isValidLambdaFunc,
} from '../../../../record/utils.js';
import { SerializedRule } from '../../../../studio/serde.js';
import { isRecordStringUnknown } from '../../../../utils/safeTypes.js';
import { ValidateFunc } from '../index.js';
import { swapVariableNameInDescription, wrapDescription } from '../utils.js';

export type RuleMetadata = {
  left: BaseRule;
  right: BaseRule;
  conjunction: 'and' | 'or';
};

/**
 * Defines the structure for the base fields of a rule, including a description, variables, function, and metadata.
 * These fields are used to configure the rule's behavior and how it evaluates input data.
 *
 * @template T The type of data the rule will operate upon.
 */
export interface BaseRuleFields<T> {
  /**
   * A human-readable description of what the rule checks or enforces.
   */
  description: string;

  /**
   * An optional set of variables that can be used within the rule's validation function.
   */
  variables?: Record<string, unknown>;

  /**
   * The function that performs the validation. It can be a string (to be converted to a function) or a direct function reference.
   */
  func: string | ValidateFunc<T>;

  /**
   * Optional metadata related to the rule, often used for rules that combine other rules.
   */
  metadata?: RuleMetadata;
}

/**
 * An abstract class that serves as the base for creating rules within the system.
 * A rule is a logical construct that evaluates whether a piece of data meets a specified criterion.
 *
 * @template T The type of input data the rule will validate.
 */
export abstract class BaseRule<T = any>
  extends Serializable
  implements BaseRuleFields<T>
{
  _isSerializable = false;

  _namespace: string[] = [
    'events',
    'inference',
    'validate',
    'guardrails',
    this._ruleType(),
  ];

  /**
   * A human-readable description of what the rule checks or enforces.
   */
  description: string;

  /**
   * An optional set of variables that can be used within the rule's validation function.
   */
  variables: Record<string, unknown> | undefined;

  /**
   * Optional track-back metadata of rules that are used for merging to the current rule.
   */
  metadata: RuleMetadata | undefined;

  /**
   * The function that performs the validation, stored as a callable function.
   * @hidden
   * @internal
   */
  private _func: ValidateFunc<T>;

  /**
   * Gets the validation function.
   */
  get func(): ValidateFunc<T> {
    return this._func;
  }

  /**
   * Sets the validation function, with conversion from string format if necessary.
   */
  set func(newVal: ValidateFunc<T> | string) {
    let funcStr: string | undefined;

    if (typeof newVal === 'string') {
      funcStr = formatLambdaFuncStr(newVal, true);
    } else {
      funcStr = newVal.toString();
    }

    this._validateFuncStr(funcStr, this.variables);

    this._func = convertLambdaFuncFromStr(funcStr) as ValidateFunc<T>;
  }

  /**
   * Constructs a new instance of a rule with the specified fields.
   */
  constructor(fields: BaseRuleFields<T>) {
    let funcStr: string | undefined;

    if (typeof fields.func === 'string') {
      funcStr = formatLambdaFuncStr(fields.func, true);
    } else {
      funcStr = fields.func.toString();
    }

    super({
      description: fields.description,
      variables: fields.variables,
      metadata: fields.metadata,
      func: funcStr,
    });

    this._validateFuncStr(funcStr, fields.variables);

    this.description = fields.description;
    this.variables = fields.variables;
    this.metadata = fields.metadata;
    this._func = convertLambdaFuncFromStr(funcStr) as ValidateFunc<T>;
  }

  /**
   * Deserializes a SerializedRule back into a BaseRule object (based on their rule types).
   * This function is essential for reconstructing rule instances from their serialized forms.
   *
   * @param serialized A SerializedRule object containing the serialized data.
   * @param values Variable values to the rules. If not provided, it will use the variable values in the serialized data.
   * @returns A BaseRule object reconstructed from the serialized data.
   */
  static async deserialize(
    serialized: SerializedRule,
    values: Record<string, unknown> = {}
  ): Promise<BaseRule> {
    if (serialized._type !== 'rule') {
      throw new Error(
        `CANNOT deserialize this type in rule: ${serialized._type}`
      );
    }

    switch (serialized._ruleType) {
      case 'string': {
        const { StringRule } = await import('./string.js');
        return StringRule.deserialize(serialized, values);
      }
      case 'number': {
        const { NumberRule } = await import('./number.js');
        return NumberRule.deserialize(serialized, values);
      }
      case 'boolean': {
        const { BooleanRule } = await import('./boolean.js');
        return BooleanRule.deserialize(serialized, values);
      }
      case 'object': {
        const { JSONObjectRule } = await import('./object.js');
        return JSONObjectRule.deserialize(serialized, values);
      }
      case 'array': {
        const { ArrayRule } = await import('./array.js');
        return ArrayRule.deserialize(serialized, values);
      }
      case 'unknown':
      default: {
        return GeneralRule.deserialize(serialized, values);
      }
    }
  }

  /**
   * Serializes the rule into a structured format for storage or transmission.
   * @returns A `SerializedRule` object containing the serialized state.
   */
  serialize(): SerializedRule {
    return {
      _type: 'rule',
      _ruleType: this._ruleType(),
      description: this.description,
      func: this.func.toString(),
      variables: this.variables,
      metadata:
        this.metadata !== undefined
          ? {
              left: this.metadata.left.serialize(),
              right: this.metadata.right.serialize(),
              conjunction: this.metadata.conjunction,
            }
          : undefined,
    };
  }

  /**
   * Cleans and formats the rule description by replacing variable placeholders with actual values.
   * @returns A formatted description with variable values substituted.
   */
  getCleanDescription(): string {
    const variablePattern = /\{\{([^}]+)\}\}/g;
    let match: RegExpExecArray | null;
    const foundVariables: string[] = [];

    while ((match = variablePattern.exec(this.description)) !== null) {
      foundVariables.push(match[1]);
    }

    let formattedDescription: string = this.description;

    foundVariables.forEach((varName: string) => {
      const path: string[] = varName.split('.');

      let json: Record<string, unknown> = this.variables ?? {};
      for (let i = 0; i < path.length; i++) {
        const attr: string = path[i];
        const isLastAttr: boolean = i === path.length - 1;

        if (!Object.prototype.hasOwnProperty.call(json, attr)) {
          // If a required variable is missing in the variables, throw an error
          throw new Error(`Missing value for variable '${attr}'`);
        }

        if (!isLastAttr) {
          if (!isRecordStringUnknown(json[attr])) {
            throw new Error(
              `Incorrect type in JSON '${path.slice(0, i + 1).join('.')}'`
            );
          }

          json = json[attr] as Record<string, unknown>;
        } else {
          const regex = new RegExp(
            `\\{\\{${path.slice(0, i + 1).join('.')}\\}\\}`,
            'g'
          );
          formattedDescription = formattedDescription.replace(
            regex,
            JSON.stringify(json[attr])
          );
        }
      }
    });

    return formattedDescription;
  }

  /**
   * Converts the rule's validation function into a `CallableLambda`.
   * @returns A new `CallableLambda` based on the rule's validation function.
   */
  toCallableLambda(): CallableLambda<T, boolean> {
    return CallableLambda.from(this.func);
  }

  /**
   * Validates an input against the rule.
   * @param input The data to validate.
   * @param variables Optional additional variables for the validation.
   * @returns A promise that resolves to true if the input is valid according to the rule.
   */
  async validate(
    input: T,
    variables?: Record<string, unknown>
  ): Promise<boolean> {
    if (variables || this.variables) {
      return this.func(input, variables ?? this.variables);
    } else {
      return this.func(input);
    }
  }

  /**
   * Abstract method to concatenate two rules with a specified logical conjunction.
   * @template U The type of input data the other rule will validate.
   * @param rule The rule to concatenate with this rule.
   * @param conjunction The type of logical conjunction ('and' | 'or').
   * @returns A new `BaseRule` that represents the combination of this rule and the other rule.
   */
  abstract concat<U>(
    rule: BaseRule<U>,
    conjunction: 'and' | 'or'
  ): BaseRule<T | U>;

  /**
   * Abstract method to determine the rule's type.
   * @returns The type of the rule as a string.
   */
  abstract _ruleType(): string;

  /**
   * Internal method for merging two rule description.
   *
   * @param left left rule
   * @param right right rule
   * @param conjunction conjunction can be either 'or' or 'and'
   * @returns merged rule description.
   * @internal
   */
  protected static _mergeDescription(
    left: BaseRule<unknown>,
    right: BaseRule<unknown>,
    conjunction: 'or' | 'and'
  ): string {
    const leftVarNames: string[] = Object.keys(left.variables ?? {});
    const leftNewVarNames: string[] = leftVarNames.map((l) => `left.${l}`);

    const rightVarNames: string[] = Object.keys(right.variables ?? {});
    const rightNewVarNames: string[] = rightVarNames.map((r) => `right.${r}`);

    let leftDescription: string = left.description;
    let rightDescription: string = right.description;

    for (let i = 0; i < leftVarNames.length; i++) {
      const oldVarName: string = leftVarNames[i];
      const newVarName: string = leftNewVarNames[i];

      leftDescription = swapVariableNameInDescription(
        leftDescription,
        oldVarName,
        newVarName
      );
    }

    for (let i = 0; i < rightVarNames.length; i++) {
      const oldVarName: string = rightVarNames[i];
      const newVarName: string = rightNewVarNames[i];

      rightDescription = swapVariableNameInDescription(
        rightDescription,
        oldVarName,
        newVarName
      );
    }

    leftDescription = wrapDescription(leftDescription, conjunction);
    rightDescription = wrapDescription(rightDescription, conjunction);

    const newDescription = `${leftDescription} ${conjunction.toUpperCase()} ${rightDescription}`;

    return newDescription;
  }

  /**
   * Internal method for merging two rule variables.
   *
   * @param left left rule
   * @param right right rule
   * @returns merged rule variables.
   * @internal
   */
  protected static _mergeVariables(
    left: BaseRule<unknown>,
    right: BaseRule<unknown>
  ): Record<string, unknown> {
    const leftVariables: Record<string, unknown> = left.variables ?? {};
    const rightVariables: Record<string, unknown> = right.variables ?? {};

    const newVariables: Record<string, unknown> = {
      left: leftVariables,
      right: rightVariables,
    };

    return newVariables;
  }

  /**
   * Internal method for merging two rule functions.
   *
   * @param left left rule
   * @param right right rule
   * @param conjunction conjunction can be either 'or' or 'and'
   * @returns merged rule functions.
   * @internal
   */
  protected static _mergeFunc(
    left: BaseRule<unknown>,
    right: BaseRule<unknown>,
    conjunction: 'and' | 'or'
  ): string | ValidateFunc {
    return `async (input, variables) => {
  const leftFunc = ${formatLambdaFuncStr(left.func.toString(), true)};
  const rightFunc = ${formatLambdaFuncStr(right.func.toString(), true)};

  const result1 = await leftFunc(input${
    left.variables ? ', variables.left' : ''
  }).catch(
    (e) => false
  );
  const result2 = await rightFunc(input${
    right.variables ? ', variables.right' : ''
  }).catch(
    (e) => false
  );

  const results = await Promise.all([result1, result2]);

  return results.${
    conjunction === 'or' ? 'some' : 'every'
  }((result) => result === true);
}`;
  }

  /**
   * Internal method for creating the trace-back metadata.
   *
   * @param left left rule
   * @param right right rule
   * @param conjunction conjunction can be either 'or' or 'and'
   * @returns the trace-back metadata..
   * @internal
   */
  protected static _mergeMetadata(
    left: BaseRule<unknown>,
    right: BaseRule<unknown>,
    conjunction: 'and' | 'or'
  ): RuleMetadata {
    return {
      left,
      right,
      conjunction,
    };
  }

  /**
   * Validate if function is formatted correctly as a callable rule function.
   *
   * A correct formatted rule function should:
   * - include `input` in the arguments;
   * - if any variables are included in the rule, those variable names should in the arguments;
   *
   * @param funcStr function string
   * @param variables variables in the function
   */
  protected _validateFuncStr(
    funcStr: string,
    variables: Record<string, unknown> | undefined
  ) {
    if (!isValidLambdaFunc(funcStr)) {
      throw new Error('Validation Function Str is not valid');
    }

    const params: string[] = funcStr
      .slice(funcStr.indexOf('(') + 1, funcStr.indexOf(')'))
      .split(',')
      .map((param) => param.trim());

    if (!params.includes('input')) {
      throw new Error(
        "Validation Function Str does not contain 'input' in arguments"
      );
    }

    if (
      variables &&
      Object.keys(variables).length > 0 &&
      !params.includes('variables')
    ) {
      throw new Error(
        "Validation Function Str does not contain 'variables' in arguments"
      );
    }
  }
}

/**
 * A general-purpose rule class that extends the BaseRule abstract class.
 * This class is intended to be used for rules where the specific type or category
 * might not be known or when a rule does not fit into a specific category.
 *
 * @template T The type of input data the rule will validate.
 * 
 * @example
 * ```typescript
 * const rule = new GeneralRule({
 *   description: 'is greater than {{value}}',
 *   variables: { value: 1 },
 *   func: await (input: number, variables: { value: number }) => input > variables.value
 * });
 * ```
 */
export class GeneralRule<T = unknown> extends BaseRule<T> {
  _isSerializable = true;

  static _name(): string {
    return 'GeneralRule';
  }

  /**
   * Specifies the rule type. For `GeneralRule`, the type is "unknown" as it can handle general cases.
   * @returns The type identifier for this class, used in classification and serialization.
   */
  _ruleType(): string {
    return 'unknown';
  }

    /**
   * Concatenates this rule with another rule using a specified logical conjunction.
   * This method effectively merges two rules into a new `GeneralRule` instance, combining their logic.
   *
   * @template U The type of input data the other rule will validate.
   * @param rule The other rule to concatenate with this rule.
   * @param conjunction The logical conjunction to apply ("and" | "or").
   * @returns A new `GeneralRule` instance that represents the logical combination of this rule and the other rule.
   */
  concat<U>(rule: BaseRule<U>, conjunction: 'and' | 'or'): BaseRule<T | U> {
    return new GeneralRule<T | U>({
      description: GeneralRule._mergeDescription(
        this as BaseRule,
        rule as BaseRule,
        conjunction
      ),
      variables: GeneralRule._mergeVariables(
        this as BaseRule,
        rule as BaseRule
      ),
      func: GeneralRule._mergeFunc(
        this as BaseRule,
        rule as BaseRule,
        conjunction
      ),
      metadata: GeneralRule._mergeMetadata(
        this as BaseRule,
        rule as BaseRule,
        conjunction
      ),
    });
  }

    /**
   * Deserializes a `SerializedRule` object into a `GeneralRule` instance.
   * This static method provides a mechanism to reconstruct a `GeneralRule` from its serialized form.
   *
   * @param serialized The serialized rule data.
   * @param values Optional additional variables that may be needed for rule initialization.
   * @returns A promise that resolves to a new `GeneralRule` instance based on the serialized data.
   */
  static async deserialize(
    serialized: SerializedRule,
    values?: Record<string, unknown>
  ): Promise<GeneralRule<unknown>> {
    const generalRuleFields = {
      description: serialized.description,
      func: serialized.func,
      variables: {
        ...serialized.variables,
        ...values,
      },
    };

    return new GeneralRule(generalRuleFields);
  }
}
