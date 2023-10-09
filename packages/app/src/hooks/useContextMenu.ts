import React, { useCallback, useEffect, useRef, useState } from 'react';

import { ContextMenuData, ContextMenu } from '../types/contextmenu.type';
/**
 * `useContextMenu` hook
 *
 * The `useContextMenu` hook helps in managing the state and logic for context
 * menu in a React application. It provides functionalities like showing,
 * hiding the context menu, and handling related events like clicking outside
 * the context menu or pressing the escape key to close it.
 *
 * @returns {Object} Returns an object containing:
 *   - `contextMenuRef`: A ref object pointing to the context menu element,
 *      intended to be used on the context menu container div to enable
 *      reference-based operations on it.
 *   - `showContextMenu`: A boolean state indicating whether the context menu
 *      is shown or not.
 *   - `contextMenu`: An object state containing the coordinates (x and y) of
 *      where to show the context menu, and optionally `data` regarding the
 *      context of where the menu was invoked.
 *   - `setShowContextMenu`: A function that updates the `showContextMenu`
 *      state.
 *   - `setContextMenu`: A function that updates the `contextMenu` state.
 *   - `handleContextMenu`: A function to be invoked on the `onContextMenu`
 *     event of a target element that is intended to have context menu
 *     functionality. It determines the position of the context menu and
 *     extracts relevant data from the target element.
 *
 * @example
 * const {
 *   contextMenuRef,
 *   showContextMenu,
 *   contextMenu,
 *   setShowContextMenu,
 *   setContextMenu,
 *   handleContextMenu,
 * } = useContextMenu();
 *
 * // Usage in component
 * <div
 *    onContextMenu={handleContextMenu}
 *    ref={contextMenuRef}
 *    style={{top: contextMenu.y, left: contextMenu.x}}
 * >
 *    {showContextMenu && <YourContextMenuComponent />}
 * </div>
 */
export function useContextMenu() {
  const contextMenuRef = useRef<HTMLDivElement>(null);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenu, setContextMenu] = useState<ContextMenu>({
    x: -1000,
    y: 0,
    data: null,
  });

  useEffect(() => {
    const handleWindowClick = (event: Event) => {
      const detail = (event as CustomEvent)
        .detail as React.MouseEvent<HTMLDivElement>;

      const listener = (e: React.MouseEvent<HTMLDivElement>) => {
        // Close context menu if mouse click outside the context menu
        const el: HTMLDivElement | null = contextMenuRef?.current;
        if (!el || el.contains(e.target as Node) || null) {
          return;
        }

        setShowContextMenu(false);
      };

      listener(detail);
    };

    const handleEscapePress = (event: Event) => {
      const detail = (event as CustomEvent).detail as React.KeyboardEvent;

      const listener = (e: React.KeyboardEvent) => {
        // Close context menu if esc key is pressed
        if (e.key === 'Escape') setShowContextMenu(false);
      };

      listener(detail);
    };

    window.addEventListener('click', handleWindowClick);
    window.addEventListener('keydown', handleEscapePress);

    return () => {
      window.removeEventListener('click', handleWindowClick);
      window.removeEventListener('keydown', handleEscapePress);
    };
  }, [contextMenuRef]);

  const getContextMenuDataFromTarget = (
    target: HTMLElement | null,
  ): ContextMenuData | null => {
    while (target && !target.dataset.contextMenuType) {
      target = target.parentElement;
    }

    return target
      ? { type: target.dataset.contextMenuType!, element: target }
      : null;
  };

  const handleContextMenu = useCallback(
    (
      event: Pick<
        React.MouseEvent<HTMLDivElement>,
        'clientX' | 'clientY' | 'target'
      >,
    ) => {
      const data: ContextMenuData | null = getContextMenuDataFromTarget(
        event.target as HTMLElement,
      );

      setShowContextMenu(true);
      console.log(`hx: ${event.clientX}, hy: ${event.clientY}`);
      setContextMenu({ x: event.clientX, y: event.clientY, data });
    },
    [],
  );

  return {
    contextMenuRef,
    showContextMenu,
    contextMenu,
    setShowContextMenu,
    setContextMenu,
    handleContextMenu,
  };
}
