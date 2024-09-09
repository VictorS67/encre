import React, { FC } from 'react';

import styled from '@emotion/styled';
import { Unstable_Popup as Popup } from '@mui/base/Unstable_Popup';
import AccountTreeTwoToneIcon from '@mui/icons-material/AccountTreeTwoTone';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import WidgetsRoundedIcon from '@mui/icons-material/WidgetsRounded';
import clsx from 'clsx';

import { Icon } from './Icon';

const PopupBody = styled.div`
  width: max-content;
  padding: 2px 8px;
  margin: 0 5px;
  border-radius: 8px;
  border: 1px solid var(--text-disabled-color);
  background-color: var(--node-background-color);
  box-shadow: 0px 4px 8px rgb(0 0 0 / 0.2);
  font-size: 12px;
  font-weight: bold;
  color: var(--text-color);
  z-index: 1;
`;

const SideToolBarContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px 0;
  gap: 15px;

  .tool {
    color: var(--text-disabled-color);
    cursor: pointer;

    &:hover {
      color: var(--text-color);
    }

    &.active {
      color: var(--text-color);
    }
  }
`;

function ToolPopup({
  name,
  children,
}: { name: string } & React.PropsWithChildren) {
  const [anchor, setAnchor] = React.useState<null | HTMLElement>(null);

  const open = Boolean(anchor);
  const id = open ? `${name}-tool-popper` : undefined;

  return (
    <div>
      <div
        onMouseOver={(e) => setAnchor(e.currentTarget)}
        onMouseOut={() => setAnchor(null)}
      >
        {children}
      </div>
      <Popup
        id={id}
        open={open}
        anchor={anchor}
        placement={'right'}
        disablePortal
        strategy="fixed"
        slotProps={{ root: { style: { zIndex: 51 } } }}
      >
        <PopupBody>{name}</PopupBody>
      </Popup>
    </div>
  );
}

export const SideToolBar: FC = () => {
  return (
    <SideToolBarContainer>
      <ToolPopup name="Explorer">
        <Icon
          icon={InsertDriveFileOutlinedIcon}
          height="24px"
          width="24px"
          fontSize="24px"
          className={clsx('tool')}
        />
      </ToolPopup>
      <ToolPopup name="Workflow Editor">
        <Icon
          icon={AccountTreeTwoToneIcon}
          height="24px"
          width="24px"
          fontSize="24px"
          className={clsx('tool', 'active')}
        />
      </ToolPopup>
      <ToolPopup name="Search">
        <Icon
          icon={SearchRoundedIcon}
          height="24px"
          width="24px"
          fontSize="28px"
          className={clsx('tool')}
        />
      </ToolPopup>
      <ToolPopup name="Plugins">
        <Icon
          icon={WidgetsRoundedIcon}
          height="24px"
          width="24px"
          fontSize="24px"
          className={clsx('tool')}
        />
      </ToolPopup>
    </SideToolBarContainer>
  );
};
