import { IconProps, SVGIcon } from './icon';

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
  icon?: IconProps;
  items?: Array<ContextMenuConfigContextItem>;
  onSelect?: () => void;
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
      items: ContextMenuConfigContexts[T]['items'];
    };
  };
  commands: ContextMenuConfigCommands;
};

export type ContextMenuConfigContextData =
  ContextMenuConfig['contexts'][keyof ContextMenuConfig['contexts']];

export type ContextMenuProps = {
  x: number;
  y: number;
  context: ContextMenuConfigContextData;
  disabled?: boolean;
  onSelect?: () => void;
};

export type ContextMenuItemProps = {
  config: ContextMenuConfigContextItem;
  context: unknown;
  active?: boolean;
  onSelect?: () => void;
  onHover?: () => void;
};
