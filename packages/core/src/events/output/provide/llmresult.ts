import { Generation } from './generation';

/**
 * Contains all relevant information returned by an LLM.
 */
export type LLMResult = {
  /**
   * One input could have multiple {@link Generation}, hence this is a list.
   */
  generations: Generation[];

  /**
   * LLM-provider specific output.
   */
  llmOutput?: Record<string, any>;
}