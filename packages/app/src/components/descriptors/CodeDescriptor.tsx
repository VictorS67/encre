import React, { FC, Suspense, memo } from 'react';

import { UIContextDescriptor } from '../../types/descriptor.type';
import { Node, UIContext } from '../../types/studio.type';
import { LazySyntaxedText } from '../LazyComponents';

/* eslint-disable react/prop-types */
export const CodeNodeContentBody: FC<
  { node: Node } & Extract<UIContext, { type: 'code' }>
> = memo(({ node, text, language, keywords }) => {
  return (
    <Suspense fallback={<div />}>
      <LazySyntaxedText
        text={text}
        language={language ?? 'encre-code'}
        keywords={keywords ?? []}
      />
    </Suspense>
  );
});

CodeNodeContentBody.displayName = 'CodeNodeContentBody';

export const codeDescriptor: UIContextDescriptor<'code'> = {
  Body: CodeNodeContentBody,
};
