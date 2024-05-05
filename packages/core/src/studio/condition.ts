import { BaseRuleCollection } from '../events/input/load/rules/base.js';
import { Callable, CallableConfig } from '../record/callable.js';
import {
  globalGuardrailRegistry,
  GuardrailRegistration,
} from './registration/guardrails.js';

export type IfConditionField = {
  type: 'if';
  ruleCollection: BaseRuleCollection;
  source?: string;
};

export type ElseIfConditionField = {
  type: 'else-if';
  ruleCollection: BaseRuleCollection;
  source?: string;
};

export type OtherwiseConditionField = {
  type: 'otherwise';
  source?: string;
};

export type ElseConditionField = ElseIfConditionField | OtherwiseConditionField;

export type ConditionField = IfConditionField | ElseConditionField;

export interface IfConditionParams {
  registry?: GuardrailRegistration;

  sources: string[];
  targets: string[];
  actions: {
    [target: string]: [IfConditionField, ...ElseConditionField[]];
  };
  // variables?: {
  //   [target: string]: (ConditionFieldVariables | undefined)[];
  // };
}

export type IfConditionSource = {
  [source: string]: unknown;
};

export type IfConditionTarget = {
  [target: string]: unknown;
};

export type ConditionFieldVariables = {
  [source: string]: Record<string, unknown> | undefined;
};

export type IfConditionOptions = CallableConfig & {
  variables?: {
    [target: string]: (ConditionFieldVariables | undefined)[];
  };
};

export abstract class BaseIfCondition<
    CallInput extends IfConditionSource = IfConditionSource,
    CallOutput extends IfConditionTarget = IfConditionTarget,
    CallOptions extends IfConditionOptions = IfConditionOptions,
  >
  extends Callable<CallInput, CallOutput, CallOptions>
  implements IfConditionParams
{
  _isSerializable = true;

  _namespace: string[] = ['studio', 'condition'];

  sources: string[];

  targets: string[];

  actions: { [target: string]: [IfConditionField, ...ElseConditionField[]] };

  // variables: {
  //   [target: string]: (ConditionFieldVariables | undefined)[];
  // };

  // where the guardrails are registered, in default we use globalGuardrailRegistry
  readonly registry: GuardrailRegistration;

  get _attributes() {
    return {
      sources: [],
      targets: [],
      actions: {},
      variables: {},
    };
  }

  constructor(fields?: IfConditionParams) {
    let registry: GuardrailRegistration | undefined;
    if (fields?.registry) {
      registry = fields?.registry;
      delete fields['registry'];
    }

    super(fields ?? {});

    if (this._kwargs['registry']) {
      registry = this._kwargs['registry'] as GuardrailRegistration;
      delete this._kwargs['registry'];
    }

    this.sources = fields?.sources ?? [];
    this.targets = fields?.targets ?? [];
    this.actions = fields?.actions ?? {};
    // this.variables = fields?.variables ?? {};

    Object.entries(this.actions).forEach(([source, conditions]) => {
      if (!this._isValidIfConditionField(conditions)) {
        throw new Error(
          `If-condition field from source '${source}' is invalid`
        );
      }
    });

    this.registry =
      registry ?? (globalGuardrailRegistry as unknown as GuardrailRegistration);
  }

  removeAction(target: string): boolean {
    if (!this.actions[target]) {
      return false;
    }

    delete this.actions[target];
    // delete this.variables[target];

    return true;
  }

  addConditionToAction(
    target: string,
    conditionField: ElseConditionField
    // variables: ConditionFieldVariables | undefined
  ): boolean {
    // CANNOT add an else-if or otherwise condition to an empty action
    if (!this.actions[target] || this.actions[target].length < 1) {
      return false;
    }

    // CANNOT add two otherwise conditions
    if (
      conditionField.type === 'otherwise' &&
      this.actions[target][this.actions[target].length - 1].type === 'otherwise'
    ) {
      return false;
    }

    // CANNOT add else-if condition after otherwise condition
    if (
      conditionField.type === 'else-if' &&
      this.actions[target][this.actions[target].length - 1].type === 'otherwise'
    ) {
      return false;
    }

    this.actions[target].push(conditionField);
    // this.variables[target].push(variables);

    return true;
  }

  insertConditionToAction(
    target: string,
    index: number,
    conditionField: ElseConditionField
    // variables: ConditionFieldVariables | undefined
  ): boolean {
    // CANNOT add an else-if or otherwise condition to an empty action
    if (!this.actions[target] || this.actions[target].length < 1) {
      return false;
    }

    // CANNOT insert before if condition
    if (index < 1) {
      return false;
    }

    // CANNOT insert otherwise condition before else condition
    if (
      conditionField.type === 'otherwise' &&
      index < this.actions[target].length
    ) {
      return false;
    }

    // CANNOT insert two otherwise conditions
    if (
      conditionField.type === 'otherwise' &&
      this.actions[target][this.actions[target].length - 1].type === 'otherwise'
    ) {
      return false;
    }

    // CANNOT add else-if condition after otherwise condition
    if (
      conditionField.type === 'else-if' &&
      index >= this.actions[target].length &&
      this.actions[target][this.actions[target].length - 1].type === 'otherwise'
    ) {
      return false;
    }

    this.actions[target].splice(index, 0, conditionField);
    // this.variables[target].splice(index, 0, variables);

    return true;
  }

  removeConditionFromAction(target: string, index: number): boolean {
    // CANNOT remove a non-exist else-if or otherwise condition
    if (!this.actions[target] || this.actions[target].length <= index) {
      return false;
    }

    // CANNOT remove an if condition
    if (index < 1) {
      return false;
    }

    this.actions[target].splice(index, 1);
    // this.variables[target].splice(index, 1);

    return true;
  }

  updateConditionInAction(
    target: string,
    index: number,
    conditionField: ConditionField
    // variables: ConditionFieldVariables | undefined
  ): boolean {
    // CANNOT update a non-exist if, else-if or otherwise condition
    if (!this.actions[target] || this.actions[target].length <= index) {
      return false;
    }

    // CANNOT update a unmatched condition
    if (this.actions[target][index].type !== conditionField.type) {
      return false;
    }

    this.actions[target][index] = conditionField;
    // this.variables[target][index] = variables;

    return true;
  }

  isIfConditionSource(input: any): input is IfConditionSource {
    return Object.keys(input).every((k) => this.sources.includes(k));
  }

  abstract invoke(
    input: CallInput,
    options?: Partial<CallOptions> | undefined
  ): Promise<CallOutput>;

  protected _isValidIfConditionField(
    conditions: [IfConditionField, ...ElseConditionField[]]
  ) {
    if (conditions.length < 1) {
      return false;
    }

    let index = 0;

    while (index < conditions.length) {
      const cond: ConditionField = conditions[index];

      if (index === 0) {
        if (cond.type !== 'if') return false;
      } else if (index === conditions.length - 1) {
        if (cond.type === 'if') return false;
      } else {
        if (cond.type === 'if' || cond.type === 'otherwise') return false;
      }

      index += 1;
    }

    return true;
  }
}

