import { IconProps } from '../types/icon.type';

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
  contexts?: Array<ContextMenuConfigContext>;
  onSelect?: () => void;
};

export type ContextMenuConfigContextMetadata = {
  label: string;
  showLabel?: boolean;
} & Omit<
  {
    [key: string]: string | number | boolean | null | undefined;
  },
  'label' | 'showLabel'
>;

export type ContextMenuConfigContext = {
  metadata: ContextMenuConfigContextMetadata;
  items: readonly ContextMenuConfigContextItem[];
};

export type ContextMenuConfigContexts = {
  [key in string]: readonly ContextMenuConfigContext[];
};

export type ContextMenuConfigCommands = Array<ContextMenuConfigContextItem>;

export type ContextMenuConfig = {
  contexts: {
    [T in keyof ContextMenuConfigContexts]: {
      type: T;
      data: ContextMenuConfigContexts[T];
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
