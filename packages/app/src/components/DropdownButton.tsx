import React, { useState, useRef, FC } from 'react';

import { DN100, DN0, N0 } from '@atlaskit/theme/colors';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import {
  useMergeRefs,
  autoUpdate,
  useFloating,
  offset,
  flip,
  shift,
  Middleware,
} from '@floating-ui/react';
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';
import ArrowDropUpRoundedIcon from '@mui/icons-material/ArrowDropUpRounded';
import clsx from 'clsx';

import { Icon } from './Icon';
import { useStableCallback } from '../hooks/useStableCallback';
import {
  DropdownButtonProps,
  DropdownItem,
  DropdownMenuItemProps,
} from '../types/dropdown.type';
import { hexToRgba } from '../utils/colorConverter';

const DropdownButtonContainer = styled.div<{
  width: number;
  borderRadius: number;
  fontSize: number;
  fontWeight: number | string;
  fontFamily: string;
  color: string;
  borderColor: string;
  backgroundColor: string;
  activeColor: string;
  activeBorderColor: string;
  activeBackgroundColor: string;
}>`
  display: flex;
  padding: 0px 4px;
  align-items: center;

  border-radius: ${(props) => props.borderRadius}px;
  background: ${(props) => props.backgroundColor};
  border: 1px solid ${(props) => props.borderColor};

  color: ${(props) => props.color};
  word-wrap: break-word;

  &:hover {
    background-color: ${(props) => props.backgroundColor};
    color: ${(props) => props.activeColor};
    border: 1px solid ${(props) => props.activeBorderColor};
  }

  &:hover > .dropdown-menu {
    border-left: 1px solid ${(props) => props.activeBorderColor};
    border-right: 1px solid ${(props) => props.activeBorderColor};
    border-bottom: 1px solid ${(props) => props.activeBorderColor};
  }

  .dropdown-text {
    font-size: ${(props) => props.fontSize}px;
    font-weight: ${(props) => props.fontWeight};
    font-family: ${(props) => props.fontFamily};
    margin: 0;
    padding: 0;
    max-width: 150px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    flex-grow: 1;
  }

  .dropdown-button {
    min-width: ${(props) => props.width}px;
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    gap: 5px;
  }
`;

const DropdownContainer = styled.div<{
  width: number;
  borderRadius: number;
  fontSize: number;
  fontWeight: number | string;
  fontFamily: string;
  color: string;
  borderColor: string;
  backgroundColor: string;
  activeBorderColor: string;
}>`
  min-width: ${(props) => props.width + 8}px;
  max-width: 250px;
  font-size: ${(props) => props.fontSize}px;
  font-weight: ${(props) => props.fontWeight};
  font-family: ${(props) => props.fontFamily};
  border-left: 1px solid ${(props) => props.borderColor};
  border-right: 1px solid ${(props) => props.borderColor};
  border-bottom: 1px solid ${(props) => props.borderColor};
  border-bottom-right-radius: ${(props) => props.borderRadius}px;
  border-bottom-left-radius: ${(props) => props.borderRadius}px;
  padding: 0;
  color: ${(props) => props.color};
  background-color: ${(props) => props.backgroundColor};
  box-shadow: 0 8px 16px ${hexToRgba(DN0, 0.25)};
  z-index: 1000;
  user-select: none;

  &:hover,
  &.active {
    border-left: 1px solid ${(props) => props.activeBorderColor};
    border-right: 1px solid ${(props) => props.activeBorderColor};
    border-bottom: 1px solid ${(props) => props.activeBorderColor};
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .dropdown-menu-item-list hr {
    border: none;
    border-bottom: 1px solid var(--text-color);
    margin: 6px 5px;
  }

  .dropdown-menu-item-list .dropdown-menu-item-label {
    display: flex;
    font-size: ${(props) => props.fontSize}px;
    font-weight: ${(props) => props.fontWeight};
    font-family: ${(props) => props.fontFamily};
    padding-left: 5px;
    padding-bottom: 5px;
    color: ${(props) => props.color};
  }
`;

