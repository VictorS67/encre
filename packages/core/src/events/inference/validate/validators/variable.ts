import { CallableConfig } from '../../../../record/callable.js';
import { BaseEvent, BaseEventParams } from '../../../base.js';
import { BaseRule } from '../guardrails/base.js';
import { ValidateResult } from '../index.js';

// Variable
export interface VariableRules {
  default?: BaseRule;
  specific?: Record<string, BaseRule>;
  exclude?: string[];
}

export interface VariableValidatorParams extends BaseEventParams {
  variables: string[];

  rules: VariableRules;
}

export class VariableValidator<
    CallInput extends Record<string, unknown> = Record<string, unknown>,
    CallOutput = ValidateResult,
    CallOptions extends CallableConfig = CallableConfig,
  >
  extends BaseEvent<CallInput, CallOutput, CallOptions>
  implements VariableValidatorParams
{
  _isSerializable = true;

  _namespace: string[] = ['inference', 'validate', 'validator'];

  static _name(): string {
    return 'VariableValidator';
  }

  variables: string[];

  rules: VariableRules;

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

  removeExcludeVariable(variable: string): void {
    if (!this.variables.includes(variable)) {
      throw new Error(`there is no variable '${variable}' in this validator`);
    }

    const { excludeKeys } = this._getRuleConfig();

    this.rules.exclude = excludeKeys.filter((v) => v !== variable);
  }

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

  addDefaultRule(guardrail: BaseRule): void {
    if (this.rules.default !== undefined) {
      console.warn('default rule already exist, now replace it with the new rule');
    }

    this.rules.default = guardrail;
  }

  removeDefaultRule(): void {
    if (this.rules.default === undefined) {
      console.warn('default rule does not exist');
      return;
    }

    this.rules.default = undefined;
  }

  async validate(
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

    return { isValid: true };
  }

  async invoke(
    input: CallInput,
    options?: Partial<CallOptions> | undefined
  ): Promise<CallOutput> {
    return this.validate(input) as CallOutput;
  }

  private _getRuleConfig(): {
    excludeKeys: string[];
    specificRuleMap: Record<string, BaseRule>;
    defaultRule: BaseRule | null;
  } {
    const excludeKeys: string[] = this.rules.exclude ?? [];
    const specificRuleMap: Record<string, BaseRule> = this.rules
      .specific ?? {};
    const defaultRule: BaseRule | null =
      this.rules.default ?? null;

    return { excludeKeys, specificRuleMap, defaultRule };
  }
}
