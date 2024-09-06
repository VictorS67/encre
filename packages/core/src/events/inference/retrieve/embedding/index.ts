/**
 * Defines the types of search strategies available in a vector store retriever,
 * including similarity-based searches and max marginal relevance searches.
 */
export type VectorStoreRetrieverSearch =
  | SimilaritySearch
  | MaxMarginalRelevanceSearch;

/**
 * Represents a similarity search strategy where the top most similar items are retrieved.
 */
export type SimilaritySearch = {
  /**
   * Specifies the type of search, always 'similarity' for this structure.
   */
  type: 'similarity';

  /**
   * The number of top similar items to retrieve. If unspecified, a default value is used.
   */
  topK?: number;
};

/**
 * Describes a max marginal relevance search that balances the similarity and diversity of 
 * search results.
 */
export type MaxMarginalRelevanceSearch = {
  /**
   * Indicates the search strategy, set as 'mmr' for max marginal relevance.
   */
  type: 'mmr';

  /**
   * Specifies the number of items to retrieve. Defaults to system configuration if not 
   * specified.
   */
  topK?: number;

  /**
   * A parameter between 0 and 1 that balances between relevance and diversity:
   * closer to 0 favors diversity, closer to 1 favors relevance.
   */
  lambda?: number;
};
