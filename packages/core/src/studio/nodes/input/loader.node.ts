import {
  BaseDocLoaderCallOptions,
  BaseLoader,
} from '../../../events/input/load/docs/base.js';
import { Context } from '../../../events/input/load/docs/context.js';
import { PDFLoader } from '../../../events/input/load/docs/pdf.js';
import { getRecordId } from '../../../utils/nanoid.js';
import { Data, scalarDefaults } from '../../data.js';
import {
  ProcessInputMap,
  ProcessContext,
  ProcessOutputMap,
} from '../../processor.js';
import { coerceToData } from '../../utils/coerce.js';
import { CallableNodeImpl } from '../base.js';
import { CallableNode } from '../index.js';

export type LoaderNode = CallableNode<'loader', BaseLoader>;

export abstract class LoaderNodeImpl extends CallableNodeImpl<LoaderNode> {}

export class PDFLoaderNodeImpl extends LoaderNodeImpl {
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

  static create(): LoaderNode {
    const loader = new PDFLoader({ shouldSplit: scalarDefaults['boolean'] });

    const node: LoaderNode = PDFLoaderNodeImpl.nodeFrom(loader);

    return node;
  }

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

  protected async _postprocess(
    rawOutputs: Context[],
    context: ProcessContext
  ): Promise<ProcessOutputMap> {
    const contexts = coerceToData(rawOutputs);

    return { contexts };
  }

  async invoke<CallInput, CallOutput, CallOptions>(
    input: CallInput,
    options?: Partial<CallOptions>
  ): Promise<CallOutput> {
    if (!(typeof input === 'string' || input instanceof Blob)) {
      `${this.type} Node ${this.title} failed in invoke because of invalid inputs.`;
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

    const rawInputs: string | Blob = await this._preprocess(inputs, context);

    const rawOutputs: Context[] = await this.invoke<
      string | Blob,
      Context[],
      BaseDocLoaderCallOptions
    >(rawInputs);

    return this._postprocess(rawOutputs, context);
  }
}
