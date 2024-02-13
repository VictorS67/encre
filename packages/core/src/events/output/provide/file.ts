import fs from 'fs';
import { BaseSourceProvider } from './base.js';
import { GenerationChunk } from './generation.js';

export type GenerationFileChunkField = {
  /**
   * Generated file output.
   * @type {string} This output represents a file path.
   * @type {Blob} This output represetns a file in Blob.
   */
  output: string | Blob;

  info?: Record<string, unknown>;
};

export class GenerationFileChunk extends GenerationChunk {
  declare output: string | Blob;

  constructor(fields: GenerationFileChunkField) {
    super(fields);
  }

  protected _getOutputBlob(): Blob {
    if (typeof this.output === 'string') {
      return new Blob([fs.readFileSync(this.output)], {
        type: 'application/pdf',
      });
    }

    return this.output;
  }

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
 * Class that provide file source as a file path or a file Blob.
 */
export class FileProvider extends BaseSourceProvider {
  declare source: string | Blob;

  declare generation: GenerationFileChunk;

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

  provide(): string | Blob {
    return this.generation.output;
  }
}
