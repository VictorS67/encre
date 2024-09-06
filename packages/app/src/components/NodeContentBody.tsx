import React, { FC, memo, useEffect, useState } from 'react';

import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import { useAsyncEffect } from 'ahooks';
import { useRecoilValue } from 'recoil';

import { useStableCallback } from '../hooks/useStableCallback';
import { useUIContextDescriptors } from '../hooks/useUIContextDescriptors';
// import { nodeBodyMapState } from '../state/node';
import { nodeBodyMapState } from '../state/node';
import {
  KnownNodeContentBodyProps,
  NodeContentBodyProps,
  UnknownNodeContentBodyProps,
} from '../types/nodebody.type';
import { Node, NodeBody, UIContext } from '../types/studio.type';
import { UIContextDescriptor } from '../types/uicontext.type';
import { fakeId } from '../utils/fakeId';
// import { useGetNodeBody } from '../apis/node';
// import { useNodeBody } from '../hooks/useNodeBody';

const NodeContentBodyWrapper = styled.div<{
  fontSize: number;
  fontFamily: 'monospace' | 'sans-serif';
}>`
  overflow: hidden;
  font-size: ${(props) => props.fontSize}px;
  font-family: ${(props) =>
    props.fontFamily === 'monospace'
      ? "'Roboto Mono', monospace"
      : "'Roboto', sans-serif"};

  &:hover {
    background: var(--node-foreground-color-2);
  }
`;

export const NodeContentBody: FC<NodeContentBodyProps> = memo(
  ({ node }: NodeContentBodyProps) => {
    const nodeBodyMap = useRecoilValue(nodeBodyMapState);

    const {
      isPending,
      error,
      data: uiContexts,
      isFetching,
    } = useQuery({
      queryKey: ['nodeBody', node.id],
      queryFn: () => {
        const body = nodeBodyMap[node.id] ?? [];

        const bodyStyle: UIContext | UIContext[] | undefined =
          typeof body === 'string' ? { type: 'plain', text: body } : body;

        let uis: UIContext[] = bodyStyle
          ? Array.isArray(bodyStyle)
            ? bodyStyle
            : [bodyStyle]
          : [];

        uis = uis.map((ui) => {
          if (ui.type === 'plain' && ui.text.startsWith('::markdown')) {
            return {
              type: 'markdown',
              text: ui.text.replace(/^::markdown/, '').trim(),
            };
          }

          return ui;
        });

        return uis;
      },
    });

    if (isPending) return <></>;

    if (error) return <div>An error occurred: {error.message}</div>;

    return <KnownNodeContentBody node={node} uiContexts={uiContexts} />;
  },
);

NodeContentBody.displayName = 'NodeContentBody';

export const KnownNodeContentBody: FC<KnownNodeContentBodyProps> = ({
  node,
  uiContexts,
  onEditorClick,
}: KnownNodeContentBodyProps) => {
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
        const editingId: string = fakeId(14);

        const onBodyClick = onEditorClick
          ? useStableCallback((n: Node, id: string) => {
              onEditorClick?.(n, style, id);
            })
          : undefined;

        const renderedBody = Body ? (
          <Body
            node={node}
            id={editingId}
            onEditClick={onBodyClick}
            {...style}
          />
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

export const UnknownNodeContentBody: FC<UnknownNodeContentBodyProps> = ({
  node,
}: UnknownNodeContentBodyProps) => {
  return <div>Body is undefined</div>;
};
