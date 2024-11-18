export function useCreateNode() {
  const createNode = useCallback(
    async (
      nodeType: string,
      nodeSubType: string,
      registerArgs?: Record<string, unknown>,
    ) => {
      const node = await send('get-node', {
        type: nodeType,
        subType: nodeSubType,
        registerArgs,
      });

      console.log(`create node: ${JSON.stringify(node)}`);

      if (!node.error) {
        return node;
      }

      return null;
    },
    [],
  );

  return { createNode };
}