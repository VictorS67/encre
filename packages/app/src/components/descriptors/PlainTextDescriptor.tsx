import React, { FC, memo } from 'react';

import { UIContextDescriptor } from '../../types/descriptor.type';
import { Node, UIContext } from '../../types/studio.type';

/* eslint-disable react/prop-types */
export const PlainTextNodeContentBody: FC<
  { node: Node } & Extract<UIContext, { type: 'plain' }>
> = memo(({ node, text }) => {
  return <pre className="pre-wrap">{text}</pre>;
});

PlainTextNodeContentBody.displayName = 'PlainTextNodeContentBody';

export const plainTextDescriptor: UIContextDescriptor<'plain'> = {
  Body: PlainTextNodeContentBody,
};
