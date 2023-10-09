/** @jsxImportSource @emotion/react */
import React, { FC } from 'react';

import { token } from '@atlaskit/tokens';
import { css } from '@emotion/react';

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

const borderStyles = css`
  border: 1px solid ${token('color.text')};
  border-radius: 5px;
`;

export const Icon: FC<IconProps> = (props: IconProps) => {
  const iconStyles = css`
    ${props.fontSize && `font-size: ${props.fontSize} !important;`}
    ${props.width && `width: ${props.width} !important;`}
    ${props.height && `height: ${props.height} !important;`}
    ${styles}
  `;

  return (
    <div css={iconStyles}>
      <props.icon fontSize="inherit" />
    </div>
  );
};

export const IconBtn: FC<IconProps> = (props: IconProps) => {
  const iconStyles = css`
    ${props.fontSize && `font-size: ${props.fontSize} !important;`}
    ${props.width && `width: ${props.width} !important;`}
    ${props.height && `height: ${props.height} !important;`}
    ${styles}
    ${borderStyles}
  `;

  return (
    <div css={iconStyles}>
      <props.icon fontSize="inherit" />
    </div>
  );
};
