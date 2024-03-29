import React, { FC, memo } from 'react';

import { Node, UIContext } from '../../types/studio.type';
import { UIContextDescriptor } from '../../types/uicontext.type';

/* eslint-disable react/prop-types */
export const PlainTextNodeContentBody: FC<
  { node: Node } & Extract<UIContext, { type: 'plain' }>
> = memo(({ node, text }) => {
  return (
    <pre className="pre-wrap" style={{ userSelect: 'text' }}>
      {text}
    </pre>
  );
});

PlainTextNodeContentBody.displayName = 'PlainTextNodeContentBody';

export const plainTextDescriptor: UIContextDescriptor<'plain'> = {
  Body: PlainTextNodeContentBody,
};
