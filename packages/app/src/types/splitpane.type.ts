import React, { PropsWithChildren, ReactNode } from 'react';

type HTMLElementProps = {
  title?: string;
  style?: React.CSSProperties;
  className?: string;
  role?: string;
};

export type PaneConfigs = {
  maxSize?: number | string;
  minSize?: number | string;
};

export type SplitPaneConfigs = {
  sizes: number[];
  paneLimitSizes: number[][];
  splitAxis: 'x' | 'y';
  performanceMode: boolean;
  onStartDrag?: (e: React.MouseEvent) => void;
  onEndDrag?: (e: React.MouseEvent) => void;
  onSizesChange?: (sizes: number[]) => void;
};

export type PaneProps = PropsWithChildren<HTMLElementProps & PaneConfigs>;

export type SashProps = HTMLElementProps & {
  render: (active: boolean) => ReactNode;
  onStartDrag: (e: React.MouseEvent) => void;
  onDragging: (e: React.MouseEvent) => void;
  onEndDrag: (e: React.MouseEvent) => void;
};

export type SashContentProps = PropsWithChildren<{
  className?: string;
  type?: string;
  active?: boolean;
}>;

export type SplitPaneProps = PropsWithChildren<
  HTMLElementProps & {
    sizes: (string | number)[];
    allowResize?: boolean;
    split?: 'vertical' | 'horizontal';
    sashClassName?: string;
    resizerSize?: number;
    performanceMode?: boolean;
    sashRender?: (index: number, active: boolean) => React.ReactNode;
    onSizesChange?: (sizes: number[]) => void;
    onStartDrag?: (e: React.MouseEvent) => void;
    onEndDrag?: (e: React.MouseEvent) => void;
  }
>;
