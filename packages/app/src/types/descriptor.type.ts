import { FC } from 'react';

import { Node, UIContext } from './studio.type';

export type UIContextDescriptor<T extends UIContext['type']> = {
  Body?: FC<{ node: Node } & Extract<UIContext, { type: T }>>;
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
