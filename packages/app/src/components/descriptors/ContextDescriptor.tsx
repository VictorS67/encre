import React, { FC, Suspense, memo, useMemo, useState } from 'react';

import { UIContext } from '../../types/studio.type';
import { Node } from '../../types/studio.type';
import { UIContextDescriptor } from '../../types/uicontext.type';
import { UIContextContainer } from '../UIContextContainer';

/* eslint-disable react/prop-types */
export const ContextNodeContentBody: FC<
  { node: Node } & Extract<UIContext, { type: 'context' }>
> = memo(({ node, text, metadata }) => {
  const [editableLabels, setEditableLabels] = useState<Record<string, string>>(
    {},
  );
  const [editableContents, setEditableContents] = useState<
    Record<string, UIContext[]>
  >({});
  const [readonlyLabels, setReadonlyLabels] = useState<string[]>([]);

  useMemo(() => {
    setEditableContents({
      text,
      metadata,
    });
  }, [text, metadata]);

  return (
    <Suspense fallback={<div />}>
      <div style={{ paddingRight: 5 }}>
        <UIContextContainer
          node={node}
          uiType="context"
          editableLabels={editableLabels}
          editableContents={editableContents}
          readonlyLabels={readonlyLabels}
        />
      </div>
    </Suspense>
  );
});

ContextNodeContentBody.displayName = 'ContextNodeContentBody';

export const contextDescriptor: UIContextDescriptor<'context'> = {
  Body: ContextNodeContentBody,
};
