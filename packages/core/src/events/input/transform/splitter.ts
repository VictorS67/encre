import { Tiktoken } from 'js-tiktoken';
import { type CallableConfig } from '../../../record/index.js';
import {
  encodingForModel,
  getTiktokenModel,
} from '../../../utils/tokenizer.js';
import { BaseEvent, type BaseEventParams } from '../../base.js';
import { Context, type ContextLike } from '../load/docs/index.js';

/**
 * Defines the parameters for the context splitter.
 *
 * @example
 * ```typescript
 * const splitterParams: ContextSplitterParams = {
 *   maxSize: 2048,
 *   overlap: 200,
 *   computeContextSize: async (text: string) => {
 *     return text.length;  // Simple length-based computation.
 *   }
 * };
 * ```
 */
export interface ContextSplitterParams extends BaseEventParams {
  /**
   * The maximum size of a single context chunk.
   */
  maxSize: number;

  /**
   * The number of characters to overlap between adjacent context chunks.
   */
  overlap: number;

  /**
   * Optional function to compute the size of a context, which can be asynchronous.
   */
  computeContextSize?:
    | ((text: string) => number)
    | ((text: string) => Promise<number>);
}

/**
 * An abstract class for splitting large contexts into manageable chunks based on specified parameters.
 *
 * @typeparam CallInput - The type of the input received by the splitter.
 * @typeparam CallOutput - The type of the output returned by the splitter.
 * @typeparam CallOptions - The type of the options that can be passed to the splitter during invocation.
 */
