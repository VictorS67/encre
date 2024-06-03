import { CallableConfig } from '../../../../record/callable.js';
import { BaseEvent, BaseEventParams } from '../../../base.js';
import { BaseRule } from '../guardrails/base.js';
import { ValidateResult } from '../index.js';

/**
 * Defines the rules applied to variables including default rules,
 * specific rules for particular variables, and exclusions.
 */
export interface VariableRules {
  /**
   * The default rule applied to all variables unless specifically overridden or excluded.
   */
  default?: BaseRule;

  /**
   * A dictionary of rules specific to certain variables.
   */
  specific?: Record<string, BaseRule>;

  /**
   * A list of variable names to be excluded from validation.
   */
  exclude?: string[];
}

/**
 * Parameters for configuring a VariableValidator including the variables to validate and their associated rules.
 */
export interface VariableValidatorParams extends BaseEventParams {
  /**
   * List of variables to validate.
   */
  variables: string[];

  /**
   * Structured rules for validation as defined by VariableRules.
   */
  rules: VariableRules;
}

/**
 * A class responsible for validating a set of variables against defined rules.
 * Extends `BaseEvent` to utilize event-driven architecture for validation processes.
 *
 * @template CallInput - The type of the input record, typically a dictionary.
 * @template CallOutput - The expected output type, typically a validation result.
 * @template CallOptions - Configuration options inherited from CallableConfig.
 *
 * @example
 * ```typescript
 * const validator = new VariableValidator({
 *   variables: ['username', 'email'],
 *   rules: {
 *     specific: {
 *       username: StringRule.exists()
 *     },
 *     default: BooleanRule.isTrue(),
 *     exclude: ['email']
 *   }
 * });
 * const result = await validator.invoke({ username: 'john_doe', email: 'john@example.com' });
 * console.log(result);
 * ```
 */
