export type VectorStoreRetrieverSearch =
  | SimilaritySearch
  | MaxMarginalRelevanceSearch;

export type SimilaritySearch = {
  type: 'similarity';
  topK?: number;
};

export type MaxMarginalRelevanceSearch = {
  type: 'mmr';
  topK?: number;
  lambda?: number;
};
