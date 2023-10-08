import SvgIcon from "@mui/material/SvgIcon";
import AbcIcon from "@mui/icons-material/Abc";

export type ContextMenuData = {
  type: string;
  element: HTMLElement;
};

export type ContextMenu = {
  x: number;
  y: number;
  data: ContextMenuData | null;
};

export type ContextMenuConfigContextItem = {
  id: string;
  name: string;
  description?: string;
  icon?: typeof SvgIcon;
};

export type ContextMenuConfigContexts = {
  [key in string]: {
    items: Array<ContextMenuConfigContextItem>;
  };
};

export type ContextMenuConfigCommands = Array<ContextMenuConfigContextItem>;

export type ContextMenuConfig = {
  contexts: {
    [T in keyof ContextMenuConfigContexts]: {
      type: T;
      items: ContextMenuConfigContexts[T]["items"];
    };
  };
  commands: ContextMenuConfigCommands;
};

export type ContextMenuProps = {
  x: number;
  y: number;
  context: ContextMenuConfig["contexts"][keyof ContextMenuConfig["contexts"]];
  disabled?: boolean;
};
