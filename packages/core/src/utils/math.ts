import { similarity as mlDistanceSimilarity } from 'ml-distance';

type VectorFunc = (xVector: number[], yVector: number[]) => number;

type ArgMax = {
  index: number;
  value: number;
};

function matrixFunc(
  X: number[][],
  Y: number[][],
  func: VectorFunc
): number[][] {
  if (
    X.length === 0 ||
    X[0].length === 0 ||
    Y.length === 0 ||
    Y[0].length === 0
  ) {
    return [[]];
  }

  if (X[0].length !== Y[0].length) {
    throw new Error(
      `Number of columns in X and Y do not match. X's shape (${X.length}, ${X[0].length}) and Y's shape (${Y.length}, ${Y[0].length})`
    );
  }

  return X.map((xVector) =>
    Y.map((yVector) => func(xVector, yVector)).map((similarity) =>
      Number.isNaN(similarity) ? 0 : similarity
    )
  );
}

function argMax(array: number[]): ArgMax {
  if (array.length === 0) {
    return {
      index: -1,
      value: NaN,
    };
  }

  let maxValue: number = array[0];
  let maxIndex = 0;
  for (let i = 1; i < array.length; i++) {
    if (array[i] > maxValue) {
      maxIndex = i;
      maxValue = array[i];
    }
  }

  return {
    index: maxIndex,
    value: maxValue,
  };
}

export function cosineSimilarity(X: number[][], Y: number[][]): number[][] {
  return matrixFunc(X, Y, mlDistanceSimilarity.cosine);
}

export function maximalMarginalRelevance(
  queryEmbedding: number[] | number[][],
  embeddings: number[][],
  lambda: number = 0.5,
  topK: number = 4
): [number[], number[]] {
  if (Math.min(topK, embeddings.length) <= 0) {
    return [[], []];
  }

  const _queryEmbeddings = (
    Array.isArray(queryEmbedding[0]) ? queryEmbedding : [queryEmbedding]
  ) as number[][];

  const similarityToQuery: number[] = cosineSimilarity(
    _queryEmbeddings,
    embeddings
  )[0];

  const similarityArgMax: ArgMax = argMax(similarityToQuery);

  const selectedEmbeddings: number[][] = [embeddings[similarityArgMax.index]];
  const selectedEmbeddingsIndexes: number[] = [similarityArgMax.index];
  const selectedSimilarities: number[] = [similarityArgMax.value];

  while (selectedEmbeddingsIndexes.length < Math.min(topK, embeddings.length)) {
    let bestScore = -Infinity;
    let bestIndex = -1;

    const similarityToSelect: number[][] = cosineSimilarity(
      embeddings,
      selectedEmbeddings
    );

    similarityToQuery.forEach((queryScore, queryScoreIndex) => {
      if (selectedEmbeddingsIndexes.includes(queryScoreIndex)) {
        return;
      }

      const maxSimilarityToSelect: number = Math.max(
        ...similarityToSelect[queryScoreIndex]
      );

      const score: number =
        lambda * queryScore - (1 - lambda) * maxSimilarityToSelect;

      if (score > bestScore) {
        bestScore = score;
        bestIndex = queryScoreIndex;
      }
    });

    selectedEmbeddings.push(embeddings[bestIndex]);
    selectedEmbeddingsIndexes.push(bestIndex);
    selectedSimilarities.push(bestScore);
  }

  return [selectedEmbeddingsIndexes, selectedSimilarities];
}
