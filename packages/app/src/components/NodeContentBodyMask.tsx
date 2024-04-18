import React, { FC } from 'react';

import styled from '@emotion/styled';

const NodeBodyMask = styled.div<{
  height: number;
}>`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.2) 50%,
    rgba(0, 0, 0, 0.5) 75%,
    rgba(0, 0, 0, 0.8) 100%
  );
  height: ${(props) => props.height}px;
  border-bottom-right-radius: calc(7px - 3px);
  border-bottom-left-radius: calc(7px - 3px);

  .mask-display {
    width: 100%;
    height: 100%;
    position: relative;
  }

  .mask-display::after {
    content: '';
    position: absolute;
    top: -2px;
    left: 50%;
    margin-left: -10px;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-top: 8px solid var(--primary-color);
  }

  .hint {
    color: white;
    font-size: 20px;
    pointer-events: none;
  }

  .mask * {
    pointer-events: none;
  }
`;

export const NodeContentBodyMask: FC<{
  height: number;
  onExpandClick?: (event: React.MouseEvent<HTMLElement>) => void;
}> = ({ height, onExpandClick }) => {
  return (
    <NodeBodyMask height={height} onClick={onExpandClick}>
      <div className="mask-display"></div>
    </NodeBodyMask>
  );
};
