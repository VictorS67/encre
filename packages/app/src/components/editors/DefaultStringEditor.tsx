import React, { FC, useEffect, useRef } from 'react';

import { useDebounceFn, useLatest } from 'ahooks';

import {
  DefaultNodeEditorProps,
  StringEditorContent,
} from '../../types/editor.type';
import { Node } from '../../types/studio.type';
import { type monaco } from '../../utils/monacoEditor';
import { LazyCodeEditor } from '../LazyComponents';

export const DefaultStringEditor: FC<
  DefaultNodeEditorProps & { editor: StringEditorContent }
> = ({ node, editor, isReadOnly, onChange, onClose }) => {
  return <></>;
};