export abstract class ContextSplitter<
    CallInput = ContextLike,
    CallOutput = Context[],
    CallOptions extends CallableConfig = CallableConfig,
  >
  extends BaseEvent<CallInput, CallOutput, CallOptions>
  implements ContextSplitterParams
{
  _isSerializable = true;

  static _name(): string {
    return 'ContextSplitter';
  }

  /**
   * The maximum size of a single context chunk.
   */
  maxSize = 2048;

  /**
   * The number of characters to overlap between adjacent context chunks.
   */
  overlap = 10;

  /**
   * Optional function to compute the size of a context, which can be asynchronous.
   */
  computeContextSize:
    | ((text: string) => number)
    | ((text: string) => Promise<number>);

  _eventNamespace(): string[] {
    return ['input', 'transform', 'splitter'];
  }

  constructor(fields?: Partial<ContextSplitterParams>) {
    super(fields ?? {});

    // this.model = getTiktokenModel(fields?.model ?? this.model);
    this.maxSize = fields?.maxSize ?? this.maxSize;
    this.overlap = fields?.overlap ?? this.overlap;

    this.computeContextSize =
      fields?.computeContextSize ?? ((text: string) => text.length);

    if (this.overlap >= this.maxSize) {
      throw new Error(
        'CANNOT set overlap chunk size larger than the max size.'
      );
    }
  }

  /**
   * Returns the parameters of the context splitter.
   */
  getParams(): Record<string, unknown> {
    return {
      maxSize: this.maxSize,
      overlap: this.overlap,
    };
  }

  /**
   * Processes the input according to the splitter's logic and returns the split contexts.
   * This method orchestrates the overall process of context splitting.
   *
   * @param input - The input to be processed. This can be a string, a Context, or an array of Contexts.
   * @param options - Optional configuration and options for the call.
   *
   * @returns An array of Contexts, each representing a chunk of the original input.
   */
  async invoke(
    input: CallInput,
    options?: Partial<CallOptions> | undefined
  ): Promise<CallOutput> {
    let texts: string[] = [];
    let metadatas: Record<string, unknown>[] = [];

    if (Array.isArray(input)) {
      const nonEmptyContext = input.filter(
        (doc) => doc.pageContent !== undefined
      );
      texts = nonEmptyContext.map(
        (context: Context): string => context.pageContent
      );
      metadatas = nonEmptyContext.map(
        (context: Context): Record<string, unknown> => context.metadata
      );
    } else if (typeof input === 'string') {
      texts.push(input);
    } else if ((input as Context).pageContent !== undefined) {
      texts.push((input as Context).pageContent);
      metadatas.push((input as Context).metadata);
    }

    const contexts: Context[] = await this.provide(texts, metadatas);
    return contexts as CallOutput;
  }

  /**
   * Splits the given texts into smaller contexts based on the configured `maxSize` and `overlap`.
   * This method should handle the actual logic of dividing the text, possibly using the `split` method.
   *
   * @param texts - Array of text strings to split.
   * @param metadatas - Array of metadata corresponding to each text string.
   *
   * @returns An array of Contexts created from the split text chunks.
   */
  async provide(
    texts: string[],
    metadatas: Record<string, unknown>[]
  ): Promise<Context[]> {
    // Padding metadata array to match the length of texts array,
    // initializing empty objects if necessary.
    const paddedMetadatas: Record<string, unknown>[] = metadatas;
    while (paddedMetadatas.length < texts.length) {
      paddedMetadatas.push({});
    }

    const contexts = new Array<Context>();
    for (let i = 0; i < texts.length; i++) {
      const text: string = texts[i];
      const metadata: Record<string, unknown> = paddedMetadatas[i];

      // Tracks the line index in the original text.
      let lineIdx = 1;

      // Stores the previous chunk of text.
      let prevChunk: string | null = null;

      // Position of the start of the previous chunk in the original text.
      let startInPrev = -1;

      for (const chunk of await this.split(text)) {
        // Content of the current chunk.
        let pageContent = '';

        // Finding the start position of the current chunk in the original text.
        const curr: number = text.indexOf(chunk, startInPrev + 1);

        if (prevChunk === null) {
          // For the first chunk, calculating new lines before its start.
          const newLinesBeforeFirstChunk: number = this.getNumberOfNewLines(
            text,
            0,
            curr
          );

          lineIdx += newLinesBeforeFirstChunk;
        } else {
          // For subsequent chunks, adjusting the line index based on the overlap
          // with the previous chunk.
          const endInPrev: number =
            startInPrev + (await this.computeContextSize(prevChunk));

          if (endInPrev < curr) {
            const newlinesInBetween = this.getNumberOfNewLines(
              text,
              endInPrev,
              curr
            );

            lineIdx += newlinesInBetween;
          } else if (endInPrev > curr) {
            const newlinesInBetween = this.getNumberOfNewLines(
              text,
              curr,
              endInPrev
            );

            lineIdx -= newlinesInBetween;
          }
        }

        const newLines: number = this.getNumberOfNewLines(chunk);

        const loc =
          metadata.loc && typeof metadata.loc === 'object'
            ? { ...metadata.loc }
            : {};

        loc['lines'] = {
          from: lineIdx,
          to: lineIdx + newLines,
        };

        pageContent += chunk;
        contexts.push(
          new Context({
            pageContent,
            metadata: {
              ...metadata,
              loc,
            },
          })
        );

        lineIdx += newLines;
        prevChunk = chunk;
        startInPrev = curr;
      }
    }

    return contexts;
  }

  /**
   * Calculates the number of newline characters in a given text segment.
   * This method can be used to determine the number of lines within a specified portion of text.
   * If start and end parameters are not provided, it counts new lines in the entire string.
   *
   * @param text - The text within which to count newline characters.
   * @param start - The starting index from which to begin counting (inclusive).
   * @param end - The ending index at which to stop counting (exclusive).
   * @returns The count of newline characters found in the specified text segment.
   *
   * @example
   * ```typescript
   * const text = "Line one\nLine two\nLine three";
   * const totalNewLines = splitter.getNumberOfNewLines(text);
   * console.log(totalNewLines); // Outputs: 2
   *
   * // To count new lines in a substring
   * const newLinesInSubstring = splitter.getNumberOfNewLines(text, 0, 15);
   * console.log(newLinesInSubstring); // Outputs: 1 (only counts new lines up to "Line two")
   * ```
   */
  getNumberOfNewLines(text: string, start?: number, end?: number): number {
    return (text.slice(start, end).match(/\n/g) || []).length;
  }

  /**
   * Abstract method that must be implemented to define how text is split into chunks.
   * This method should return an array of strings, each representing a chunk of the original text.
   *
   * @param text - The text to split.
   *
   * @returns A promise that resolves to an array of string chunks.
   */
  abstract split(text: string): Promise<string[]>;
}

/**
 * Defines the parameters for the text splitter.
 *
 * @example
 * ```typescript
 * const splitterParams: ContextSplitterParams = {
 *   separator: "\n\n",
 *   keepSeparator: true,
 *   maxSize: 2048,
 *   overlap: 200,
 *   computeContextSize: async (text: string) => {
 *     return text.length;  // Simple length-based computation.
 *   }
 * };
 * ```
 */
