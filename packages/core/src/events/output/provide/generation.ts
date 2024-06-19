/**
 * Represents the result of a generation process, encapsulating the generated output and any associated metadata.
 */
export interface Generation {
  /**
   * The primary data that was generated. The type is unspecified (`unknown`), allowing for flexibility.
   */
  output: unknown;

  /**
   * Optional metadata associated with the generation. This may include diagnostics, statistics,
   * or reasons why the generation process was concluded, structured as a record of key-value pairs.
   */
  info?: Record<string, unknown>;
}

/**
 * Alias for the Generation interface, used specifically in the context of handling generation data chunks.
 * This type is intended to maintain consistency and clarity in interfaces and classes that deal with data chunks.
 */
export type GenerationChunkField = Generation;

/**
 * Abstract class that defines the structure and functionality of a generation chunk.
 * A generation chunk represents a segment or part of a larger data generation process,
 * encapsulating both the data itself and optional metadata about the generation.
 *
 * Implementations of this class are expected to provide a method for concatenating
 * multiple chunks into a single coherent unit, facilitating the handling of streamed or
 * segmented data.
 */
export abstract class GenerationChunk implements Generation {
  /**
   * The generated output of this chunk. The nature of this data is determined by the specific implementation.
   */
  public output: unknown;

  /**
   * Optional metadata providing additional information about this particular chunk's generation.
   */
  public info?: Record<string, unknown>;

  /**
   * Constructs a new instance of GenerationChunk.
   *
   * @param fields An object conforming to the GenerationChunkField interface, providing initial values for the output and optional info.
   */
  constructor(fields: GenerationChunkField) {
    this.output = fields.output;
    this.info = fields.info;
  }

  /**
   * Abstract method that must be implemented by subclasses to support concatenation of this chunk with another.
   * The method should define how two chunks are combined into a single, larger chunk.
   *
   * @param chunk Another instance of a GenerationChunk to be concatenated with this instance.
   * @returns A new instance of GenerationChunk representing the concatenated result.
   */
  abstract concat(chunk: GenerationChunk): GenerationChunk;
}
