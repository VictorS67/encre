import React, { FC, useState, forwardRef, useEffect } from 'react';

import { setGlobalTheme } from '@atlaskit/tokens';
import styled from '@emotion/styled';
import { Unstable_Popup as Popup } from '@mui/base/Unstable_Popup';
import FlashOffRoundedIcon from '@mui/icons-material/FlashOffRounded';
import FlashOnRoundedIcon from '@mui/icons-material/FlashOnRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import { css } from '@mui/material';
import Switch from '@mui/material/Switch';
import { useToggle } from 'ahooks';
import clsx from 'clsx';
import { useRecoilState, useRecoilValue } from 'recoil';

import { useUpdateNodeBuiltInTypePairs } from '../apis/registry';
import { useServer } from '../hooks/useServer';
import { Theme, themeState } from '../state/settings';

import { DropdownButton } from './DropdownButton';
import { Icon } from './Icon';

const ActionBarContainer = styled.div`
  position: absolute;
  top: 0;
  // left: var(--header-height);
  left: 0;
  // width: 100%;
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

  .server-tab {
    display: flex;
    gap: 4px;
    align-items: center;
  }

  .spacer {
    flex-grow: 1;
    width: 20px;
  }

  .encre-setting-bar {
    cursor: pointer;
    padding-inline: 5px;
    width: 70px;
    height: 28px;
    display: flex;
    align-items: center;
    font-size: 14px;
    font-weight: bold;
    border-radius: 5px;
    background-color: var(--primary-color);
    color: #f0f0f0;
  }

  .graph-dropdown {
    height: 28px;
    display: flex;
  }

  .run-button {
    cursor: pointer;
    padding-inline: 8px;
    height: 28px;
    display: flex;
    align-items: center;
    font-size: 14px;
    font-weight: bold;
    border-radius: 5px;
    background-color: var(--success-color);
    color: var(--node-background-color);
  }

  #simple-popper {
    z-index: 51;
  }
`;

const PopupBody = styled.div`
  width: max-content;
  padding: 2px 8px;
  margin: 8px 0;
  border-radius: 8px;
  border: 1px solid var(--node-background-color);
  background-color: var(--node-background-color);
  box-shadow: 0px 4px 8px rgb(0 0 0 / 0.7);
  font-size: 12px;
  font-weight: bold;
  color: var(--text-color);
  z-index: 1;

  display: flex;
  flex-direction: column;

  & .row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 28px;
    width: 100%;
  }

  & hr {
    border: none;
    border-bottom: 1px solid var(--text-color);
    margin: 5px 0;
  }

  .spacer {
    flex-grow: 1;
    width: 20px;
  }

  & .MuiSwitch-root {
    height: 36px;
  }

  & .MuiSwitch-thumb {
    width: 18px;
    height: 18px;
  }

  & .MuiSwitch-switchBase,
  & .MuiSwitch-switchBase.Mui-checked,
  & .MuiSwitch-switchBase.Mui-disabled {
    color: var(--node-foreground-color);

    &:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }
  }

  & .MuiSwitch-switchBase + .MuiSwitch-track,
  & .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track,
  & .MuiSwitch-switchBase.Mui-disabled + .MuiSwitch-track {
    background-color: var(--node-foreground-color);
  }
`;

