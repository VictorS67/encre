import { ArrayRule } from '../../../events/inference/validate/guardrails/index.js';
import { getRecordId } from '../../../utils/nanoid.js';
import {
  type Data,
  type DataType,
  dataTypes,
  isArrayData,
  isArrayDataType,
} from '../../data.js';
import { type ProcessContext } from '../../processor.js';
import { coerceToData } from '../../utils/coerce.js';
import { GuardrailImpl } from '../base.js';
import { type Guardrail } from '../index.js';

export type ArrayGuard = Guardrail<'array', Array<unknown>, ArrayRule>;

export class ArrayGuardrailImpl extends GuardrailImpl<
  ArrayGuard,
  Array<unknown>
> {
  static create(method: string): ArrayGuard {
    let rule: ArrayRule;
    if (typeof ArrayRule[method] !== 'function') {
      rule = new ArrayRule({
        description: '',
        variables: {},
        func: async (inputs, variables) => {
          return true;
        },
      });
    } else {
      rule = ArrayRule[method]();
    }

    const guardrail: ArrayGuard = {
      id: getRecordId(),
      type: rule._ruleType(),
      name: method,
      detail: rule.description,
      guard: rule,
      dataType: dataTypes.filter((dt: DataType) => isArrayDataType(dt)),
    };

    return guardrail;
  }

  protected async _preprocess(
    data: Data,
    context: ProcessContext
  ): Promise<Array<unknown>> {
    if (!isArrayData(data)) {
      throw new Error(
        `${this.type} Guardrail ${this.name} failed in preprocess because of invalid data.`
      );
    }

    return data.value;
  }
  protected async _postprocess(
    rawData: Array<unknown>,
    context: ProcessContext
  ): Promise<Data> {
    return coerceToData(rawData);
  }
}
