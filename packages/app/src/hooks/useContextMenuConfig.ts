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
          data: value,
        }))
        .reduce<{
          [key: string]: {
            type: string;
            data: readonly ContextMenuConfigContext[];
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
