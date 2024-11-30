import React, {
  FC,
  memo,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { css } from "@emotion/react";
import styled from "@emotion/styled";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import { useThrottleFn } from "ahooks";

import { EXT_MAP } from "internal/src/constants/encre";

import { useAudioRecorder } from "../../hooks/useAudioRecorder";
import { useStableCallback } from "../../hooks/useStableCallback";
import { Node, UIContext } from "../../types/studio.type";
import { UIContextDescriptor } from "../../types/uicontext.type";
import { formatBytes } from "../../utils/format";
import { AudioRecorder } from "../AudioRecorder";
import { Icon } from "../Icon";
import {
  LazyAudioVisualizer,
  LazyLiveAudioVisualizer,
} from "../LazyComponents";

const Audio = styled.div`
  width: 100%;
  overflow: hidden;
  display: inline-flex;

  .audio-container {
    width: 100%;
  }

  .audio-info {
    position: absolute;
    top: 0;
    right: 0;
    padding: 3px;
    border-bottom-left-radius: 5px;
    background-color: var(--node-foreground-color-2);
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

  .audio-container:hover .audio-info {
    opacity: 1;
    pointer-events: auto;
  }
`;

/* eslint-disable react/prop-types */
export const AudioNodeContentBody: FC<
  { node: Node; id: string } & Extract<UIContext, { type: "audio" }>
> = memo(({ node, id, mimeType, data }) => {
  const [blob, setBlob] = useState<Blob | undefined>(
    new Blob([data], { type: mimeType })
  );
  // const recorder = useAudioRecorder();

  const audioCanvasContainerRef = useRef<HTMLDivElement>(null);
  const [audioCanvasWidth, setAudioCanvasWidth] = useState<number>(0);

  const setAudioCanvasWidthDebounced = useThrottleFn(
    (width: number) => {
      setAudioCanvasWidth(width);
    },
    { wait: 25 }
  );

  const updateAudioCanvasWidth = useStableCallback((width: number) => {
    setAudioCanvasWidthDebounced.run(width);
  });

  useLayoutEffect(() => {
    if (audioCanvasContainerRef === null) {
      return;
    }

    const observeTarget = audioCanvasContainerRef.current;
    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        updateAudioCanvasWidth(entry.target.clientWidth);
      });
    });

    if (observeTarget) {
      resizeObserver.observe(observeTarget);
    }

    return () => {
      if (observeTarget) {
        resizeObserver.unobserve(observeTarget);
      }
    };
  }, [audioCanvasContainerRef]);

  return (
    <div className="audio-container" ref={audioCanvasContainerRef}>
      {/* <AudioRecorder
        onRecordingComplete={setBlob}
        recorderControls={recorder}
      />

      {recorder.mediaRecorder && (
        <LazyLiveAudioVisualizer
          mediaRecorder={recorder.mediaRecorder}
          width={audioCanvasWidth}
          height={75}
          barWidth={3}
          gap={2}
          barColor={getComputedStyle(document.documentElement)
            .getPropertyValue('--text-disabled-color')
            .trim()}
        />
      )} */}

      {blob && (
        <LazyAudioVisualizer
          blob={blob}
          mimeType={mimeType}
          width={audioCanvasWidth}
          height={75}
          displayInfo={true}
          barWidth={3}
          gap={2}
          barColor={getComputedStyle(document.documentElement)
            .getPropertyValue("--text-disabled-color")
            .trim()}
          barPlayedColor={getComputedStyle(document.documentElement)
            .getPropertyValue("--audio-track-color")
            .trim()}
        />
      )}
    </div>
  );
});

AudioNodeContentBody.displayName = "AudioNodeContentBody";

export const audioDescriptor: UIContextDescriptor<"audio"> = {
  Body: AudioNodeContentBody,
};
