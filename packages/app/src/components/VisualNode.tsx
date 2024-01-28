/** @jsxImportSource @emotion/react */
import React, {
  CSSProperties,
  FC,
  ForwardedRef,
  forwardRef,
  memo,
  useMemo,
} from 'react';

import { css } from '@emotion/react';
import { useRecoilValue } from 'recoil';

import { useStableCallback } from '../hooks/useStableCallback';
import { themeState } from '../state/settings';
import {
  MinimizedVisualNodeContentProps,
  VisualNodeContentProps,
  VisualNodeProps,
} from '../types/node.type';

const visualNodeStyles = css`
  color: var(--text-color);
  background: var(--node-background-color);
  border-radius: 7px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const nodeContentStyles = css`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  .node-minimize-content,
  .node-content {
    background: var(--node-forground-color);
    flex-grow: 1;
    overflow-y: scroll;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-self: stretch;
    gap: 2px;
    padding: 8px 4px 8px 7px;
  }

  .node-minimize-content > * {
    visibility: hidden;
    align-self: stretch;
  }

  .node-minimize-card,
  .node-card {
    background: var(--node-background-color);
    display: flex;
    flex-direction: column;
    gap: 5px;
    align-items: flex-start;
    align-self: stretch;
    padding: 8px 10px;
  }

  .node-minimize-card > .node-header {
    visibility: collapse;
  }

  .node-header {
    display: flex;
    align-self: stretch;
    flex: 1 0 0;
    align-items: center;
    gap: 3.5px;
    height: 20px;
  }

  .node-tooling {
    flex-grow: 0;
  }

  .node-tag-grp {
    display: flex;
    align-items: flex-start;
    gap: 3.5px;
    flex-grow: 1;
  }

  .node-tag {
    display: flex;
    padding: 3px 8px;
    align-items: center;
    border-radius: 12px;
    text-align: center;
    display: grid;
    place-items: center;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 100%;
    text-transform: lowercase;
    background: var(--node-forground-color);
    color: var(--text-color);
  }

  .node-title {
    align-self: strech;
    color: var(--text-color);
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    display: grid;
    place-items: center;
    height: 30px;
  }

  .node-minimize-card > .node-title {
    width: 100%;
    text-align: center;
  }
