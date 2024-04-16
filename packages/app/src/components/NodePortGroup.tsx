import React, { FC, memo } from 'react';

import styled from '@emotion/styled';

import { Port } from './Port';
import { useNodeIO } from '../hooks/useNodeIO';
import { useStableCallback } from '../hooks/useStableCallback';
import { NodePortGroupProps } from '../types/port.type';
import { NodeInputPortDef, NodeOutputPortDef } from '../types/studio.type';

const NodePortGrp = styled.div<{
  isCollapsed?: boolean;
  nodeWidth: number;
}>`
  display: flex;
  justify-content: space-between;
  margin: 0 -11px 0 -11px;
  padding: 5px 0;

  .input-ports,
  .output-ports {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap 8px;
  }

  .input-ports .port {
    ${(props) =>
      props.isCollapsed
        ? `position: absolute;
    top: 26px;`
        : ''}
    justify-content: flex-start;
    margin-right: auto;
  }

  .output-ports .port {
    ${(props) =>
      props.isCollapsed
        ? `position: absolute;
    top: 26px;
    right: -11px;`
        : ''}
    justify-content: flex-end;
    margin-left: auto;
  }

  .input-ports .port-label {
    text-align: left;
  }

  .output-ports .port-label {
    text-align: right;
  }

  .port {
    display: flex;
    align-items: center;
    positon: relative;
    height: 30px;
  }

  .input-port,
  .output-port {
    translation: all 0.2s ease-in-out;
  }

  .input-port {
    margin-left: 0px;
  }

  .output-port {
    margin-right: 0px;
  }

  .port-circle {
    position: relative;
    border: 2px solid var(--primary-color);
    background: var(--canvas-background-color);
    border-radius: 50%;
    height: 16px;
    width: 16px;
    opacity: 1;
    cursor: pointer;
  }

  .port-label {
    font-size: 14px;
    font-weight: 700;
    font-style: normal;
    line-height: normal;
    margin: 0 4px;
    user-select: none;
    align-self: strech;
    cursor: default;

    max-width: ${(props) => props.nodeWidth / 2 - 17}px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    hyphens: auto;

    opacity: 0.85;
  }

  .input-port .port-label {
    color: var(--text-color-accent-1);
  }

  .output-port .port-label {
    color: var(--text-color-accent-2);
  }

  .port:hover .port-circle+.port-label {
    opacity: 1;
  }

  .port:hover .port-circle {
    border: 3px solid var(--primary-color);
    margin: 0 -1px;
  }

  .port.connected .port-circle{
    background-color: red;
    border: 2px solid green;
  }

  .port.closest .port-circle {
    background-color: green;
    border: 2px solid red;
  }

  .input-ports .port.connected {
    flex-direction: row;
    justify-content: flex-start;
  }

  .output-ports .port {
    flex-direction: row-reverse;
    justify-content: flex-end;
  }

  .port-hover-area {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    position: absolute;
    left: 8px;
    top: 8px;
    transform: translate(-50%, -50%);
  }
`;

export const NodePortGroup: FC<NodePortGroupProps> = memo(
  ({
    node,
    connections,
    nodeWidth,
    attributeListeners,
    draggingWire,
    draggingWireClosestPort,
    isCollapsed,
    onWireStartDrag,
    onWireEndDrag,
  }: NodePortGroupProps) => {
    const { inputDefs, outputDefs } = useNodeIO(node.id);

    const onMouseDownPort = useStableCallback(
      (
        e: React.MouseEvent<HTMLDivElement>,
        portName: string,
        isInput?: boolean,
      ) => {
        e.stopPropagation();
        e.preventDefault();
        onWireStartDrag?.(e, node.id, portName, isInput);
      },
    );

    const onMouseUpPort = useStableCallback(
      (e: React.MouseEvent<HTMLDivElement>, portName: string) => {
        e.stopPropagation();
        e.preventDefault();
        onWireEndDrag?.(e);
      },
    );

    return (
      <NodePortGrp
        nodeWidth={nodeWidth}
        isCollapsed={isCollapsed}
        {...attributeListeners}
      >
        <div className="input-ports">
          {inputDefs.map((inputDef: NodeInputPortDef) => {
            const isConnected: boolean =
              connections.some(
                (c) =>
                  c.toNodeId === inputDef.nodeId &&
                  c.toPortName === inputDef.name,
              ) ||
              (draggingWire?.toNodeId === inputDef.nodeId &&
                draggingWire?.toPortName === inputDef.name);

            return (
              <Port
                key={`${inputDef.nodeId}-input-${inputDef.name}`}
                nodeId={inputDef.nodeId}
                title={inputDef.name}
                definition={inputDef}
                attributeListeners={attributeListeners}
                draggingDataType={draggingWire?.dataType}
                isDragToEnabled={true}
                isClosestPortToWire={
                  draggingWireClosestPort?.nodeId === inputDef.nodeId &&
                  draggingWireClosestPort?.portName === inputDef.name
                }
                isInput
                isConnected={isConnected}
                isCollapsed={isCollapsed}
                onMouseDown={isCollapsed ? undefined : onMouseDownPort}
                onMouseUp={isCollapsed ? undefined : onMouseUpPort}
              />
            );
          })}
        </div>
        <div className="output-ports">
          {outputDefs.map((outputDef: NodeOutputPortDef) => {
            const isConnected: boolean =
              connections.some(
                (c) =>
                  c.fromNodeId === outputDef.nodeId &&
                  c.fromPortName === outputDef.name,
              ) ||
              (draggingWire?.fromNodeId === outputDef.nodeId &&
                draggingWire?.fromPortName === outputDef.name);

            return (
              <Port
                key={`${outputDef.nodeId}-output-${outputDef.name}`}
                nodeId={outputDef.nodeId}
                title={outputDef.name}
                definition={outputDef}
                attributeListeners={attributeListeners}
                draggingDataType={draggingWire?.dataType}
                isConnected={isConnected}
                isCollapsed={isCollapsed}
                onMouseDown={isCollapsed ? undefined : onMouseDownPort}
                onMouseUp={isCollapsed ? undefined : onMouseUpPort}
              />
            );
          })}
        </div>
      </NodePortGrp>
    );
  },
);

NodePortGroup.displayName = 'NodePortGroup';
