import React, { FC, Suspense, memo, useMemo, useState } from 'react';

import { Node, UIContext } from '../../types/studio.type';
import { UIContextDescriptor } from '../../types/uicontext.type';
import { formatBytes } from '../../utils/format';
import { UIContextContainer } from '../UIContextContainer';

/* eslint-disable react/prop-types */
export const BlobNodeContentBody: FC<
  { node: Node; id: string } & Extract<UIContext, { type: 'blob' }>
> = memo(({ node, id, blob, size, blobType }) => {
  const editableContents: Record<string, UIContext[]> | null = useMemo(() => {
    return { blob };
  }, [blob]);

  const readonlyLabels: string[] | null = useMemo(() => {
    return [`${blobType === '' ? 'unknown' : blobType}, ${formatBytes(size)}`];
  }, [blob]);

  return (
    <Suspense fallback={<div />}>
      <div style={{ paddingRight: 5 }}>
        <UIContextContainer
          node={node}
          uiType="blob"
          editableLabels={{}}
          editableContents={editableContents === null ? {} : editableContents}
          readonlyLabels={readonlyLabels === null ? [] : readonlyLabels}
        />
      </div>
    </Suspense>
  );
});

BlobNodeContentBody.displayName = 'BlobNodeContentBody';

export const blobDescriptor: UIContextDescriptor<'blob'> = {
  Body: BlobNodeContentBody,
};
