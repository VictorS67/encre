# Type alias: MaxMarginalRelevanceSearch

> **MaxMarginalRelevanceSearch**: `object`

Describes a max marginal relevance search that balances the similarity and diversity of 
search results.

## Type declaration

### lambda?

> `optional` **lambda**: `number`

A parameter between 0 and 1 that balances between relevance and diversity:
closer to 0 favors diversity, closer to 1 favors relevance.

### topK?

> `optional` **topK**: `number`

Specifies the number of items to retrieve. Defaults to system configuration if not 
specified.

### type

> **type**: `"mmr"`

Indicates the search strategy, set as 'mmr' for max marginal relevance.

## Source

[packages/core/src/events/inference/retrieve/embedding/index.ts:28](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/retrieve/embedding/index.ts#L28)
