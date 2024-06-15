export * from './base.js';

/**
 * Interface for tracking token usage in LLM/Chat LM API Calls.
 */
export interface TokenUsage {
  completionTokens?: number;
  promptTokens?: number;
  totalTokens?: number;
}