export interface TextSplitterParams extends ContextSplitterParams {
  /**
   * Separator in splitting text
   */
  separator: string;

  /**
   * Flag to determine if the separator should be kept in the output
   */
  keepSeparator: boolean;
}

/**
 * The TextSplitter class is responsible for splitting a given text into multiple contexts
 * based on specified parameters. It extends the functionality of ContextSplitter by allowing
 * the text to be split using a custom separator and controlling whether the separator should
 * be retained in the outputs.
 *
 * @param CallInput - The type of input the splitter handles.
 * @param CallOutput - The type of output returned after splitting.
 * @param CallOptions - Configuration options passed to each call.
 *
 * @example
 * ```typescript
 * const textSplitter = new TextSplitter({
 *   maxSize: 1024,
 *   overlap: 50,
 *   separator: "\n\n",
 *   keepSeparator: true
 * });
 *
 * const inputText = `First paragraph.\n\nSecond paragraph.\n\nThird paragraph.`;
 * const contexts = await textSplitter.invoke(inputText);
 * console.log(contexts); // Outputs the text split into contexts with separators included.
 * ```
 */
export class TextSplitter<
    CallInput = ContextLike,
    CallOutput = Context[],
    CallOptions extends CallableConfig = CallableConfig,
  >
  extends ContextSplitter<CallInput, CallOutput, CallOptions>
  implements TextSplitterParams
{
  static _name(): string {
    return 'TextSplitter';
  }

  // Default separator set to two new lines
  separator = '\n\n';

  // By default, the separator is not kept in the output
  keepSeparator = false;

  constructor(fields?: Partial<TextSplitterParams>) {
    super(fields);
    this.separator = fields?.separator ?? this.separator;
    this.keepSeparator = fields?.keepSeparator ?? this.keepSeparator;
  }

  getParams(): Partial<TextSplitterParams> {
    return {
      ...super.getParams(),
      separator: this.separator,
      keepSeparator: this.keepSeparator,
    };
  }

  /**
   * Splits the text into segments based on the defined separator.
   * If `keepSeparator` is true, the separator is included in the output segments.
   *
   * @param text - The text to split.
   * @param separator - The separator used to split the text.
   * @returns An array of text segments.
   * @internal
   */
  protected _splitWithSeparator(text: string, separator: string): string[] {
    let splits: string[];
    if (separator) {
      if (this.keepSeparator) {
        const regexEscapedSeparator: string = separator.replace(
          /[/\-\\^$*+?.()|[\]{}]/g,
          '\\$&'
        );

        // Splitting and keeping the separator in the output
        splits = text.split(new RegExp(`(?=${regexEscapedSeparator})`));
      } else {
        // Splitting without keeping the separator
        splits = text.split(separator);
      }
    } else {
      // Splitting character by character if no separator is provided
      splits = text.split('');
    }

    // Filtering out empty strings from the result
    return splits.filter((s) => s !== '');
  }

  /**
   * Joins an array of strings into a single string with the provided separator,
   * returns null if the result is empty.
   *
   * @param texts - The array of text pieces to join.
   * @param separator - The separator to use between text pieces.
   * @returns The joined text or null if the resulting text is empty.
   * @internal
   */
  protected _joinTextWithSeparator(
    texts: string[],
    separator: string
  ): string | null {
    const text: string = texts.join(separator).trim();
    return text === '' ? null : text;
  }

  /**
   * Merges smaller text splits into larger chunks based on the maximum context size.
   * Ensures that the merged text does not exceed the specified size limits.
   *
   * @param splits - The text splits to merge.
   * @param separator - The separator used between merged text pieces.
   * @returns An array of merged text pieces.
   * @internal
   */
  protected async _mergeSplits(
    splits: string[],
    separator: string
  ): Promise<string[]> {
    const newSplits: string[] = [];
    const currGrp: string[] = [];
    let totalSize = 0;

    // Map to store sizes of each split for efficient access
    const sizes = new Map();
    sizes.set(separator, await this.computeContextSize(separator));

    for (const split of splits) {
      // Caching split sizes to avoid redundant computations
      if (!sizes.has(split)) {
        sizes.set(split, await this.computeContextSize(split));
      }
      const splitSize: number = sizes.get(split);

      // Logic to ensure each chunk does not exceed the maximum context size
      if (totalSize + splitSize + sizes.get(separator) > this.maxSize) {
        // Warning for chunk size exceeding the maximum allowed size
        if (totalSize > this.maxSize) {
          console.warn(
            `Created a chunk with a size of ${totalSize} which is larger than the max size of ${this.maxSize}`
          );
        }

        // Joining the current group of splits into a single text chunk
        if (currGrp.length > 0) {
          const text: string | null = this._joinTextWithSeparator(
            currGrp,
            separator
          );

          // Adding the joined text to the new splits if it's not null
          if (text !== null) {
            newSplits.push(text);
          }

          // Adjusting the current group based on total size and overlap
          // Keep popping the first split in the group if
          // - the current chunk size is greater than the overlap size;
          // - or the new chunk exceeds the maximum context size.
          while (
            currGrp.length > 0 &&
            (totalSize > this.overlap ||
              (totalSize + splitSize + sizes.get(separator) > this.maxSize &&
                totalSize > 0))
          ) {
            if (!sizes.has(currGrp[0])) {
              sizes.set(currGrp[0], await this.computeContextSize(currGrp[0]));
            }
            totalSize -= sizes.get(currGrp[0]);

            currGrp.shift();
          }
        }
      }

      // Adding the current split to the group and updating the total size
      currGrp.push(split);
      totalSize += splitSize;
    }

    // Joining the final group of splits and adding to new splits if not null
    const text = this._joinTextWithSeparator(currGrp, separator);
    if (text !== null) {
      newSplits.push(text);
    }

    return newSplits;
  }

  /**
   * Split text based on the configured separator and merge strategy.
   *
   * @param text - The text to split.
   * @returns A promise that resolves to an array of split text pieces.
   */
  async split(text: string): Promise<string[]> {
    // split the text using the existing method
    const splits: string[] = this._splitWithSeparator(text, this.separator);

    // merge the splits
    return this._mergeSplits(splits, this.keepSeparator ? '' : this.separator);
  }
}

