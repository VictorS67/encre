import React, { CSSProperties, FC, MutableRefObject } from 'react';

import { Node, UIContext } from './studio.type';
import { type monaco } from '../utils/monacoEditor';

export type SyntaxedEditor =
  | EditorGroupContent
  | CodeEditorContent
  | StringEditorContent
  | MessageEditorContent
  | ImageEditorContent;

export type EditorGroupContent = SharedEditorProps & {
  type: 'group';

  editors: SyntaxedEditor[];
};

export type CodeEditorContent = SharedEditorProps & {
  type: 'code';

  language: string;
  text: string;
  theme?: string;
};

export type StringEditorContent = SharedEditorProps & {
  type: 'string';

  text: string;
};

export type MessageEditorContent = SharedEditorProps & {
  type: 'message';

  role: 'human' | 'assistant' | 'system' | 'function' | 'general';
  name?: string;
  editors: Omit<SyntaxedEditor, 'MessageEditorContent'>[];
};

export type ImageEditorContent = SharedEditorProps & {
  type: 'image';

  dataUri?: string;
  description?: string;
};

export type SharedEditorProps = {
  autoFocus?: boolean;
};

export type NodeChangeFn = (nodeToChange: Node) => void;

export type CodeEditorProps = {
  text: string;
  language?: string;
  keywords?: string[];
  properties?: string[];
  variables?: string[];
  fontSize?: number;
  fontFamily?: string;
  isReadOnly?: boolean;
  autoFocus?: boolean;
  showLineNumbers?: boolean;
  scrollBeyondLastLine?: boolean;
  theme?: string;
  editorRef?: MutableRefObject<monaco.editor.IStandaloneCodeEditor | undefined>;
  onChange?: (newText: string) => void;
  onKeyDown?: (e: monaco.IKeyboardEvent) => void;
};

export type SyntaxedTextProps = {
  text: string;
  language?: string;
  keywords?: string[];
  properties?: string[];
  variables?: string[];
  theme?: string;
  style?: CSSProperties;
};

export type NodeEditorProps = {
  selectedNode: Node;
  onDeselect: () => void;
};

export type DefaultNodeEditorProps = {
  node: Node;
  isReadOnly: boolean;
  startLineNumber?: number;
  lines?: number;
  onChange?: NodeChangeFn;
  onClose?: () => void;
};

export type EditorModalProps = {
  open: boolean;
  Header?: FC;
  Body?: FC;
  Footer?: FC;
  onClose?: () => void;
};
