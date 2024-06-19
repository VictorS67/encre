import {
  type BaseDocLoaderCallOptions,
  type BaseLoader,
  type Context,
  PDFLoader,
} from '../../../events/input/load/docs/index.js';
import { load } from '../../../load/index.js';
import {
  globalImportMap,
  globalSecretMap,
} from '../../../load/registration.js';
import { getRecordId } from '../../../utils/nanoid.js';
import { type Data, scalarDefaults } from '../../data.js';
import {
  type ProcessInputMap,
  type ProcessContext,
  type ProcessOutputMap,
} from '../../processor.js';
import { type SerializedNode } from '../../serde.js';
import { coerceToData } from '../../utils/coerce.js';
import { CallableNodeImpl } from '../base.js';
import { type CallableNode } from '../index.js';

/**
 * A type alias for a specialized callable node focused on loading operations.
 * This node type is specialized for handling loader operations,
 * particularly in the context of data loading from various formats.
 */
export type LoaderNode = CallableNode<'loader', BaseLoader>;

/**
 * An abstract class providing a base implementation for loader nodes.
 * This class extends the callable node implementation to provide specialized
 * loader functionalities.
 */
export abstract class LoaderNodeImpl extends CallableNodeImpl<LoaderNode> {
  /**
   * Deserializes a serialized loader node representation into an executable loader node,
   * reconstituting the node with its operational parameters and data.
   *
   * @param serialized The serialized node data.
   * @returns A promise resolving to a deserialized loader node.
   */
  static async deserialize(serialized: SerializedNode): Promise<LoaderNode> {
    const subType: string = serialized.subType;

    switch (subType) {
      case 'pdf':
        return PDFLoaderNodeImpl.deserialize(serialized);
      default:
        throw new Error('Plugin node is unsupported for now');
    }
  }
}

/**
 * Implementation of a LoaderNode specifically for loading PDF documents.
 * This node handles the preprocessing, processing, and postprocessing of PDF data,
 * converting it into a consumable format for downstream processing nodes.
 *
 * ### Node Properties
 *
 * | Field       | Type                | Description                                                                 |
 * |-------------|---------------------|-----------------------------------------------------------------------------|
 * | `type`      | `'loader'`          | The type of the node, indicating it handles loading operations.             |
 * | `subtype`   | `'pdf'`             | The subtype of the node, specifying that it is specialized for PDF data.    |
 * | `data`      | {@link PDFLoader}   | The callable used for PDF loading operations.                               |
 *
 * ### Input Ports
 *
 * | Port Name   | Supported Types     | Description                                                                 |
 * |-------------|---------------------|-----------------------------------------------------------------------------|
 * | `pdf`       | `string`, `blob`    | Accepts either a URL as a string or a PDF file as a blob.                   |
 *
 * ### Output Ports
 *
 * | Port Name   | Supported Types     | Description                                                                 |
 * |-------------|---------------------|-----------------------------------------------------------------------------|
 * | `contexts`  | `context[]`         | Outputs an array of contexts derived from the processed PDF.                |
 *
 */
export class PDFLoaderNodeImpl extends LoaderNodeImpl {
  /**
   * Creates a LoaderNode configuration from a PDFLoader callable instance.
   * This method initializes the node with predefined settings suitable for PDF loading.
   *
   * @param callable An instance of PDFLoader defining the loading logic.
   * @returns A fully configured LoaderNode specialized for PDF operations.
   */
  static nodeFrom(callable: PDFLoader): LoaderNode {
    return {
      id: getRecordId(),
      type: 'loader',
      subType: 'pdf',
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
        pdf: ['string', 'blob'],
      },
      outputs: {
        contexts: 'context[]',
      },
    };
  }

  /**
   * Factory method to create a new instance of PDFLoaderNode.
   * This method provides a simple way to instantiate a PDF loader node with default settings.
   *
   * @returns An instance of LoaderNode prepared with a default PDFLoader.
   */
  static create(): LoaderNode {
    const loader = new PDFLoader({ shouldSplit: scalarDefaults['boolean'] });

    const node: LoaderNode = PDFLoaderNodeImpl.nodeFrom(loader);

    return node;
  }

  static async deserialize(serialized: SerializedNode): Promise<LoaderNode> {
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

    if (type !== 'loader') {
      throw new Error(`CANNOT deserialize this type in loader node: ${type}`);
    }

    const pdfLoaderStr = JSON.stringify(data);
    const pdfLoader = await load<PDFLoader>(
      pdfLoaderStr,
      globalSecretMap,
      globalImportMap
    );

    return {
      id,
      type,
      subType,
      registerArgs,
      data: pdfLoader,
      visualInfo,
      inputs,
      outputs,
      runtime,
      memory,
      outputSizes,
    };
  }

  /**
   * Preprocesses the input data by validating and preparing it for the loader.
   * This step ensures that the input data is in the correct format (string or Blob).
   *
   * @param inputs The map containing input data for the node.
   * @param context The processing context, not actively used here.
   * @returns The validated and cast input data as a string or Blob.
   * @throws Error if the inputs are not valid.
   * @internal
   */
  protected async _preprocess(
    inputs: ProcessInputMap,
    context: ProcessContext
  ): Promise<string | Blob> {
    const pdf: Data | undefined = inputs['pdf'];

    if (!pdf || !(pdf.type === 'string' || pdf.type === 'blob')) {
      throw new Error(
        `${this.type} Node ${this.title} failed in preprocess because of invalid inputs.`
      );
    }

    return pdf.value;
  }

  /**
   * Postprocesses the raw output from the loader, wrapping it into the expected output format.
   *
   * @param rawOutputs The raw contexts generated by the loader.
   * @param context The processing context, not actively used here.
   * @returns A map of process outputs keyed by their output port names.
   * @internal
   */
  protected async _postprocess(
    rawOutputs: Context[],
    context: ProcessContext
  ): Promise<ProcessOutputMap> {
    const contexts = coerceToData(rawOutputs);

    return { contexts };
  }

  /**
   * Invokes the PDF loader with the given input under the provided options.
   * This method directly interfaces with the loader's callable mechanism.
   *
   * @param input The input data for the loader, expected to be either a string or Blob.
   * @param options Optional additional settings for the loader call.
   * @returns The output from the loader as specified by the loader's output type.
   */
  async invoke<CallInput, CallOutput, CallOptions>(
    input: CallInput,
    options?: Partial<CallOptions>
  ): Promise<CallOutput> {
    if (!(typeof input === 'string' || input instanceof Blob)) {
      `${this.type} Node ${this.title} failed in invoke because of invalid inputs.`;
    }

    return this.data.invoke(input, options) as CallOutput;
  }

  /**
   * Main process method that orchestrates the full lifecycle of PDF data loading.
   * This method integrates input validation, preprocessing, loader invocation, and
   * postprocessing.
   *
   * @param inputs A map containing all inputs to the node.
   * @param context The current processing context.
   * @returns A map of outputs as processed by the node.
   * @throws Error if inputs are not valid or if any stage of processing fails.
   */
  async process(
    inputs: ProcessInputMap,
    context: ProcessContext
  ): Promise<ProcessOutputMap> {
    if (!this.validateInputs(inputs)) {
      throw new Error(`${this.type} Node ${this.title} has invalid inputs`);
    }

    const rawInputs: string | Blob = await this._preprocess(inputs, context);

    const rawOutputs: Context[] = await this.invoke<
      string | Blob,
      Context[],
      BaseDocLoaderCallOptions
    >(rawInputs);

    return this._postprocess(rawOutputs, context);
  }
}
