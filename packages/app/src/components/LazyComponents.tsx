import { lazy } from "react";

export const LazyCodeEditor = lazy(() => import("./CodeEditor.js"));

export const LazySyntaxedText = lazy(() => import("./SyntaxedText.js"));
