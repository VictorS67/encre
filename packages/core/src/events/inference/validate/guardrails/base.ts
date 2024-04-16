import { Serializable } from '../../../../load/serializable.js';
import { CallableLambda } from '../../../../record/callable.js';
import {
  convertLambdaFuncFromStr,
  formatLambdaFuncStr,
  isValidLambdaFunc,
} from '../../../../record/utils.js';
import { ValidateFunc } from '../index.js';
import {
  swapKeysInVariables,
  swapVariableNameInDescription,
  wrapDescription,
} from '../utils.js';

export interface BaseRuleFields<T> {
  description: string;
  variables?: Record<string, unknown>;
  func: string | ValidateFunc<T>;
}

export abstract class BaseRule<T = any>
  extends Serializable
  implements BaseRuleFields<T>
{
  _isSerializable = false;

  _namespace: string[] = [
    'inference',
    'validate',
    'guardrails',
    this._ruleType(),
  ];

  description: string;

  variables: Record<string, unknown> | undefined;

  func: ValidateFunc<T>;

  constructor(fields: BaseRuleFields<T>) {
    let funcStr: string | undefined;

    if (typeof fields.func === 'string') {
      if (!isValidLambdaFunc(fields.func)) {
        throw new Error('Validation Function Str is not valid');
      }

      funcStr = fields.func;
    } else {
      funcStr = fields.func.toString();
    }

    super({
      description: fields.description,
      variables: fields.variables,
      func: funcStr,
    });

    this.description = fields.description;
    this.variables = fields.variables;
    this.func = convertLambdaFuncFromStr(funcStr) as ValidateFunc<T>;
  }

  toCallableLambda(): CallableLambda<T, boolean> {
    return CallableLambda.from(this.func);
  }

  async validate(input: T): Promise<boolean> {
    if (this.variables) {
      return this.func(input, this.variables);
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
  const conjunction = '${conjunction.toString()}';
  const leftFunc = ${formatLambdaFuncStr(left.func.toString(), true)};
  const rightFunc = ${formatLambdaFuncStr(right.func.toString(), true)};

  const result1 = await leftFunc(input${left.variables ? ', variables.left' : ''}).catch(
    (e) => false
  );
  const result2 = await rightFunc(input${right.variables ? ', variables.right' : ''}).catch(
    (e) => false
  );

  const results = await Promise.all([result1, result2]);

  if (conjunction === "or") {
    return results.some((result) => result === true);
  } else {
    return results.every((result) => result === true);
  }
}`;
  };
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
    });
  }
}
