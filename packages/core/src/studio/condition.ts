import { BaseRuleCollection } from '../events/input/load/rules/base.js';
import { Callable, CallableConfig } from '../record/callable.js';
import {
  globalGuardrailRegistry,
  GuardrailRegistration,
} from './registration/guardrails.js';

/**
 * Represents the base structure for an 'if' condition field in a conditional rule system.
 */
export type IfConditionField = {
  /**
   * Indicates the type of condition ('if')
   */
  type: 'if';

  /**
   * Collection of rules that determine when this condition should apply.
   */
  ruleCollection: BaseRuleCollection;

  /**
   * Optional identifier for the source of the data to be evaluated by the condition.
   */
  source?: string;
};

/**
 * Represents an 'else-if' condition which is evaluated if the preceding 'if' or 'else-if' conditions fail.
 */
export type ElseIfConditionField = {
  /**
   * Indicates the type of condition ('else-if').
   */
  type: 'else-if';

  /**
   * Collection of rules that determine when this condition should apply.
   */
  ruleCollection: BaseRuleCollection;

  /**
   * Optional identifier for the source of the data to be evaluated by the condition.
   */
  source?: string;
};

/**
 * Represents an 'otherwise' condition, a fallback that executes if all other 'if' and 'else-if' conditions fail.
 */
export type OtherwiseConditionField = {
  /**
   * Indicates the type of condition ('otherwise').
   */
  type: 'otherwise';

  /**
   * Optional identifier for the source of the data, typically unused as it's a default fallback.
   */
  source?: string;
};

/**
 * Represents an 'else' condition which can be either an 'else-if' or 'otherwise'.
 */
export type ElseConditionField = ElseIfConditionField | OtherwiseConditionField;

/**
 * Represents any type of condition, including 'if', 'else-if', and 'otherwise'.
 */
export type ConditionField = IfConditionField | ElseConditionField;

/**
 * Defines the parameters required for initializing an IfCondition, including the
 * rule sources, targets, and actions.
 * @example
 * ```
 * const ifConditionParams: IfConditionParams = {
 *   sources: ['userInput', 'appState'],
 *   targets: ['display', 'log'],
 *   actions: {
 *     display: [{
 *       type: 'if',
 *       ruleCollection: new RuleCollection(...),
 *       source: 'userInput',
 *     }, {
 *       type: 'otherwise',
 *       source: 'appState'
 *     }]
 *   }
 * };
 * ```
 */
export interface IfConditionParams {
  /**
   * Optional registration of guardrails that provide additional constraints or rules in plugins.
   */
  registry?: GuardrailRegistration;

  /**
   * List of identifiers for data sources that are evaluated by the conditions.
   */
  sources: string[];

  /**
   * List of identifiers for targets that are affected based on the evaluation of the conditions.
   */
  targets: string[];

  /**
   * Defines a map of conditional actions. Each target can have a sequence of condition fields,
   * starting with an 'if' and optionally followed by 'else-if' and 'otherwise'.
   */
  actions: {
    [target: string]: [IfConditionField, ...ElseConditionField[]];
  };
  // variables?: {
  //   [target: string]: (ConditionFieldVariables | undefined)[];
  // };
}

/**
 * Represents the structure of sources from which conditions fetch their data for evaluation.
 */
export type IfConditionSource = {
  [source: string]: unknown;
};

/**
 * Represents the structure of targets which will be affected based on the condition evaluations.
 */
export type IfConditionTarget = {
  [target: string]: unknown;
};

/**
 * Represents variables associated with each condition field that may affect the rule evaluation.
 */
export type ConditionFieldVariables = {
  [source: string]: Record<string, unknown> | undefined;
};

/**
 * Extends CallableConfig to include optional variables that can be passed to each condition field.
 * @example
 * ```
 * const conditionOptions: IfConditionOptions = {
 *   variables: {
 *     eligibility: [{ userData: { country: "US" } }]
 *   }
 * };
 * ```
 */
