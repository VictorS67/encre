import { NumberRule } from '../../../events/inference/validate/guardrails/index.js';
import { getRecordId } from '../../../utils/nanoid.js';
import { type Data } from '../../data.js';
import { type ProcessContext } from '../../processor.js';
import { coerceToData, expectTypeOptional } from '../../utils/coerce.js';
import { GuardrailImpl } from '../base.js';
import { type Guardrail } from '../index.js';

export type NumberGuard = Guardrail<'number', number, NumberRule>;

export class NumberGuardrailImpl extends GuardrailImpl<NumberGuard, number> {
  static create(method: string): NumberGuard {
    let rule: NumberRule;
    if (typeof NumberRule[method] !== 'function') {
      rule = new NumberRule({
        description: '',
        variables: {},
        func: async (inputs, variables) => {
          return true;
        },
      });
    } else {
      rule = NumberRule[method]();
    }

    const guardrail: NumberGuard = {
      id: getRecordId(),
      type: rule._ruleType(),
      name: method,
      detail: rule.description,
      guard: rule,
      dataType: ['number', 'unknown'],
    };

    return guardrail;
  }

  protected async _preprocess(
    data: Data,
    context: ProcessContext
  ): Promise<number> {
    const validData = await expectTypeOptional(data, 'number');

    if (validData === undefined) {
      throw new Error(
        `${this.type} Guardrail ${this.name} failed in preprocess because of invalid data.`
      );
    }

    return validData;
  }
  protected async _postprocess(
    rawData: number,
    context: ProcessContext
  ): Promise<Data> {
    return coerceToData(rawData);
  }
}
