import React, { FC, Suspense, memo, useMemo, useState } from 'react';

import { UIContext } from '../../types/studio.type';
import { Node } from '../../types/studio.type';
import { UIContextDescriptor } from '../../types/uicontext.type';
import { UIContextContainer } from '../UIContextContainer';

/* eslint-disable react/prop-types */
export const MessageNodeContentBody: FC<
  { node: Node } & Extract<UIContext, { type: 'message' }>
> = memo(({ node, content, kwargs, role, name }) => {
  const editableLabels: Record<string, string> | null = useMemo(() => {
    return { name: name ?? '' };
  }, [name]);

  const editableContents: Record<string, UIContext[]> | null = useMemo(() => {
    return { content, kwargs };
  }, [content, kwargs]);

  const readonlyLabels: string[] | null = useMemo(() => {
    return [role];
  }, [role]);

  return (
    <Suspense fallback={<div />}>
      <div style={{ paddingRight: 5 }}>
        <UIContextContainer
          node={node}
          uiType="message"
          editableLabels={editableLabels === null ? {} : editableLabels}
          editableContents={editableContents === null ? {} : editableContents}
          readonlyLabels={readonlyLabels === null ? [] : readonlyLabels}
        />
      </div>
    </Suspense>
  );
});

MessageNodeContentBody.displayName = 'MessageNodeContentBody';

export const messageDescriptor: UIContextDescriptor<'message'> = {
  Body: MessageNodeContentBody,
};
