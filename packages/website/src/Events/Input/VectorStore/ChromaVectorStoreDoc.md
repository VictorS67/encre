## Chroma Vector Store

The Chroma Vector Store class provides an in-memory vector store that integrates with a [Chroma ](https://docs.trychroma.com/) backend service for storing and retrieving vector embeddings associated with content. It supports operations like adding vectors, deleting vectors based on IDs or filters, and conducting similarity and maximal marginal relevance searches.


---

| Reference | Link |
| --- | --- |
| Encre Concept | [Serializable, ChromaCollectionMetadata, ChromaVectorStoreFilterType](**-a-link-to-the-corresponding-concept-documentation-**) |
| Encre Node | [** A reference to the node that uses this component **](**-a-link-to-the-corresponding-node-documentation-**) |
| API | [** A reference to API Documentation **](**-a-link-to-the-corresponding-api-documentation-**) |

### Overview

The `ChromaVectorStore` class is essential for managing high-dimensional vector data used in search and machine learning applications. It allows for efficient storage, retrieval, and similarity searches on vector embeddings.


### Usage

#### Creating with Parameters

Here's an example of how to create `ChromaVectorStore` with parameters:

```typescript
import { ChromaVectorStore } from "@encrejs/core";

const vectorStore = new ChromaVectorStore({
  url: 'my-chroma-instance-url',
  collectionName: 'myVectorCollection'
});

```

Component parameters:

| Parameter | Runtime Type | Description |
| --- | --- | --- |
| url | string | Base URL of the Chroma backend service. |
| numDimensions | number | Optional. Number of dimensions for each embedding vector. |
| collectionName | string | Optional. Name of the collection within Chroma where vectors are stored. |
| collectionMetadata | ChromaCollectionMetadata | Optional. Additional metadata related to the collection. |
| filter | ChromaVectorStoreFilterType | Optional. Filter settings that can be applied during search operations. |

