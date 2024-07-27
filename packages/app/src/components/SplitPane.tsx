import React, { FC, useEffect, useMemo, useRef, useState } from 'react';

import styled from '@emotion/styled';
import clsx from 'clsx';

import {
  ensureSize,
  useDraggingSplitPane,
} from '../hooks/useDraggingSplitPane';
import {
  PaneConfigs,
  PaneProps,
  SplitPaneProps,
} from '../types/splitpane.type';

import { Pane } from './Pane';
import { Sash } from './Sash';
import { SashContent } from './SashContent';

const SplitPaneContainer = styled.div`
  flex: 1;
  height: 100%;
  position: relative;
  width: 100%;

  & .pane {
    height: 100%;
    position: absolute;
    white-space: normal;
    width: 100%;
    overflow: hidden;
  }

  & .sash {
    height: 100%;
    position: absolute;
    top: 0;
    transition: background-color 0.1s;
    width: 100%;
    z-index: 9999;

    &.disabled {
      pointer-events: none;
    }

    &.vertical {
      cursor: col-resize;
    }

    &.horizontal {
      cursor: row-resize;
    }
  }

  &.dragging {
    &.vertical {
      cursor: col-resize;
    }

    &.horizontal {
      cursor: row-resize;
    }
  }

  &.disabled {
    user-select: none;
  }
`;

export const SplitPane: FC<SplitPaneProps> = ({
  children,
  sizes: propSizes,
  className: wrapClassName,
  sashClassName,
  resizerSize = 4,
  allowResize = true,
  performanceMode = false,
  split = 'vertical',
  sashRender = (_, active) => <SashContent active={active} type="vscode" />,
  onSizesChange,
  onStartDrag,
  onEndDrag,
  ...otherProps
}) => {
  const wrapper = useRef<HTMLDivElement>(null);
  const [wrapperRect, setWrapperRect] = useState<{
    height?: number;
    width?: number;
    x?: number;
    y?: number;
  }>({});

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      setWrapperRect(wrapper.current?.getBoundingClientRect() ?? {});
    });

    if (wrapper.current) {
      resizeObserver.observe(wrapper.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [wrapper]);

  const { sizeName, splitPos, splitAxis } = useMemo(
    () => ({
      sizeName:
        ((split === 'vertical' ? 'width' : 'height') as 'width') || 'height',
      splitPos: ((split === 'vertical' ? 'left' : 'top') as 'left') || 'top',
      splitAxis: ((split === 'vertical' ? 'x' : 'y') as 'x') || 'y',
    }),
    [split],
  );

  const childrenToSplit: JSX.Element[] = children as JSX.Element[];
  const wrapSize: number = wrapperRect[sizeName] ?? 0;

  const paneLimitSizes: number[][] = useMemo(
    () =>
      childrenToSplit.map((childNode) => {
        const limits = [0, Infinity];
        if (childNode.type === Pane) {
          const { minSize, maxSize } = childNode.props as PaneConfigs;
          limits[0] = ensureSize(minSize, wrapSize, 0);
          limits[1] = ensureSize(maxSize, wrapSize);
        }
        return limits;
      }),
    [childrenToSplit, wrapSize],
  );

  const sizes: number[] = useMemo(() => {
    let count = 0;
    let currSum = 0;
    const res: number[] = childrenToSplit.map((_, index) => {
      const size: number = ensureSize(propSizes[index], wrapSize);
      if (size === Infinity) {
        count++;
      } else {
        currSum += size;
      }
      return size;
    });

    if (currSum > wrapSize || (!count && currSum < wrapSize)) {
      const cacheNum: number = (currSum - wrapSize) / currSum;
      return res.map((size) =>
        size === Infinity ? 0 : size - size * cacheNum,
      );
    }

    if (count > 0) {
      const average: number = (wrapSize - currSum) / count;
      return res.map((size) => (size === Infinity ? average : size));
    }

    return res;
  }, [...propSizes, childrenToSplit.length, wrapSize]);

  const {
    isDragging,
    sashPosSizes,
    paneSizes,
    panePoses,
    onDraggingStart,
    onDraggingEnd,
    onDraggingMove,
  } = useDraggingSplitPane({
    sizes,
    paneLimitSizes,
    splitAxis,
    performanceMode,
    onStartDrag,
    onEndDrag,
    onSizesChange,
  });

  return (
    <SplitPaneContainer
      className={clsx(
        'split-pane',
        split,
        { dragging: isDragging },
        wrapClassName,
      )}
      ref={wrapper}
      {...otherProps}
    >
      {childrenToSplit.map((childNode, childIndex) => {
        const isPane: boolean = childNode.type === Pane;
        const paneProps = (isPane ? childNode.props : {}) as PaneProps;

        return (
          <Pane
            key={childIndex}
            className={clsx('pane', paneProps.className)}
            style={{
              ...paneProps.style,
              [sizeName]: paneSizes[childIndex],
              [splitPos]: panePoses[childIndex],
            }}
          >
            {isPane ? paneProps.children : childNode}
          </Pane>
        );
      })}
      {sashPosSizes.slice(1, -1).map((posSize, index) => (
        <Sash
          key={index}
          className={clsx({ disabled: !allowResize }, split)}
          style={{
            [sizeName]: resizerSize,
            [splitPos]: posSize - resizerSize / 2,
          }}
          render={sashRender.bind(null, index)}
          onStartDrag={onDraggingStart}
          onDragging={(e) => onDraggingMove(e, index)}
          onEndDrag={onDraggingEnd}
        />
      ))}
    </SplitPaneContainer>
  );
};
