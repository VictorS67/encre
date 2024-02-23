/** @jsxImportSource @emotion/react */
import React, { FC } from 'react';

import { token } from '@atlaskit/tokens';
import { SerializedStyles, css } from '@emotion/react';
import styled from '@emotion/styled';

import { IconProps } from '../types/icon.type';

const styles = css`
  display: flex;
  flex: 1;

  font-size: inherit;
  width: 42px;
  height: 42px;
  align-items: center;
  justify-content: center;
`;

const IconDiv = styled.div<{
  fontSize?: string;
  width?: string;
  height?: string;
  additionalStyles?: SerializedStyles;
}>`
  font-size: ${(props) => props.fontSize ?? 'inherit'} !important;
  width: ${(props) => props.width ?? '42px'} !important;
  height: ${(props) => props.height ?? '42px'} !important;
  ${(props) => props.additionalStyles ?? ''}
  ${styles}
`;

export const Icon: FC<IconProps> = (props: IconProps) => {
  return (
    <IconDiv
      fontSize={props.fontSize}
      height={props.height}
      width={props.width}
      additionalStyles={props.additionalStyles}
      onClick={props.onClick}
    >
      <props.icon fontSize="inherit" />
    </IconDiv>
  );
};