/**
 * Parameters for configuring the RecursiveTextSplitter.
 * Extends the basic TextSplitterParams with additional functionality to handle multiple separators.
 */
export interface RecursiveTextSplitterParams
  extends Partial<TextSplitterParams> {
  /**
   * An array of strings defining the multiple separators to be used for splitting text.
   * The order of separators can influence the granularity of the resulting text splits.
   */
  separators: string[];
}

/**
 * Enumerates supported languages for splitting, each potentially using language-specific separators.
 */
export type SupportedLanguageForSplit =
  | 'cpp'
  | 'go'
  | 'java'
  | 'js'
  | 'php'
  | 'proto'
  | 'python'
  | 'rst'
  | 'ruby'
  | 'rust'
  | 'scala'
  | 'swift'
  | 'markdown'
  | 'latex'
  | 'html'
  | 'sol';

/**
 * The {@link RecursiveTextSplitter} is an advanced text splitting utility designed to handle complex splitting requirements.
 * It leverages maxSize and overlap parameters to ensure efficient and context-aware splitting.
 *
 * Features:
 * - **Recursive Splitting Strategy:** Unlike the basic {@link TextSplitter}, the {@link RecursiveTextSplitter} applies
 *   a depth-oriented approach, gradually splitting text from higher to lower granularity.
 * - **Dynamic Separator Selection:** Identifies the first applicable separator from the array and adjusts the array by removing
 *   higher granularity separators in each recursive step.
 * - **Good Splits Identification:** Focuses on finding 'good splits'—segments that maximize the number of splits while keeping
 *   each segment's size under maxSize.
 * - **Merging and Outputting:** Merges 'good splits' before adding them to the output array, maintaining textual coherence.
 * - **Handling Nested Separators:** Recursively handles nested separators to manage complex texts, aiming to keep segments under maxSize.
 * - **Context Preservation:** Enhances continuity between splits by incorporating overlapped sections from preceding segments.
 *
 * Note: While the {@link RecursiveTextSplitter} reduces the likelihood of exceeding maxSize, it does not guarantee that all segments
 * will always be smaller than maxSize.
 *
 * Usage: This splitter is ideal for complex and nuanced text processing tasks where granularity, context preservation, and size constraints are crucial.
 *
 * @example
 * ```typescript
 * // Assume we're processing a long document where logical breaks are represented by different separators like double newlines, single newlines, or punctuations.
 * const longDocument = "Section 1: Introduction\n\nThis section introduces the main concepts...\nSection 2: Development\nThis section covers the development...";
 * const splitter = new RecursiveTextSplitter({
 *   maxSize: 1000,  // Maximum characters in a single chunk
 *   overlap: 50,    // Characters to overlap between chunks
 *   separators: ['\n\n', '.', '\n'],  // Order of separators to apply
 *   keepSeparator: true
 * });
 *
 * const splitText = await splitter.invoke(longDocument);
 * console.log(splitText);
 * // Output will show the text split into manageable chunks, maintaining logical separations and sections where possible.
 * ```
 */
