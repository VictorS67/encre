import React, { FC } from 'react';

import styled from '@emotion/styled';

const IframeContainer = styled.div`
  position: relative;
  -webkit-box-flex: 1;
  -webkit-flex-grow: 1;
  -ms-flex-positive: 1;
  flex-grow: 1;
  overflow: hidden;
  color-scheme: dark light;
  background: Canvas;
  color: CanvasText;

  .result-iframe {
    border: 0;
    background: Canvas;
    color: CanvasText;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
  }

  iframe {
    overflow-clip-margin: content-box !important;
    border-width: 2px;
    border-style: inset;
    border-color: initial;
    border-image: initial;
    overflow: clip !important;
  }
`;

export const Iframe: FC = () => {
  return (
    <IframeContainer>
      <iframe
        id="result"
        className="result-iframe"
        src="http://localhost:5127/"
        sandbox="allow-scripts allow-same-origin allow-presentation allow-forms allow-popups allow-downloads allow-storage-access-by-user-activation"
        frameBorder="0"
        draggable
        referrerPolicy="no-referrer"
        allow="cross-origin-isolated"
        data-iframe-will-auto-focus="1"
        allowFullScreen
      ></iframe>
    </IframeContainer>
  );
};
