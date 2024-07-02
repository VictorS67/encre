import React, { FC } from 'react';

import {
  DefaultNodeEditorProps,
  SyntaxedEditor,
} from '../../types/editor.type';

import { DefaultNodeEditorField } from './DefaultNodeEditorField';

export const DefaultNodeEditor: FC<DefaultNodeEditorProps> = ({
  node,
  isReadOnly,
  onChange,
  onClose,
}: DefaultNodeEditorProps) => {
  // const editors: SyntaxedEditor[] = useNodeContentEditors(node);

  // return (
  //   <div>
  //     {editors.map((editor, i) => {
  //       return (
  //         <DefaultNodeEditorField
  //           key={i}
  //           node={node}
  //           editor={editor}
  //           isReadOnly={isReadOnly}
  //           onChange={onChange}
  //           onClose={onClose}
  //         />
  //       );
  //     })}
  //   </div>
  // );

  return <></>;
};