export class RecursiveTextSplitter
  extends TextSplitter
  implements RecursiveTextSplitterParams
{
  static _name(): string {
    return 'RecursiveTextSplitter';
  }

  /**
   * An array of strings defining the multiple separators to be used for splitting text.
   * The order of separators can influence the granularity of the resulting text splits.
   */
  separators: string[] = ['\n\n', '\n', ' ', ''];

  keepSeparator = true;

  constructor(fields?: Partial<RecursiveTextSplitterParams>) {
    super(fields);
    this.separators = fields?.separators ?? this.separators;
    this.keepSeparator = fields?.keepSeparator ?? this.keepSeparator;
  }

  getParams(): Partial<RecursiveTextSplitterParams> {
    return {
      maxSize: this.maxSize,
      overlap: this.overlap,
      separators: this.separators,
      keepSeparator: this.keepSeparator,
    };
  }

  /**
   * Recursively splits text using an array of separators, managing complex text structures.
   * Each recursive call processes the text with the next separator in the array until the base case is reached.
   *
   * @param text - The text to split.
   * @param separators - The array of separators used for recursive splitting.
   * @returns A promise resolving to an array of split text segments.
   * @internal
   */
  private async _recursivelySplit(
    text: string,
    separators: string[]
  ): Promise<string[]> {
    let separator: string = separators[separators.length - 1];
    let newSeparators: string[] | undefined;
    for (let i = 0; i < separators.length; i++) {
      const currSeparator: string = separators[i];
      if (currSeparator === '') {
        // current separator is the final one, which means the base case.
        separator = currSeparator;
        break;
      }

      if (text.includes(currSeparator)) {
        // current separator is found in text, which means it can be splitted.
        separator = currSeparator;
        newSeparators = separators.slice(i + 1);
        break;
      }
    }

    const newSplits: string[] = [];
    const splits: string[] = this._splitWithSeparator(text, separator);

    let goodSplits: string[] = [];
    const _separator: string = this.keepSeparator ? '' : separator;

    // Map to store sizes of each split for efficient access
    const sizes = new Map();

    for (const split of splits) {
      // Caching split sizes to avoid redundant computations
      if (!sizes.has(split)) {
        sizes.set(split, await this.computeContextSize(split));
      }
      const splitSize: number = sizes.get(split);

      if (splitSize < this.maxSize) {
        goodSplits.push(split);
      } else {
        if (goodSplits.length > 0) {
          const mergedSplits: string[] = await this._mergeSplits(
            goodSplits,
            _separator
          );
          newSplits.push(...mergedSplits);
          goodSplits = [];
        }

        if (!newSeparators) {
          newSplits.push(split);
        } else {
          const otherSplits: string[] = await this._recursivelySplit(
            split,
            newSeparators
          );
          newSplits.push(...otherSplits);
        }
      }
    }

    if (goodSplits.length > 0) {
      const mergedSplits: string[] = await this._mergeSplits(
        goodSplits,
        _separator
      );
      newSplits.push(...mergedSplits);
    }

    return newSplits;
  }

  async split(text: string): Promise<string[]> {
    return this._recursivelySplit(text, this.separators);
  }

  /**
   * Retrieves an array of predefined separators tailored for the syntax and structure of a specified programming
   * or markup language. This method is used to facilitate language-specific text splitting by recognizing
   * patterns and structures unique to each language.
   *
   * @param language - A value from the SupportedLanguageForSplit enum, representing the programming or markup language.
   * @returns An array of strings, each a separator used to split text based on the syntactical features of the specified language.
   * @throws Error if the provided language is not supported, ensuring that callers handle or avoid unsupported languages.
   *
   * @example
   * ```typescript
   * // Example for JavaScript
   * const jsSeparators = RecursiveTextSplitter.getSeparatorsFromLanguage("js");
   * console.log(jsSeparators);
   * // Output might include separators for functions, loops, etc., like "\nfunction ", "\nif(", etc.
   * ```
   *
   * @example
   * ```typescript
   * // Example for HTML
   * const htmlSeparators = RecursiveTextSplitter.getSeparatorsFromLanguage("html");
   * console.log(htmlSeparators);
   * // Output might include separators for different HTML tags like "<div>", "<p>", "<h1>", etc.
   * ```
   */
  static getSeparatorsFromLanguage(language: SupportedLanguageForSplit) {
    switch (language) {
      case 'cpp':
        return [
          // Split along class definitions
          '\nclass ',
          // Split along function definitions
          '\nvoid ',
          '\nint ',
          '\nfloat ',
          '\ndouble ',
          // Split along control flow statements
          '\nif ',
          '\nfor ',
          '\nwhile ',
          '\nswitch ',
          '\ncase ',
          // Split by the normal type of lines
          '\n\n',
          '\n',
          ' ',
          '',
        ];
      case 'go':
        return [
          // Split along function definitions
          '\nfunc ',
          '\nvar ',
          '\nconst ',
          '\ntype ',
          // Split along control flow statements
          '\nif ',
          '\nfor ',
          '\nswitch ',
          '\ncase ',
          // Split by the normal type of lines
          '\n\n',
          '\n',
          ' ',
          '',
        ];
      case 'java':
        return [
          // Split along class definitions
          '\nclass ',
          // Split along method definitions
          '\npublic ',
          '\nprotected ',
          '\nprivate ',
          '\nstatic ',
          // Split along control flow statements
          '\nif ',
          '\nfor ',
          '\nwhile ',
          '\nswitch ',
          '\ncase ',
          // Split by the normal type of lines
          '\n\n',
          '\n',
          ' ',
          '',
        ];
      case 'js':
        return [
          // Split along function definitions
          '\nfunction ',
          '\nconst ',
          '\nlet ',
          '\nvar ',
          '\nclass ',
          // Split along control flow statements
          '\nif ',
          '\nfor ',
          '\nwhile ',
          '\nswitch ',
          '\ncase ',
          '\ndefault ',
          // Split by the normal type of lines
          '\n\n',
          '\n',
          ' ',
          '',
        ];
      case 'php':
        return [
          // Split along function definitions
          '\nfunction ',
          // Split along class definitions
          '\nclass ',
          // Split along control flow statements
          '\nif ',
          '\nforeach ',
          '\nwhile ',
          '\ndo ',
          '\nswitch ',
          '\ncase ',
          // Split by the normal type of lines
          '\n\n',
          '\n',
          ' ',
          '',
        ];
      case 'proto':
        return [
          // Split along message definitions
          '\nmessage ',
          // Split along service definitions
          '\nservice ',
          // Split along enum definitions
          '\nenum ',
          // Split along option definitions
          '\noption ',
          // Split along import statements
          '\nimport ',
          // Split along syntax declarations
          '\nsyntax ',
          // Split by the normal type of lines
          '\n\n',
          '\n',
          ' ',
          '',
        ];
      case 'python':
        return [
          // First, try to split along class definitions
          '\nclass ',
          '\ndef ',
          '\n\tdef ',
          // Now split by the normal type of lines
          '\n\n',
          '\n',
          ' ',
          '',
        ];
      case 'rst':
        return [
          // Split along section titles
          '\n===\n',
          '\n---\n',
          '\n***\n',
          // Split along directive markers
          '\n.. ',
          // Split by the normal type of lines
          '\n\n',
          '\n',
          ' ',
          '',
        ];
      case 'ruby':
        return [
          // Split along method definitions
          '\ndef ',
          '\nclass ',
          // Split along control flow statements
          '\nif ',
          '\nunless ',
          '\nwhile ',
          '\nfor ',
          '\ndo ',
          '\nbegin ',
          '\nrescue ',
          // Split by the normal type of lines
          '\n\n',
          '\n',
          ' ',
          '',
        ];
      case 'rust':
        return [
          // Split along function definitions
          '\nfn ',
          '\nconst ',
          '\nlet ',
          // Split along control flow statements
          '\nif ',
          '\nwhile ',
          '\nfor ',
          '\nloop ',
          '\nmatch ',
          '\nconst ',
          // Split by the normal type of lines
          '\n\n',
          '\n',
          ' ',
          '',
        ];
      case 'scala':
        return [
          // Split along class definitions
          '\nclass ',
          '\nobject ',
          // Split along method definitions
          '\ndef ',
          '\nval ',
          '\nvar ',
          // Split along control flow statements
          '\nif ',
          '\nfor ',
          '\nwhile ',
          '\nmatch ',
          '\ncase ',
          // Split by the normal type of lines
          '\n\n',
          '\n',
          ' ',
          '',
        ];
      case 'swift':
        return [
          // Split along function definitions
          '\nfunc ',
          // Split along class definitions
          '\nclass ',
          '\nstruct ',
          '\nenum ',
          // Split along control flow statements
          '\nif ',
          '\nfor ',
          '\nwhile ',
          '\ndo ',
          '\nswitch ',
          '\ncase ',
          // Split by the normal type of lines
          '\n\n',
          '\n',
          ' ',
          '',
        ];
      case 'markdown':
        return [
          // First, try to split along Markdown headings (starting with level 2)
          '\n## ',
          '\n### ',
          '\n#### ',
          '\n##### ',
          '\n###### ',
          // Note the alternative syntax for headings (below) is not handled here
          // Heading level 2
          // ---------------
          // End of code block
          '```\n\n',
          // Horizontal lines
          '\n\n***\n\n',
          '\n\n---\n\n',
          '\n\n___\n\n',
          // Note that this splitter doesn't handle horizontal lines defined
          // by *three or more* of ***, ---, or ___, but this is not handled
          '\n\n',
          '\n',
          ' ',
          '',
        ];
      case 'latex':
        return [
          // First, try to split along Latex sections
          '\n\\chapter{',
          '\n\\section{',
          '\n\\subsection{',
          '\n\\subsubsection{',
          // Now split by environments
          '\n\\begin{enumerate}',
          '\n\\begin{itemize}',
          '\n\\begin{description}',
          '\n\\begin{list}',
          '\n\\begin{quote}',
          '\n\\begin{quotation}',
          '\n\\begin{verse}',
          '\n\\begin{verbatim}',
          // Now split by math environments
          '\n\\begin{align}',
          '$$',
          '$',
          // Now split by the normal type of lines
          '\n\n',
          '\n',
          ' ',
          '',
        ];
      case 'html':
        return [
          // First, try to split along HTML tags
          '<body>',
          '<div>',
          '<p>',
          '<br>',
          '<li>',
          '<h1>',
          '<h2>',
          '<h3>',
          '<h4>',
          '<h5>',
          '<h6>',
          '<span>',
          '<table>',
          '<tr>',
          '<td>',
          '<th>',
          '<ul>',
          '<ol>',
          '<header>',
          '<footer>',
          '<nav>',
          // Head
          '<head>',
          '<style>',
          '<script>',
          '<meta>',
          '<title>',
          // Normal type of lines
          '\n\n',
          '\n',
          ' ',
          '',
        ];
      case 'sol':
        return [
          // Split along compiler informations definitions
          '\npragma ',
          '\nusing ',
          // Split along contract definitions
          '\ncontract ',
          '\ninterface ',
          '\nlibrary ',
          // Split along method definitions
          '\nconstructor ',
          '\ntype ',
          '\nfunction ',
          '\nevent ',
          '\nmodifier ',
          '\nerror ',
          '\nstruct ',
          '\nenum ',
          // Split along control flow statements
          '\nif ',
          '\nfor ',
          '\nwhile ',
          '\ndo while ',
          '\nassembly ',
          // Split by the normal type of lines
          '\n\n',
          '\n',
          ' ',
          '',
        ];
      default:
        throw new Error(`Language ${language} is not supported for splitting.`);
    }
  }

  /**
   * Utility method to generate a RecursiveTextSplitter instance based on a supported programming language,
   * applying predefined separators that are typical for the syntax of the specified language.
   *
   * @param language - A supported language for which the splitter will be configured.
   * @param options - Optional parameters to override default configurations.
   * @returns A configured RecursiveTextSplitter instance for the specified language.
   *
   * @example
   * ```typescript
   * // Creating a RecursiveTextSplitter instance for JavaScript code.
   * const splitter = RecursiveTextSplitter.fromLanguage("js", {
   *   maxSize: 2048,
   *   overlap: 100,
   *   keepSeparator: true
   * });
   *
   * const jsCode = `function hello() {\\n  console.log("Hello, world!");\\n}\\nfunction bye() {\\n  console.log("Goodbye, world!");\\n}`;
   * const splitCode = await splitter.invoke(jsCode);
   * console.log(splitCode); // Outputs the code split into functions.
   * ```
   */
  static fromLanguage(
    language: SupportedLanguageForSplit,
    options?: Partial<RecursiveTextSplitterParams>
  ) {
    return new RecursiveTextSplitter({
      ...options,
      separators: RecursiveTextSplitter.getSeparatorsFromLanguage(language),
    });
  }
}

