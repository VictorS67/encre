/** @jsxImportSource @emotion/react */
import React, { FC, useMemo, useRef, useState } from 'react';

import { DN100 } from '@atlaskit/theme/colors';
import { DndContext } from '@dnd-kit/core';
import { css } from '@emotion/react';
import { useThrottleFn } from 'ahooks';
import { CSSTransition } from 'react-transition-group';
import { useRecoilState, useSetRecoilState } from 'recoil';

import { ContextMenu } from './ContextMenu';
import { useCanvasPosition } from '../hooks/useCanvasPosition';
import { useContextMenu } from '../hooks/useContextMenu';
import { useStableCallback } from '../hooks/useStableCallback';
import { canvasPositionState, lastMousePositionState } from '../state/canvas';
import { type CanvasPosition } from '../types/canvas.type';
import {
  type ContextMenuConfigContextData,
  type ContextMenuConfigContextItem,
  type ContextMenuConfigContexts,
  type ContextMenuData,
} from '../types/contextmenu.type';
import { hexToRgba } from '../utils/colorConverter';

const styles = css`
  position: relative;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  z-index: 0;

  background-blend-mode: difference !important;
  background-image: linear-gradient(
      ${hexToRgba(DN100, 0.5)} 1px,
      transparent 1px
    ),
    linear-gradient(90deg, ${hexToRgba(DN100, 0.5)} 1px, transparent 1px),
    linear-gradient(${hexToRgba(DN100, 0.25)} 1px, transparent 1px),
    linear-gradient(90deg, ${hexToRgba(DN100, 0.25)} 1px, transparent 1px) !important;

  .canvas-contents {
    transform-origin: top left;
  }

  .context-menu-box {
    position: absolute;
    display: none;
  }

  .context-menu-box-enter {
    position: absolute;
    display: block;
    opacity: 0;
  }

  .context-menu-box-enter-active {
    position: absolute;
    opacity: 1;
    transition: opacity 100ms ease-out;
  }

  .context-menu-box-exit {
    position: absolute;
    opacity: 1;
  }

  .context-menu-box-exit-done {
    position: absolute;
    opacity: 0;
    left: -1000px;
  }
`;

type MouseInfo = {
  x: number;
  y: number;
  target: EventTarget | undefined;
};

