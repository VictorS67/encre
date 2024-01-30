import React, { FC, memo } from 'react';

import { useMarkdown } from '../../hooks/useMarkdown';
import { KnownNode, NodeContentDescriptor } from '../../types/nodecontent.type';

/* eslint-disable react/prop-types */
export const TextNodeBody: FC<{ node: KnownNode<'text'> }> = memo(
  ({ node }) => {
    let content: string = node.content;

    if (content.startsWith('::markdown')) {
      content = content.replace(/^::markdown/, '').trim();
      const contentHTML = useMarkdown(content);

      return <div className="pre-wrap" dangerouslySetInnerHTML={contentHTML} />;
    }

    return <pre className="pre-wrap">{content}</pre>;
  },
);

TextNodeBody.displayName = 'TextNodeBody';

export const textNodeDescriptor: NodeContentDescriptor<'text'> = {
  Body: TextNodeBody,
  useMarkdownInDefault: false,
};
