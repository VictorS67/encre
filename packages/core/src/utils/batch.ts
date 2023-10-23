export function batch<T>(arr: T[], size: number): T[][] {
  return arr.reduce((chunks: T[][], element: T, idx: number) => {
    const chunkIdx: number = Math.floor(idx / size);
    const chunk: T[] = chunks[chunkIdx] || [];
    chunks[chunkIdx] = chunk.concat([element]);
    return chunks;
  }, [] as T[][]);
}
