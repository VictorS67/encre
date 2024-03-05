import React, { useCallback, useEffect } from 'react';

import { useLatest } from 'ahooks';
import { useRecoilState, useRecoilValue } from 'recoil';

import { nodeIODefState, nodeMapState } from '../state/node';
import { connectionsState } from '../state/nodeconnection';
import { draggingWireClosestPortState, draggingWireState } from '../state/wire';
import {
  Node,
  NodeConnection,
  NodeInputPortDef,
  NodeOutputPortDef,
} from '../types/studio.type';

export const useDraggingWire = (
  onConnectionsChange: (cs: NodeConnection[]) => void,
) => {
  const [draggingWire, setDraggingWire] = useRecoilState(draggingWireState);
  const nodeIODefs = useRecoilValue(nodeIODefState);
  const connections = useRecoilValue(connectionsState);
  const nodeMap = useRecoilValue(nodeMapState);
  const [draggingWireClosestPort, setDraggingWireClosestPort] = useRecoilState(
    draggingWireClosestPortState,
  );

  const isDragging = !!draggingWire;

  const latestClosestPort = useLatest(draggingWireClosestPort);

  useEffect(() => {
    if (draggingWireClosestPort && isDragging) {
      console.log('updating dragging wire');

      setDraggingWire((w) => ({
        ...w!,
        toNodeId: draggingWireClosestPort.nodeId,
        toPortName: draggingWireClosestPort.portName,
      }));
    } else if (isDragging) {
      setDraggingWire((w) => ({
        ...w!,
        toNodeId: undefined,
        toPortName: undefined,
      }));
    }
  }, [draggingWireClosestPort, setDraggingWire, isDragging]);

  const onWireStartDrag = useCallback(
    (
      e: React.MouseEvent<HTMLElement>,
      fromNodeId: string,
      fromPortName: string,
      isInput?: boolean,
    ) => {
      e.stopPropagation();

      console.log(
        `onWireStartDrag: fromNodeId: ${fromNodeId}, fromPortName: ${fromPortName}, isInput: ${isInput}`,
      );

      if (isInput) {
        // remove the existing connection if the input port is already connected
        const existingConnectionIdx: number = connections.findIndex(
          (c) => c.fromNodeId === fromNodeId && c.fromPortName === fromPortName,
        );

        console.log(
          `start drag finding connections: ${JSON.stringify(connections)}`,
        );

        if (existingConnectionIdx !== -1) {
          const newConnections = [...connections];
          newConnections.splice(existingConnectionIdx, 1);
          onConnectionsChange(newConnections);

          const { fromNodeId: cFromNodeId, fromPortName: cFromPortName } =
            connections[existingConnectionIdx];

          const definition = nodeIODefs[cFromNodeId]!.outputDefs.find(
            (o) => o.name === cFromPortName,
          )!;

          setDraggingWire({
            fromNodeId: cFromNodeId,
            fromPortName: cFromPortName,
            fromPortIsInput: false,
            dataType: definition.type,
          });
        }
      } else {
        const definition = nodeIODefs[fromNodeId]!.outputDefs.find(
          (o) => o.name === fromPortName,
        )!;

        setDraggingWire({
          fromNodeId,
          fromPortName,
          fromPortIsInput: !!isInput,
          dataType: definition.type,
        });
      }
    },
    [connections, nodeIODefs, onConnectionsChange, setDraggingWire],
  );

  const onWireEndDrag = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      console.log(
        `onWireEndDrag: draggingWire: ${JSON.stringify(draggingWire)}`,
      );

      if (!draggingWire) return;

      const { nodeId: toNodeId, portName: toPortName } =
        draggingWireClosestPort ?? {};

      console.log(
        `onWireEndDrag: toNodeId: ${toNodeId}, toPortName: ${toPortName}`,
      );

      if (!toNodeId || !toPortName) return;

      e.stopPropagation();

      let fromNode: Node | undefined = nodeMap[draggingWire.fromNodeId];
      let toNode: Node | undefined = nodeMap[toNodeId];

      let fromNodeIODef = fromNode ? nodeIODefs[fromNode.id]! : undefined;
      let toNodeIODef = toNode ? nodeIODefs[toNode.id]! : undefined;

      let inputDef: NodeInputPortDef | undefined = toNode
        ? toNodeIODef?.inputDefs.find((i) => i.name === toPortName)
        : undefined;
      let outputDef: NodeOutputPortDef | undefined = fromNode
        ? fromNodeIODef?.outputDefs.find(
            (o) => o.name === draggingWire.fromPortName,
          )
        : undefined;

      if (!fromNode || !toNode || !inputDef || !outputDef) {
        const swap = fromNode;
        fromNode = toNode;
        toNode = swap;

        fromNodeIODef = fromNode ? nodeIODefs[fromNode.id]! : undefined;
        toNodeIODef = toNode ? nodeIODefs[toNode.id]! : undefined;

        inputDef = toNode
          ? toNodeIODef?.inputDefs.find((i) => i.name === toPortName)
          : undefined;
        outputDef = fromNode
          ? fromNodeIODef?.outputDefs.find(
              (o) => o.name === draggingWire.fromPortName,
            )
          : undefined;

        if (!fromNode || !toNode || !inputDef || !outputDef) {
          setDraggingWire(undefined);
          setDraggingWireClosestPort(undefined);
          return;
        }
      }

      // remove the existing connection if the input port is already connected
      const existingConnectionIdx: number = connections.findIndex(
        (c) =>
          c.fromNodeId === fromNode!.id && c.fromPortName === outputDef!.name,
      );

      const newConnections = [...connections];

      if (existingConnectionIdx !== -1) {
        newConnections.splice(existingConnectionIdx, 1);
      }

      // add the new connection
      const connection: NodeConnection = {
        fromNodeId: fromNode.id,
        fromPortName: outputDef.name,
        toNodeId: toNode.id,
        toPortName: inputDef.name,
      };

      onConnectionsChange?.([...newConnections, connection]);

      setDraggingWire(undefined);
      setDraggingWireClosestPort(undefined);
    },
    [
      draggingWire,
      connections,
      nodeMap,
      nodeIODefs,
      draggingWireClosestPort,
      onConnectionsChange,
      setDraggingWire,
      setDraggingWireClosestPort,
    ],
  );

  useEffect(() => {
    const onWindowClick = (e: MouseEvent) => {
      // If mouse is released without connecting to another port, remove the dragging wire
      if (draggingWire && e.type === 'mouseup') {
        if (!latestClosestPort.current) {
          setDraggingWire(undefined);
        }
      }
    };

    window.addEventListener('mouseup', onWindowClick);
    return () => {
      window.removeEventListener('mouseup', onWindowClick);
    };
  }, [draggingWire, latestClosestPort, setDraggingWire]);

  return { draggingWire, onWireStartDrag, onWireEndDrag };
};
