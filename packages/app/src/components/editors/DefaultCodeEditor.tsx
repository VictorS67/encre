import React, { FC } from 'react';

import { useDebounceFn, useLatest } from 'ahooks';

import {
  CodeEditorContent,
  DefaultNodeEditorProps,
} from '../../types/editor.type';
import { Node } from '../../types/studio.type';

export const DefaultCodeEditor: FC<
  DefaultNodeEditorProps & {
    editor: CodeEditorContent;
  }
> = ({ node, editor, isReadOnly, onChange, onClose }) => {
  const nodeLatest = useLatest(node);

  // const onChangeDebounced = useDebounceFn<(node: Node) => void>(onChange, {
  //   wait: 100,
  // });

  // const onEditorChange = ()

  return <></>;
};