/**
 * Defines parameters for the {@link TokenTextSplitter} that extends the {@link TextSplitterParams}.
 */
export interface TokenTextSplitterParams extends TextSplitterParams {
  /**
   * The name of the model used for tokenization. This typically would be a name
   * identifying a specific language model that understands how to tokenize the input text.
   */
  modelName: string;

  /**
   * An array of allowed special characters or tokens. This allows for the inclusion of
   * specific characters or tokens in the tokenization process. If set to "all",
   * it implies that all special characters are allowed during tokenization.
   */
  allowedSpecial: Array<string> | 'all';

  /**
   * An array of disallowed special characters or tokens. This parameter is used
   * to explicitly exclude certain characters or tokens from the tokenization process.
   * If set to "all", it implies that all special characters are disallowed.
   */
  disallowedSpecial: Array<string> | 'all';
}

/**
 * The `TokenTextSplitter` is a specialized text splitter that utilizes a tokenization
 * model to split text. It is particularly useful for applications where precise control
 * over the inclusion and exclusion of specific tokens or characters is necessary, such as
 * in natural language processing or data sanitization tasks.
 * 
 * @example
 * ```typescript
 * const splitter = new TokenTextSplitter({
 *   maxSize: 512,
 *   overlap: 50,
 *   modelName: "gpt3-3.5-turbo",
 *   allowedSpecial: ["{", "}"], // Allow curly braces
 *   disallowedSpecial: "all"   // Disallow all other special characters
 * });
 *
 * const text = "Here is some text with {special characters} that need to be handled properly.";
 * const chunks = await splitter.invoke(text);
 * console.log(chunks);
 * ```
 */
