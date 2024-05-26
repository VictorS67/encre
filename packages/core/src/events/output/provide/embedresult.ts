/**
 * Contains all relevant information returned by an LLM Embeddings.
 */
export type EmbedResult = {
  embedding: number[];

  /**
   * Metadata from the LLM embedding API
   */
  embedOutput?: Record<string, any>;
};