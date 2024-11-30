import React, { FC, memo } from "react";

import { css } from "@emotion/react";
import styled from "@emotion/styled";
import AbcRoundedIcon from "@mui/icons-material/AbcRounded";
import CssIcon from "@mui/icons-material/Css";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import HtmlIcon from "@mui/icons-material/Html";
import JavascriptRoundedIcon from "@mui/icons-material/JavascriptRounded";
import { match } from "ts-pattern";

import { EXT_MAP } from "internal/src/constants/encre";

import { SVGIcon } from "../../types/icon.type";
import { Node, UIContext } from "../../types/studio.type";
import { UIContextDescriptor } from "../../types/uicontext.type";
import { formatBytes } from "../../utils/format";
import { Icon } from "../Icon";

const File = styled.div`
  align-self: stretch;
  width: 100%;
  height: 20px;
  margin-top: 5px;
  gap: 5px;
  overflow: hidden;
  display: inline-flex;
  user-select: none;
  color: var(--text-color);
  align-items: center;

  .file-name {
    font-weight: 700;
    overflow: hidden;
    diaplay: inline-flex;
    font-size: 14px;
    white-space: nowrap;
  }

  .file-size {
    align-self: flex-end;
    font-weight: 700;
    overflow: hidden;
    diaplay: inline-block;
    font-size: 12px;
    color: var(--text-disabled-color);
    white-space: nowrap;
  }

  .spacer {
    flex-grow: 1;
  }
`;

// const extMap = {
//   'text/plain': 'bin',
//   'text/html': 'html',
//   'text/javascript': 'js',
//   'text/css': 'css',
//   'application/json': 'json',
//   'application/pdf': 'pdf',
//   'application/xml': 'xml',
//   'image/png': 'png',
//   'image/jpeg': 'jpeg',
//   'image/gif': 'gif',
//   'image/svg+xml': 'svg',
//   'audio/mp3': 'mp3',
//   'audio/ogg': 'ogg',
//   'audio/wav': 'wav',
// };

/* eslint-disable react/prop-types */
export const FileNodeContentBody: FC<
  { node: Node; id: string } & Extract<UIContext, { type: "file" }>
> = memo(({ node, id, mimeType, data }) => {
  const FileIcon: SVGIcon = match(mimeType)
    .with("text/plain", () => AbcRoundedIcon)
    .with("text/html", () => HtmlIcon)
    .with("text/javascript", () => JavascriptRoundedIcon)
    .with("text/css", () => CssIcon)
    .with("application/json", () => DescriptionRoundedIcon)
    .with("application/pdf", () => DescriptionRoundedIcon)
    .with("application/xml", () => DescriptionRoundedIcon)
    .exhaustive();

  const fileName: string = match(mimeType)
    .with("text/plain", () => "Plain text document")
    .with("text/html", () => "HTML document")
    .with("text/javascript", () => "JS file")
    .with("text/css", () => "CSS file")
    .with("application/json", () => "JSON file")
    .with("application/pdf", () => "PDF file")
    .with("application/xml", () => "XML file")
    .exhaustive();

  const fileSize = formatBytes(data.byteLength);

  const onClickDownload = (e: React.MouseEvent) => {
    const ext = mimeType && EXT_MAP[mimeType] ? EXT_MAP[mimeType] : "unknown";

    const filename = `download.${ext}`;

    const blob = new Blob([data], {
      type: mimeType,
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();

    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <File>
      <Icon
        icon={FileIcon}
        width={"24px"}
        height={"24px"}
        fontSize={"24px"}
        additionalStyles={css`
          flex: 0 !important;
          margin-left: 5px;
        `}
      />
      <div className="file-name">{fileName}</div>
      <div className="file-size">{fileSize}</div>
      <div className="spacer"></div>
      <Icon
        icon={DownloadRoundedIcon}
        width={"18px"}
        height={"18px"}
        fontSize={"20px"}
        additionalStyles={css`
          cursor: pointer;
          color: var(--text-disabled-color) !important;
          display: flex;
          flex: 0 !important;
          margin-right: 5px;
          &:hover {
            color: var(--text-color) !important;
          }
        `}
        onClick={onClickDownload}
      />
    </File>
  );
});

FileNodeContentBody.displayName = "FileNodeContentBody";

export const fileDescriptor: UIContextDescriptor<"file"> = {
  Body: FileNodeContentBody,
};
