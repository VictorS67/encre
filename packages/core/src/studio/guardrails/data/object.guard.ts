import { JSONObjectRule } from '../../../events/inference/validate/guardrails/object.js';
import { Context } from '../../../events/input/load/docs/context.js';
import {
  BaseMessage,
  BaseMessageLike,
} from '../../../events/input/load/msgs/base.js';
import {
  convertMessageLikeToMessage,
  isMessageLike,
} from '../../../events/input/load/msgs/utils.js';
import { getRecordId } from '../../../utils/nanoid.js';
import { isRecordStringUnknown } from '../../../utils/safeTypes.js';
import {
  ChatMessageData,
  ContextData,
  Data,
  DataType,
  JSONObjectData,
  TypeOf,
} from '../../data.js';
import { ProcessContext } from '../../processor.js';
import { coerceToData, expectTypeOptional } from '../../utils/coerce.js';
import { GuardrailImpl } from '../base.js';
import { Guardrail } from '../index.js';

export type JSONObjectGuard = Guardrail<'object', object, JSONObjectRule>;

export class JSONObjectGuardrailImpl extends GuardrailImpl<
  JSONObjectGuard,
  object
> {
  static create(method: string): JSONObjectGuard {
    let rule: JSONObjectRule;
    if (typeof JSONObjectRule[method] !== 'function') {
      rule = new JSONObjectRule({
        description: '',
        variables: {},
        func: async (inputs, variables) => {
          return true;
        },
      });
    } else {
      rule = JSONObjectRule[method]();
    }

    const guardrail: JSONObjectGuard = {
      id: getRecordId(),
      type: rule._ruleType(),
      name: method,
      detail: rule.description,
      guard: rule,
      dataType: ['context', 'chat-message', 'object', 'unknown'],
    };

    return guardrail;
  }

  protected async _preprocess(
    data: Data,
    context: ProcessContext
  ): Promise<object> {
    const possibleDataTypes: [
      TypeOf<ContextData>,
      TypeOf<ChatMessageData>,
      TypeOf<JSONObjectData>,
    ] = ['context', 'chat-message', 'object'];

    let validData:
      | Context
      | BaseMessageLike
      | Record<string, unknown>
      | undefined;
    let index = 0;
    while (index < possibleDataTypes.length) {
      validData = await expectTypeOptional(data, possibleDataTypes[index]);

      if (Context.isContext(validData)) {
        return {
          pageContent: validData.pageContent,
          metadata: validData.metadata,
        };
      }

      if (isMessageLike(validData)) {
        const message: BaseMessage = convertMessageLikeToMessage(validData);
        return message.toSerialized();
      }

      if (isRecordStringUnknown(validData)) {
        return validData;
      }

      index += 1;
    }

    throw new Error(
      `${this.type} Guardrail ${this.name} failed in preprocess because of invalid data.`
    );
  }

  protected async _postprocess(
    rawData: object,
    context: ProcessContext
  ): Promise<Data> {
    return coerceToData(rawData);
  }
}
