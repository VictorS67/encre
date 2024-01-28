import { useMemo } from 'react';

import { marked } from 'marked';

export function useMarkdown(text?: string, enabled: boolean = true) {
  return useMemo(() => {
    if (!enabled) {
      return { __html: '' };
    }

    const markdownHTML: string = marked(text ?? '');

    return { __html: markdownHTML };
  }, [text, enabled]);
}
