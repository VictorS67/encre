import React, { FC } from 'react';

import styled from '@emotion/styled';
import clsx from 'clsx';

import { SashContentProps } from '../types/splitpane.type';

const SashContentContainer = styled.div`
  width: 100%;
  height: 100%;

  &.vscode {
    &.active {
      background-color: var(--primary-color);
    }
  }
`;

export const SashContent: FC<SashContentProps> = ({
  className,
  children,
  active,
  type,
}) => {
  return (
    <SashContentContainer
      className={clsx('split-sash-content', { active }, type, className)}
    >
      {children}
    </SashContentContainer>
  );
};
