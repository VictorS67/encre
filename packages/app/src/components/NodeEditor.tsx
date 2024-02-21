import React, { FC } from 'react';

import { produce } from 'immer';
import { ErrorBoundary } from 'react-error-boundary';
import {
  isRecoilValue,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil';

import { DefaultNodeEditor } from './editors/DefaultNodeEditor';
import { useStableCallback } from '../hooks/useStableCallback';
import { editingNodeIdState, nodeMapState, nodesState } from '../state/node';
import { connectionsState } from '../state/nodeconnection';
import { NodeEditorProps } from '../types/editor.type';
import { Node } from '../types/studio.type';

export const NodeEditorRenderer: FC = () => {
  const nodeMap = useRecoilValue(nodeMapState);
  const [editingNodeId, setEditingNodeId] = useRecoilState(editingNodeIdState);

  const onDeselect = useStableCallback(() => {
    setEditingNodeId(undefined);
  });

  const nodeToEdit: Node | undefined = editingNodeId
    ? nodeMap[editingNodeId]
    : undefined;

  if (!editingNodeId || !nodeToEdit) {
    return null;
  }

  return (
    <ErrorBoundary
      fallback={
        <div>There is something wrong with rendering the NodeEditor...</div>
      }
    >
      <NodeEditor selectedNode={nodeToEdit} onDeselect={onDeselect} />
    </ErrorBoundary>
  );
};

export const NodeEditor: FC<NodeEditorProps> = ({
  selectedNode,
  onDeselect,
}: NodeEditorProps) => {
  // const setNodes = useSetRecoilState(nodesState);
  // const setConnections = useSetRecoilState(connectionsState);

  // const nodeMap = useRecoilValue(nodeMapState);

  // const updateNode = useStableCallback((node: Node) => {
  //   setNodes((nodes: Node[]) =>
  //     produce(nodes, (draft) => {
  //       const index: number = draft.findIndex((n) => n.id === node.id);
  //       draft[index] = node as any;
  //     })
  //   );
  // });

  // const { PopUpWindow } = useUnknownNodeContentDescriptor(selectedNode);

  // const nodeEditor = PopUpWindow ? (
  //   <PopUpWindow node={selectedNode} onChange={updateNode} />
  // ) : (
  //   <DefaultNodeEditor
  //     node={selectedNode}
  //     isReadOnly={false}
  //     onChange={updateNode}
  //     onClose={onDeselect}
  //   />
  // );

  return <></>;
};