const MyDropdownItem = styled.div<{
  fontSize: number;
  fontWeight: number | string;
  fontFamily: string;
  color: string;
  activeColor: string;
  activeBackgroundColor: string;
}>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: start;
  padding: 1px 4px;
  white-space: nowrap;
  cursor: pointer;
  transition:
    background-color 0.1s ease-out,
    color 0.1s ease-out;
  gap: 8px;
  color: ${(props) => props.color};

  &:hover,
  &.active {
    background-color: ${(props) => props.activeBackgroundColor};
    color: ${(props) => props.activeColor};
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

  .label-icon {
    flex-shrink: 1;
  }

  .label-text,
  .sublabel-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .label-text {
    font-size: ${(props) => props.fontSize}px;
    font-weight: ${(props) => props.fontWeight};
    font-family: ${(props) => props.fontFamily};
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
`;

export const DropdownButton: FC<DropdownButtonProps> = ({
  name,
  items,
  showIcon,
  styling,
  onDropDownMenuClick,
  additionalKwargs,
}: DropdownButtonProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [selectedItemIndex, setSelectedItemIndex] = useState(-1);

  const nudge: Middleware = {
    name: 'nudge',
    fn(middlewareArguments) {
      const { x, y } = middlewareArguments;
      return {
        data: {},
        x: x - 5,
        y: y - 2.5,
      };
    },
  };
  const { refs, floatingStyles } = useFloating({
    placement: 'bottom-start',
    whileElementsMounted: autoUpdate,
    middleware: [flip(), shift({ crossAxis: true }), nudge],
  });

  const mergedRef = useMergeRefs([dropdownRef, refs.setReference]);

  const defaultStyling = {
    width: 30,
    borderRadius: 4,
    fontSize: 14,
    fontWeight: 700,
    fontFamily: 'Arial, Helvetica, sans-serif',
    color: 'var(--text-color)',
    borderColor: 'transparent',
    backgroundColor: 'var(--canvas-background-color)',
    activeColor: 'var(--text-color)',
    activeBorderColor: 'var(--text-color-accent-3)',
    activeBackgroundColor: 'var(--node-foreground-color-1)',
  };

  styling = {
    ...defaultStyling,
    ...styling,
  };

  const onMenuItemClick = useStableCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setOpen(false);
    onDropDownMenuClick?.(e as React.MouseEvent<HTMLElement>, additionalKwargs);
  });

  return (
    <DropdownButtonContainer
      width={styling.width!}
      borderRadius={styling.borderRadius!}
      fontSize={styling.fontSize!}
      fontWeight={styling.fontWeight!}
      fontFamily={styling.fontFamily!}
      color={styling.color!}
      borderColor={styling.borderColor!}
      backgroundColor={styling.backgroundColor!}
      activeColor={styling.activeColor!}
      activeBackgroundColor={styling.activeBackgroundColor!}
      activeBorderColor={styling.activeBorderColor!}
    >
      <div
        className="dropdown-button"
        ref={mergedRef}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="dropdown-text">{name}</span>
        {!open && (
          <Icon
            icon={ArrowDropDownRoundedIcon}
            height={'20px'}
            width={'10px'}
            fontSize={'20px'}
            additionalStyles={css`
              color: var(--text-color);
            `}
          />
        )}
        {open && (
          <Icon
            icon={ArrowDropUpRoundedIcon}
            height={'20px'}
            width={'10px'}
            fontSize={'20px'}
            additionalStyles={css`
              color: var(--text-color);
            `}
          />
        )}
      </div>
      {open && (
        <DropdownContainer
          ref={refs.setFloating}
          className={clsx('dropdown-menu')}
          style={floatingStyles}
          width={styling.width!}
          borderRadius={styling.borderRadius!}
          fontSize={styling.fontSize!}
          fontWeight={styling.fontWeight!}
          fontFamily={styling.fontFamily!}
          color={styling.color!}
          borderColor={styling.borderColor!}
          backgroundColor={styling.backgroundColor!}
          activeBorderColor={styling.activeBorderColor!}
        >
          <div className="dropdown-menu-item-list">
            {items.map((item: DropdownItem, index: number) => (
              <DropdownMenuItem
                key={`${item.name}-${index}`}
                index={index}
                showIcon={showIcon}
                {...item}
                active={index === selectedItemIndex}
                styling={{
                  fontSize: styling?.fontSize,
                  fontWeight: styling?.fontWeight,
                  fontFamily: styling?.fontFamily,
                  color: styling?.color,
                  activeColor: styling?.activeColor,
                  activeBackgroundColor: styling?.activeBackgroundColor,
                }}
                onClick={onMenuItemClick}
              />
            ))}
          </div>
        </DropdownContainer>
      )}
    </DropdownButtonContainer>
  );
};

export const DropdownMenuItem: FC<DropdownMenuItemProps> = ({
  name,
  index,
  description,
  icon,
  showIcon,
  active,
  styling,
  onClick,
}: DropdownMenuItemProps) => {
  const defaultStyling = {
    fontSize: 14,
    fontWeight: 700,
    fontFamily: 'Arial, Helvetica, sans-serif',
    color: 'var(--text-color)',
    activeColor: 'var(--text-color)',
    activeBackgroundColor: 'var(--node-foreground-color-2)',
  };

  styling = {
    ...defaultStyling,
    ...styling,
  };

  return (
    <MyDropdownItem
      className={clsx({ active })}
      fontSize={styling.fontSize!}
      fontWeight={styling.fontWeight!}
      fontFamily={styling.fontFamily!}
      color={styling.color!}
      activeColor={styling.activeColor!}
      activeBackgroundColor={styling.activeBackgroundColor!}
      data-label={index}
      onClick={onClick}
    >
      <div className="label-container">
        {icon && showIcon && (
          <div className="label-icon">
            <Icon {...icon} />
          </div>
        )}
        <div className="label">
          <span className="label-text">{name}</span>
          {description && <span className="sublabel-text">{description}</span>}
        </div>
      </div>
    </MyDropdownItem>
  );
};
