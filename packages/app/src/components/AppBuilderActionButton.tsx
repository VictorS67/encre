import React, { FC } from 'react';

import styled from '@emotion/styled';

import { AppBuilderActionButtonProps } from '../types/appbuilder.type';

const ActionButton = styled.button`
  cursor: pointer;
  padding-inline: 5px;
  width: fit-content;
  height: 34px;
  display: flex;
  border: 0;
  align-items: center;
  font-size: 0.9rem;
  font-weight: bold;
  border-radius: 5px;
  background-color: var(--text-color);
  color: var(--node-foreground-color);

  &:hover {
    opacity: 0.7;
  }

  &:focus-visible {
    outline: none;
  }

  &:disabled {
    border: 2px solid var(--text-disabled-color);
    background-color: var(--text-disabled-color);
    color: var(--node-background-color);
    opacity: 1;
  }

  .space {
    width: 25px;
  }
`;

export const AppBuilderActionButton: FC<AppBuilderActionButtonProps> = ({
  name,
}) => {
  return (
    <ActionButton>
      <span>{name}</span>
      <span className="space" />
    </ActionButton>
  );
};
