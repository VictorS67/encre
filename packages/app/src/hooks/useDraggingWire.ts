import React, { useCallback, useEffect } from 'react';

import { useLatest } from 'ahooks';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import { nodeIODefState, nodeMapState } from '../state/node';
import { connectionsState } from '../state/nodeconnection';
import {
  draggingWireClosestPortState,
  draggingWireState,
  removeWireDataState,
  updateWireDataState,
  wireDataMapState,
} from '../state/wire';
import {
  Node,
  NodeConnection,
  NodeInputPortDef,
  NodeOutputPortDef,
  RecordId,
} from '../types/studio.type';
import { DefaultWireOptions, WireData } from '../types/wire.type';

export const defaultWireOptions: DefaultWireOptions = {
  straight: {
    type: 'straight',
  },
  bezier: {
    type: 'bezier',
    curvature: 0.25,
  },
  'adaptive-bezier': {
    type: 'adaptive-bezier',
  },
  'smooth-step': {
    type: 'smooth-step',
    borderRadius: 5,
    offset: 25,
  },
};

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
  const wireDataMap = useRecoilValue(wireDataMapState);
  const updateWireData = useSetRecoilState(updateWireDataState);
  const removeWireData = useSetRecoilState(removeWireDataState);

  const isDragging = !!draggingWire;

  const latestClosestPort = useLatest(draggingWireClosestPort);

  useEffect(() => {
    if (draggingWireClosestPort && isDragging) {
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
      fromNodeId: RecordId,
      fromPortName: string,
      isInput?: boolean,
    ) => {
      e.stopPropagation();

      if (isInput) {
        const toNodeId = fromNodeId;
        const toPortName = fromPortName;

        // remove the existing connection if the from port is already connected
        const existingConnectionIdx: number = connections.findIndex(
          (c) => c.toNodeId === toNodeId && c.toPortName === toPortName,
        );

        if (existingConnectionIdx !== -1) {
          const newConnections = [...connections];
          newConnections.splice(existingConnectionIdx, 1);
          onConnectionsChange(newConnections);

          const {
            fromNodeId: cFromNodeId,
            fromPortName: cFromPortName,
            toNodeId: cToNodeId,
            toPortName: cToPortName,
          } = connections[existingConnectionIdx];

          const definition = nodeIODefs[cFromNodeId]!.outputDefs.find(
            (o) => o.name === cFromPortName,
          )!;

          setDraggingWire({
            fromNodeId: cFromNodeId,
            fromPortName: cFromPortName,
            fromPortIsInput: false,
            dataType: definition.type,
          });

          const wireId = `wire-${cFromNodeId}-${cFromPortName}-partial`;
          const connectionWireId = `wire-${cFromNodeId}-${cFromPortName}-${cToNodeId}-${cToPortName}`;
          const oldWireData: WireData | undefined =
            wireDataMap[connectionWireId];

          if (oldWireData) {
            updateWireData({
              id: wireId,
              wireData: oldWireData,
            });
            removeWireData(connectionWireId);
          } else {
            updateWireData({
              id: wireId,
              wireData: {
                wireType: 'adaptive-bezier',
                wireOptions: defaultWireOptions['adaptive-bezier'],
              },
            });
          }
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

        const wireId = `wire-${fromNodeId}-${fromPortName}-partial`;
        updateWireData({
          id: wireId,
          wireData: {
            wireType: 'adaptive-bezier',
            wireOptions: defaultWireOptions['adaptive-bezier'],
          },
        });
      }
    },
    [
      connections,
      nodeIODefs,
      wireDataMap,
      onConnectionsChange,
      setDraggingWire,
      updateWireData,
      removeWireData,
    ],
  );

  const onWireEndDrag = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (!draggingWire) return;

      const { nodeId: toNodeId, portName: toPortName } =
        draggingWireClosestPort ?? {};

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

      // remove the existing connection if the output port is already connected
      const existingConnectionIdx: number = connections.findIndex(
        (c) => c.toNodeId === toNode!.id && c.toPortName === inputDef!.name,
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

      const draggingWireId = `wire-${connection.fromNodeId}-${connection.fromPortName}-partial`;
      const wireId = `wire-${connection.fromNodeId}-${connection.fromPortName}-${connection.toNodeId}-${connection.toPortName}`;

      const oldWireData: WireData | undefined = wireDataMap[draggingWireId];

      if (oldWireData) {
        updateWireData({
          id: wireId,
          wireData: oldWireData,
        });
        removeWireData(draggingWireId);
      } else {
        updateWireData({
          id: wireId,
          wireData: {
            wireType: 'adaptive-bezier',
            wireOptions: defaultWireOptions['adaptive-bezier'],
          },
        });
      }

      setDraggingWire(undefined);
      setDraggingWireClosestPort(undefined);
    },
    [
      draggingWire,
      connections,
      nodeMap,
      nodeIODefs,
      draggingWireClosestPort,
      wireDataMap,
      onConnectionsChange,
      setDraggingWire,
      setDraggingWireClosestPort,
      updateWireData,
      removeWireData,
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
