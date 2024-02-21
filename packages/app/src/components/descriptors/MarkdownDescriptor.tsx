import React, { FC, memo } from 'react';

import { useMarkdown } from '../../hooks/useMarkdown';
import { useStableCallback } from '../../hooks/useStableCallback';
import { UIContextDescriptor } from '../../types/descriptor.type';
import { Node, UIContext } from '../../types/studio.type';

/* eslint-disable react/prop-types */
export const MarkdownNodeContentBody: FC<
  { node: Node } & Extract<UIContext, { type: 'markdown' }>
> = memo(({ node, text }) => {
  const markdownBody = useMarkdown(text);

  return <div className="pre-wrap" dangerouslySetInnerHTML={markdownBody} />;
});

MarkdownNodeContentBody.displayName = 'MarkdownNodeContentBody';

export const markdownDescriptor: UIContextDescriptor<'markdown'> = {
  Body: MarkdownNodeContentBody,
};
