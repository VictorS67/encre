import React, { FC, useEffect, useRef } from "react";
import { CodeEditorProps } from "../types/code.type";
import { monaco } from "../utils/monacoEditor";
import { themeState } from "../state/settings";
import { useRecoilValue } from "recoil";
import { getColorMode } from "../utils/colorMode";

export const CodeEditor: FC<CodeEditorProps> = ({
  text,
  isReadOnly,
  language,
  showLineNumbers,
  scrollBeyondLastLine,
  theme,
}) => {
  const editorContainer = useRef<HTMLDivElement>(null);
  const editorInstance = useRef<monaco.editor.IStandaloneCodeEditor>();

  const appTheme = useRecoilValue(themeState);

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

    editorInstance.current = editor;

    return () => {
      editor.dispose();
      window.removeEventListener("resize", onResize);
    };
  }, [appTheme]);

  return <div ref={editorContainer} className="editor-container" />;
};

export default CodeEditor;
