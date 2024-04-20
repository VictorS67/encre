import React, { FC, memo } from 'react';

import { useMarkdown } from '../../hooks/useMarkdown';
import { useStableCallback } from '../../hooks/useStableCallback';
import { Node, UIContext } from '../../types/studio.type';
import { UIContextDescriptor } from '../../types/uicontext.type';

/* eslint-disable react/prop-types */
export const MarkdownNodeContentBody: FC<
  { node: Node; id: string } & Extract<UIContext, { type: 'markdown' }>
> = memo(({ node, id, text }) => {
  const markdownBody = useMarkdown(text);

  return (
    <div
      className="pre-wrap"
      style={{ userSelect: 'text', paddingLeft: 10 }}
      data-label={'editor'}
      dangerouslySetInnerHTML={markdownBody}
    />
  );
});

MarkdownNodeContentBody.displayName = 'MarkdownNodeContentBody';

export const markdownDescriptor: UIContextDescriptor<'markdown'> = {
  Body: MarkdownNodeContentBody,
};
