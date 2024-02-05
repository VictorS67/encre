import React, { FC } from 'react';

import { DefaultNodeEditorField } from './DefaultNodeEditorField';
import {
  DefaultNodeEditorProps,
  EditorGroupContent,
} from '../../types/editor.type';

export const EditorGroup: FC<
  DefaultNodeEditorProps & { editor: EditorGroupContent }
> = ({ editor, ...sharedProps }) => {
  const { editors } = editor;

  return (
    <div>
      <div className="editor-group">
        {editors.map((e, i) => {
          return <DefaultNodeEditorField key={i} {...sharedProps} editor={e} />;
        })}
      </div>
    </div>
  );
};
