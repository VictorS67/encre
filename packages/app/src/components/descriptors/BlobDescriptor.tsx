import React, { FC, Suspense, memo, useEffect, useMemo, useState } from 'react';

import { Node, UIContext } from '../../types/studio.type';
import { UIContextDescriptor } from '../../types/uicontext.type';
import { UIContextContainer } from '../UIContextContainer';

/* eslint-disable react/prop-types */
export const BlobNodeContentBody: FC<
  { node: Node } & Extract<UIContext, { type: 'blob' }>
> = memo(({ node, blob, size, blobType }) => {
  const [blobUrl, setBlobUrl] = useState<string | undefined>();
  const [editableLabels, setEditableLabels] = useState<Record<string, string>>(
    {},
  );
  const [editableContents, setEditableContents] = useState<
    Record<string, UIContext[]>
  >({});
  const [readonlyLabels, setReadonlyLabels] = useState<string[]>([]);

  useEffect(() => {
    if (blobUrl) {
      URL.revokeObjectURL(blobUrl);
    }

    setBlobUrl(URL.createObjectURL(blob));

    setEditableContents({
      blob: [
        {
          type: 'plain',
          text: blobUrl ?? '',
        },
      ],
    });

    setReadonlyLabels([
      `${blobType === '' ? 'unknown' : blobType}, ${size} Bytes`,
    ]);
  }, [blob]);

  return (
    <Suspense fallback={<div />}>
      <div style={{ paddingRight: 5 }}>
        <UIContextContainer
          node={node}
          uiType="blob"
          editableLabels={editableLabels}
          editableContents={editableContents}
          readonlyLabels={readonlyLabels}
        />
      </div>
    </Suspense>
  );
});

BlobNodeContentBody.displayName = 'BlobNodeContentBody';

export const blobDescriptor: UIContextDescriptor<'blob'> = {
  Body: BlobNodeContentBody,
};
