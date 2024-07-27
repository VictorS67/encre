import React, { FC } from 'react';

import styled from '@emotion/styled';

const AppBuilderBarContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: calc(100% - 20px);
  height: var(--header-height);

  display: flex;
  justify-content: center;
  box-shadow: 3px 1px 10px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(1px);

  padding: 0 10px;
  background-color: var(--canvas-background-color);
  color: var(--text-color);
  z-index: 999;
  font-size: 12px;
  flex-direction: column;
  gap: 4px;
`;

export const AppBuilderBar: FC = () => {
  return <AppBuilderBarContainer></AppBuilderBarContainer>;
};
