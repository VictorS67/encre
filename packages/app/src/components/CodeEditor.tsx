import React, { FC, useEffect, useRef, useState } from 'react';

import { debounce } from '@mui/material';
import { useLatest } from 'ahooks';
import { useRecoilValue } from 'recoil';

import { themeState } from '../state/settings';
import { CodeEditorProps } from '../types/editor.type';
import { getColorMode } from '../utils/colorMode';
import { defineSuggestions, defineTokens, monaco } from '../utils/monacoEditor';

export const CodeEditor: FC<CodeEditorProps> = ({
  text,
  language,
  keywords,
  fontSize,
  fontFamily,
  isReadOnly,
  autoFocus,
  showLineNumbers,
  scrollBeyondLastLine,
  theme,
  editorRef,
  onChange,
  onKeyDown,
}: CodeEditorProps) => {
  const editorContainer = useRef<HTMLDivElement>(null);
  const editorInstance = useRef<monaco.editor.IStandaloneCodeEditor>();

  const onChangeLatest = useLatest(onChange);

  const appTheme = useRecoilValue(themeState);

  const [tokenDisposable, setTokenDisposable] = useState<monaco.IDisposable>();
  const [completionDisposable, setCompletionDisposable] =
    useState<monaco.IDisposable>();

  const _keywords = keywords ?? [];

  useEffect(() => {
    return () => {
      if (
        tokenDisposable?.dispose &&
        typeof tokenDisposable.dispose === 'function'
      ) {
        tokenDisposable.dispose();
      }
    };
  }, [tokenDisposable]);

  useEffect(() => {
    return () => {
      if (
        completionDisposable?.dispose &&
        typeof completionDisposable.dispose === 'function'
      ) {
        completionDisposable.dispose();
      }
    };
  }, [completionDisposable]);

  useEffect(() => {
    if (!editorContainer.current) return;

    if (!tokenDisposable) {
      setTokenDisposable(defineTokens(_keywords));
    }

    if (!completionDisposable) {
      setCompletionDisposable(defineSuggestions(_keywords));
    }

    const colorMode: string | null = getColorMode();
    if (!colorMode) return;

    const actualTheme: string =
      theme === 'encre-code' || !theme ? `encre-code-${colorMode}` : theme;

    const editor = monaco.editor.create(editorContainer.current, {
      theme: actualTheme,
      lineNumbers: showLineNumbers ? 'on' : 'off',
      automaticLayout: true,
      glyphMargin: false,
      folding: false,
      lineNumbersMinChars: 2,
      language,
      fontSize,
      fontFamily,
      minimap: {
        enabled: false,
      },
      wordWrap: 'on',
      readOnly: isReadOnly,
      value: text,
      scrollBeyondLastLine,
      overviewRulerLanes: 0,
      scrollbar: {
        vertical: 'hidden',
        horizontal: 'hidden',
        handleMouseWheel: false,
      },
    });

    const onResize = () => {
      editor.layout({ width: 0, height: 0 });

      window.requestAnimationFrame(() => {
        const rect = editorContainer.current?.getBoundingClientRect();

        editor.layout({ width: rect?.width ?? 0, height: rect?.height ?? 0 });
      });
    };

    editor.layout();

    const onResizeDebounced = debounce(onResize, 300);
    window.addEventListener('resize', onResizeDebounced);

    editor.onDidChangeModelContent(() => {
      onChangeLatest.current?.(editor.getValue());
    });

    editorInstance.current = editor;
    if (editorRef) {
      editorRef.current = editor;
    }

    const latestBeforeDispose = onChangeLatest.current;

    return () => {
      latestBeforeDispose?.(editor.getValue());
      editor.dispose();
      window.removeEventListener('resize', onResizeDebounced);
    };
  }, []);

  useEffect(() => {
    if (editorInstance.current && appTheme) {
      const colorMode: string | null = getColorMode();
      if (!colorMode) return;

      const actualTheme: string =
        theme === 'encre-code' || !theme ? `encre-code-${colorMode}` : theme;

      editorInstance.current.updateOptions({
        theme: actualTheme,
      });
    }
  }, [appTheme]);

  useEffect(() => {
    if (autoFocus) {
      editorInstance.current?.focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    if (onKeyDown) {
      const keyDown = editorInstance.current?.onKeyDown(onKeyDown);

      return () => {
        keyDown?.dispose();
      };
    }
  }, [onKeyDown]);

  return (
    <div
      ref={editorContainer}
      className="editor-container"
      style={{ height: '100%' }}
    />
  );
};

export default CodeEditor;
