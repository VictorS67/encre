import React, { FC, useEffect, useLayoutEffect, useRef, useState } from 'react';

import { debounce } from '@mui/material';
import { useLatest, useThrottleFn } from 'ahooks';
import { useRecoilValue } from 'recoil';

import { themeState } from '../state/settings';
import { CodeEditorProps } from '../types/editor.type';
import { getColorMode } from '../utils/colorMode';
import { defineSuggestions, defineTokens, monaco } from '../utils/monacoEditor';

export const CodeEditor: FC<CodeEditorProps> = ({
  text,
  language = 'encre-code',
  keywords = [],
  properties = [],
  variables = [],
  fontSize,
  fontFamily,
  isReadOnly,
  autoFocus = true,
  showLineNumbers,
  scrollBeyondLastLine = false,
  theme,
  editorRef,
  onChange,
  onKeyDown,
}: CodeEditorProps) => {
  // const editingCodeId = useRecoilValue(editingCodeIdState);
  const editorContainer = useRef<HTMLDivElement>(null);
  const editorInstance = useRef<monaco.editor.IStandaloneCodeEditor>();

  const onChangeLatest = useLatest(onChange);

  const appTheme = useRecoilValue(themeState);

  // const [tokenDisposable, setTokenDisposable] = useState<monaco.IDisposable>();
  // const [completionDisposable, setCompletionDisposable] =
  //   useState<monaco.IDisposable>();

  // useEffect(() => {
  //   setTokenDisposable(defineTokens(keywords, properties, variables));

  //   return () => {
  //     if (
  //       tokenDisposable?.dispose &&
  //       typeof tokenDisposable.dispose === 'function'
  //     ) {
  //       tokenDisposable.dispose();
  //     }
  //   };
  // }, []);

  // useEffect(() => {
  //   setCompletionDisposable(defineSuggestions(keywords, properties, variables));

  //   return () => {
  //     console.log(`MONACO: ${typeof completionDisposable?.dispose}`)

  //     if (
  //       completionDisposable?.dispose &&
  //       typeof completionDisposable.dispose === 'function'
  //     ) {
  //       console.log('MONACO: defineSuggestions dispose')

  //       completionDisposable.dispose();
  //     }
  //   };
  // }, []);

  useEffect(() => {
    if (!editorContainer.current) return;

    const colorMode: string | null = getColorMode();
    if (!colorMode) return;

    const actualTheme: string =
      theme === 'encre-code' || !theme ? `encre-code-${colorMode}` : theme;

    const completionDisposable = defineSuggestions(keywords, properties, variables);

    const editor = monaco.editor.create(editorContainer.current, {
      theme: actualTheme,
      lineNumbers: showLineNumbers ? 'on' : 'off',
      suggestOnTriggerCharacters: true,
      quickSuggestions: true,
      parameterHints: {
        enabled: true,
      },
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
      padding: {
        top: 0,
        bottom: 0,
      },
    });

    const onResize = () => {
      editor.layout({ width: 0, height: 0 });

      window.requestAnimationFrame(() => {
        const rect = editorContainer.current?.getBoundingClientRect();

        editor.layout({ width: rect?.width ?? 0, height: rect?.height ?? 0 });
      });
    };

    const contentHeight = editor.getContentHeight();
    editorContainer.current.style.height = `${contentHeight + 100}px`;
    editor.layout();

    const onResizeDebounced = debounce(onResize, 300);
    window.addEventListener('resize', onResizeDebounced);

    editor.onDidChangeModelContent(() => {
      onChangeLatest.current?.(editor.getValue());
      if (editorContainer.current) {
        editorContainer.current.style.height = `${editor.getContentHeight() + 100}px`;
      }

      editor.layout();
    });

    editorInstance.current = editor;
    if (editorRef) {
      editorRef.current = editor;
    }

    const latestBeforeDispose = onChangeLatest.current;

    // setTokenDisposable(defineTokens(keywords, properties, variables));

    // setCompletionDisposable(defineSuggestions(keywords, properties, variables));

    // setCommandDisposable(defineCommands(keywords));

    defineTokens(keywords, properties, variables);

    return () => {
      // const tokenDisposable = defineTokens(keywords, properties, variables);
      // tokenDisposable.dispose();
      // if (
      //   completionDisposable?.dispose &&
      //   typeof completionDisposable.dispose === 'function'
      // ) {
      //   console.log('MONACO: defineSuggestions dispose')

      //   completionDisposable.dispose();
      // }

      latestBeforeDispose?.(editor.getValue());
      editor.dispose();
      completionDisposable.dispose();
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
      style={{
        minWidth: 0,
        minHeight: 0,
        maxHeight: '100%',
        display: 'flex',
        flex: 1,
        height: '100%',
        width: '100%',
      }}
    />
  );
};

export default CodeEditor;
