import React, { FC, memo, useEffect, useState } from 'react';

import styled from '@emotion/styled';
import { match } from 'ts-pattern';

import { LazyCodeEditor } from './LazyComponents';
import { useMarkdown } from '../hooks/useMarkdown';
import { useNodeBody } from '../hooks/useNodeBody';
import { useUnknownNodeContentDescriptor } from '../hooks/useNodeTypes';
import {
  NodeContentBodyProps,
  UnknownNodeContentBodyProps,
} from '../types/descriptor.type';
import {
  NodeBody,
  NodeBodyCodeStyle,
  NodeBodyMarkdownStyle,
  NodeBodyPlainStyle,
  NodeBodyStyle,
} from '../types/nodebody.type';

export const NodeContentBody: FC<NodeContentBodyProps> = memo(
  ({ node }: NodeContentBodyProps) => {
    const { Body } = useUnknownNodeContentDescriptor(node);

    const body = Body ? (
      <Body node={node} />
    ) : (
      <UnknownNodeContentBody node={node} />
    );

    return <div className="node-content-body">{body}</div>;
  },
);

NodeContentBody.displayName = 'NodeContentBody';

const UnknownNodeContentBodyWrapper = styled.div<{
  fontSize: number;
  fontFamily: 'monospace' | 'sans-serif';
}>`
  overflow: hidden;
  font-size: ${(props) => props.fontSize}px;
  font-family: ${(props) =>
    props.fontFamily === 'monospace'
      ? "'Roboto Mono', monospace"
      : "'Roboto', sans-serif"};
`;

export const UnknownNodeContentBody: FC<UnknownNodeContentBodyProps> = ({
  node,
}: UnknownNodeContentBodyProps) => {
  const [body, sBody] = useState<NodeBody | undefined>();

  useEffect(() => {
    const renderedBody = useNodeBody(node);

    sBody(renderedBody);
  }, [node]);

  const bodyStyle: NodeBodyStyle | NodeBodyStyle[] | undefined =
    typeof body === 'string' ? { type: 'plain', text: body } : body;

  let bodies = bodyStyle
    ? Array.isArray(bodyStyle)
      ? bodyStyle
      : [bodyStyle]
    : [];
  bodies = bodies.map((b) => {
    if (b.type === 'plain' && b.text.startsWith('::markdown')) {
      return {
        type: 'markdown',
        text: b.text.replace(/^::markdown/, '').trim(),
      };
    }

    return b;
  });

  const renderedBodies = bodies.map((style) => ({
    style,
    rendered: match(style)
      .with({ type: 'plain' }, (s) => <PlainNodeContentBody {...s} />)
      .with({ type: 'markdown' }, (s) => <MarkdownNodeContentBody {...s} />)
      .with({ type: 'code' }, (s) => <CodeNodeContentBody {...s} />)
      .exhaustive(),
  }));

  return (
    <div>
      {renderedBodies.map(({ style, rendered }, i) => (
        <UnknownNodeContentBodyWrapper
          key={i}
          fontFamily={style.fontFamily ?? 'sans-serif'}
          fontSize={style.fontSize ?? 12}
        >
          {rendered}
        </UnknownNodeContentBodyWrapper>
      ))}
    </div>
  );
};

/* eslint-disable react/prop-types */
export const PlainNodeContentBody: FC<NodeBodyPlainStyle> = memo(({ text }) => {
  return <pre className="pre-wrap">{text}</pre>;
});

PlainNodeContentBody.displayName = 'PlainNodeContentBody';

/* eslint-disable react/prop-types */
export const MarkdownNodeContentBody: FC<NodeBodyMarkdownStyle> = memo(
  ({ text }) => {
    const markdownBody = useMarkdown(text);

    return <div className="pre-wrap" dangerouslySetInnerHTML={markdownBody} />;
  },
);

MarkdownNodeContentBody.displayName = 'MarkdownNodeContentBody';

/* eslint-disable react/prop-types */
export const CodeNodeContentBody: FC<NodeBodyCodeStyle> = memo(
  ({ text, language, keywords }) => {
    return (
      <LazyCodeEditor
        text={text}
        language={language}
        keywords={keywords}
        isReadOnly={true}
        showLineNumbers={false}
      />
    );
  },
);

CodeNodeContentBody.displayName = 'CodeNodeContentBody';
