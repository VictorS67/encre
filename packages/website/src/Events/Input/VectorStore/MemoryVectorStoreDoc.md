## Memory Vector Store

Provides an in-memory implementation of a vector store that supports operations such as adding, deleting, and searching vectors based on similarity or relevance. This class is suitable for lightweight applications or environments where persistence is not required.


---

| Reference | Link |
| --- | --- |
| Encre Concept | [Serializable, MemoryVectorStoreFilterType](**-a-link-to-the-corresponding-concept-documentation-**) |
| Encre Node | [** A reference to the node that uses this component **](**-a-link-to-the-corresponding-node-documentation-**) |
| API | [** A reference to API Documentation **](**-a-link-to-the-corresponding-api-documentation-**) |

### Overview

The `MemoryVectorStore` class is essential for managing high-dimensional vector data in-memory, making it suitable for applications that require fast access to vector data without the need for persistent storage.


### Usage

#### Creating with Parameters

Here's an example of how to create `MemoryVectorStore` with parameters:

```typescript
import { MemoryVectorStore } from "@encrejs/core";

const vectorStore = new MemoryVectorStore();

```

Component parameters:

| Parameter | Runtime Type | Description |
| --- | --- | --- |
| vectors | Vector[] | A list of all vectors currently stored in the memory. Each vector includes its content, embedding, and metadata. |
| similarity | typeof mlDistanceSimilarity.cosine| The function used to calculate the similarity between two vectors. This is typically a cosine similarity function from a machine learning library. |
| filter | MemoryVectorStoreFilterType | Optional. Filters that can be applied during vector retrieval operations to limit the results based on custom logic. |

