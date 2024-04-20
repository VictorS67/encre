/** @jsxImportSource @emotion/react */
import React, {
  FC,
  ForwardedRef,
  forwardRef,
  useEffect,
  useState,
} from 'react';

import { DN100, DN0, N0 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import { css } from '@emotion/react';
import {
  useMergeRefs,
  autoUpdate,
  shift,
  useFloating,
} from '@floating-ui/react';
import clsx from 'clsx';

import { ContextMenuItem } from './ContextMenuItem';
import { useContextMenuConfig } from '../hooks/useContextMenuConfig';
import { useStableCallback } from '../hooks/useStableCallback';
import {
  ContextMenuConfigContext,
  ContextMenuContextProps,
  type ContextMenuConfigContextItem,
  type ContextMenuProps,
} from '../types/contextmenu.type';
import { hexToRgba } from '../utils/colorConverter';

const styles = css`
  position: absolute;
  &.disabled {
    display: none;
  }
`;

const contextMenuStyles = css`
  min-width: 150px;
  max-width: 250px;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 11px;
  border: 1px solid var(--primary-color);
  padding: 5px 0;
  color: var(--text-color);
  background-color: var(--canvas-background-color);
  box-shadow: 0 8px 16px ${hexToRgba(DN0, 0.25)};
  z-index: 1000;
  user-select: none;

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .context-menu-item-list hr {
    border: none;
    border-bottom: 1px solid var(--text-color);
    margin: 6px 5px;
  }

  .context-menu-item-list .context-menu-item-label {
    display: flex;
    font-size: 11px;
    font-weight: bold;
    padding-left: 5px;
    padding-bottom: 5px;
    color: var(--text-color);
  }
`;

export const ContextMenu = forwardRef<HTMLDivElement, ContextMenuProps>(
  function MyContextMenu(
    { x, y, context, disabled, onSelect }: ContextMenuProps,
    ref: ForwardedRef<HTMLDivElement>,
  ) {
    const { refs, floatingStyles, update } = useFloating({
      placement: 'bottom-start',
      whileElementsMounted: autoUpdate,
      middleware: [shift({ crossAxis: true })],
    });

    const mergedRef = useMergeRefs([ref, refs.setReference]);

    const { contexts, commands } = useContextMenuConfig();
    const { type, data, group } = contexts[context['type']];

    useEffect(() => {
      update();
    }, [update, x, y]);

    const showContext: readonly ContextMenuConfigContext[] = group;

    const onMenuContextSelect = useStableCallback((id: string, d: unknown) => {
      onSelect?.(id, context, { x, y }, d);
    });

    return (
      <div
        ref={mergedRef}
        css={styles}
        style={{ top: y + 4, left: x - 16 }}
        className={clsx({ disabled })}
        onClick={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
          event.stopPropagation()
        }
      >
        <div
          css={contextMenuStyles}
          style={floatingStyles}
          ref={refs.setFloating}
        >
          {showContext.map(
            (itemList: ContextMenuConfigContext, index: number) => (
              <ContextMenuContext
                key={`${type}-${itemList.metadata.label}-${index}`}
                type={type}
                index={index}
                context={itemList}
                contextGroup={context.group}
                onSelect={onMenuContextSelect}
              />
            ),
          )}
        </div>
      </div>
    );
  },
);

export const ContextMenuContext: FC<ContextMenuContextProps> = ({
  type,
  index,
  context,
  contextGroup,
  onSelect,
}: ContextMenuContextProps) => {
  const [selectedItemIndex, setSelectedItemIndex] = useState(-1);

  const onMenuItemSelect = useStableCallback((id: string, data: unknown) => {
    onSelect?.(id, data);
  });

  return (
    <div className="context-menu-item-list">
      {index > 0 && <hr />}
      {context.metadata.showLabel && (
        <span className="context-menu-item-label">
          {context.metadata.label}
        </span>
      )}
      {context.items.map(
        (item: ContextMenuConfigContextItem, listIndex: number) => (
          <ContextMenuItem
            key={`${type}-${context.metadata.label}-${item.id}`}
            config={item}
            context={contextGroup}
            active={listIndex === selectedItemIndex}
            onSelect={onMenuItemSelect}
          />
        ),
      )}
    </div>
  );
};
