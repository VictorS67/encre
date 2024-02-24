import React, { FC, memo, useEffect, useMemo, useState } from 'react';

import { css } from '@emotion/react';
import styled from '@emotion/styled';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';

import { Node, UIContext, extMap } from '../../types/studio.type';
import { UIContextDescriptor } from '../../types/uicontext.type';
import { formatBytes } from '../../utils/format';
import { Icon } from '../Icon';

const Image = styled.div`
  align-self: stretch;
  width: 100%;
  overflow: hidden;
  display: inline-flex;
  justify-content: center;

  .image-container {
    position: relative;
    display: inline-flex;
  }

  .image-info {
    position: absolute;
    top: 0;
    right: 0;
    padding: 3px;
    border-bottom-left-radius: 5px;
    background-color: var(--node-forground-color-1);
    color: var(--text-disabled-color);
    text-decoration: none;
    opacity: 0;
    transition: opacity 0.1s ease;
    pointer-events: none;

    display: inline-flex;
    align-items: center;
    gap: 5px;
  }

  .file-info {
    align-self: flex-end;
    font-weight: 700;
    overflow: hidden;
    diaplay: inline-block;
    font-size: 12px;
    color: var(--text-disabled-color);
  }

  .image-container:hover .image-info {
    opacity: 1;
    pointer-events: auto;
  }
`;

/* eslint-disable react/prop-types */
export const ImageNodeContentBody: FC<
  { node: Node } & Extract<UIContext, { type: 'image' }>
> = memo(({ node, mimeType, data }) => {
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [svgContent, setSvgContent] = useState<string | undefined>(undefined);

  useEffect(() => {
    const blob = new Blob([data], { type: mimeType });

    if (!blob) return;

    if (mimeType === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSvgContent(event.target?.result?.toString());
      };
      reader.readAsText(blob);
    } else {
      const url = URL.createObjectURL(blob);
      setImageUrl(url);

      return () => {
        if (url) {
          URL.revokeObjectURL(url);
        }
      };
    }
  }, [data, mimeType]);

  const fileSize = formatBytes(data.byteLength);

  const onDragImgStart = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const onClickDownload = (e: React.MouseEvent) => {
    const filename = `download.${extMap[mimeType]}`;

    const blob = new Blob([data], {
      type: mimeType,
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();

    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <Image>
      {imageUrl || svgContent ? (
        <div className="image-container">
          {svgContent ? (
            <div
              dangerouslySetInnerHTML={{ __html: svgContent }}
              style={{ width: 300, height: 300 }}
              onDragStart={onDragImgStart}
            />
          ) : (
            <img src={imageUrl} alt="" onDragStart={onDragImgStart} />
          )}
          <div className="image-info">
            <div className="file-info" style={{ textTransform: 'uppercase' }}>
              {extMap[mimeType]}
            </div>
            <div className="file-info">{fileSize}</div>
            <Icon
              icon={DownloadRoundedIcon}
              width={'18px'}
              height={'18px'}
              fontSize={'20px'}
              additionalStyles={css`
                cursor: pointer;
                &:hover {
                  color: var(--text-color) !important;
                }
              `}
              onClick={onClickDownload}
            />
          </div>
        </div>
      ) : null}
    </Image>
  );
});

ImageNodeContentBody.displayName = 'ImageNodeContentBody';

export const imageDescriptor: UIContextDescriptor<'image'> = {
  Body: ImageNodeContentBody,
};
