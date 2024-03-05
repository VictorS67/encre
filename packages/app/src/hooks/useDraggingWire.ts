import React, { useCallback, useEffect } from 'react';

import { useLatest } from 'ahooks';
import { useRecoilState, useRecoilValue } from 'recoil';

import { nodeIODefState, nodeMapState } from '../state/node';
import { connectionsState } from '../state/nodeconnection';
import { draggingWireClosestPortState, draggingWireState } from '../state/wire';
import { Node, NodeConnection } from '../types/studio.type';

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

      if (isInput) {
        // remove the existing connection if the input port is already connected
        const existingConnectionIdx: number = connections.findIndex(
          (c) => c.inputNodeId === fromNodeId && c.inputName === fromPortName,
        );

        if (existingConnectionIdx !== -1) {
          const newConnections = [...connections];
          newConnections.splice(existingConnectionIdx, 1);
          onConnectionsChange(newConnections);

          const { outputName, outputNodeId } =
            connections[existingConnectionIdx];

          const definition = nodeIODefs[outputNodeId]!.outputDefs.find(
            (o) => o.name === outputName,
          )!;

          setDraggingWire({
            fromNodeId: outputNodeId,
            fromPortName: outputName,
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
          dataType: definition.type,
        });
      }
    },
    [connections, nodeIODefs, onConnectionsChange, setDraggingWire],
  );

  const onWireEndDrag = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (!draggingWire) return;

      const { nodeId: toNodeId, portName: toPortName } =
        draggingWireClosestPort ?? {};

      if (!toNodeId || !toPortName) return;

      e.stopPropagation();

      let inputNode: Node | undefined = nodeMap[toNodeId];
      let outputNode: Node | undefined = nodeMap[draggingWire.fromNodeId];

      let inputNodeIODef = inputNode ? nodeIODefs[inputNode.id]! : undefined;
      let outputNodeIODef = outputNode ? nodeIODefs[outputNode.id]! : undefined;

      let input = inputNode
        ? inputNodeIODef?.inputDefs.find((i) => i.name === toPortName)
        : undefined;
      let output = outputNode
        ? outputNodeIODef?.outputDefs.find(
            (i) => i.name === draggingWire.fromPortName,
          )
        : undefined;

      if (!inputNode || !outputNode || !input || !output) {
        const swap = inputNode;
        inputNode = outputNode;
        outputNode = swap;

        inputNodeIODef = inputNode ? nodeIODefs[inputNode.id]! : undefined;
        outputNodeIODef = outputNode ? nodeIODefs[outputNode.id] : undefined;

        input = inputNode
          ? inputNodeIODef?.inputDefs.find((i) => i.name === toPortName)
          : undefined;
        output = outputNode
          ? outputNodeIODef?.outputDefs.find(
              (i) => i.name === draggingWire.fromPortName,
            )
          : undefined;

        if (!inputNode || !outputNode || !input || !output) {
          setDraggingWire(undefined);
          setDraggingWireClosestPort(undefined);
          return;
        }
      }

      // remove the existing connection if the input port is already connected
      const existingConnectionIdx: number = connections.findIndex(
        (c) =>
          inputNode &&
          input &&
          c.inputNodeId === inputNode.id &&
          c.inputName === input.name,
      );

      const newConnections = [...connections];

      if (existingConnectionIdx !== -1) {
        newConnections.splice(existingConnectionIdx, 1);
      }

      // add the new connection
      const connection: NodeConnection = {
        inputNodeId: inputNode.id,
        inputName: input.name,
        outputNodeId: outputNode.id,
        outputName: output.name,
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
