import { type BaseRule } from '../../events/inference/validate/guardrails/index.js';
import { type RecordId } from '../../load/keymap.js';
import { type DataType } from '../data.js';

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