export const RoadmapCanvas: FC = () => {
  const { canvasPosition, canvasToClientPosition, clientToCanvasPosition } =
    useCanvasPosition();
  const setCanvasPosition = useSetRecoilState(canvasPositionState);
  const [lastMousePosition, setLastMousePosition] = useRecoilState(
    lastMousePositionState,
  );

  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
  const [dragStart, setDragStart] = useState({
    x: 0,
    y: 0,
    canvasStartX: 0,
    canvasStartY: 0,
  });
  const [isContextMenuDisabled, setIsContextMenuDisabled] = useState(true);

  const lastMouseInfoRef = useRef<MouseInfo>({
    x: -1000,
    y: 0,
    target: undefined,
  });

  const {
    contextMenuRef,
    showContextMenu,
    contextMenu,
    setShowContextMenu,
    setContextMenu,
    handleContextMenu,
  } = useContextMenu();

  const defaultCanvasContextMenu: ContextMenuConfigContextData | null =
    useMemo(() => {
      return {
        type: 'blankSpace',
        data: [],
      };
    }, [contextMenu]);

  const canvasContextMenu = useStableCallback((event: React.MouseEvent) => {
    event.preventDefault();
    console.log(`x: ${event.clientX}, y: ${event.clientY}`);
    handleContextMenu(event);
  });

  const canvasMouseDown = useStableCallback((event: React.MouseEvent) => {
    // Check if main button (ususally the left button) is pressed
    if (event.button !== 0) return;

    // Check if canvas is mouse-down
    if (
      (event.target as HTMLElement).classList.contains('my-canvas') === false
    ) {
      return;
    }

    event.preventDefault();

    // Cancel Context Menu
    setIsContextMenuDisabled(true);

    // Start dragging
    setIsDraggingCanvas(true);

    // Record start position
    setDragStart({
      x: event.clientX,
      y: event.clientY,
      canvasStartX: canvasPosition.x,
      canvasStartY: canvasPosition.y,
    });
  });

  const canvasMouseMove = useThrottleFn(
    (event: React.MouseEvent) => {
      // Record last mouse position
      setLastMousePosition({ x: event.clientX, y: event.clientY });
      lastMouseInfoRef.current = {
        x: event.clientX,
        y: event.clientY,
        target: event.target,
      };

      if (isDraggingCanvas) {
        // Compute dragging distance
        const dx: number = (event.clientX - dragStart.x) / canvasPosition.zoom;
        const dy: number = (event.clientY - dragStart.y) / canvasPosition.zoom;

        // Update new canvas position
        const position: CanvasPosition = {
          x: dragStart.canvasStartX + dx,
          y: dragStart.canvasStartY + dy,
          zoom: canvasPosition.zoom,
        };
        setCanvasPosition(position);
      }
    },
    { wait: 10 },
  );

  const canvasMouseUp = (event: React.MouseEvent) => {
    // End dragging
    setIsDraggingCanvas(false);
  };

  const isScrollable = (element: HTMLElement): boolean => {
    const style: CSSStyleDeclaration = window.getComputedStyle(element);
    const isVerticalScrollable: boolean =
      style.overflowY === 'auto' && element.scrollHeight > element.clientHeight;
    const isHorizontalScrollable: boolean =
      style.overflowX === 'auto' && element.scrollWidth > element.clientWidth;

    return isVerticalScrollable || isHorizontalScrollable;
  };

  const isAnyParentScrollable = (element: HTMLElement): boolean => {
    let currentNode: HTMLElement | null = element.parentElement;

    while (currentNode) {
      if (isScrollable(currentNode)) return true;

      currentNode = currentNode.parentElement;
    }

    return false;
  };

  const zoomDebounced = useThrottleFn(
    (
      target: HTMLElement,
      wheelDelta: number,
      clientX: number,
      clientY: number,
    ) => {
      // Check if mouse is placed on the background
      if (isAnyParentScrollable(target)) return;

      // compute new zoom
      const zoomSpeed: number = 0.025;
      const zoomFactor: number = wheelDelta < 0 ? 1 + zoomSpeed : 1 - zoomSpeed;
      const newZoom: number = canvasPosition.zoom * zoomFactor;

      // compute current mouse position in canvas space
      const currentMouseCanvasPosition = clientToCanvasPosition(
        clientX,
        clientY,
      );

      // compute distance between mouse and canvas position
      const dx: number = clientX / newZoom - canvasPosition.x;
      const dy: number = clientY / newZoom - canvasPosition.y;

      // cancel offset from current mouse position
      const posDiff = {
        x: dx - currentMouseCanvasPosition.x,
        y: dy - currentMouseCanvasPosition.y,
      };

      // compute the new canvas position
      const position: CanvasPosition = {
        x: canvasPosition.x + posDiff.x,
        y: canvasPosition.y + posDiff.y,
        zoom: newZoom,
      };

      setCanvasPosition(position);
    },
    { wait: 25 },
  );

  const handleZoom = useStableCallback((event: React.WheelEvent) => {
    // do not zoom if context menu is enabled
    if (isContextMenuDisabled) {
      zoomDebounced.run(
        event.target as HTMLElement,
        event.deltaY,
        event.clientX,
        event.clientY,
      );
    }
  });

  return (
    <DndContext>
      <div
        css={styles}
        className="my-canvas"
        onContextMenu={canvasContextMenu}
        onMouseDown={canvasMouseDown}
        onMouseMove={canvasMouseMove.run}
        onMouseUp={canvasMouseUp}
        onMouseLeave={canvasMouseUp}
        onWheel={handleZoom}
        style={{
          backgroundPosition: `
          ${canvasPosition.x - 1}px ${canvasPosition.y - 1}px
          `,
          backgroundSize: `
          ${100 * canvasPosition.zoom}px ${100 * canvasPosition.zoom}px,
          ${100 * canvasPosition.zoom}px ${100 * canvasPosition.zoom}px,
          ${20 * canvasPosition.zoom}px ${20 * canvasPosition.zoom}px,
          ${20 * canvasPosition.zoom}px ${20 * canvasPosition.zoom}px
          `,
        }}
      >
        <div
          className="canvas-contents"
          style={{
            transform: `scale(${canvasPosition.zoom}, ${canvasPosition.zoom}) translate(${canvasPosition.x}px, ${canvasPosition.y}px) translateZ(-1px)`,
          }}
        ></div>
        <CSSTransition
          classNames="context-menu-box"
          nodeRef={contextMenuRef}
          in={showContextMenu && !!defaultCanvasContextMenu}
          timeout={200}
          onEnter={() => {
            setIsContextMenuDisabled(false);
          }}
          onExit={() => {
            setContextMenu({ x: 0, y: 0, data: null });
            setIsContextMenuDisabled(true);
          }}
        >
          <ContextMenu
            ref={contextMenuRef}
            x={contextMenu.x}
            y={contextMenu.y}
            disabled={isContextMenuDisabled}
            context={defaultCanvasContextMenu!}
          ></ContextMenu>
        </CSSTransition>
      </div>
    </DndContext>
  );
};
