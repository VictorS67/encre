/** @jsxImportSource @emotion/react */
import React, { FC, useState } from 'react';

import { P300, DN100, DN0, N0, N30A } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import {
  autoUpdate,
  flip,
  useFloating,
  useMergeRefs,
} from '@floating-ui/react';
import clsx from 'clsx';
import { CSSTransition } from 'react-transition-group';

import { Icon } from './Icon';
import { useStableCallback } from '../hooks/useStableCallback';
import {
  ContextMenuConfigContextItem,
  ContextMenuItemProps,
} from '../state/contextMenu';
import { hexToRgba } from '../utils/colorConverter';

const subMenuStyles = css`
  postion: absolute;
  top: 0;
  left: 95%;
  min-width: 150px;
  max-width: 250px;
  border: 1px solid ${token('color.text')};
  border-radius: 5px;
  padding: 8px 0;
  color: ${token('color.text')};
  background-color: ${token('elevation.surface.overlay')};
  box-shadow: 0 8px 16px ${hexToRgba(DN0, 0.25)};
  z-index: 1000;

  &.submenu-box-enter {
    opacity: 0;
  }

  &.submenu-box-enter-active {
    opacity: 1;
    transition: opacity 100ms ease-out;
  }

  &.submenu-box-exit {
    opacity: 1;
  }

  &.submenu-box-exit-active {
    opacity: 0;
    transition: opacity 100ms ease-out;
  }
`;

const hasSubMenuStyles = css`
  &::after {
    content: '';
    margin-left: auto;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 5px 0 5px 8px;
    border-color: transparent transparent transparent ${token('color.text')};
    transform: translateY(-50%));
  }
  &:hover::after {
    border-color: transparent transparent transparent
      ${token('color.text.subtle')};
  }
`;

const MyContextMenuItem = styled.div<{ hasSubMenu?: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: start;
  border-radius: 3px;
  padding: 6px 10px;
  white-space: nowrap;
  cursor: pointer;
  transition:
    background-color 0.1s ease-out,
    color 0.1s ease-out;
  gap: 8px;

  &:hover,
  &.active {
    background-color: ${token('color.skeleton')};
    color: ${token('color.text.subtle')};
  }

  .label-container {
    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: center;
    gap: 8px;
  }

  .label {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: start;
    user-select: none;
  }

  .label-text,
  .sublabel-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .label-text {
    font-size: 12px;
    font-weight: bold;
    margin: 0;
    padding: 0;
    max-width: 130px;
  }

  .sublabel-text {
    font-size: 10px;
    margin: 0;
    padding: 0;
    max-width: 130px;
  }

  ${(props) => props.hasSubMenu && hasSubMenuStyles}
`;

export const ContextMenuItem: FC<ContextMenuItemProps> = (
  props: ContextMenuItemProps,
) => {
  const { config, context, active, onSelect, onHover } = props;

  const hasSubMenu = (config.items?.length ?? 0) > 0;

  const [isSubMenuVisible, setIsSubMenuVisiable] = useState(false);
  const subMenuFloating = useFloating({
    placement: 'right-start',
    whileElementsMounted: autoUpdate,
    middleware: [flip()],
  });

  const handleMouseEnter = useStableCallback(() => {
    if (hasSubMenu) {
      setIsSubMenuVisiable(true);
    }

    onHover?.();
  });

  const handleMouseLeave = useStableCallback(() => {
    if (hasSubMenu) {
      setIsSubMenuVisiable(false);
    }
  });

  const handleClick = () => {
    if (hasSubMenu) {
      return;
    }

    onSelect?.();
  };

  const mergedRef = useMergeRefs([subMenuFloating.refs.setReference]);

  return (
    <MyContextMenuItem
      ref={mergedRef}
      className={clsx({ active })}
      hasSubMenu={hasSubMenu}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="label-container">
        {config.icon && <Icon {...config.icon} />}
        <div className="label">
          <span className="label-text">{config.name}</span>
          {config.description && (
            <span className="sublabel-text">{config.description}</span>
          )}
        </div>
      </div>
      <CSSTransition
        classNames="submenu-box"
        nodeRef={subMenuFloating.refs.floating}
        in={isSubMenuVisible}
        timeout={100}
        unmountOnExit
      >
        <div
          ref={subMenuFloating.refs.setFloating}
          css={subMenuStyles}
          style={subMenuFloating.floatingStyles}
        >
          {hasSubMenu &&
            config.items?.map((subItem: ContextMenuConfigContextItem) => (
              <ContextMenuItem
                key={subItem.id}
                config={subItem}
                onSelect={onSelect}
                context={context}
              />
            ))}
        </div>
      </CSSTransition>
    </MyContextMenuItem>
  );
};
