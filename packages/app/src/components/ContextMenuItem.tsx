/** @jsxImportSource @emotion/react */
import React, { FC, useState } from 'react';
import { CSSTransition } from 'react-transition-group';

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

import { useStableCallback } from '../hooks/useStableCallback';
import {
  ContextMenuConfigContext,
  ContextMenuConfigContextItem,
  ContextMenuItemProps,
} from '../types/contextmenu.type';
import { hexToRgba } from '../utils/colorConverter';

import { Icon } from './Icon';

const subMenuStyles = css`
  postion: absolute;
  top: 0;
  left: 95%;
  min-width: 150px;
  max-width: 250px;
  border: 1px solid var(--primary-color);
  padding: 5px 0;
  color: var(--text-color);
  background-color: var(--canvas-background-color);
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

  .context-submenu-item-list hr {
    border: none;
    border-bottom: 1px solid var(--text-color);
  }

  .context-submenu-item-list .context-submenu-item-label {
    display: flex;
    font-size: 12px;
    font-weight: bold;
    padding-left: 5px;
    padding-bottom: 5px;
    color: var(--text-color);
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
    border-color: transparent transparent transparent var(--text-color);
    transform: translateY(-50%));
  }
  &:hover::after {
    border-color: transparent transparent transparent
    var(--primary-color);
  }
`;

const MyContextMenuItem = styled.div<{ hasSubMenu?: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: start;
  padding: 3px 8px;
  white-space: nowrap;
  cursor: pointer;
  transition:
    background-color 0.1s ease-out,
    color 0.1s ease-out;
  gap: 8px;

  &:hover,
  &.active {
    background-color: var(--primary-color);
    color: var(--text-color);
  }

  .label-container {
    display: flex;
    flex: 1;
    flex-direction: row;
    justify-content: start;
    align-items: center;
    gap: 8px;
  }

  .label {
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    justify-content: center;
    align-items: start;
    user-select: none;
  }

  .label-icon,
  .label-tip {
    flex-shrink: 1;
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
    max-width: 150px;
  }

  .sublabel-text {
    font-size: 10px;
    margin: 0;
    padding: 0;
    max-width: 150px;
  }

  ${(props) => props.hasSubMenu && hasSubMenuStyles}
`;

export const ContextMenuItem: FC<ContextMenuItemProps> = (
  props: ContextMenuItemProps,
) => {
  const { config, context, active, onSelect, onHover } = props;

  const hasSubMenu = (config.contexts?.length ?? 0) > 0;

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

    onSelect?.(config.id, config.data);
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
        {config.icon && (
          <div className="label-icon">
            <Icon {...config.icon} />
          </div>
        )}
        <div className="label">
          <span className="label-text">{config.name}</span>
          {config.description && (
            <span className="sublabel-text">{config.description}</span>
          )}
        </div>
        {config.tip && (
          <div className="label-tip">
            <span className="label-text">{config.tip}</span>
          </div>
        )}
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
            config.contexts?.map(
              (subItemList: ContextMenuConfigContext, index: number) => (
                <div
                  className="context-submenu-item-list"
                  key={`submenu-${subItemList.metadata.label}-${index}`}
                >
                  {index > 0 && <hr />}
                  {subItemList.metadata.showLabel && (
                    <span className="context-submenu-item-label">
                      {subItemList.metadata.label}
                    </span>
                  )}
                  {subItemList.items.map(
                    (subItem: ContextMenuConfigContextItem) => (
                      <ContextMenuItem
                        key={`submenu-${subItemList.metadata.label}-${subItem.id}`}
                        config={subItem}
                        onSelect={onSelect}
                        context={context}
                      />
                    ),
                  )}
                </div>
              ),
            )}
        </div>
      </CSSTransition>
    </MyContextMenuItem>
  );
};
