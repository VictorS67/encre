import { BooleanRule } from '../../../events/inference/validate/guardrails/boolean.js';
import { getRecordId } from '../../../utils/nanoid.js';
import { Data } from '../../data.js';
import { ProcessContext } from '../../processor.js';
import {
  coerceToData,
  coerceTypeOptional,
  expectTypeOptional,
} from '../../utils/coerce.js';
import { GuardrailImpl } from '../base.js';
import { Guardrail } from '../index.js';

export type BooleanGuard = Guardrail<'boolean', boolean, BooleanRule>;

export class BooleanGuardrailImpl extends GuardrailImpl<BooleanGuard, boolean> {
  static create(method: string): BooleanGuard {
    let rule: BooleanRule;
    if (typeof BooleanRule[method] !== 'function') {
      rule = new BooleanRule({
        description: '',
        variables: {},
        func: async (inputs, variables) => {
          return true;
        },
      });
    } else {
      rule = BooleanRule[method]();
    }

    const guardrail: BooleanGuard = {
      id: getRecordId(),
      type: rule._ruleType(),
      name: method,
      detail: rule.description,
      guard: rule,
      dataType: ['boolean', 'unknown'],
    };

    return guardrail;
  }

  protected async _preprocess(
    data: Data,
    context: ProcessContext
  ): Promise<boolean> {
    const validData = await expectTypeOptional(data, 'boolean');

    if (validData === undefined) {
      throw new Error(
        `${this.type} Guardrail ${this.name} failed in preprocess because of invalid data.`
      );
    }

    return validData;
  }
  protected async _postprocess(
    rawData: boolean,
    context: ProcessContext
  ): Promise<Data> {
    return coerceToData(rawData);
  }
}
