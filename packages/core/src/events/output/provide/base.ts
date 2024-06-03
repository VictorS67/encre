import { GenerationChunk } from './generation.js';

/**
 * Defines the contract for a source provider responsible for supplying a readable source and its associated generation information.
 * The interface ensures that any implementing class will provide both the source data and its corresponding generation details,
 * making it suitable for systems that require data along with metadata about how that data was generated or processed.
 *
 * @template T The type of the source data, which can be any type depending on the specific requirements of the implementation.
 */
export interface SourceProvider<T = unknown> {
  /**
   * The source data provided by this provider. The type is generic, allowing for flexibility in what can be considered a source.
   */
  source: T;

  /**
   * The generation context associated with the source, detailing the processing or generation steps that produced the source.
   * This is typically used to track how the source was created, which can be critical for debugging or auditing purposes.
   */
  generation: GenerationChunk;
}

/**
 * An abstract base class that implements the SourceProvider interface, providing a foundational structure
 * for source management within data processing or generation systems. This class requires concrete implementations
 * to define specific behaviors for replacing, adding, and providing sources, making it highly adaptable to different data workflows.
 *
 * @template T The type of the source data. This generic type allows implementations to specify what kind of data they deal with,
 * such as streams, documents, datasets, etc.
 */
export abstract class BaseSourceProvider<T = unknown>
  implements SourceProvider<T>
{
  /**
   * The current source data managed by this provider.
   */
  source: T;

  /**
   * The generation details of the current source, encapsulating the output and any associated metadata about the generation process.
   */
  generation: GenerationChunk;

  /**
   * Replaces the current source with a new one. Implementations must define how the source is replaced in their specific context.
   *
   * @param source The new source data to replace the existing source.
   */
  abstract replace(source: T): void;

  /**
   * Adds a new source to the existing source data. This method must be defined by subclasses to specify how sources are aggregated or combined.
   *
   * @param source The source data to be added to the existing source.
   */
  abstract add(source: T): void;

  /**
   * Provides the output of the current generation context. This method must return the processed or generated output associated with the source,
   * typically used in scenarios where the final data needs to be retrieved for further use or storage.
   *
   * @returns The output of the generation process, which is defined by the concrete implementation of the generation context.
   */
  abstract provide(): GenerationChunk['output'];
}
