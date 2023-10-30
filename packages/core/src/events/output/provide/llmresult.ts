import { Generation } from './generation';

/**
 * Contains all relevant information returned by an LLM.
 */
export type LLMResult = {
  /**
   * List of the things generated. Each input could have multiple {@link Generation}, hence this is a list of lists.
   */
  generations: Generation[][];

  /**
   * LLM-provider specific output.
   */
  llmOutput?: Record<string, any>;
}