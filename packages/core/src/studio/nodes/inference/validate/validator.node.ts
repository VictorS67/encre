import { ValidateResult } from '../../../../events/inference/validate/index.js';
import { VariableValidator } from '../../../../events/inference/validate/validators/variable.js';
import { load } from '../../../../load/index.js';
import {
  globalImportMap,
  globalSecretMap,
} from '../../../../load/registration.js';
import { CallableConfig } from '../../../../record/callable.js';
import { getRecordId } from '../../../../utils/nanoid.js';
import { isRecordStringUnknown } from '../../../../utils/safeTypes.js';
import { Data } from '../../../data.js';
import {
  ProcessInputMap,
  ProcessContext,
  ProcessOutputMap,
} from '../../../processor.js';
import { SerializedNode } from '../../../serde.js';
import { coerceToData } from '../../../utils/coerce.js';
import { CallableNodeImpl } from '../../base.js';
import { CallableNode } from '../../index.js';

/**
 * A type alias for a specialized callable node focused on variable validation.
 * This node type is specialized for handling validation operations,
 * particularly in scenarios where variable inputs need to be checked against specific rules.
 */
export type VariableValidatorNode = CallableNode<
  'variable-validator',
  VariableValidator
>;

/**
 * Implementation of a CallableNode specifically for validating variable inputs.
 * This node handles the validation of variables based on defined rules, returning whether the variables
 * are valid and any associated error messages.
 *
 * ### Node Properties
 *
 * | Field       | Type                     | Description                                                                   |
 * |-------------|--------------------------|-------------------------------------------------------------------------------|
 * | `type`      | `'variable-validator'`   | The type of the node, indicating it handles validation of variables.          |
 * | `subType`   | `'variable'`             | The subtype of the node, specifying that it is specialized for variable validation. |
 * | `data`      | {@link VariableValidator}| The callable used for variable validation operations.                         |
 *
 * ### Input Ports
 *
 * | Port Name   | Supported Types     | Description                                                                 |
 * |-------------|---------------------|-----------------------------------------------------------------------------|
 * | `variables` | `object`            | Accepts an object containing variables to be validated.                     |
 *
 * ### Output Ports
 *
 * | Port Name      | Supported Types         | Description                                                                |
 * |----------------|-------------------------|----------------------------------------------------------------------------|
 * | `isValid`      | `boolean`               | Outputs a boolean indicating whether the variables are valid.              |
 * | `errorMessage` | `string`, `unknown`     | Outputs an error message if the variables are invalid, otherwise undefined.|
 *
 */
export class VariableValidatorNodeImpl extends CallableNodeImpl<VariableValidatorNode> {
  /**
   * Creates a VariableValidatorNode configuration from a VariableValidator callable instance.
   * @param callable An instance of VariableValidator defining the validation logic.
   * @returns A fully configured VariableValidatorNode specialized for validating variables.
   */
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

  /**
   * Factory method to create a new instance of VariableValidatorNode.
   * This method provides a simple way to instantiate a variable validator node with default settings,
   * preparing it for use in validation operations with customizable rules.
   *
   * @returns An instance of VariableValidatorNode prepared with a default VariableValidator.
   */
  static create(): VariableValidatorNode {
    const variableValidator = new VariableValidator({
      variables: [],
      rules: {},
    });

    const node: VariableValidatorNode =
      VariableValidatorNodeImpl.nodeFrom(variableValidator);

    return node;
  }

  /**
   * Deserializes a serialized variable-validator node representation into an executable variable-validator node,
   * reconstituting the node with its operational parameters and data.
   *
   * @param serialized The serialized node data.
   * @returns A promise resolving to a deserialized variable-validator node.
   */
  static async deserialize(
    serialized: SerializedNode
  ): Promise<VariableValidatorNode> {
    const {
      id,
      type,
      subType,
      registerArgs,
      data,
      visualInfo,
      inputs,
      outputs,
      runtime,
      memory,
      outputSizes,
    } = serialized;

    if (type !== 'variable-validator') {
      throw new Error(
        `CANNOT deserialize this type in variable-validator node: ${type}`
      );
    }

    const variableValidatorStr = JSON.stringify(data);
    const variableValidator = await load<VariableValidator>(
      variableValidatorStr,
      globalSecretMap,
      globalImportMap
    );

    return {
      id,
      type,
      subType,
      registerArgs,
      data: variableValidator,
      visualInfo,
      inputs,
      outputs,
      runtime,
      memory,
      outputSizes,
    };
  }

  /**
   * Preprocesses the input variables to ensure they are in a valid format for validation.
   *
   * @param inputs The map containing input data for the node.
   * @param context The processing context, not actively used here.
   * @returns The validated input data as a record of strings to unknown.
   * @throws Error if the inputs are not valid.
   * @internal
   */
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

  /**
   * Postprocesses the validation results, extracting the validity status and any error messages.
   *
   * @param rawOutputs The validation results from the callable.
   * @param context The processing context, not actively used here.
   * @returns A map of process outputs keyed by their output port names.
   * @internal
   */
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

  /**
   * Invokes the variable validation logic with the given input.
   *
   * @param input The input data for validation, expected to be a record of strings to unknown.
   * @param options Optional additional settings for the validation call.
   * @returns The result from the validation as specified by the callable's output type.
   */
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

  /**
   * Main process method that orchestrates the full lifecycle of variable validation.
   * This method integrates input validation, preprocessing, validation invocation, and postprocessing.
   *
   * @param inputs A map containing all inputs to the node.
   * @param context The current processing context.
   * @returns A map of outputs as processed by the node, including validity and any error messages.
   * @throws Error if inputs are not valid or if any stage of processing fails.
   */
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
