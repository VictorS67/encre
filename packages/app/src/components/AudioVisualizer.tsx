import React, {
  CSSProperties,
  FC,
  ForwardedRef,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import styled from "@emotion/styled";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import { css } from "@mui/material";

import { EXT_MAP } from "internal/src/constants/encre";

import {
  AudioVisualizerProps,
  LiveAudioVisualizerProps,
  AudioDataPoint,
} from "../types/audiovisualizer.type";
import {
  calculateBarData,
  calculateLiveBarData,
  draw,
  drawLive,
} from "../utils/audioVisualizer";
import { formatBytes } from "../utils/format";

import { Icon } from "./Icon";

const AudioTrack = styled.div<{ width: number; height: number }>`
  position: relative;
  width: 100%;
  height: ${(props) => props.height}px;

  .audio-container {
    position: relative;
    width: 100%;
    height: ${(props) => props.height}px;
  }

  .track {
    width: ${(props) => props.width}px;
    position: absolute;
    left: 0;
    top: 0;
  }

  .playhead {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 2px;
    background: var(--text-color-accent-3);
    pointer-events: none;
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

  &:hover .audio-info {
    opacity: 1;
    pointer-events: auto;
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

export const AudioVisualizer = forwardRef<
  HTMLCanvasElement,
  AudioVisualizerProps
>(function myAudioVisualizer(
  {
    blob,
    mimeType,
    width,
    height,
    displayInfo = false,
    barWidth = 2,
    gap = 1,
    style,
    backgroundColor = "transparent",
    barColor = "rgb(184, 184, 184)",
    barPlayedColor = "rgb(160, 198, 255)",
  }: AudioVisualizerProps,
  ref?: ForwardedRef<HTMLCanvasElement>
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const animationFrameRef = useRef(0);
  const startTimeRef = useRef(0);
  const startOffsetRef = useRef(0);

  const [data, setData] = useState<AudioDataPoint[]>([]);
  const [duration, setDuration] = useState<number>(1);
  const [currTime, setCurrTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [displayPlayhead, setDisplayPlayhead] = useState(false);

  const fileSize = formatBytes(blob.size);

  const togglePlayback = (e: React.MouseEvent) => {
    const audioContext = audioContextRef.current;
    const audioBuffer = audioBufferRef.current;

    if (!audioContext || !audioBuffer) return;

    if (isPlaying) {
      // Stop the audio
      if (sourceRef.current) {
        sourceRef.current.stop();
        sourceRef.current = null;
      }
      setIsPlaying(false);
      startOffsetRef.current += audioContext.currentTime - startTimeRef.current;
    } else {
      // Play the audio
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.start(0, startOffsetRef.current);
      source.addEventListener(
        "ended",
        () => {
          setIsPlaying(false);
          setDisplayPlayhead(true);
          startOffsetRef.current = 0;
        },
        { once: true }
      );

      if (sourceRef.current) {
        sourceRef.current.disconnect();
      }
      sourceRef.current = source;
      setIsPlaying(true);
      setDisplayPlayhead(true);
      startTimeRef.current = audioContext.currentTime;
    }
  };

  const updateCurrentTime = useCallback(() => {
    if (!audioContextRef.current || !isPlaying) return;

    const newTime =
      startOffsetRef.current +
      audioContextRef.current.currentTime -
      startTimeRef.current;
    setCurrTime(newTime);
    animationFrameRef.current = requestAnimationFrame(updateCurrentTime);
  }, [isPlaying, width, duration]);

  useEffect(() => {
    if (isPlaying) {
      animationFrameRef.current = requestAnimationFrame(updateCurrentTime);
    }

    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [isPlaying, updateCurrentTime, width, duration]);

  useImperativeHandle<HTMLCanvasElement | null, HTMLCanvasElement | null>(
    ref,
    () => canvasRef.current,
    []
  );

  useEffect(() => {
    if (!canvasRef.current) return;

    if (!blob) {
      const barsData = Array.from({ length: 100 }, () => ({
        max: 0,
        min: 0,
      }));
      draw(
        barsData,
        canvasRef.current,
        barWidth,
        gap,
        backgroundColor,
        barColor,
        barPlayedColor
      );
      return;
    }

    const audioContext = new AudioContext();
    audioContextRef.current = audioContext;

    blob.arrayBuffer().then((audioBuffer) => {
      audioContext.decodeAudioData(audioBuffer, (buffer) => {
        if (!canvasRef.current) return;
        audioBufferRef.current = buffer;
        setDuration(buffer.duration);

        const barsData = calculateBarData(buffer, height, width, barWidth, gap);
        setData(barsData);

        draw(
          barsData,
          canvasRef.current,
          barWidth,
          gap,
          backgroundColor,
          barColor,
          barPlayedColor
        );
      });
    });

    return () => {
      audioContext.close();
    };
  }, [blob, backgroundColor, barColor, barPlayedColor, canvasRef.current]);

  useLayoutEffect(() => {
    if (!audioBufferRef.current || !canvasRef.current) return;

    const audioBuffer = audioBufferRef.current;

    const barsData = calculateBarData(
      audioBuffer,
      height,
      width,
      barWidth,
      gap
    );
    setData(barsData);
    draw(
      barsData,
      canvasRef.current,
      barWidth,
      gap,
      backgroundColor,
      barColor,
      barPlayedColor
    );
  }, [
    width,
    backgroundColor,
    barColor,
    barPlayedColor,
    audioBufferRef.current,
    canvasRef.current,
  ]);

  useLayoutEffect(() => {
    if (!canvasRef.current || !audioContextRef.current) return;

    draw(
      data,
      canvasRef.current,
      barWidth,
      gap,
      backgroundColor,
      barColor,
      barPlayedColor,
      currTime,
      duration
    );
  }, [
    isPlaying,
    currTime,
    duration,
    width,
    backgroundColor,
    barColor,
    barPlayedColor,
  ]);

  const playHeadStyling = useMemo(() => {
    const styling: CSSProperties = {
      opacity: displayPlayhead ? "1" : "0",
      left: `${(currTime / duration) * 100}%`,
    };

    return styling;
  }, [displayPlayhead, currTime, duration]);

  const onClickDownload = (e: React.MouseEvent) => {
    e.stopPropagation();

    const ext = mimeType && EXT_MAP[mimeType] ? EXT_MAP[mimeType] : "unknown";

    const filename = `download.${ext}`;

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
    <AudioTrack width={width} height={height}>
      <div className="audio-container">
        <canvas
          ref={canvasRef}
          className="track"
          width={width}
          height={height}
          style={{
            ...style,
          }}
          onClick={togglePlayback}
        />
        <div className="playhead" style={playHeadStyling}></div>
      </div>
      {displayInfo ? (
        <div className="audio-info">
          <div className="file-info" style={{ textTransform: "uppercase" }}>
            {mimeType && EXT_MAP[mimeType] ? EXT_MAP[mimeType] : "unknown"}
          </div>
          <div className="file-info">{fileSize}</div>
          <Icon
            icon={DownloadRoundedIcon}
            width={"18px"}
            height={"18px"}
            fontSize={"20px"}
            additionalStyles={css`
              cursor: pointer;
              &:hover {
                color: var(--text-color) !important;
              }
            `}
            onClick={onClickDownload}
          />
        </div>
      ) : null}
    </AudioTrack>
  );
});

AudioVisualizer.displayName = "AudioVisualizer";

export const LiveAudioVisualizer: FC<LiveAudioVisualizerProps> = ({
  mediaRecorder,
  width = "100%",
  height = "100%",
  barWidth = 2,
  gap = 1,
  backgroundColor = "transparent",
  barColor = "rgb(160, 198, 255)",
  fftSize = 1024,
  maxDecibels = -10,
  minDecibels = -90,
  smoothingTimeConstant = 0.4,
}: LiveAudioVisualizerProps) => {
  const [context] = useState(() => new AudioContext());
  const [analyser, setAnalyser] = useState<AnalyserNode>();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!mediaRecorder.stream) return;

    const analyserNode = context.createAnalyser();
    setAnalyser(analyserNode);
    analyserNode.fftSize = fftSize;
    analyserNode.minDecibels = minDecibels;
    analyserNode.maxDecibels = maxDecibels;
    analyserNode.smoothingTimeConstant = smoothingTimeConstant;
    const source = context.createMediaStreamSource(mediaRecorder.stream);
    source.connect(analyserNode);
  }, [mediaRecorder.stream]);

  useEffect(() => {
    if (analyser && mediaRecorder.state === "recording") {
      report();
    }
  }, [analyser, mediaRecorder.state]);

  const report = useCallback(() => {
    if (!analyser) return;

    const data = new Uint8Array(analyser?.frequencyBinCount);

    if (mediaRecorder.state === "recording") {
      analyser?.getByteFrequencyData(data);
      processFrequencyData(data);
      requestAnimationFrame(report);
    } else if (mediaRecorder.state === "paused") {
      processFrequencyData(data);
    } else if (
      mediaRecorder.state === "inactive" &&
      context.state !== "closed"
    ) {
      context.close();
    }
  }, [analyser, context.state, backgroundColor, barColor]);

  const processFrequencyData = (data: Uint8Array): void => {
    if (!canvasRef.current) return;

    const dataPoints = calculateLiveBarData(
      data,
      canvasRef.current.width,
      barWidth,
      gap
    );
    drawLive(
      dataPoints,
      canvasRef.current,
      barWidth,
      gap,
      backgroundColor,
      barColor
    );
  };

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        aspectRatio: "unset",
        width: "100%",
      }}
    />
  );
};