export type IfConditionOptions = CallableConfig & {
  /**
   * Optional detailed variables that may influence the behavior of the callable conditions.
   */
  variables?: {
    [target: string]: (ConditionFieldVariables | undefined)[];
  };
};

/**
 * Abstract base class for defining conditional logic with various branches ('if', 'else-if', 'otherwise').
 */
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

  /**
   * List of source identifiers involved in the conditions.
   */
  sources: string[];

  /**
   * List of target identifiers that results may be assigned to.
   */
  targets: string[];

  /**
   * A map of actions tied to specific targets, each associated with a series of conditions.
   */
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

  /**
   * Removes a specified action from the conditions map based on the target.
   * @param target The target key corresponding to the action to be removed.
   * @returns {boolean} True if the action was successfully removed, false if the action did not exist.
   * @example
   * ```
   * const removed = ifCondition.removeAction('logEntry');
   * console.log(removed); // Output: true or false based on existence and removal success
   * ```
   */
  removeAction(target: string): boolean {
    if (!this.actions[target]) {
      return false;
    }

    delete this.actions[target];
    // delete this.variables[target];

    return true;
  }

  /**
   * Adds a new condition to an existing action sequence. The condition can be either 'else-if' or 'otherwise'.
   * This method enforces that 'otherwise' can only be added at the end and only once.
   * @param target The target key where the condition should be added.
   * @param conditionField The condition field (either 'else-if' or 'otherwise') to add.
   * @returns {boolean} True if the condition was added successfully, false if it could not be added.
   * @example
   * ```
   * const success = ifCondition.addConditionToAction('logEntry', {
   *   type: 'else-if',
   *   ruleCollection: new RuleCollection(...),
   *   source: 'appState'
   * });
   * console.log(success); // Output: true or false based on addition success
   * ```
   */
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

  /**
   * Inserts a condition into an existing action sequence at a specified index.
   * The method enforces that no 'else-if' conditions can be added after an 'otherwise'.
   * @param target The target key where the condition should be inserted.
   * @param index The index at which to insert the condition.
   * @param conditionField The condition field to insert.
   * @returns {boolean} True if the condition was inserted successfully, false if it could not be inserted.
   * @example
   * ```
   * const success = ifCondition.insertConditionToAction('displayMessage', 1, {
   *   type: 'else-if',
   *   ruleCollection: new RuleCollection(...),
   *   source: 'userInput'
   * });
   * console.log(success); // Output: true or false
   * ```
   */
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

  /**
   * Removes a condition from an action sequence at a specified index.
   * The method ensures that 'if' conditions cannot be removed.
   * @param target The target key from which the condition should be removed.
   * @param index The index of the condition to remove.
   * @returns {boolean} True if the condition was removed successfully, false if it could not be removed.
   * @example
   * ```
   * const success = ifCondition.removeConditionFromAction('displayMessage', 2);
   * console.log(success); // Output: true or false
   * ```
   */
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

  /**
   * Updates a specific condition within an action sequence at a given index.
   * The method ensures that the type of the condition matches the type being updated.
   * @param target The target key of the action where the condition update should occur.
   * @param index The index of the condition to update.
   * @param conditionField The new condition field to replace the existing one.
   * @returns {boolean} True if the condition was updated successfully, false otherwise.
   * @example
   * ```
   * const success = ifCondition.updateConditionInAction('logEntry', 1, {
   *   type: 'else-if',
   *   ruleCollection: new RuleCollection(...),
   *   source: 'userActivity'
   * });
   * console.log(success); // Output: true or false
   * ```
   */
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

  /**
   * Checks if a given input conforms to the expected sources for the if conditions.
   * @param input The input object to check.
   * @returns {boolean} True if the input contains all expected source keys, false otherwise.
   * @example
   * ```
   * const input = { userData: {...}, systemData: {...} };
   * const isValidSource = ifCondition.isIfConditionSource(input);
   * console.log(isValidSource); // Output: true or false
   * ```
   */
  isIfConditionSource(input: any): input is IfConditionSource {
    return Object.keys(input).every((k) => this.sources.includes(k));
  }

  /**
   * Abstract method to invoke the conditional logic based on the provided input and options.
   * Implementations must define how to process the input and apply conditions.
   * @param input The source data to evaluate against the conditions.
   * @param options Optional parameters that may influence the conditional logic.
   * @returns {Promise<CallOutput>} A promise that resolves to the outcome of the conditional logic.
   */
  abstract invoke(
    input: CallInput,
    options?: Partial<CallOptions> | undefined
  ): Promise<CallOutput>;

  /**
   * Validates the sequence of condition fields to ensure they are in the correct order and of correct types.
   * Specifically, it checks that the sequence starts with an 'if', followed by zero or more 'else-if', and
   * optionally ends with an 'otherwise'.
   * @param conditions An array of condition fields.
   * @returns {boolean} True if the sequence is valid, false otherwise.
   * @internal
   * @example
   * ```
   * const conditions = [
   *   { type: 'if', ruleCollection: new RuleCollection(...) },
   *   { type: 'else-if', ruleCollection: new RuleCollection(...) },
   *   { type: 'otherwise' }
   * ];
   * const isValid = ifCondition._isValidIfConditionField(conditions);
   * console.log(isValid); // Output: true or false
   * ```
   */
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

