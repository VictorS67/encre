import React, { FC, Suspense, memo } from 'react';

import { Node, UIContext } from '../../types/studio.type';
import { UIContextDescriptor } from '../../types/uicontext.type';
import { LazySyntaxedText } from '../LazyComponents';

/* eslint-disable react/prop-types */
export const CodeNodeContentBody: FC<
  { node: Node } & Extract<UIContext, { type: "code" }>
> = memo(({ node, text, language, keywords, properties, variables }) => {
  return (
    <Suspense fallback={<div />}>
      <LazySyntaxedText
        text={text}
        language={language}
        keywords={keywords}
        properties={properties}
        variables={variables}
      />
    </Suspense>
  );
});

CodeNodeContentBody.displayName = 'CodeNodeContentBody';

export const codeDescriptor: UIContextDescriptor<'code'> = {
  Body: CodeNodeContentBody,
};
