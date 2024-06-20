import { useMemo } from 'react';

import { globalNodeRegistry } from '@encrejs/core/studio/registration/nodes';
import { orderBy } from 'lodash-es';

import { typeOf } from '../utils/safeTypes';

export function useContextMenuAddNodeConfigContexts() {
  const nodeTypePairs = globalNodeRegistry.nodeTypePairs;

  const avaliableNodes = useMemo(() => {
    const groups = Object.entries(nodeTypePairs).map(([type, subTypes]) => {
      let subTypeContextItems = subTypes.map((subType) => ({
        id: `add-node:${type}-${subType}`,
        name: subType,
        // TODO: need to find the registerArgs here
        data: {
          nodeType: type,
          nodeSubType: subType,
        },
      }));

      subTypeContextItems = orderBy(subTypeContextItems, (item) => item.name);

      const metadata = { label: type };

      return {
        id: `add-node-${type}`,
        name: type,
        contexts:
          subTypeContextItems.length > 0
            ? [
                {
                  metadata,
                  items: subTypeContextItems,
                },
              ]
            : [],
      };
    });

    return groups.filter((grp) => grp.contexts.length > 0);
  }, []);

  return avaliableNodes;
}
