import { BaseRule } from '../../events/inference/validate/guardrails/base.js';
import { ValidateFunc } from '../../events/inference/validate/index.js';
import { RecordId } from '../../load/keymap.js';
import {
  convertLambdaFuncFromStr,
  formatLambdaFuncStr,
  isValidLambdaFunc,
} from '../../record/utils.js';
import { Data, scalarDefaults } from '../data.js';
import { ProcessContext, validateProcessData } from '../processor.js';
import { Guardrail } from './index.js';

export abstract class GuardrailImpl<
  T extends Guardrail<string, GuardDataType, BaseRule<GuardDataType>>,
  GuardDataType = any,
  GuardType extends T['type'] = T['type'],
> {
  readonly guardrail: T;

  constructor(guardrail: T) {
    this.guardrail = guardrail;
  }

  get name(): string {
    return this.guardrail.name;
  }

  get detail(): string {
    return this.guardrail.detail ?? '';
  }

  get id(): RecordId {
    return this.guardrail.id;
  }

  get type(): GuardType {
    return this.guardrail.type as GuardType;
  }

  get description(): string {
    return this.guardrail.guard.description;
  }

  get dataType(): T['dataType'] {
    return this.guardrail.dataType;
  }

  get function(): string {
    if (typeof this.guardrail.guard.func === 'string') {
      return this.guardrail.guard.func;
    }

    return this.guardrail.guard.func.toString();
  }

  get variables(): Record<string, unknown> | undefined {
    return this.guardrail.guard.variables;
  }

  set description(newVal: string) {
    this.guardrail.guard.description = newVal;
  }

  set function(newVal: string) {
    if (!isValidLambdaFunc(newVal)) {
      throw new Error('Guardrail Function Str is not valid');
    }

    const params: string[] = newVal
      .slice(newVal.indexOf('(') + 1, newVal.indexOf(')'))
      .split(',')
      .map((param) => param.trim());

    if (!params.includes('inputs')) {
      throw new Error(
        "Guardrail Function Str does not contain 'inputs' in arguments"
      );
    }

    if (
      this.variables &&
      Object.keys(this.variables).length > 0 &&
      !params.includes('variables')
    ) {
      throw new Error(
        "Guardrail Function Str does not contain 'variables' in arguments"
      );
    }

    const funcStr: string = formatLambdaFuncStr(newVal, true);
    this.guardrail.guard.func = convertLambdaFuncFromStr(
      funcStr
    ) as ValidateFunc<GuardDataType>;
  }

  set variables(newVal: Record<string, unknown> | undefined) {
    this.guardrail.guard.variables = newVal;
  }

  validateData(data: Data): boolean {
    return validateProcessData(data, this.dataType);
  }

  protected abstract _preprocess(
    data: Data,
    context: ProcessContext
  ): Promise<GuardDataType>;

  protected abstract _postprocess(
    rawData: GuardDataType,
    context: ProcessContext
  ): Promise<Data>;

  async parse(data: Data, context: ProcessContext): Promise<Data> {
    if (!this.validateData(data)) {
      throw new Error(`${this.type} Guardrail ${this.name} has invalid data`);
    }

    if (data.value === undefined || data.value === null) {
      return {
        type: 'unknown',
        value: data.value,
      };
    }

    const rawData = await this._preprocess(data, context);

    const isValid: boolean = await this.guardrail.guard.validate(rawData);

    if (isValid) {
      return this._postprocess(rawData, context);
    } else {
      return {
        type: 'unknown',
        value: scalarDefaults['unknown'],
      };
    }
  }

  async validate(data: Data, context: ProcessContext): Promise<boolean> {
    if (!this.validateData(data)) {
      throw new Error(`${this.type} Guardrail ${this.name} has invalid data`);
    }

    if (data.value === undefined || data.value === null) {
      return false;
    }

    const rawData = await this._preprocess(data, context);

    return this.guardrail.guard.validate(rawData);
  }
}
