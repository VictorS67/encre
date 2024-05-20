import { ValidateResult } from '../../../../events/inference/validate/index.js';
import { VariableValidator } from '../../../../events/inference/validate/validators/variable.js';
import { CallableConfig } from '../../../../record/callable.js';
import { getRecordId } from '../../../../utils/nanoid.js';
import { isRecordStringUnknown } from '../../../../utils/safeTypes.js';
import { Data } from '../../../data.js';
import {
  ProcessInputMap,
  ProcessContext,
  ProcessOutputMap,
} from '../../../processor.js';
import { coerceToData } from '../../../utils/coerce.js';
import { CallableNodeImpl } from '../../base.js';
import { CallableNode } from '../../index.js';

export type VariableValidatorNode = CallableNode<
  'variable-validator',
  VariableValidator
>;

export class VariableValidatorNodeImpl extends CallableNodeImpl<VariableValidatorNode> {
  static nodeFrom(callable: VariableValidator): VariableValidatorNode {
    return {
      id: getRecordId(),
      type: 'variable-validator',
      subType: 'variable',
      data: callable,
      visualInfo: {
        position: {
          x: 0,
          y: 0,
        },
        size: {
          width: 300,
          height: 500,
        },
      },
      inputs: {
        variables: ['object'],
      },
      outputs: {
        isValid: 'boolean',
        errorMessage: ['string', 'unknown'],
      },
    };
  }

  static create(): VariableValidatorNode {
    const variableValidator = new VariableValidator({
      variables: [],
      rules: {},
    });

    const node: VariableValidatorNode =
      VariableValidatorNodeImpl.nodeFrom(variableValidator);

    return node;
  }

  protected async _preprocess(
    inputs: ProcessInputMap,
    context: ProcessContext
  ): Promise<Record<string, unknown>> {
    const variables: Data | undefined = inputs['variables'];

    if (!variables || !(variables.type === 'object')) {
      throw new Error(
        `${this.type} Node ${this.title} failed in preprocess because of invalid inputs.`
      );
    }

    return variables.value;
  }

  protected async _postprocess(
    rawOutputs: ValidateResult,
    context: ProcessContext
  ): Promise<ProcessOutputMap> {
    const { isValid, errorMessage } = rawOutputs;

    return {
      isValid: coerceToData(isValid),
      errorMessage: coerceToData(errorMessage),
    };
  }

  async invoke<CallInput, CallOutput, CallOptions>(
    input: CallInput,
    options?: Partial<CallOptions> | undefined
  ): Promise<CallOutput> {
    if (!isRecordStringUnknown(input)) {
      throw new Error(
        `${this.type} Node ${this.title} failed in invoke because of invalid inputs.`
      );
    }

    return this.data.invoke(input, options) as CallOutput;
  }

  async process(
    inputs: ProcessInputMap,
    context: ProcessContext
  ): Promise<ProcessOutputMap> {
    if (!this.validateInputs(inputs)) {
      throw new Error(`${this.type} Node ${this.title} has invalid inputs`);
    }

    const rawInputs: Record<string, unknown> = await this._preprocess(
      inputs,
      context
    );

    const rawOutputs: ValidateResult = await this.invoke<
      Record<string, unknown>,
      ValidateResult,
      CallableConfig
    >(rawInputs);

    return this._postprocess(rawOutputs, context);
  }
}
