import { FC } from 'react';

import { Node, UIContext } from './studio.type';

export type UIContextDescriptor<T extends UIContext['type']> = {
  Body?: FC<
    { node: Node; id: string; onClick?: (node: Node) => void } & Extract<
      UIContext,
      { type: T }
    >
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

export type ConditionField = {
  type: 'if' | 'else-if' | 'otherwise';
  description?: string;
  target?: string;
};

export type ConditionUIContextContainerProps = {
  node: Node;
  uiType: 'condition';
  subject: string;
  properties: string[];
  when: ConditionField;
  otherwiseWhen?: ConditionField[];
  otherwise?: Omit<ConditionField, 'description'>;
};

export type ConditionUIContextItemProps = {
  type: 'if' | 'else-if' | 'otherwise';
  node: Node;
  condition: ConditionField;
  properties: string[];
  index: number;
  selectedIndex?: number;
  showOtherwiseWhen?: boolean;
  showOtherwise?: boolean;
  onConditionClick?: (event: React.MouseEvent<HTMLElement>) => void;
};

export type UIContextContainerVisualContentData = {
  type: 'container';
  expandedContentName?: string;
};

export type UIContextVisualContentData = UIContextContainerVisualContentData;
