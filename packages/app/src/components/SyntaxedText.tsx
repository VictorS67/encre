import React, { FC, useLayoutEffect, useRef } from 'react';

import { useRecoilValue } from 'recoil';

import { themeState } from '../state/settings';
import { SyntaxedTextProps } from '../types/editor.type';
import { getColorMode } from '../utils/colorMode';
import { monaco } from '../utils/monacoEditor';

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
      theme === 'encre-code' || !theme ? `encre-code-${colorMode}` : theme;

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
