/** @jsxImportSource @emotion/react */
import React, { FC, useCallback, useState } from 'react';

import { css } from '@emotion/react';
import styled from '@emotion/styled';

import { SvgLogo } from '../icons/logo';

import { ActionBar } from './ActionBar';
import { AppBuilder } from './AppBuilder';
import { AppBuilderBar } from './AppBuilderBar';
import { Iframe } from './Iframe';
import { NodeGraphBuilder } from './NodeGraphBuilder';
import { Pane } from './Pane';
import { SideToolBar } from './SideToolBar';
import { SplitPane } from './SplitPane';

const styles = css`
  overflow: hidden;
  height: 100vh;
  width: 100vw;
`;

const SideBarContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: var(--header-height);
  height: 100vh;
  background-color: var(--canvas-background-color);
  border-right: 1px solid var(--text-disabled-color);
  z-index: 1000;
`;

const LogoContainer = styled.div`
  position: relative;
  width: 100%;
  height: var(--header-height);
  background-color: var(--canvas-background-color);
`;

export const EncreStudio: FC = () => {
  const [sizes, setSizes] = useState<(string | number)[]>([400, 'auto']);

  // TODO: remove this
  const [stage, setStage] = useState<number>(0);

  return (
    <div css={styles}>
      <SideBarContainer>
        <LogoContainer>
          <SvgLogo
            width={38}
            height={38}
            style={{ color: 'var(--primary-color)' }}
          />
        </LogoContainer>
        <SideToolBar />
      </SideBarContainer>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 'var(--header-height)',
          width: 'calc(100vw - var(--header-height))',
          height: '100vh',
        }}
      >
        <SplitPane split="vertical" sizes={sizes} onSizesChange={setSizes}>
          <Pane minSize={400}>
            <ActionBar />
            <NodeGraphBuilder />
          </Pane>
          <div>
            {stage === 0 && (
              <>
                <AppBuilderBar />
                <AppBuilder />
              </>
            )}
            {stage === 1 && (
              <>
                <AppBuilderBar />
                <div
                  style={{
                    paddingTop: 'var(--header-height)',
                    height: 'calc(100vh - var(--header-height))',
                    display: 'flex',
                  }}
                >
                  <PopupButton />                
                </div>
              </>
            )}
          </div>
        </SplitPane>
      </div>
    </div>
  );
};

const PopupButton = () => {
  const openPopup = () => {
    const newWindow = window.open('https://www.figma.com/proto/bPCoTdsdoNemAdCxvhJU2K/UI?node-id=768-1602&t=G3xEgguiNbMi8DbC-1&scaling=min-zoom&content-scaling=fixed&page-id=768%3A1601&starting-point-node-id=768%3A1602', 'Example App', 'width=800,height=600');
    if (newWindow) {
      // Perform further actions with newWindow if necessary
      newWindow.focus();
    }
  };

  return (
    <button style={{ width: 100, height: 50 }} onClick={openPopup}>Open Popup</button>
  );
};
