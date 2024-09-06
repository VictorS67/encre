import React, { FC, useEffect, useLayoutEffect, useRef, useState } from 'react';

import { useRecoilValue } from 'recoil';

import { themeState } from '../state/settings';
import { SyntaxedTextProps } from '../types/editor.type';
import { getColorMode } from '../utils/colorMode';
import { defineSuggestions, defineTokens, monaco } from '../utils/monacoEditor';

export const SyntaxedText: FC<SyntaxedTextProps> = ({
  text,
  language = 'encre-code',
  keywords = [],
  properties = [],
  variables = [],
  theme,
  style,
}) => {
  const editorContainer = useRef<HTMLPreElement>(null);

  const appTheme = useRecoilValue(themeState);

  const [tokenDisposable, setTokenDisposable] = useState<monaco.IDisposable>();
  const [completionDisposable, setCompletionDisposable] =
    useState<monaco.IDisposable>();

  // const _keywords = keywords;

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
    if (!tokenDisposable) {
      setTokenDisposable(defineTokens(keywords, properties, variables));
    }

    if (!completionDisposable) {
      setCompletionDisposable(
        defineSuggestions(keywords, properties, variables),
      );
    }

    const colorMode = getColorMode();
    if (!colorMode) return;

    const actualTheme: string =
      theme === 'encre-code' || !theme ? `encre-code-${colorMode}` : theme;

    monaco.editor.colorizeElement(editorContainer.current!, {
      theme: actualTheme,
    });
  }, [text, appTheme]);

  return (
    <pre
      ref={editorContainer}
      data-lang={language}
      className="pre-wrap"
      style={{ wordBreak: 'break-word', userSelect: 'text', ...style }}
    >
      {text}
    </pre>
  );
};

export default SyntaxedText;
