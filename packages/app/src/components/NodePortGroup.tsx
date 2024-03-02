import React, { FC, memo } from 'react';

import styled from '@emotion/styled';

import { Port } from './Port';
import { useNodeIO } from '../hooks/useNodeIO';
import { NodePortGroupProps } from '../types/port.type';
import { NodeInputPortDef, NodeOutputPortDef } from '../types/studio.type';

const NodePortGrp = styled.div<{
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
    justify-content: flex-start;
  }

  .output-ports .port {
    justify-content: flex-end;
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

    width: ${(props) => props.nodeWidth * 0.4}px;
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

  .input-ports .port.connected {
    flex-direction: row;
    justify-content: flex-start;
  }

  .output-ports .port {
    flex-direction: row-reverse;
    justify-content: flex-end;
  }
`;

export const NodePortGroup: FC<NodePortGroupProps> = memo(
  ({ node, connections, nodeWidth }: NodePortGroupProps) => {
    const { inputDefs, outputDefs } = useNodeIO(node.id);

    return (
      <NodePortGrp nodeWidth={nodeWidth}>
        <div className="input-ports">
          {inputDefs.map((input: NodeInputPortDef) => {
            const isConnected: boolean = connections.some(
              (c) => c.inputNodeId === node.id && c.inputName === input.name,
            );

            return (
              <Port
                key={`input-${input.name}`}
                nodeId={input.nodeId}
                title={input.name}
                definition={input}
                isInput
                isConnected={isConnected}
              />
            );
          })}
        </div>
        <div className="output-ports">
          {outputDefs.map((output: NodeOutputPortDef) => {
            const isConnected: boolean = connections.some(
              (c) => c.outputNodeId === node.id && c.outputName === output.name,
            );

            return (
              <Port
                key={`input-${output.name}`}
                nodeId={output.nodeId}
                title={output.name}
                definition={output}
                isConnected={isConnected}
              />
            );
          })}
        </div>
      </NodePortGrp>
    );
  },
);

NodePortGroup.displayName = 'NodePortGroup';
