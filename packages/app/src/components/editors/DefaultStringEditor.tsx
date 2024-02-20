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
  const nodeLatest = useLatest(node);

  if (onChange) {
    const onChangeDebounced = useDebounceFn<(node: Node) => void>(onChange, {
      wait: 100,
    });

    const onEditorChange = (newText: string) => {
      onChangeDebounced.run({
        ...nodeLatest.current,
        content: newText,
      });
    };

    return (
      <StringEditor
        text={editor.text}
        isReadOnly={isReadOnly}
        autoFocus={editor.autoFocus}
        language="text"
        onChange={onEditorChange}
      />
    );
  }
};

export const StringEditor: FC<{
  text: string | undefined;
  isReadOnly: boolean;
  autoFocus?: boolean;
  language?: string;
  theme?: string;
  onChange: (text: string) => void;
  onClose?: () => void;
}> = ({ text, isReadOnly, autoFocus, language, theme, onChange, onClose }) => {
  const editorInstance = useRef<monaco.editor.IStandaloneCodeEditor>();

  const onChangeLatest = useLatest(onChange);

  useEffect(() => {
    if (editorInstance.current) {
      const currentText: string | undefined = text;

      if (editorInstance.current.getValue() !== currentText) {
        editorInstance.current.setValue(currentText ?? '');
      }

      editorInstance.current.updateOptions({
        readOnly: isReadOnly,
      });
    }
  }, [text, isReadOnly]);

  return (
    <div className="editor-wrapper">
      <LazyCodeEditor
        editorRef={editorInstance}
        text={text ?? ''}
        onChange={(newText) => {
          onChangeLatest.current?.(newText);
        }}
        theme={theme}
        language={language}
        isReadOnly={isReadOnly}
        autoFocus={autoFocus}
      />
    </div>
  );
};
