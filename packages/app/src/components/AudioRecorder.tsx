import React, { FC, Suspense, useEffect, useRef, useState } from 'react';

import styled from '@emotion/styled';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import MicRoundedIcon from '@mui/icons-material/MicRounded';
import PauseRoundedIcon from '@mui/icons-material/PauseRounded';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import clsx from 'clsx';

import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { AudioRecorderProps } from '../types/audiorecorder.type';

import { Icon } from './Icon';
import { LazyLiveAudioVisualizer } from './LazyComponents';

const AudioRecorderContainer = styled.div`
  background-color: rgb(235, 235, 235);
  box-shadow: 0px 2px 5px 0px rgb(190, 190, 190);
  border-radius: 20px;
  box-sizing: border-box;
  color: #000000;

  width: 40px;
  display: flex;
  align-items: center;

  transition: all 0.2s ease-in;
  -webkit-tap-highlight-color: transparent;

  .audio-recorder-visualizer {
    margin-left: 15px;
    flex-grow: 1;
    align-self: center;
    display: flex;
    align-items: center;
  }

  .display-none {
    display: none;
  }

  .audio-recorder-status-dot {
    background-color: rgb(221, 0, 0);
    border-radius: 50%;
    height: 10px;
    width: 9px;
    margin-right: 5px;
  }
`;

/**
 * Usage: https://github.com/samhirtarif/react-audio-recorder#audiorecorder-component
 *
 *
 * @prop `onRecordingComplete` Method that gets called when save recording option is clicked
 * @prop `recorderControls` Externally initilize hook and pass the returned object to this param, this gives your control over the component from outside the component.
 * https://github.com/samhirtarif/react-audio-recorder#combine-the-useaudiorecorder-hook-and-the-audiorecorder-component
 * @prop `audioTrackConstraints`: Takes a {@link https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackSettings#instance_properties_of_audio_tracks subset} of `MediaTrackConstraints` that apply to the audio track
 * @prop `onNotAllowedOrFound`: A method that gets called when the getUserMedia promise is rejected. It receives the DOMException as its input.
 * @prop `downloadOnSavePress` If set to `true` the file gets downloaded when save recording is pressed. Defaults to `false`
 * @prop `downloadFileExtension` File extension for the audio filed that gets downloaded. Defaults to `mp3`. Allowed values are `mp3`, `wav` and `webm`
 * @prop `showVisualizer` Displays a waveform visualization for the audio when set to `true`. Defaults to `false`
 * @prop `classes` Is an object with attributes representing classes for different parts of the component
 */
export const AudioRecorder: FC<AudioRecorderProps> = ({
  onRecordingComplete,
  onNotAllowedOrFound,
  recorderControls,
  audioTrackConstraints,
  downloadOnSavePress = false,
  downloadFileExtension = 'webm',
  showVisualizer = false,
  mediaRecorderOptions,
  classes,
}: AudioRecorderProps) => {
  const {
    startRecording,
    stopRecording,
    togglePauseResume,
    recordingBlob,
    isRecording,
    isPaused,
    recordingTime,
    mediaRecorder,
  } =
    recorderControls ??
    useAudioRecorder(
      audioTrackConstraints,
      onNotAllowedOrFound,
      mediaRecorderOptions,
    );

  const [shouldSave, setShouldSave] = useState(false);
  const ffmpegRef = useRef(new FFmpeg());

  const onClickStartRecord = (e: React.MouseEvent) => {
    e.stopPropagation();

    startRecording();
  };

  const onClickSaveRecord = (e: React.MouseEvent) => {
    e.stopPropagation();

    setShouldSave(true);
    stopRecording();
  };

  const onClickTogglePauseResume = (e: React.MouseEvent) => {
    e.stopPropagation();

    togglePauseResume();
  };

  const onClickDiscardRecord = (e: React.MouseEvent) => {
    e.stopPropagation();

    setShouldSave(false);
    stopRecording();
  };

  const convertToDownloadFileExtension = async (
    webmBlob: Blob,
  ): Promise<Blob> => {
    const baseURL = 'https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/esm';
    const ffmpeg = ffmpegRef.current;
    ffmpeg.on('log', ({ message }) => {
      console.log(message);
    });

    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.wasm`,
        'application/wasm',
      ),
      workerURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.worker.js`,
        'text/javascript',
      ),
    });

    const inputName = 'input.webm';
    const outputName = `output.${downloadFileExtension}`;

    await ffmpeg.writeFile(
      inputName,
      new Uint8Array(await webmBlob.arrayBuffer()),
    );
    await ffmpeg.exec(['-i', inputName, outputName]);

    const outputData = await ffmpeg.readFile(outputName);

    const outputBlob = new Blob(
      [new Uint8Array(outputData as ArrayBuffer).buffer],
      {
        type: `audio/${downloadFileExtension}`,
      },
    );

    return outputBlob;
  };

  const download = async (blob: Blob): Promise<void> => {
    if (!crossOriginIsolated && downloadFileExtension !== 'webm') {
      console.warn(
        'This website is not "cross-origin isolated". Audio will be downloaded in webm format, since mp3/wav encoding requires cross origin isolation. Please visit https://web.dev/cross-origin-isolation-guide/ and https://web.dev/coop-coep/ for information on how to make your website "cross-origin isolated"',
      );
    }

    const downloadBlob = crossOriginIsolated
      ? await convertToDownloadFileExtension(blob)
      : blob;
    const fileExt = crossOriginIsolated ? downloadFileExtension : 'webm';
    const url = URL.createObjectURL(downloadBlob);

    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `audio.${fileExt}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  useEffect(() => {
    if (
      (shouldSave || recorderControls) &&
      recordingBlob != null &&
      onRecordingComplete != null
    ) {
      onRecordingComplete(recordingBlob);
      if (downloadOnSavePress) {
        download(recordingBlob);
      }
    }
  }, [recordingBlob]);

  return (
    <AudioRecorderContainer>
      {isRecording ? (
        <Icon icon={SaveRoundedIcon} onClick={onClickSaveRecord} />
      ) : (
        <Icon icon={MicRoundedIcon} onClick={onClickStartRecord} />
      )}
      <span
        className={clsx({
          'display-none': !isRecording,
        })}
      >
        {Math.floor(recordingTime / 60)}:
        {String(recordingTime % 60).padStart(2, '0')}
      </span>
      {showVisualizer ? (
        <span
          className={clsx({
            'audio-recorder-visualizer': true,
            'display-none': !isRecording,
          })}
        >
          {mediaRecorder && (
            <Suspense fallback={<div />}>
              <LazyLiveAudioVisualizer
                mediaRecorder={mediaRecorder}
                barWidth={2}
                gap={2}
                width={140}
                height={30}
                fftSize={512}
                maxDecibels={-10}
                minDecibels={-80}
                smoothingTimeConstant={0.4}
              />
            </Suspense>
          )}
        </span>
      ) : (
        <span
          className={clsx({
            'display-none': !isRecording,
          })}
        >
          <span className="audio-recorder-status-dot"></span>
          Recording
        </span>
      )}
      {isPaused ? (
        <Icon icon={PlayArrowRoundedIcon} onClick={onClickTogglePauseResume} />
      ) : (
        <Icon icon={PauseRoundedIcon} onClick={onClickTogglePauseResume} />
      )}
      <Icon icon={DeleteForeverRoundedIcon} onClick={onClickDiscardRecord} />
    </AudioRecorderContainer>
  );
};
