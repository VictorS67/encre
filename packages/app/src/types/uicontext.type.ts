import { FC } from 'react';

import {
  ConditionUI,
  ElseIfConditionUI,
  IfConditionUI,
  Node,
  OtherwiseConditionUI,
  UIContext,
} from './studio.type';

export type UIContextDescriptor<T extends UIContext['type']> = {
  Body?: FC<
    {
      node: Node;
      id: string;
      onEditClick?: (node: Node, editingId: string) => void;
    } & Extract<UIContext, { type: T }>
  >;
  PopUpWindow?: FC<
    { node: Node; onChange?: (node: Node) => void } & Extract<
      UIContext,
      { type: T }
    >
  >;
};

export type UIContextDescriptors = {
  [K in UIContext['type']]: UIContextDescriptor<K>;
};

export type UIContextContainerProps = {
  node: Node;
  uiType: UIContext['type'];
  editableLabels: Record<string, string>;
  editableContents: Record<string, UIContext[]>;
  readonlyLabels: string[];
};

export type ConditionUIContextContainerProps = {
  node: Node;
  uiType: 'condition';
  target: string;
  sources: string[];
  when: IfConditionUI;
  otherwiseWhen?: ElseIfConditionUI[];
  otherwise?: OtherwiseConditionUI;
};

export type ConditionUIContextItemProps = {
  type: 'if' | 'else-if' | 'otherwise';
  node: Node;
  condition: ConditionUI;
  sources: string[];
  index: number;
  selectedIndex?: number;
  showOtherwiseWhen?: boolean;
  showOtherwise?: boolean;
  onConditionClick?: (event: React.MouseEvent<HTMLElement>) => void;
  onConditionEditorClick?: (
    node: Node,
    uiContext: UIContext,
    editingId: string,
  ) => void;
};

export type UIContextContainerVisualContentData = {
  type: 'container';
  expandedContentName?: string;
};

export type UIContextVisualContentData = UIContextContainerVisualContentData;
