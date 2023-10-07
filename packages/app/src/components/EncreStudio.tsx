/** @jsxImportSource @emotion/react */
import React, { FC, useState } from 'react';

import { setGlobalTheme } from '@atlaskit/tokens';
import { css } from '@emotion/react';
import clsx from 'clsx';
import { useRecoilValue } from 'recoil';

import { RoadmapCanvas } from './RoadmapCanvas';
import { themeState } from '../state/settings';

const styles = css`
  overflow: hidden;
  height: 100vh;
  width: 100vw;
`;

export const EncreStudio: FC = () => {
  const theme = useRecoilValue(themeState);

  setGlobalTheme({
    colorMode: theme,
  });

  return (
    <div css={styles}>
      <RoadmapCanvas />
    </div>
  );
};
