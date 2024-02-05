import { lazy } from 'react';

export const LazyCodeEditor = lazy(() => import('./CodeEditor'));

export const LazySyntaxedText = lazy(() => import('./SyntaxedText'));
