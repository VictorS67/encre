/** @jsxImportSource @emotion/react */
import React, { FC, useCallback, useState } from 'react';

import { setGlobalTheme } from '@atlaskit/tokens';
import { css } from '@emotion/react';
import clsx from 'clsx';
import { useRecoilState, useRecoilValue } from 'recoil';

import { useUpdateNodeBuiltInTypePairs } from '../apis/registry';
import { useServerURL } from '../apis/server';
import { serverURLState, themeState } from '../state/settings';

import { NodeGraphBuilder } from './NodeGraphBuilder';
// import { send } from 'internal/src/fetch';

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
      <ActionPanel />
      <NodeGraphBuilder />
    </div>
  );
};

const actionStyles = css`
  position: absolute;
  top: 0px;
  left: auto;
  right: auto;
  padding: 10px 20px;
  border-radius: 5px;
  background-color: rgba(255, 255, 255, 0.03);
  color: var(--text-color);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 99999;
  font-size: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const ActionPanel: FC = () => {
  const { setServerURL } = useServerURL();
  const { updateNodeBuiltInTypePairs } = useUpdateNodeBuiltInTypePairs();

  const onClickSend = async (e: React.MouseEvent) => {
    await setServerURL('http://localhost:5127');
    await updateNodeBuiltInTypePairs();
  };
  return (
    <div css={actionStyles}>
      <button onClick={onClickSend}>Connect</button>
    </div>
  );
};
