import { useMemo } from 'react';

import { useContextMenuConfigCommands } from './useContextMenuConfigCommands';
import { useContextMenuConfigContexts } from './useContextMenuConfigContexts';
import {
  ContextMenuConfig,
  ContextMenuConfigCommands,
  ContextMenuConfigContextItem,
  ContextMenuConfigContexts,
} from '../state/contextMenu';
import { entries } from '../utils/safeTypes';

export function useContextMenuConfig(): ContextMenuConfig {
  const contexts: ContextMenuConfigContexts = useContextMenuConfigContexts();
  const commands: ContextMenuConfigCommands = useContextMenuConfigCommands();

  const config: ContextMenuConfig = useMemo(
    () => ({
      contexts: entries(contexts)
        .map(([key, value]) => ({
          type: key,
          items: value['items'],
        }))
        .reduce<{
          [key: string]: {
            type: string;
            items: ContextMenuConfigContextItem[];
          };
        }>((accumulator, dict) => {
          accumulator[dict.type] = dict;
          return accumulator;
        }, {}),
      commands,
    }),
    [contexts, commands],
  );

  return config;
}
