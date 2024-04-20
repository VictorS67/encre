import React, { CSSProperties, FC, memo, Suspense, useMemo } from 'react';

import { useRecoilValue } from 'recoil';

import { LazySyntaxedText } from './LazyComponents';
import { useMarkdown } from '../hooks/useMarkdown';
import { commentContentFromCommentIdState } from '../state/comment';
import { CommentContentBodyProps } from '../types/commentbody.type';
import { GraphComment, UIContext } from '../types/studio.type';

export const CommentContentBody: FC<CommentContentBodyProps> = memo(
  ({ comment }: CommentContentBodyProps) => {
    const commentContent = useRecoilValue(
      commentContentFromCommentIdState(comment.id),
    );

    let ui: UIContext;
    if (comment.type === 'plain' && comment.text.startsWith('::markdown')) {
      ui = {
        type: 'markdown',
        text: comment.text.replace(/^::markdown/, '').trim(),
      };
    } else if (comment.type === 'code') {
      ui = {
        type: comment.type,
        text: comment.text,
        language: comment.language,
        keywords: comment.keywords,
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
          <PlainTextCommentContentBody
            commentContent={commentContent}
            {...ui}
          />
        )}
        {ui.type === 'markdown' && (
          <MarkdownCommentContentBody commentContent={commentContent} {...ui} />
        )}
        {ui.type === 'code' && (
          <CodeCommentContentBody commentContent={commentContent} {...ui} />
        )}
      </div>
    );
  },
);

CommentContentBody.displayName = 'CommentContentBody';

/* eslint-disable react/prop-types */
export const PlainTextCommentContentBody: FC<
  { commentContent: GraphComment['visualInfo']['content'] } & Extract<
    UIContext,
    { type: 'plain' }
  >
> = memo(({ commentContent, text }) => {
  const contentTextStyle = useMemo(() => {
    const hAlign = commentContent?.horitontal ?? 'start';

    const styling: CSSProperties = {
      textAlign: hAlign,
    };

    return styling;
  }, [commentContent?.horitontal]);

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
  { commentContent: GraphComment['visualInfo']['content'] } & Extract<
    UIContext,
    { type: 'markdown' }
  >
> = memo(({ commentContent, text }) => {
  const markdownBody = useMarkdown(text);
  const contentTextStyle = useMemo(() => {
    const hAlign = commentContent?.horitontal ?? 'start';

    const styling: CSSProperties = {
      textAlign: hAlign,
    };

    return styling;
  }, [commentContent?.horitontal]);

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
  { commentContent: GraphComment['visualInfo']['content'] } & Extract<
    UIContext,
    { type: 'code' }
  >
> = memo(
  ({ commentContent, text, language, keywords, properties, variables }) => {
    const contentTextStyle = useMemo(() => {
      const hAlign = commentContent?.horitontal ?? 'start';

      const styling: CSSProperties = {
        textAlign: hAlign,
      };

      return styling;
    }, [commentContent?.horitontal]);

    return (
      <Suspense fallback={<div />}>
        <LazySyntaxedText
          text={text}
          language={language}
          keywords={keywords}
          properties={properties}
          variables={variables}
          style={contentTextStyle}
        />
      </Suspense>
    );
  },
);

CodeCommentContentBody.displayName = 'CodeCommentContentBody';
