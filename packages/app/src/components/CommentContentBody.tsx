import React, { CSSProperties, FC, memo, Suspense, useMemo } from 'react';

import { LazySyntaxedText } from './LazyComponents';
import { useMarkdown } from '../hooks/useMarkdown';
import { CommentContentBodyProps } from '../types/commentbody.type';
import { GraphComment, UIContext } from '../types/studio.type';

export const CommentContentBody: FC<CommentContentBodyProps> = memo(
  ({ comment }: CommentContentBodyProps) => {
    let ui: UIContext;
    if (comment.type === 'plain' && comment.text.startsWith('::markdown')) {
      ui = {
        type: 'markdown',
        text: comment.text.replace(/^::markdown/, '').trim(),
      };
    } else {
      ui = {
        type: comment.type,
        text: comment.text,
      };
    }

    return (
      <div className="comment-content-body">
        {ui.type === 'plain' && (
          <PlainTextCommentContentBody comment={comment} {...ui} />
        )}
        {ui.type === 'markdown' && (
          <MarkdownCommentContentBody comment={comment} {...ui} />
        )}
        {ui.type === 'code' && (
          <CodeCommentContentBody comment={comment} {...ui} />
        )}
      </div>
    );
  },
);

CommentContentBody.displayName = 'CommentContentBody';

/* eslint-disable react/prop-types */
export const PlainTextCommentContentBody: FC<
  { comment: GraphComment } & Extract<UIContext, { type: 'plain' }>
> = memo(({ comment, text }) => {
  const contentTextStyle = useMemo(() => {
    const hAlign = comment.visualInfo.content?.horitontal ?? 'start';

    const styling: CSSProperties = {
      textAlign: hAlign,
    };

    return styling;
  }, [comment.visualInfo.content?.horitontal]);

  return (
    <pre
      className="pre-wrap"
      style={{
        userSelect: 'text',
        display: 'flex',
        flexDirection: 'column',
        ...contentTextStyle,
      }}
    >
      {text}
    </pre>
  );
});

PlainTextCommentContentBody.displayName = 'PlainTextCommentContentBody';

/* eslint-disable react/prop-types */
export const MarkdownCommentContentBody: FC<
  { comment: GraphComment } & Extract<UIContext, { type: 'markdown' }>
> = memo(({ comment, text }) => {
  const markdownBody = useMarkdown(text);
  const contentTextStyle = useMemo(() => {
    const hAlign = comment.visualInfo.content?.horitontal ?? 'start';

    const styling: CSSProperties = {
      textAlign: hAlign,
    };

    return styling;
  }, [comment.visualInfo.content?.horitontal]);

  return (
    <div
      className="pre-wrap"
      style={{
        userSelect: 'text',
        ...contentTextStyle,
      }}
      dangerouslySetInnerHTML={markdownBody}
    />
  );
});

MarkdownCommentContentBody.displayName = 'MarkdownCommentContentBody';

/* eslint-disable react/prop-types */
export const CodeCommentContentBody: FC<
  { comment: GraphComment } & Extract<UIContext, { type: 'code' }>
> = memo(({ comment, text, language, keywords }) => {
  const contentTextStyle = useMemo(() => {
    const hAlign = comment.visualInfo.content?.horitontal ?? 'start';

    const styling: CSSProperties = {
      textAlign: hAlign,
    };

    return styling;
  }, [comment.visualInfo.content?.horitontal]);

  return (
    <Suspense fallback={<div />}>
      <LazySyntaxedText
        text={text}
        language={language ?? 'encre-code'}
        keywords={keywords ?? []}
        style={contentTextStyle}
      />
    </Suspense>
  );
});

CodeCommentContentBody.displayName = 'CodeCommentContentBody';
