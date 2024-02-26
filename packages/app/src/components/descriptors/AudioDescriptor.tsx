import React, {
  FC,
  memo,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useThrottleFn } from 'ahooks';
import { useRecoilValue } from 'recoil';

import { useAudioRecorder } from '../../hooks/useAudioRecorder';
import { useStableCallback } from '../../hooks/useStableCallback';
import { themeState } from '../../state/settings';
import { Node, UIContext } from '../../types/studio.type';
import { UIContextDescriptor } from '../../types/uicontext.type';
import { AudioRecorder } from '../AudioRecorder';
import {
  LazyAudioVisualizer,
  LazyLiveAudioVisualizer,
} from '../LazyComponents';

/* eslint-disable react/prop-types */
export const AudioNodeContentBody: FC<
  { node: Node } & Extract<UIContext, { type: 'audio' }>
> = memo(({ node, mimeType, data }) => {
  const [blob, setBlob] = useState<Blob | undefined>();
  const recorder = useAudioRecorder();

  const audioCanvasContainerRef = useRef<HTMLDivElement>(null);
  const [audioCanvasWidth, setAudioCanvasWidth] = useState<number>(0);
  const appTheme = useRecoilValue(themeState);

  const setAudioCanvasWidthDebounced = useThrottleFn(
    (width: number) => {
      setAudioCanvasWidth(width);
    },
    { wait: 25 },
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
        // setAudioCanvasWidth(entry.contentRect.width);
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

  const barColor = useMemo(() => {
    return getComputedStyle(document.documentElement)
      .getPropertyValue('--text-color')
      .trim();
  }, [appTheme]);

  return (
    <div ref={audioCanvasContainerRef}>
      <AudioRecorder
        onRecordingComplete={setBlob}
        recorderControls={recorder}
      />

      {recorder.mediaRecorder && (
        <LazyLiveAudioVisualizer
          mediaRecorder={recorder.mediaRecorder}
          width={audioCanvasWidth}
          height={75}
        />
      )}

      {blob && (
        <LazyAudioVisualizer
          blob={blob}
          width={500}
          height={75}
          barWidth={1}
          gap={0}
          barColor={'#f76565'}
        />
      )}

      {blob && (
        <LazyAudioVisualizer
          blob={blob}
          width={audioCanvasWidth}
          height={75}
          barWidth={3}
          gap={2}
          currentTime={audioCanvasWidth / 100}
          barColor={getComputedStyle(document.documentElement)
            .getPropertyValue('--audio-track-color')
            .trim()}
          barPlayedColor={'red'}
        />
      )}
      <p>The width of the div is: {audioCanvasWidth}px</p>
    </div>
  );
});

AudioNodeContentBody.displayName = 'AudioNodeContentBody';

export const audioDescriptor: UIContextDescriptor<'audio'> = {
  Body: AudioNodeContentBody,
};
