/** @jsxImportSource @emotion/react */
import React, { FC } from 'react';

import { DN100 } from '@atlaskit/theme/colors';
import { DndContext } from '@dnd-kit/core';
import { css } from '@emotion/react';
import { useRecoilState } from 'recoil';

import { canvasPositionState } from '../state/roadmapBuilder';
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
`;

export const RoadmapCanvas: FC = () => {
  const [canvasPosition, setCanvasPosition] =
    useRecoilState(canvasPositionState);

  return (
    <DndContext>
      <div
        css={styles}
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
      ></div>
    </DndContext>
  );
};
