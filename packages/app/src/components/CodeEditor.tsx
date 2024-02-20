import React, { FC, useEffect, useRef } from "react";

import { useLatest } from "ahooks";
import { useRecoilValue } from "recoil";

import { themeState } from "../state/settings";
import { CodeEditorProps } from "../types/editor.type";
import { getColorMode } from "../utils/colorMode";
import { monaco } from "../utils/monacoEditor";

export const CodeEditor: FC<CodeEditorProps> = ({
  text,
  language,
  keywords,
  isReadOnly,
  autoFocus,
  showLineNumbers,
  scrollBeyondLastLine,
  theme,
  editorRef,
  onChange,
}: CodeEditorProps) => {
  const editorContainer = useRef<HTMLDivElement>(null);
  const editorInstance = useRef<monaco.editor.IStandaloneCodeEditor>();

  const onChangeLatest = useLatest(onChange);

  const appTheme = useRecoilValue(themeState);

  const _keywords = keywords ?? [];

  monaco.languages.setMonarchTokensProvider("encre-code", {
    keywords: _keywords,
    tokenizer: {
      root: [
        [
          /[a-zA-Z][\w$]*/,
          {
            cases: {
              "@keywords": "keyword",
              "@default": "variable",
            },
          },
        ],
        [/\{\{[^}]+\}\}/, "replacement"],
        [/".*?"/, "string"],
        [/\/\//, "comment"],
      ],
    },
  });

  monaco.languages.registerCompletionItemProvider("encre-code", {
    provideCompletionItems: (model, position) => {
      const suggestions = [
        ..._keywords.map((k) => {
          const word = model.getWordUntilPosition(position);

          return {
            label: k,
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: k,
            range: {
              startLineNumber: position.lineNumber,
              endLineNumber: position.lineNumber,
              startColumn: word.startColumn,
              endColumn: word.endColumn,
            },
          };
        }),
      ];

      return { suggestions };
    },
  });

  useEffect(() => {
    if (!editorContainer.current) return;

    const colorMode: string | null = getColorMode();
    if (!colorMode) return;

    const actualTheme: string =
      theme === "encre-code" || !theme ? `encre-code-${colorMode}` : theme;

    const editor = monaco.editor.create(editorContainer.current, {
      theme: actualTheme,
      lineNumbers: showLineNumbers ? "on" : "off",
      glyphMargin: false,
      folding: false,
      lineNumbersMinChars: 2,
      language,
      minimap: {
        enabled: false,
      },
      wordWrap: "on",
      readOnly: isReadOnly,
      value: text,
      scrollBeyondLastLine,
    });

    const onResize = () => {
      editor.layout();
    };

    editor.layout();

    window.addEventListener("resize", onResize);

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
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    if (editorInstance.current && appTheme) {
      const colorMode: string | null = getColorMode();
      if (!colorMode) return;

      const actualTheme: string =
        theme === "encre-code" || !theme ? `encre-code-${colorMode}` : theme;

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

  return <div ref={editorContainer} className="editor-container" />;
};

export default CodeEditor;