/**
 * Represents a concrete implementation of the `BaseIfCondition` class, capable of processing
 * input data through a series of conditional logic branches to determine output.
 *
 * This class specifically handles the evaluation of `if`, `else-if`, and `otherwise` conditions,
 * directing the flow of logic based on these evaluations and updating the targets accordingly.
 *
 * @class
 * @extends BaseIfCondition
 * @example
 * ```
 * // Assuming RuleCollection is a class that validates some criteria:
 * const conditions: [IfConditionField, ...ElseConditionField[]] = [
 *   {
 *     type: 'if',
 *     ruleCollection: new RuleCollection(...),
 *     source: 'sourceDataKey'
 *   },
 *   {
 *     type: 'else-if',
 *     ruleCollection: new RuleCollection(...),
 *     source: 'alternateSourceKey'
 *   },
 *   {
 *     type: 'otherwise',
 *     source: 'defaultSourceKey'
 *   }
 * ];
 *
 * const ifCondition = new IfCondition({
 *   sources: ['sourceDataKey', 'alternateSourceKey', 'defaultSourceKey'],
 *   targets: ['resultTarget'],
 *   actions: {
 *     resultTarget: conditions
 *   }
 * });
 *
 * // To use:
 * const input = { sourceDataKey: {...}, alternateSourceKey: {...}, defaultSourceKey: {...} };
 * const output = await ifCondition.invoke(input);
 * console.log(output); // Output based on the rules defined in conditions
 * ```
 */
export class IfCondition extends BaseIfCondition {
  /**
   * Navigates through the conditional actions based on input data and returns the source identifier
   * for the condition that passes validation.
   *
   * @param input An object containing the data sources used for condition checks.
   * @param conditions An array of conditions (`IfConditionField` and `ElseConditionField`) to evaluate.
   * @param variables Optional variables to pass into rule evaluations.
   * @returns {Promise<string | undefined>} A promise that resolves to the source identifier of the condition that passed, or undefined if no conditions pass.
   * @throws {Error} If the conditions are invalid or there is a mismatch in the number of conditions and variables.
   * @internal
   */
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

  /**
   * Invokes the conditional logic defined for this instance and returns the outputs based on 
   * the source-target mappings.
   *
   * @param input The data used for evaluating the conditions.
   * @param options Optional configuration for this invocation, which might include additional variables for condition evaluations.
   * @returns {Promise<IfConditionTarget>} A promise that resolves to an object containing the outputs for each target based on the evaluated conditions.
   */
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
