import React, { FC, Suspense, memo, useMemo, useState } from 'react';

import { UIContext } from '../../types/studio.type';
import { Node } from '../../types/studio.type';
import { UIContextDescriptor } from '../../types/uicontext.type';
import { UIContextContainer } from '../UIContextContainer';

/* eslint-disable react/prop-types */
export const ContextNodeContentBody: FC<
  { node: Node; id: string } & Extract<UIContext, { type: 'context' }>
> = memo(({ node, id, text, metadata }) => {
  const editableContents: Record<string, UIContext[]> | null = useMemo(() => {
    return { text, metadata };
  }, [text, metadata]);

  return (
    <Suspense fallback={<div />}>
      <div style={{ paddingRight: 5 }}>
        <UIContextContainer
          node={node}
          uiType="context"
          editableLabels={{}}
          editableContents={editableContents === null ? {} : editableContents}
          readonlyLabels={[]}
        />
      </div>
    </Suspense>
  );
});

ContextNodeContentBody.displayName = 'ContextNodeContentBody';

export const contextDescriptor: UIContextDescriptor<'context'> = {
  Body: ContextNodeContentBody,
};
