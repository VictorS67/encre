import React, { FC, memo } from 'react';

import { Node, UIContext } from '../../types/studio.type';
import { UIContextDescriptor } from '../../types/uicontext.type';

/* eslint-disable react/prop-types */
export const AudioNodeContentBody: FC<
  { node: Node } & Extract<UIContext, { type: 'audio' }>
> = memo(({ node, mimeType, data }) => {
  return <></>;
});

AudioNodeContentBody.displayName = 'AudioNodeContentBody';

export const audioDescriptor: UIContextDescriptor<'audio'> = {
  Body: AudioNodeContentBody,
};
