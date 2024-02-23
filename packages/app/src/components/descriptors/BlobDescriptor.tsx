import React, { FC, Suspense, memo, useMemo, useState } from 'react';

import { Node, UIContext } from '../../types/studio.type';
import { UIContextDescriptor } from '../../types/uicontext.type';
import { UIContextContainer } from '../UIContextContainer';

/* eslint-disable react/prop-types */
export const BlobNodeContentBody: FC<
  { node: Node } & Extract<UIContext, { type: 'blob' }>
> = memo(({ node, blob, size, blobType }) => {
  const [blobUrl, setBlobUrl] = useState<string | undefined>();
  const editableContents: Record<string, UIContext[]> | null = useMemo(() => {
    if (blobUrl) {
      URL.revokeObjectURL(blobUrl);
    }

    // TODO: use `file-type` to identify file type from blob
    const _blobUrl = URL.createObjectURL(blob);

    setBlobUrl(_blobUrl);

    return {
      blob: [
        {
          type: 'plain',
          text: _blobUrl ?? '',
        },
      ],
    };
  }, [blob]);

  const readonlyLabels: string[] | null = useMemo(() => {
    return [`${blobType === '' ? 'unknown' : blobType}, ${size} Bytes`];
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