export class TokenTextSplitter
  extends TextSplitter
  implements TokenTextSplitterParams
{
  static _name(): string {
    return 'TokenTextSplitter';
  }

  /**
   * The name of the model used for tokenization. This typically would be a name
   * identifying a specific language model that understands how to tokenize the input text.
   */
  modelName: string;

  /**
   * An array of allowed special characters or tokens. This allows for the inclusion of
   * specific characters or tokens in the tokenization process. If set to "all",
   * it implies that all special characters are allowed during tokenization.
   */
  allowedSpecial: string[] | 'all';

  /**
   * An array of disallowed special characters or tokens. This parameter is used
   * to explicitly exclude certain characters or tokens from the tokenization process.
   * If set to "all", it implies that all special characters are disallowed.
   */
  disallowedSpecial: string[] | 'all';

  /**
   * Tiktokenizer used for encoding text.
   */
  private tokenizer: Tiktoken;

  constructor(fields?: Partial<TokenTextSplitterParams>) {
    super(fields);

    this.modelName = fields?.modelName ?? 'gpt2';
    this.allowedSpecial = fields?.allowedSpecial ?? [];
    this.disallowedSpecial = fields?.disallowedSpecial ?? 'all';
  }

  getParams(): Partial<TokenTextSplitterParams> {
    return {
      maxSize: this.maxSize,
      overlap: this.overlap,
      modelName: this.modelName,
      allowedSpecial: this.allowedSpecial,
      disallowedSpecial: this.disallowedSpecial,
    };
  }

  /**
   * Splits the given text into tokens based on the tokenizer configuration.
   */
  async split(text: string): Promise<string[]> {
    if (!this.tokenizer) {
      this.tokenizer = await encodingForModel(getTiktokenModel(this.modelName));
    }

    const splits: string[] = [];

    const tokens: number[] = this.tokenizer.encode(
      text,
      this.allowedSpecial,
      this.disallowedSpecial
    );

    let start = 0;
    let end: number = Math.min(start + this.maxSize, tokens.length);

    let chunkTokens: number[] = tokens.slice(start, end);
    while (start < tokens.length) {
      splits.push(this.tokenizer.decode(chunkTokens));

      start += this.maxSize - this.overlap;
      end = Math.min(start + this.maxSize, tokens.length);
      chunkTokens = tokens.slice(start, end);
    }

    return splits;
  }
}
