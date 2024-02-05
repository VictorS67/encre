import React, { FC } from 'react';

import { DefaultNodeEditorField } from './DefaultNodeEditorField';
import { useNodeContentEditors } from '../../hooks/useNodeContentEditors';
import {
  DefaultNodeEditorProps,
  SyntaxedEditor,
} from '../../types/editor.type';

export const DefaultNodeEditor: FC<DefaultNodeEditorProps> = ({
  node,
  isReadOnly,
  onChange,
  onClose,
}: DefaultNodeEditorProps) => {
  const editors: SyntaxedEditor[] = useNodeContentEditors(node);

  return (
    <div>
      {editors.map((editor, i) => {
        return (
          <DefaultNodeEditorField
            key={i}
            node={node}
            editor={editor}
            isReadOnly={isReadOnly}
            onChange={onChange}
            onClose={onClose}
          />
        );
      })}
    </div>
  );
};