export class VariableValidator<
    CallInput extends Record<string, unknown> = Record<string, unknown>,
    CallOutput = ValidateResult,
    CallOptions extends CallableConfig = CallableConfig,
  >
  extends BaseEvent<CallInput, CallOutput, CallOptions>
  implements VariableValidatorParams
{
  _isSerializable = true;

  _eventNamespace(): string[] {
    return ['inference', 'validate', 'validator'];
  }

  static _name(): string {
    return 'VariableValidator';
  }

  /**
   * List of variables to validate.
   */
  variables: string[];

  /**
   * Structured rules for validation as defined by VariableRules.
   */
  rules: VariableRules;

  /**
   * Initializes a new instance of VariableValidator with optional configuration parameters.
   * Throws an error if specific rules are provided for variables not included in the list.
   *
   * @param fields - Optional parameters to set up the validator.
   */
  constructor(fields?: Partial<VariableValidatorParams>) {
    super(fields ?? {});

    this.variables = fields?.variables ? [...new Set(fields?.variables)] : [];
    this.rules = fields?.rules ?? {};

    const keysNotIncluded: string[] = Object.keys(
      this.rules.specific ?? {}
    ).filter((key) => !this.variables.includes(key));

    if (keysNotIncluded.length > 0) {
      throw new Error(
        `Variables that cannot be validated specifically: ${JSON.stringify(
          keysNotIncluded
        )}`
      );
    }
  }

  /**
   * Retrieves all applicable rules for each variable, considering exclusions and specific rules.
   * Returns a mapping from variable names to their applicable rules, or `null` if excluded.
   *
   * @returns A record mapping each variable to its applicable rule or `null`.
   * @example
   * ```typescript
   * const validator = new VariableValidator({
   *   variables: ['username', 'email'],
   *   rules: {
   *     specific: {
   *       username: StringRule.exists()
   *     },
   *     default: BooleanRule.isTrue(),
   *     exclude: ['email']
   *   }
   * });
   * const allRules = validator.getAllRules();
   * console.log(allRules);
   * // Outputs: { username: <specific rule equvalent to StringRule.exists()>, email: null }
   * ```
   */
  getAllRules(): Record<string, BaseRule | null> {
    const { excludeKeys, specificRuleMap, defaultRule } = this._getRuleConfig();

    return this.variables.reduce(
      (acc, key) => {
        if (excludeKeys.includes(key)) {
          acc[key] = null;
        } else if (Object.keys(specificRuleMap).includes(key)) {
          acc[key] = specificRuleMap[key];
        } else {
          acc[key] = defaultRule;
        }

        return acc;
      },
      {} as Record<string, BaseRule | null>
    );
  }

  /**
   * Retrieves the applicable rule for a given variable, considering exclusions and specific rules.
   * Throws an error if the variable is not managed by this validator.
   *
   * @param variable - The variable name to retrieve the rule for.
   * @returns The applicable rule for the variable or `null` if excluded.
   * @throws Error if the variable is not known to this validator.
   * @example
   * ```typescript
   * const validator = new VariableValidator({
   *   variables: ['username', 'email'],
   *   rules: {
   *     specific: {
   *       username: StringRule.exists()
   *     },
   *     default: BooleanRule.isTrue(),
   *     exclude: ['email']
   *   }
   * });
   *
   * const rule = validator.getRule('username');
   * console.log(rule);
   * // Outputs: <specific rule equvalent to StringRule.exists()>
   * ```
   */
  getRule(variable: string): BaseRule | null {
    if (!this.variables.includes(variable)) {
      throw new Error(`there is no variable '${variable}' in this validator`);
    }

    const { excludeKeys, specificRuleMap, defaultRule } = this._getRuleConfig();

    if (excludeKeys.includes(variable)) {
      return null;
    } else if (Object.keys(specificRuleMap).includes(variable)) {
      return specificRuleMap[variable];
    } else {
      return defaultRule;
    }
  }

  /**
   * Adds a variable to the exclusion list, which will prevent it from being validated.
   * Throws an error if the variable is not known to this validator.
   *
   * @param variable - The variable name to exclude from validation.
   * @throws Error if the variable is not managed by this validator.
   * @example
   * ```typescript
   * const validator = new VariableValidator({
   *   variables: ['username', 'email'],
   *   rules: {
   *     specific: {
   *       username: StringRule.exists()
   *     },
   *     default: BooleanRule.isTrue(),
   *   }
   * });
   *
   * validator.addExcludeVariable('email');
   * // 'email' will now be excluded from validation.
   * ```
   */
  addExcludeVariable(variable: string): void {
    if (!this.variables.includes(variable)) {
      throw new Error(`there is no variable '${variable}' in this validator`);
    }

    const { excludeKeys } = this._getRuleConfig();

    if (!excludeKeys.includes(variable)) {
      excludeKeys.push(variable);
    }

    this.rules.exclude = excludeKeys;
  }

  /**
   * Removes a variable from the exclusion list, allowing it to be validated again.
   * Throws an error if the variable is not known to this validator.
   *
   * @param variable - The variable name to include back into validation.
   * @throws Error if the variable is not managed by this validator.
   * @example
   * ```typescript
   * const validator = new VariableValidator({
   *   variables: ['username', 'email'],
   *   rules: {
   *     specific: {
   *       username: StringRule.exists()
   *     },
   *     default: BooleanRule.isTrue(),
   *     exclude: ['email']
   *   }
   * });
   *
   * validator.removeExcludeVariable('email');
   * // 'email' is now eligible for validation.
   * ```
   */
  removeExcludeVariable(variable: string): void {
    if (!this.variables.includes(variable)) {
      throw new Error(`there is no variable '${variable}' in this validator`);
    }

    const { excludeKeys } = this._getRuleConfig();

    this.rules.exclude = excludeKeys.filter((v) => v !== variable);
  }

  /**
   * Adds a specific rule to a variable. If the variable is excluded, a warning is logged but the rule is added.
   * Throws an error if the variable is not known to this validator.
   *
   * @param variable - The variable to apply the specific rule.
   * @param guardrail - The rule to apply to the variable.
   * @throws Error if the variable is not managed by this validator.
   * @example
   * ```typescript
   * const validator = new VariableValidator({
   *   variables: ['username', 'email'],
   *   rules: {
   *     specific: {
   *       username: StringRule.exists()
   *     },
   *     default: BooleanRule.isTrue(),
   *     exclude: ['email']
   *   }
   * });
   *
   * const lengthRule = new StringRule({
   *   description: "Must be at least 10 characters long",
   *   func: await (input) => input.length >= 10
   * });
   *
   * validator.addSpecificRule('password', lengthRule);
   * // Adds a specific rule for 'password'.
   * ```
   */
  addSpecificRule(variable: string, guardrail: BaseRule): void {
    if (!this.variables.includes(variable)) {
      throw new Error(`there is no variable '${variable}' in this validator`);
    }

    const { excludeKeys, specificRuleMap } = this._getRuleConfig();

    if (excludeKeys.includes(variable)) {
      console.warn(
        `variable '${variable}' is excluded so the specific rule does not apply to it, you can remove this variable from the exclude list`
      );
    }

    specificRuleMap[variable] = guardrail;
    this.rules.specific = specificRuleMap;
  }

  /**
   * Removes a specific rule from a variable.
   * Logs a warning if no specific rule exists or if the variable is excluded.
   * Throws an error if the variable is not known to this validator.
   *
   * @param variable - The variable from which to remove the specific rule.
   * @throws Error if the variable is not managed by this validator.
   * @example
   * ```typescript
   * const validator = new VariableValidator({
   *   variables: ['username', 'email'],
   *   rules: {
   *     specific: {
   *       username: StringRule.exists()
   *     },
   *     default: BooleanRule.isTrue(),
   *     exclude: ['email']
   *   }
   * });
   *
   * validator.removeSpecificRule('username');
   * // Removes the specific rule associated with 'username'.
   * ```
   */
  removeSpecificRule(variable: string): void {
    if (!this.variables.includes(variable)) {
      throw new Error(`there is no variable '${variable}' in this validator`);
    }

    const { excludeKeys, specificRuleMap } = this._getRuleConfig();

    if (!Object.keys(specificRuleMap).includes(variable)) {
      console.warn(`variable '${variable}' has no specific rule`);
      return;
    }

    if (excludeKeys.includes(variable)) {
      console.warn(
        `variable '${variable}' is excluded from validation, you can remove this variable from the exclude list`
      );
    }

    delete specificRuleMap[variable];
    this.rules.specific = specificRuleMap;
  }

  /**
   * Sets or replaces the default rule applied to all variables unless specifically overridden or excluded.
   * Warns if replacing an existing default rule.
   *
   * @param guardrail - The default rule to apply to all non-excluded variables.
   * @example
   * ```typescript
   * const validator = new VariableValidator({
   *   variables: ['username', 'email'],
   *   rules: {
   *     specific: {
   *       username: StringRule.exists()
   *     },
   *     exclude: ['email']
   *   }
   * });
   *
   * const defaultRule = BooleanRule.isTrue();
   * validator.addDefaultRule(defaultRule);
   * // Sets a new default rule for all applicable variables.
   * ```
   */
  addDefaultRule(guardrail: BaseRule): void {
    if (this.rules.default !== undefined) {
      console.warn(
        'default rule already exist, now replace it with the new rule'
      );
    }

    this.rules.default = guardrail;
  }

  /**
   * Removes the current default rule, if it exists. Warns if no default rule is set.
   *
   * @example
   * ```typescript
   * const validator = new VariableValidator({
   *   variables: ['username', 'email'],
   *   rules: {
   *     specific: {
   *       username: StringRule.exists()
   *     },
   *     default: BooleanRule.isTrue(),
   *     exclude: ['email']
   *   }
   * });
   *
   * validator.removeDefaultRule();
   * // The default rule is now removed.
   * ```
   */
  removeDefaultRule(): void {
    if (this.rules.default === undefined) {
      console.warn('default rule does not exist');
      return;
    }

    this.rules.default = undefined;
  }

  /**
   * Executes validation against a set of variable values. Validates each variable against its applicable rule.
   * Returns a `ValidateResult` indicating whether all validations passed.
   *
   * @param variableValues - A record of variable names and their corresponding values to validate.
   * @returns A promise resolving to a `ValidateResult`.
   * @internal
   * @example
   * ```typescript
   * const validator = new VariableValidator({
   *   variables: ['username', 'email'],
   *   rules: {
   *     specific: {
   *       username: StringRule.exists()
   *     },
   *     default: BooleanRule.isTrue(),
   *     exclude: ['email']
   *   }
   * });
   *
   * const result = await validator._validate({ username: 'john_doe', email: 'john@example.com' });
   * console.log(result);
   * // Outputs: { isValid: true }
   * ```
   */
  protected async _validate(
    variableValues: Record<string, unknown>
  ): Promise<ValidateResult> {
    const { excludeKeys, specificRuleMap, defaultRule } = this._getRuleConfig();

    for (const variable of Object.keys(variableValues)) {
      if (!this.variables.includes(variable)) {
        throw new Error(`there is no variable '${variable}' in this validator`);
      }

      if (excludeKeys.includes(variable)) {
        continue;
      }

      const value: unknown = variableValues[variable];

      const ruleToApply: BaseRule | null = Object.keys(
        specificRuleMap
      ).includes(variable)
        ? specificRuleMap[variable]
        : defaultRule;

      if (!ruleToApply) {
        throw new Error(`no rule can be apply to variable '${variable}'`);
      }

      if (!(await ruleToApply.validate(value))) {
        return {
          isValid: false,
          errorMessage: `Validation failed in variable '${variable}'`,
        };
      }
    }

    return { isValid: true };
  }

  /**
   * Validates a single variable against its applicable rule. Returns a `ValidateResult`.
   * Throws an error if the variable is not known or has no applicable rule.
   *
   * @param variable - The name of the variable to validate.
   * @param value - The value of the variable to validate.
   * @returns A promise resolving to a `ValidateResult`.
   * @throws Error if there is no applicable rule or if the variable is not managed by this validator.
   * @example
   * ```typescript
   * const validator = new VariableValidator({
   *   variables: ['username', 'email'],
   *   rules: {
   *     specific: {
   *       username: StringRule.exists()
   *     },
   *     default: BooleanRule.isTrue(),
   *     exclude: ['email']
   *   }
   * });
   *
   * const result = await validator.validateVariable('email', 'test@example.com');
   * console.log(result);
   * // Outputs: { isValid: true }
   * ```
   */
  async validateVariable(
    variable: string,
    value: unknown
  ): Promise<ValidateResult> {
    if (!this.variables.includes(variable)) {
      throw new Error(`there is no variable '${variable}' in this validator`);
    }

    const { excludeKeys, specificRuleMap, defaultRule } = this._getRuleConfig();

    if (excludeKeys.includes(variable)) {
      return { isValid: true };
    }

    const ruleToApply: BaseRule | null = Object.keys(specificRuleMap).includes(
      variable
    )
      ? specificRuleMap[variable]
      : defaultRule;

    if (!ruleToApply) {
      throw new Error(`no rule can be apply to variable '${variable}'`);
    }

    if (!(await ruleToApply.validate(value))) {
      return {
        isValid: false,
        errorMessage: `Validation failed in variable '${variable}'`,
      };
    }

    return { isValid: true };
  }

  /**
   * Invokes the validation process for the given input variables, using the `validate` method.
   * This method is typically used when this class is treated as a callable in a system where `invoke` is the standard method for execution.
   *
   * @param input - The input variables to validate.
   * @param options - Optional additional configuration.
   * @returns The validation result as a `CallOutput`, essentially a `ValidateResult`.
   * @example
   * ```typescript
   * const validator = new VariableValidator({
   *   variables: ['username', 'email'],
   *   rules: {
   *     specific: {
   *       username: StringRule.exists()
   *     },
   *     default: BooleanRule.isTrue(),
   *     exclude: ['email']
   *   }
   * });
   *
   * const result = await validator.invoke({ username: 'john_doe', email: 'john@example.com' });
   * console.log(result);
   * // Outputs: { isValid: true }
   * ```
   */
  async invoke(
    input: CallInput,
    options?: Partial<CallOptions> | undefined
  ): Promise<CallOutput> {
    return this._validate(input) as CallOutput;
  }

  /** @hidden */
  private _getRuleConfig(): {
    excludeKeys: string[];
    specificRuleMap: Record<string, BaseRule>;
    defaultRule: BaseRule | null;
  } {
    const excludeKeys: string[] = this.rules.exclude ?? [];
    const specificRuleMap: Record<string, BaseRule> = this.rules.specific ?? {};
    const defaultRule: BaseRule | null = this.rules.default ?? null;

    return { excludeKeys, specificRuleMap, defaultRule };
  }
}
