import React, { FC, memo } from 'react';

import { KnownNode, NodeContentDescriptor } from '../../types/nodecontent.type';

/* eslint-disable react/prop-types */
export const TextNodeBody: FC<{ node: KnownNode<'text'> }> = memo(
  ({ node }) => {
    return <pre style={{ whiteSpace: 'pre-wrap' }}>{node.content}</pre>;
  },
);

TextNodeBody.displayName = 'TextNodeBody';

export const textNodeDescriptor: NodeContentDescriptor<'text'> = {
  Body: TextNodeBody,
  useMarkdownInDefault: true,
};
