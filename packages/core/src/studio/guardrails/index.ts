import { BaseRule } from '../../events/inference/validate/guardrails/base.js';
import { RecordId } from '../../load/keymap.js';
import { DataType } from '../data.js';

export interface BaseGuardrail {
  id: RecordId;

  name: string;

  detail?: string | undefined;
}

export interface Guardrail<
  GuardType extends string = string,
  RuntimeType = any,
  Guard extends BaseRule<RuntimeType> = BaseRule<RuntimeType>,
> extends BaseGuardrail {
  type: GuardType;

  dataType: DataType | Readonly<DataType[]>;

  guard: Guard;
}
