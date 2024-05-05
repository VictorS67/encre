import { StringRule } from '../../../events/inference/validate/guardrails/string.js';
import { getRecordId } from '../../../utils/nanoid.js';
import { Data } from '../../data.js';
import { ProcessContext } from '../../processor.js';
import { coerceToData, expectTypeOptional } from '../../utils/coerce.js';
import { GuardrailImpl } from '../base.js';
import { Guardrail } from '../index.js';

export type StringGuard = Guardrail<'string', string, StringRule>;

export class StringGuardrailImpl extends GuardrailImpl<StringGuard, string> {
  static create(method: string): StringGuard {
    let rule: StringRule;
    if (typeof StringRule[method] !== 'function') {
      rule = new StringRule({
        description: '',
        variables: {},
        func: async (inputs, variables) => {
          return true;
        },
      });
    } else {
      rule = StringRule[method]();
    }

    const guardrail: StringGuard = {
      id: getRecordId(),
      type: rule._ruleType(),
      name: method,
      detail: rule.description,
      guard: rule,
      dataType: ['string', 'unknown'],
    };

    return guardrail;
  }

  protected async _preprocess(
    data: Data,
    context: ProcessContext
  ): Promise<string> {
    const validData = await expectTypeOptional(data, 'string');

    if (validData === undefined) {
      throw new Error(
        `${this.type} Guardrail ${this.name} failed in preprocess because of invalid data.`
      );
    }

    return validData;
  }
  protected async _postprocess(
    rawData: string,
    context: ProcessContext
  ): Promise<Data> {
    return coerceToData(rawData);
  }
}
