import React, { FC, useState } from 'react';

import styled from '@emotion/styled';
import { useAsyncEffect } from 'ahooks';

import { useUIContextDescriptors } from '../hooks/useUIContextDescriptors';
import { UIContextDescriptor } from '../types/descriptor.type';
import {
  NodeContentBodyProps,
  UnknownNodeContentBodyProps,
} from '../types/nodebody.type';
import { NodeBody, UIContext } from '../types/studio.type';

const NodeContentBodyWrapper = styled.div<{
  fontSize: number;
  fontFamily: 'monospace' | 'sans-serif';
}>`
  user-select: none;
  overflow: hidden;
  font-size: ${(props) => props.fontSize}px;
  font-family: ${(props) =>
    props.fontFamily === 'monospace'
      ? "'Roboto Mono', monospace"
      : "'Roboto', sans-serif"};
`;

export const NodeContentBody: FC<NodeContentBodyProps> = ({
  node,
}: NodeContentBodyProps) => {
  const [body, setBody] = useState<NodeBody | undefined>();

  useAsyncEffect(async () => {
    const renderedBody = await node.getBody();

    setBody(renderedBody);
  }, [node]);

  const bodyStyle: UIContext | UIContext[] | undefined =
    typeof body === 'string' ? { type: 'plain', text: body } : body;

  let uiContexts: UIContext[] = bodyStyle
    ? Array.isArray(bodyStyle)
      ? bodyStyle
      : [bodyStyle]
    : [];
  uiContexts = uiContexts.map((ui) => {
    if (ui.type === 'plain' && ui.text.startsWith('::markdown')) {
      return {
        type: 'markdown',
        text: ui.text.replace(/^::markdown/, '').trim(),
      };
    }

    return ui;
  });

  const descriptors = useUIContextDescriptors(uiContexts);

  const renderedBodies = [] as {
    style: UIContext;
    Body: UIContextDescriptor<UIContext['type']>['Body'];
  }[];
  for (let i = 0; i < descriptors.length; i++) {
    const ui: UIContext = uiContexts[i];
    const descriptor: UIContextDescriptor<UIContext['type']> = descriptors[i];

    renderedBodies.push({
      style: ui,
      Body: descriptor.Body,
    });
  }

  return (
    <div
      className="node-content-body"
      style={{ height: '100%', flex: 1, flexDirection: 'column' }}
    >
      {renderedBodies.map(({ style, Body }, i) => {
        const renderedBody = Body ? (
          <Body node={node} {...style} />
        ) : (
          <UnknownNodeContentBody node={node} />
        );

        return (
          <NodeContentBodyWrapper
            key={i}
            fontFamily={style.fontFamily ?? 'sans-serif'}
            fontSize={style.fontSize ?? 14}
          >
            {renderedBody}
          </NodeContentBodyWrapper>
        );
      })}
    </div>
  );
};

NodeContentBody.displayName = 'NodeContentBody';

export const UnknownNodeContentBody: FC<UnknownNodeContentBodyProps> = ({
  node,
}: UnknownNodeContentBodyProps) => {
  return <div>Body is undefined</div>;
};
