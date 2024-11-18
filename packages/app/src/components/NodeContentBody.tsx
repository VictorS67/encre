import React, { FC, memo, useCallback, useEffect, useState } from 'react';

import styled from '@emotion/styled';
import { produce } from 'immer';
import { useQuery } from '@tanstack/react-query';
import { useAsyncEffect } from 'ahooks';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import { useStableCallback } from '../hooks/useStableCallback';
import { useUIContextDescriptors } from '../hooks/useUIContextDescriptors';
// import { nodeBodyMapState } from '../state/node';
import { editingNodeIdState, nodeBodyMapState, nodesState } from '../state/node';
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
    const [editingNodeId, setEditingNodeId] = useRecoilState(editingNodeIdState);

    const select = useStableCallback(() => {
      setEditingNodeId(node.id);
    });

    const deselect = useStableCallback(() => {
      setEditingNodeId(undefined);
    });

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

    console.log(`listening editingNodeId === node.id: ${editingNodeId === node.id}`);

    return <KnownNodeContentBody
      node={node}
      uiContexts={uiContexts ?? []}
      isEditing={editingNodeId === node.id}
      onSelect={select}
      onDeselect={deselect}
    />;

    // return <></>;
  },
);

NodeContentBody.displayName = 'NodeContentBody';

export const KnownNodeContentBody: FC<KnownNodeContentBodyProps> = ({
  node,
  uiContexts,
  isEditing,
  onSelect,
  onDeselect
  // onEditorClick,
}: KnownNodeContentBodyProps) => {
  const setNodes = useSetRecoilState(nodesState);

  const descriptors = useUIContextDescriptors(uiContexts);

  const renderedBodies = [] as {
    style: UIContext;
    Body: UIContextDescriptor<UIContext['type']>['Body'];
    Editor: UIContextDescriptor<UIContext['type']>['Editor'];
  }[];
  for (let i = 0; i < descriptors.length; i++) {
    const ui: UIContext = uiContexts[i];
    const descriptor: UIContextDescriptor<UIContext['type']> = descriptors[i];
    console.log(`index: ${i}, ui: `, ui);

    renderedBodies.push({
      style: ui,
      Body: descriptor.Body,
      Editor: descriptor.Editor
    });
  }

  const handleClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
    if (!isEditing) {
      console.log('node content body clicking!')
      onSelect?.();
    }
  }, [onSelect]);

  const updateNode = useStableCallback((n: Node) => {
    setNodes((nodes) =>
      produce(nodes, (draft) => {
        const index = draft.findIndex((n) => n.id === node.id);
        draft[index] = node as any;
      }),
    );
  });

  return (
    <div
      className="node-content-body"
      style={{ height: '100%', flex: 1, flexDirection: 'column' }}
      onClick={handleClick}
    >
      {renderedBodies.map(({ style, Body, Editor }, i) => {
        const editingId: string = fakeId(14);

        const renderedBody = Body ? (
          <Body
            node={node}
            id={editingId}
            onChange={updateNode}
            {...style}
          />
        ) : (
          <UnknownNodeContentBody node={node} />
        );

        // TODO: Change this to Editor
        const renderedEditor = Editor ? (
          <Editor
            node={node}
            id={editingId}
            onChange={updateNode}
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
            {isEditing ? renderedEditor : renderedBody}
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