`;

/* eslint-disable react/prop-types */
export const VisualNode = memo(
  forwardRef<HTMLDivElement, VisualNodeProps>(function MyVisualNode(
    {
      node,
      connections = [],
      xDelta = 0,
      yDelta = 0,
      attributes,
      attributeListeners,
      isDragging,
      isMinimized,
      scale,
      canvasZoom,
      onNodeSizeChange,
      onNodeSelect,
      onNodeMouseOver,
      onNodeMouseOut,
    }: VisualNodeProps,
    ref: ForwardedRef<HTMLDivElement>,
  ) {
    const style = useMemo(() => {
      const styling: CSSProperties = {
        opacity: isDragging ? '0' : '',
        transform: `translate(${node.visualInfo.position.x + xDelta}px, ${
          node.visualInfo.position.y + yDelta
        }px) scale(${scale ?? 1})`,
        zIndex: node.visualInfo.position.zIndex,
        width: node.visualInfo.size.width,
        height: node.visualInfo.size.height,
        border: '3px solid var(--primary-color)',
      };

      return styling;
    }, [
      node.visualInfo.position.x,
      node.visualInfo.position.y,
      xDelta,
      yDelta,
      node.visualInfo.size.width,
      node.visualInfo.size.height,
      node.visualInfo.position.zIndex,
      node.state,
      isDragging,
      scale,
    ]);

    // abstract away the difference between function and object refs.
    const nodeRef = (instance: HTMLDivElement | null) => {
      if (typeof ref === 'function') {
        // refs are created by a callback function.
        ref(instance);
      } else if (ref) {
        // refs are created by `React.createRef()`.
        ref.current = instance;
      }
    };

    const onNodeGrabClick = useStableCallback((event: React.MouseEvent) => {
      event.stopPropagation();
      onNodeSelect?.();

      console.log('onNodeGrabClick');
    });

    return (
      <div
        ref={nodeRef}
        css={visualNodeStyles}
        style={style}
        {...attributes}
        onMouseOver={(event) => onNodeMouseOver?.(event, node.id)}
        onMouseOut={(event) => onNodeMouseOut?.(event, node.id)}
      >
        {/* {isMinimized ? (
          <MinimizedVisualNodeContent
            node={node}
            connections={connections}
            attributeListeners={attributeListeners}
            canvasZoom={canvasZoom}
            onNodeGrabClick={onNodeGrabClick}
          />
        ) : (
          <VisualNodeContent
            node={node}
            connections={connections}
            isMinimized={isMinimized}
            attributeListeners={attributeListeners}
            onNodeGrabClick={onNodeGrabClick}
          />
        )} */}
        <VisualNodeContent
          node={node}
          connections={connections}
          isMinimized={isMinimized}
          canvasZoom={canvasZoom}
          attributeListeners={attributeListeners}
          onNodeGrabClick={onNodeGrabClick}
        />
      </div>
    );
  }),
);

/* eslint-disable react/prop-types */
// const MinimizedVisualNodeContent: FC<MinimizedVisualNodeContentProps> = memo(
//   ({
//     node,
//     connections = [],
//     attributeListeners,
//     canvasZoom,
//     onNodeGrabClick,
//   }: MinimizedVisualNodeContentProps) => {
//     const style = useMemo(() => {
//       const styling: CSSProperties = {
//         fontSize: `${24 * (canvasZoom + 0.4)}px`,
//       };

//       return styling;
//     }, [canvasZoom]);

//     const theme = useRecoilValue(themeState);

//     function getColorMode(): string | null {
//       // Select the element that contains the 'data-color-mode' attribute
//       const element = document.querySelector('[data-color-mode]');

//       // Check if the element exists and return the attribute value
//       return element ? element.getAttribute('data-color-mode') : null;
//     }

//     const contentTopBorderStyling: CSSProperties = useMemo(() => {
//       const colorMode = getColorMode();

//       const styling: CSSProperties =
//         colorMode === 'light'
//           ? {
//               borderTop: '2px solid var(--primary-color)',
//             }
//           : {};

//       return styling;
//     }, [theme]);

//     // TODO: Add Input and Output circles
//     return (
//       <>
//         <div
//           {...attributeListeners}
//           onClick={onNodeGrabClick}
//           css={nodeContentStyles}
//         >
//           {/* <div className="node-abbreviation" style={style}>
//             {node.metadata.abbreviation}
//           </div> */}
//           <div className="node-card">
//             <div className="node-header"></div>
//             <div className="node-minimize-title" style={style}>
//               {node.metadata.name}
//             </div>
//           </div>
//           <div className="node-minimize-content">
//             <div>CONTENT</div>
//             <div style={{ height: '500px' }}></div>
//           </div>
//         </div>
//       </>
//     );
//   },
// );

// MinimizedVisualNodeContent.displayName = 'MinimizedVisualNodeContent';

/* eslint-disable react/prop-types */
const VisualNodeContent: FC<VisualNodeContentProps> = memo(
  ({
    node,
    connections = [],
    isMinimized,
    canvasZoom,
    attributeListeners,
    onNodeGrabClick,
  }: VisualNodeContentProps) => {
    const theme = useRecoilValue(themeState);

    function getColorMode(): string | null {
      // Select the element that contains the 'data-color-mode' attribute
      const element = document.querySelector('[data-color-mode]');

      // Check if the element exists and return the attribute value
      return element ? element.getAttribute('data-color-mode') : null;
    }

    const tagBorderStyling: CSSProperties = useMemo(() => {
      const colorMode = getColorMode();

      const styling: CSSProperties =
        colorMode === 'light'
          ? {
              border: '2px solid var(--primary-color)',
            }
          : {};

      return styling;
    }, [theme]);

    const [cardHeightStyling, minTitleStyling, minVisibilityStyling] =
      useMemo(() => {
        const cardStyling: CSSProperties = {
          height: 50,
        };

        const titleStyling: CSSProperties = isMinimized
          ? {
              fontSize: `${24 * (canvasZoom + 0.4)}px`,
              height: 50,
            }
          : {
              fontSize: '18px',
            };

        const visibilityStyling: CSSProperties = isMinimized
          ? { visibility: 'hidden' }
          : {};

        return [cardStyling, titleStyling, visibilityStyling];
      }, [
        node.metadata.inputs,
        node.metadata.outputs,
        canvasZoom,
        isMinimized,
      ]);

    const contentTopBorderStyling: CSSProperties = useMemo(() => {
      const colorMode = getColorMode();

      const styling: CSSProperties =
        colorMode === 'light'
          ? {
              borderTop: '2px solid var(--primary-color)',
            }
          : {};

      return styling;
    }, [theme]);

    // TODO: Add Input and Output circles
    return (
      <>
        <div
          {...attributeListeners}
          onClick={onNodeGrabClick}
          css={nodeContentStyles}
        >
          <div
            className={isMinimized ? 'node-minimize-card' : 'node-card'}
            style={cardHeightStyling}
          >
            <div className="node-header">
              <div className="node-tag-grp">
                {node.metadata.tags?.map((t) => (
                  <div className="node-tag" key={t} style={tagBorderStyling}>
                    {t}
                  </div>
                ))}
              </div>
              <div className="node-tooling">ICON</div>
            </div>
            <div className="node-title" style={minTitleStyling}>
              {node.metadata.name}
            </div>
          </div>
          <div
            className={isMinimized ? 'node-minimize-content' : 'node-content'}
            style={contentTopBorderStyling}
          >
            <div>CONTENT</div>
            <div style={{ height: '500px' }}></div>
          </div>
        </div>
      </>
    );
  },
);

VisualNodeContent.displayName = 'VisualNodeContent';
