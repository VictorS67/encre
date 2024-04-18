import {
  Context,
  ContextLike,
  isContextLike,
} from '../../../events/input/load/docs/context.js';
import {
  ContextSplitter,
  RecursiveTextSplitter,
  SupportedLanguageForSplit,
  TextSplitter,
  TokenTextSplitter,
} from '../../../events/input/transform/splitter.js';
import { CallableConfig } from '../../../record/callable.js';
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

export type SplitterNode = CallableNode<'splitter', ContextSplitter>;

export abstract class SplitterNodeImpl extends CallableNodeImpl<SplitterNode> {
  protected async _preprocess(
    inputs: ProcessInputMap,
    context: ProcessContext
  ): Promise<ContextLike> {
    const input: Data | undefined = inputs['input'];

    if (
      !input ||
      !(
        input.type === 'string' ||
        input.type === 'context' ||
        input.type === 'context[]'
      )
    ) {
      throw new Error(
        `${this.type} Node ${this.title} failed in preprocess because of invalid inputs.`
      );
    }

    return input.value;
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
    if (!isContextLike(input)) {
      throw new Error(
        `${this.type} Node ${this.title} failed in preprocess because of invalid inputs.`
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

    const rawInputs: ContextLike = await this._preprocess(inputs, context);

    const rawOutputs: Context[] = await this.invoke<
      ContextLike,
      Context[],
      CallableConfig
    >(rawInputs);

    return this._postprocess(rawOutputs, context);
  }
}

export class TextSplitterNodeImpl extends SplitterNodeImpl {
  static create(): SplitterNode {
    const textSplitter = new TextSplitter(scalarDefaults['object']);

    const node: SplitterNode = {
      id: getRecordId(),
      type: 'splitter',
      subType: 'text',
      data: textSplitter,
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
        input: ['string', 'context', 'context[]'],
      },
      outputs: {
        contexts: 'context[]',
      },
    };

    return node;
  }
}

export class RecursiveTextSplitterNodeImpl extends SplitterNodeImpl {
  static create(): SplitterNode {
    const textSplitter = new RecursiveTextSplitter(scalarDefaults['object']);

    const node: SplitterNode = {
      id: getRecordId(),
      type: 'splitter',
      subType: 'paragraph',
      data: textSplitter,
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
        input: ['string', 'context', 'context[]'],
      },
      outputs: {
        contexts: 'context[]',
      },
    };

    return node;
  }
}

export class LanguageTextSplitterNodeImpl extends SplitterNodeImpl {
  static create(fields: { language: SupportedLanguageForSplit }): SplitterNode {
    const textSplitter = RecursiveTextSplitter.fromLanguage(fields.language);

    const node: SplitterNode = {
      id: getRecordId(),
      type: 'splitter',
      subType: fields.language,
      registerArgs: fields,
      data: textSplitter,
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
        input: ['string', 'context', 'context[]'],
      },
      outputs: {
        contexts: 'context[]',
      },
    };

    return node;
  }
}

export class TokenTextSplitterNodeImpl extends SplitterNodeImpl {
  static create(): SplitterNode {
    const tokenSplitter = new TokenTextSplitter(scalarDefaults['object']);

    const node: SplitterNode = {
      id: getRecordId(),
      type: 'splitter',
      subType: 'token',
      data: tokenSplitter,
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
        input: ['string', 'context', 'context[]'],
      },
      outputs: {
        contexts: 'context[]',
      },
    };

    return node;
  }
}
