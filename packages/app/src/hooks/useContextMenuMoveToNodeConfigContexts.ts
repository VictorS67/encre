import { useRecoilValue } from 'recoil';

import { nodesState } from '../state/node';

export function useContextMenuMoveToNodeConfigContexts() {
  const nodes = useRecoilValue(nodesState);

  return nodes.map((node) => ({
    id: `move-to-node:${node.id}`,
    name: node.title,
    data: {
      nodeId: node.id,
    },
  }));
}
