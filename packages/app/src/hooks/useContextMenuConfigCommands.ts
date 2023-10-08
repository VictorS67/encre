import { useMemo } from "react";
import { ContextMenuConfigCommands } from "../state/contextMenu";

export function useContextMenuConfigCommands() {
  const commands: ContextMenuConfigCommands = useMemo(() => [], []);

  return commands;
}
