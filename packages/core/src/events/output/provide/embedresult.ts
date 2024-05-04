import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";

/**
 * Contains all relevant information returned by an LLM Embeddings.
 */
export type EmbedResult = {
  embeddings: number[];

  /**
   * Metadata from the LLM embedding API
   */
  embedOutput?: Record<string, any>;
}