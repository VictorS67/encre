export interface Generation {
  /**
   * Generated output
   */
  output: unknown;

  /**
   * Raw generation information from the provider.
   * May include reason for finishing.
   */
  info?: Record<string, unknown>;
}

export type GenerationChunkField = Generation;

export abstract class GenerationChunk implements Generation {
  public output: unknown;

  public info?: Record<string, unknown>;

  constructor(fields: GenerationChunkField) {
    this.output = fields.output;
    this.info = fields.info;
  }

  abstract concat(chunk: GenerationChunk): GenerationChunk;
}