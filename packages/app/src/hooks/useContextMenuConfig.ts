import { useMemo } from 'react';

import { useContextMenuConfigCommands } from './useContextMenuConfigCommands';
import { useContextMenuConfigContexts } from './useContextMenuConfigContexts';
import {
  ContextMenuConfig,
  ContextMenuConfigCommands,
  ContextMenuConfigContext,
  ContextMenuConfigContextItem,
  ContextMenuConfigContexts,
} from '../types/contextmenu.type';
import { entries } from '../utils/safeTypes';

export function useContextMenuConfig(): ContextMenuConfig {
  const contexts: ContextMenuConfigContexts = useContextMenuConfigContexts();
  const commands: ContextMenuConfigCommands = useContextMenuConfigCommands();

  const config: ContextMenuConfig = useMemo(
    () => ({
      contexts: entries(contexts)
        .map(([key, value]) => ({
          type: key,
          data: {},
          groups: value,
        }))
        .reduce<{
          [key: string]: {
            type: string;
            data: unknown;
            group: readonly ContextMenuConfigContext<unknown>[];
          };
        }>((acc, dict) => {
          acc[dict.type] = {
            ...dict,
            group: dict.groups.group,
          };
          return acc;
        }, {}),
      commands,
    }),
    [contexts, commands],
  );

  return config;
}
