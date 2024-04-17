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

export type ContextMenuConfigContextItem<Context = unknown, Data = unknown> = {
  id: string;
  name: string;
  description?: string;
  tip?: string;
  icon?: IconProps;
  data?: Data | ((context: Context) => Data);
  conditional?: (context: Context) => boolean;
  contexts?: Array<ContextMenuConfigContext>; // The sub-level contexts
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

export type ContextMenuConfigContextGroups<Context = unknown> = {
  contextType: Context;
  group: readonly ContextMenuConfigContext<Context>[];
};

export type ContextMenuConfigContext<Context = unknown> = {
  metadata: ContextMenuConfigContextMetadata;
  items: readonly ContextMenuConfigContextItem<Context>[];
};

export type ContextMenuConfigContexts = {
  [key in string]: ContextMenuConfigContextGroups;
};

export type ContextMenuConfigCommands = Array<ContextMenuConfigContextItem>;

export type ContextMenuConfig = {
  contexts: {
    [T in keyof ContextMenuConfigContexts]: {
      type: T;
      data: ContextMenuConfigContexts[T]['contextType'];
      group: ContextMenuConfigContexts[T]['group'];
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
  onSelect?: (
    id: string,
    context: ContextMenuConfigContextData,
    meta: { x: number; y: number },
    data: unknown,
  ) => void;
};

export type ContextMenuContextProps = {
  type: string;
  index: number;
  context: ContextMenuConfigContext;
  contextGroup: readonly ContextMenuConfigContext<unknown>[];
  onSelect?: (id: string, data: unknown) => void;
};

export type ContextMenuItemProps = {
  config: ContextMenuConfigContextItem;
  context: unknown;
  active?: boolean;
  onSelect?: (id: string, data: unknown) => void;
  onHover?: () => void;
};
