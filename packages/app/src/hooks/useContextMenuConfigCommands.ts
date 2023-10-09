import { useMemo } from 'react';

import { ContextMenuConfigCommands } from '../types/contextmenu.type';

export function useContextMenuConfigCommands() {
  const commands: ContextMenuConfigCommands = useMemo(() => [], []);

  return commands;
}
