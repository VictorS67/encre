import React, { FC, useCallback, useMemo } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import { useContextMenuNodeGraphHandler } from '../hooks/useContextMenuNodeGraphHandler';
import { useEditorClick } from '../hooks/useEditorClick';
import { useStableCallback } from '../hooks/useStableCallback';
import { commentsState, selectingCommentIdsState } from '../state/comment';
import { nodesState, selectingNodeIdsState } from '../state/node';
import { connectionsState } from '../state/nodeconnection';
import { selectingWireIdsState } from '../state/wire';
import { GraphComment, Node, RecordId } from '../types/studio.type';

import { NodeCanvas } from './NodeCanvas';

export const NodeGraphBuilder: FC = () => {
  const [nodes, setNodes] = useRecoilState(nodesState);
  const [connections, setConnections] = useRecoilState(connectionsState);
  const [comments, setComments] = useRecoilState(commentsState);
  const setSelectingNodeIds = useSetRecoilState(selectingNodeIdsState);
  const setSelectingCommentIds = useSetRecoilState(selectingCommentIdsState);
  const setSelectingWireIds = useSetRecoilState(selectingWireIdsState);
  const contextMenuNodeGraphHandler = useContextMenuNodeGraphHandler();

  const onNodesChange = useStableCallback((newNodes: Node[]) => {
    setNodes(newNodes);
  });

  const onCommentsChange = useStableCallback((newComments: GraphComment[]) => {
    setComments(newComments);
  });

  const onNodesSelect = useStableCallback(
    (newNodes: Node[], isMulti?: boolean) => {
      if (isMulti) {
        setSelectingNodeIds((nodeIds: RecordId[]) => [
          ...new Set([...nodeIds, ...newNodes.map((n) => n.id)]),
        ]);
      } else {
        if (newNodes.length > 1) return;

        setSelectingNodeIds(newNodes.map((n) => n.id));
      }
    },
  );

  const onCommentsSelect = useStableCallback(
    (newComments: GraphComment[], isMulti?: boolean) => {
      if (isMulti) {
        setSelectingCommentIds((commentIds: RecordId[]) => [
          ...new Set([...commentIds, ...newComments.map((c) => c.id)]),
        ]);
      } else {
        if (newComments.length > 1) return;

        setSelectingCommentIds(newComments.map((c) => c.id));
      }
    },
  );

  const onWiresSelect = useStableCallback(
    (newWireIds: string[], isMulti?: boolean) => {
      if (isMulti) {
        setSelectingWireIds((wireIds: string[]) => [
          ...new Set([...wireIds, ...newWireIds]),
        ]);
      } else {
        if (newWireIds.length > 1) return;

        setSelectingWireIds(newWireIds);
      }
    },
  );

  return (
    <ErrorBoundary
      fallback={<div>There is something wrong in NodeCanvas...</div>}
    >
      {/* <div>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. In quis lorem
        arcu. Nam eget felis nec orci porttitor interdum eget eu nisi. Curabitur
        aliquam nec diam sit amet feugiat. Praesent ipsum ex, maximus vel tellus
        a, placerat tincidunt sapien. Aenean et odio at ex semper ornare. Duis
        in turpis tincidunt elit hendrerit sagittis. Sed et magna ac nunc tempor
        porttitor condimentum vel orci. Pellentesque vel posuere augue. Sed a
        leo eu felis euismod hendrerit. Nulla tempus arcu ut tempus faucibus.
        Integer a odio congue, luctus quam quis, maximus augue. Fusce sodales
        lacus quis auctor accumsan. Curabitur aliquet lacus in neque fermentum,
        quis feugiat mauris condimentum. Sed tristique porttitor pulvinar.
        Vestibulum malesuada vel diam at rhoncus. Donec id turpis nisi. Etiam
        vitae leo eleifend, imperdiet elit sed, efficitur arcu. Etiam volutpat,
        massa imperdiet venenatis ultricies, felis lectus vehicula nunc, vel
        dapibus velit nunc efficitur purus. Nam id nunc vitae lacus aliquam
        placerat. Quisque a pellentesque diam. Praesent et mi nisl. Integer
        aliquet rutrum eros vel rutrum. Aenean eu tincidunt ligula. Cras quis
        nisl pellentesque, semper orci nec, aliquet eros. Donec lacus erat,
        porttitor vitae placerat ut, varius sit amet risus. Ut vel lacus nec
        nibh tempor aliquet ac id diam. Integer sit amet euismod elit. Aenean
        malesuada tortor libero, in aliquet mauris efficitur sed. Proin congue
        nisl ac fermentum laoreet. Nam maximus ultricies elementum. Sed rutrum
        lectus eget sapien commodo tempus. Nullam arcu diam, cursus ut nulla eu,
        tincidunt volutpat orci. Suspendisse eleifend libero non sapien lacinia
        scelerisque. Ut interdum, libero eu faucibus gravida, purus ex pretium
        quam, in imperdiet ex dolor non sapien. In erat nisi, porttitor vel
        sollicitudin quis, lobortis ut massa. Donec facilisis diam et odio
        lobortis, non aliquet ipsum convallis. Nunc facilisis nisi a dui
        euismod, non mollis nunc pulvinar. Morbi luctus aliquet massa, et
        finibus enim pretium non. Morbi ac semper neque. Nullam mollis mi non
        tortor luctus, quis cursus libero condimentum. Suspendisse aliquam velit
        nisl, in vehicula dui hendrerit placerat. Aliquam porta risus sed
        maximus vestibulum. Morbi gravida dictum libero quis rutrum. Nunc justo
        lacus, tempus eu tellus sed, egestas dictum risus. Mauris eget porta
        nibh, eu feugiat nunc. Aenean tincidunt mattis sapien. Nullam consequat
        mi sit amet congue facilisis. In eget pretium mauris. Aenean ultricies
        placerat posuere. Maecenas elementum urna non sapien ultrices pretium.
        Nunc a ex vitae erat pharetra eleifend quis a justo. Donec eu nisl sed
        tellus eleifend ornare sit amet eget velit. Duis bibendum suscipit est,
        in blandit nulla congue non. Sed blandit diam libero, nec convallis ex
        pretium in.
      </div> */}
      <NodeCanvas
        nodes={nodes}
        connections={connections}
        comments={comments}
        onNodesChange={onNodesChange}
        onCommentsChange={onCommentsChange}
        onConnectionsChange={setConnections}
        onNodesSelect={onNodesSelect}
        onCommentsSelect={onCommentsSelect}
        onWiresSelect={onWiresSelect}
        onContextMenuSelect={contextMenuNodeGraphHandler}
      />
    </ErrorBoundary>
  );
};
