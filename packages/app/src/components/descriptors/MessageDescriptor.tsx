import React, { FC, Suspense, memo, useMemo, useState } from 'react';

import { UIContext } from '../../types/studio.type';
import { Node } from '../../types/studio.type';
import { UIContextDescriptor } from '../../types/uicontext.type';
import { UIContextContainer } from '../UIContextContainer';

/* eslint-disable react/prop-types */
export const MessageNodeContentBody: FC<
  { node: Node } & Extract<UIContext, { type: 'message' }>
> = memo(({ node, content, kwargs, role, name }) => {
  const [editableLabels, setEditableLabels] = useState<Record<string, string>>(
    {},
  );
  const [editableContents, setEditableContents] = useState<
    Record<string, UIContext[]>
  >({});
  const [readonlyLabels, setReadonlyLabels] = useState<string[]>([]);

  useMemo(() => {
    setEditableLabels({ name: name ?? '' });

    setEditableContents({ content, kwargs });

    setReadonlyLabels([role]);
  }, [content, kwargs, role, name]);

  return (
    <Suspense fallback={<div />}>
      <div style={{ paddingRight: 5 }}>
        <UIContextContainer
          node={node}
          uiType="message"
          editableLabels={editableLabels}
          editableContents={editableContents}
          readonlyLabels={readonlyLabels}
        />
      </div>
    </Suspense>
  );
});

MessageNodeContentBody.displayName = 'MessageNodeContentBody';

export const messageDescriptor: UIContextDescriptor<'message'> = {
  Body: MessageNodeContentBody,
};