export class IfCondition extends BaseIfCondition {
  protected async _navigate(
    input: IfConditionSource,
    conditions: [IfConditionField, ...ElseConditionField[]],
    variables?: (ConditionFieldVariables | undefined)[]
  ): Promise<string | undefined> {
    if (!this._isValidIfConditionField(conditions)) {
      throw new Error('If-condition field is invalid');
    }

    if (variables !== undefined && conditions.length !== variables.length) {
      throw new Error(
        'If-condition field does not have equal number of conditions and variables'
      );
    }

    const ifCond: {
      condition: IfConditionField;
      variable?: ConditionFieldVariables;
    } = {
      condition: conditions[0],
      variable: variables ? variables[0] : undefined,
    };

    let elseIfCond: {
      condition: ElseIfConditionField;
      variable?: ConditionFieldVariables;
    }[] = [];

    let otherwiseCond:
      | {
          condition: OtherwiseConditionField;
          variable?: ConditionFieldVariables;
        }
      | undefined;

    if (conditions.length > 1) {
      if (conditions[conditions.length - 1].type === 'otherwise') {
        elseIfCond = conditions.slice(1, -1).map((condition, index) => ({
          condition: condition as ElseIfConditionField,
          variable: variables ? variables[index] : undefined,
        }));

        otherwiseCond = {
          condition: conditions[
            conditions.length - 1
          ] as OtherwiseConditionField,
          variable: variables ? variables[conditions.length - 1] : undefined,
        };
      } else {
        elseIfCond = conditions.slice(1).map((condition, index) => ({
          condition: condition as ElseIfConditionField,
          variable: variables ? variables[index] : undefined,
        }));
      }
    }

    if (
      await ifCond.condition.ruleCollection.validate(input, ifCond.variable)
    ) {
      return ifCond.condition.source;
    }

    for (const elseIfCondItem of elseIfCond) {
      if (
        await elseIfCondItem.condition.ruleCollection.validate(
          input,
          elseIfCondItem.variable
        )
      ) {
        return elseIfCondItem.condition.source;
      }
    }

    if (otherwiseCond !== undefined) {
      return otherwiseCond.condition.source;
    }
  }

  async invoke(
    input: IfConditionSource,
    options?: Partial<IfConditionOptions> | undefined
  ): Promise<IfConditionTarget> {
    const variables = {
      // ...this.variables,
      ...options?.variables,
    };

    return Object.fromEntries(
      await Promise.all(
        Object.entries(this.actions).map(async ([target, conditions]) => {
          const targetedSource: string | undefined = await this._navigate(
            input,
            conditions,
            Object.keys(variables).length > 0 ? variables[target] : undefined
          );

          return [target, targetedSource ? input[targetedSource] : undefined];
        })
      )
    );
  }
}
