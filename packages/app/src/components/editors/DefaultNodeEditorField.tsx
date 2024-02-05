import React, { FC } from 'react';

import { match } from 'ts-pattern';

import { DefaultStringEditor } from './DefaultStringEditor';
import {
  DefaultNodeEditorProps,
  SyntaxedEditor,
} from '../../types/editor.type';

export const DefaultNodeEditorField: FC<
  DefaultNodeEditorProps & { editor: SyntaxedEditor }
> = ({ node, editor, isReadOnly, onChange, onClose }) => {
  const nodeEditorProps: DefaultNodeEditorProps = {
    node,
    isReadOnly,
    onChange,
    onClose,
  };

  // const input = match(editor)
  //   .with({ type: "string" }, (e) => (
  //     <DefaultStringEditor {...nodeEditorProps} editor={e} />
  //   ))
  //   .exhaustive();

  return <div></div>;
};
