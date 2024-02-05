import React, { FC, useLayoutEffect, useRef } from "react";
import { SyntaxedTextProps } from "../types/editor.type";
import { useRecoilValue } from "recoil";
import { themeState } from "../state/settings";
import { monaco } from "../utils/monacoEditor";
import { getColorMode } from "../utils/colorMode";

export const SyntaxedText: FC<SyntaxedTextProps> = ({
  text,
  language,
  theme,
}) => {
  const editorContainer = useRef<HTMLPreElement>(null);

  const appTheme = useRecoilValue(themeState);

  useLayoutEffect(() => {
    const colorMode = getColorMode();
    if (!colorMode) return;

    const actualTheme: string =
      theme === "encre-code" || !theme ? `encre-code-${colorMode}` : theme;

    monaco.editor.colorizeElement(editorContainer.current!, {
      theme: actualTheme,
    });
  }, [text, appTheme]);

  return (
    <pre ref={editorContainer} data-lang={language}>
      {text}
    </pre>
  );
};

export default SyntaxedText;
