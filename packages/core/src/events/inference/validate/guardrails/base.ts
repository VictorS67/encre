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

export interface BaseRuleFields<T> {
  description: string;
  variables?: Record<string, unknown>;
  func: string | ValidateFunc<T>;

  metadata?: RuleMetadata;
}

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

  description: string;

  variables: Record<string, unknown> | undefined;

  metadata: RuleMetadata | undefined;

  _func: ValidateFunc<T>;

  get func(): ValidateFunc<T> {
    return this._func;
  }

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

  toCallableLambda(): CallableLambda<T, boolean> {
    return CallableLambda.from(this.func);
  }

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

  abstract concat<U>(
    rule: BaseRule<U>,
    conjunction: 'and' | 'or'
  ): BaseRule<T | U>;

  abstract _ruleType(): string;

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

export class GeneralRule<T = unknown> extends BaseRule<T> {
  _isSerializable = true;

  static _name(): string {
    return 'GeneralRule';
  }

  _ruleType(): string {
    return 'unknown';
  }

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
