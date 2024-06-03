import fs from 'fs';
import { BaseSourceProvider } from './base.js';
import { GenerationChunk } from './generation.js';

/**
 * Defines the structure of fields required for initializing a GenerationFileChunk.
 * This type supports both file paths and binary Blob objects as output.
 */
export type GenerationFileChunkField = {
  /**
   * Either a string representing a file path or a Blob object representing binary data.
   */
  output: string | Blob;

  /**
   * Optional metadata associated with the generation of the file, such as creation details or processing metadata.
   */
  info?: Record<string, unknown>;
};

/**
 * Represents a chunk of a generation process that deals specifically with file outputs. This class extends GenerationChunk
 * to handle file-based data, either as paths or as binary data (Blobs), providing functionality for concatenating such chunks.
 *
 * @extends GenerationChunk
 */
export class GenerationFileChunk extends GenerationChunk {
  /** @hidden */
  declare output: string | Blob;

  /**
   * Constructs a new instance of GenerationFileChunk.
   * @param fields An object containing the file output and optional metadata.
   */
  constructor(fields: GenerationFileChunkField) {
    super(fields);
  }

  /**
   * Retrieves the output as a Blob object, converting from a file path if necessary.
   * @returns A Blob representation of the output.
   */
  protected _getOutputBlob(): Blob {
    if (typeof this.output === 'string') {
      return new Blob([fs.readFileSync(this.output)], {
        type: 'application/pdf',
      });
    }

    return this.output;
  }

  /**
   * Concatenates this file chunk with another, combining their contents into a single Blob.
   * @param chunk Another GenerationFileChunk to concatenate with this chunk.
   * @returns A new GenerationFileChunk representing the concatenated output.
   */
  concat(chunk: GenerationFileChunk): GenerationFileChunk {
    const newBlob = new Blob([this._getOutputBlob(), chunk._getOutputBlob()], {
      type: 'application/pdf',
    });

    return new GenerationFileChunk({
      output: newBlob,
      info: {
        ...this.info,
        ...chunk.info,
        source: 'blob',
        type: newBlob.type,
        size: newBlob.size,
      },
    });
  }
}

/**
 * A source provider that handles file sources, capable of managing both file paths and binary data (Blobs).
 * This class is responsible for supplying file-based data to consumers, supporting operations such as replace and add,
 * which manipulate the underlying source.
 *
 * @extends BaseSourceProvider
 */
export class FileProvider extends BaseSourceProvider {
  /** @hidden */
  declare source: string | Blob;

  /** @hidden */
  declare generation: GenerationFileChunk;

  /**
   * Initializes a new FileProvider with a given source.
   * @param source Either a string representing a file path or a Blob object.
   */
  constructor(source: string | Blob) {
    super();
    this.source = source;
    this.generation = new GenerationFileChunk({
      output: source,
      info: {
        source: typeof source === 'string' ? source : 'blob',
        type: typeof source === 'string' ? undefined : source.type,
        size: typeof source === 'string' ? undefined : source.size,
      },
    });
  }

  /**
   * Replaces the current source with a new one.
   * @param source A new source, either a file path or a Blob, to replace the existing one.
   */
  replace(source: string | Blob) {
    this.generation = new GenerationFileChunk({
      output: source,
      info: {
        source: typeof source === 'string' ? source : 'blob',
        type: typeof source === 'string' ? undefined : source.type,
        size: typeof source === 'string' ? undefined : source.size,
      },
    });
  }

  /**
   * Adds a new source to the existing one, effectively concatenating them if applicable.
   * @param source A new source, either a file path or a Blob, to add to the existing source.
   */
  add(source: string | Blob) {
    const newGeneration = new GenerationFileChunk({
      output: source,
      info: {
        source: typeof source === 'string' ? source : 'blob',
        type: typeof source === 'string' ? undefined : source.type,
        size: typeof source === 'string' ? undefined : source.size,
      },
    });

    this.generation.concat(newGeneration);
  }

  /**
   * Provides the current source output.
   * @returns The current source, either as the original string (file path) or Blob.
   */
  provide(): string | Blob {
    return this.generation.output;
  }
}
