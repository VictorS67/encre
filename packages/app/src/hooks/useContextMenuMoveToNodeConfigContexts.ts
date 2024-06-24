import { useRecoilValue } from 'recoil';

import { nodesState } from '../state/node';

export function useContextMenuMoveToNodeConfigContexts() {
  const nodes = useRecoilValue(nodesState);

  return nodes.map((node) => ({
    id: `move-to-node:${node.id}`,
    name: node.title ?? (node.data._id[node.data._id.length - 1] as string),
    data: {
      nodeId: node.id,
    },
  }));
}
