/**
 * Contains all relevant information returned by an LLM Embeddings.
 */
export type EmbedResult = {
  /**
   * Embedding vectors
   */
  embedding: number[];

  /**
   * Metadata from the LLM embedding API
   */
  embedOutput?: Record<string, any>;
};