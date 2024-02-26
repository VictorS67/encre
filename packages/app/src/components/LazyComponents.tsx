import { lazy } from 'react';

export const LazyCodeEditor = lazy(() => import('./CodeEditor'));

export const LazySyntaxedText = lazy(() => import('./SyntaxedText'));

export const LazyLiveAudioVisualizer = lazy(async () => {
  const { LiveAudioVisualizer } = await import('./AudioVisualizer');

  return { default: LiveAudioVisualizer };
});

export const LazyAudioVisualizer = lazy(async () => {
  const { AudioVisualizer } = await import('./AudioVisualizer');

  return { default: AudioVisualizer };
});
