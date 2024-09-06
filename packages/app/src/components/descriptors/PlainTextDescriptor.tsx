import React, { FC, memo } from 'react';

import { Node, UIContext } from '../../types/studio.type';
import { UIContextDescriptor } from '../../types/uicontext.type';

/* eslint-disable react/prop-types */
export const PlainTextNodeContentBody: FC<
  { node: Node; id: string } & Extract<UIContext, { type: 'plain' }>
> = memo(({ node, id, text }) => {
  return (
    <pre
      className="pre-wrap"
      style={{ userSelect: 'text', paddingLeft: 10 }}
      data-label={'editor'}
    >
      {text}
    </pre>
  );
});

PlainTextNodeContentBody.displayName = 'PlainTextNodeContentBody';

export const plainTextDescriptor: UIContextDescriptor<'plain'> = {
  Body: PlainTextNodeContentBody,
};