function ThemeConfigurationRows() {
  const [theme, setTheme] = useRecoilState(themeState);
  const [themeModes, setThemeModes] = useState<string[]>(
    theme === Theme.AUTO
      ? ['Sync with system', 'Single Theme']
      : ['Single Theme', 'Sync with system'],
  );
  const [isDayTheme, toggleIsDayTheme] = useToggle();

  useEffect(() => {
    if (themeModes[0] === 'Single Theme') {
      setTheme(isDayTheme ? Theme.LIGHT : Theme.DARK);
    } else {
      setTheme(Theme.AUTO);
    }
  }, [themeModes, isDayTheme, toggleIsDayTheme, setTheme]);

  useEffect(() => {
    const colorTheme = document.documentElement.getAttribute('data-color-mode');

    if (colorTheme === 'dark') {
      toggleIsDayTheme.setLeft();
    } else {
      toggleIsDayTheme.setRight();
    }
  }, []);

  useEffect(() => {
    setGlobalTheme({
      colorMode: theme,
    });
  }, [theme]);

  const onThemeModeMenuClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setThemeModes([themeModes[1], themeModes[0]]);
  };

  return (
    <>
      <div className="row">
        <span>Theme Mode</span>
      </div>
      <div className="row">
        <DropdownButton
          name={themeModes[0]}
          items={themeModes.slice(1).map((tm) => ({ name: tm }))}
          showIcon={false}
          styling={{
            width: 120,
            fontSize: 12,
            borderColor: 'var(--node-foreground-color)',
            activeBorderColor: 'var(--node-foreground-color)',
            backgroundColor: 'var(--node-foreground-color)',
          }}
          onDropDownMenuClick={onThemeModeMenuClick}
        />
      </div>
      <div className="row">
        <span>Night</span>
        <Switch
          inputProps={{ 'aria-label': 'Color switch demo' }}
          onClick={(e) => {
            if (e.button === 0) {
              toggleIsDayTheme.toggle();
            }
          }}
          {...{ disabled: themeModes[0] === 'Sync with system' }}
          {...{ checked: isDayTheme }}
        />
        <span>Day</span>
      </div>
    </>
  );
}

function ConfigurationPopup() {
  const [anchor, setAnchor] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchor(anchor ? null : event.currentTarget);
  };

  const open = Boolean(anchor);
  const id = open ? 'configuration-popper' : undefined;

  return (
    <div>
      <div onClick={handleClick}>
        <Icon
          icon={TuneRoundedIcon}
          width={'28px'}
          height={'28px'}
          fontSize={'18px'}
          additionalStyles={css`
            cursor: pointer;
            border-radius: 5px;
            color: var(--text-color);
            background-color: var(--node-background-color);
          `}
        />
      </div>
      <Popup
        id={id}
        open={open}
        anchor={anchor}
        placement={'bottom-end'}
        disablePortal
        strategy="fixed"
        slotProps={{ root: { style: { zIndex: 51 } } }}
      >
        <PopupBody>
          <ThemeConfigurationRows />
          <hr />
        </PopupBody>
      </Popup>
    </div>
  );
}

export const ActionBar: FC = () => {
  const { updateNodeBuiltInTypePairs } = useUpdateNodeBuiltInTypePairs();
  const { serverState: server, connect } = useServer({
    onConnect: async () => {
      await updateNodeBuiltInTypePairs();
    },
  });

  const [url, serUrl] = useState<string>('http://localhost:5127');

  return (
    <ActionBarContainer>
      <div className={clsx('server-tab')}>
        <div>
          {server.url !== '' && (
            <Icon
              icon={FlashOnRoundedIcon}
              width={'28px'}
              height={'28px'}
              fontSize={'18px'}
              additionalStyles={css`
                cursor: pointer;
                border-radius: 5px;
                color: var(--node-background-color);
                background-color: var(--success-color);
              `}
            />
          )}
          {server.url === '' && (
            <Icon
              icon={FlashOffRoundedIcon}
              width={'28px'}
              height={'28px'}
              fontSize={'18px'}
              additionalStyles={css`
                cursor: pointer;
                border-radius: 5px;
                color: var(--node-background-color);
                background-color: var(--warn-color);
              `}
              onClick={() => connect(url)}
            />
          )}
        </div>

        <div className={clsx('encre-setting-bar')}>
          <span>Encre</span>
        </div>
        <div className="graph-dropdown">
          <DropdownButton
            name={'Graph 1'}
            items={[
              {
                name: '  ',
              },
            ]}
            showIcon={false}
            styling={{
              width: 100,
              fontSize: 13,
              borderColor: 'var(--primary-color)',
              activeBorderColor: 'var(--primary-color)',
            }}
          />
        </div>

        <div className="spacer"></div>

        <ConfigurationPopup />

        <div className={clsx('run-button')}>
          <span>Run</span>
        </div>
      </div>
    </ActionBarContainer>
  );
};
