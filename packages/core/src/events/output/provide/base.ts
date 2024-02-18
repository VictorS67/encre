import { GenerationChunk } from './generation.js';

/**
 * Interface that defines the source provider for providing readable
 * source.
 */
export interface SourceProvider<T = unknown> {
  source: T;

  generation: GenerationChunk;
}

export abstract class BaseSourceProvider<T = unknown> implements SourceProvider<T> {
  source: T;

  generation: GenerationChunk;

  abstract replace(source: T): void;

  abstract add(source: T): void;

  abstract provide(): GenerationChunk['output'];
}