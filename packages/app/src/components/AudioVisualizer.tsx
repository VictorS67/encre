import React, {
  FC,
  ForwardedRef,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import { useAsyncEffect, useThrottleFn } from 'ahooks';

import { useStableCallback } from '../hooks/useStableCallback';
import {
  AudioVisualizerProps,
  LiveAudioVisualizerProps,
  AudioDataPoint,
  AudioCanvasFields,
} from '../types/audiovisualizer.type';
import {
  calculateBarData,
  calculateLiveBarData,
  draw,
  drawLive,
} from '../utils/audioVisualizer';

export const AudioVisualizer = forwardRef<
  HTMLCanvasElement,
  AudioVisualizerProps
>(function myAudioVisualizer(
  {
    blob,
    width,
    height,
    barWidth = 2,
    gap = 1,
    currentTime,
    style,
    backgroundColor = 'transparent',
    barColor = 'rgb(184, 184, 184)',
    barPlayedColor = 'rgb(160, 198, 255)',
  }: AudioVisualizerProps,
  ref?: ForwardedRef<HTMLCanvasElement>,
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [data, setData] = useState<AudioDataPoint[]>([]);
  const [duration, setDuration] = useState<number>(0);

  // const drawCanvasDebounced = useThrottleFn(
  //   (fields: AudioCanvasFields) => {
  //     draw(
  //       fields.data,
  //       fields.canvas,
  //       fields.barWidth,
  //       fields.gap,
  //       fields.backgroundColor,
  //       fields.barColor,
  //       fields.barPlayedColor,
  //       fields.currentTime,
  //       fields.duration
  //     );
  //   },
  //   { wait: 10 }
  // );

  // const drawCanvas = useStableCallback((fields: AudioCanvasFields) => {
  //   drawCanvasDebounced.run(fields);
  // });

  useImperativeHandle<HTMLCanvasElement | null, HTMLCanvasElement | null>(
    ref,
    () => canvasRef.current,
    [],
  );

  useAsyncEffect(async () => {
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
        barPlayedColor,
        currentTime,
      );
      return;
    }

    const audioBuffer = await blob.arrayBuffer();
    const audioContext = new AudioContext();
    await audioContext.decodeAudioData(audioBuffer, (buffer) => {
      if (!canvasRef.current) return;
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
        barPlayedColor,
        currentTime,
      );
    });
  }, [blob, currentTime, width, barColor, canvasRef.current]);

  useLayoutEffect(() => {
    if (!canvasRef.current) return;

    draw(
      data,
      canvasRef.current,
      barWidth,
      gap,
      backgroundColor,
      barColor,
      barPlayedColor,
      currentTime,
      duration,
    );
  }, [currentTime, data, barColor, duration]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        ...style,
        width: '100%',
      }}
    />
  );
});

AudioVisualizer.displayName = 'AudioVisualizer';

export const LiveAudioVisualizer: FC<LiveAudioVisualizerProps> = ({
  mediaRecorder,
  width = '100%',
  height = '100%',
  barWidth = 2,
  gap = 1,
  backgroundColor = 'transparent',
  barColor = 'rgb(160, 198, 255)',
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
    if (analyser && mediaRecorder.state === 'recording') {
      report();
    }
  }, [analyser, mediaRecorder.state]);

  const report = useCallback(() => {
    if (!analyser) return;

    const data = new Uint8Array(analyser?.frequencyBinCount);

    if (mediaRecorder.state === 'recording') {
      analyser?.getByteFrequencyData(data);
      processFrequencyData(data);
      requestAnimationFrame(report);
    } else if (mediaRecorder.state === 'paused') {
      processFrequencyData(data);
    } else if (
      mediaRecorder.state === 'inactive' &&
      context.state !== 'closed'
    ) {
      context.close();
    }
  }, [analyser, context.state, barColor]);

  const processFrequencyData = (data: Uint8Array): void => {
    if (!canvasRef.current) return;

    const dataPoints = calculateLiveBarData(
      data,
      canvasRef.current.width,
      barWidth,
      gap,
    );
    drawLive(
      dataPoints,
      canvasRef.current,
      barWidth,
      gap,
      backgroundColor,
      barColor,
    );
  };

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        aspectRatio: 'unset',
        width: '100%',
      }}
    />
  );
};
