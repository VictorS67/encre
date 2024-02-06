export type SyntaxedComponent = EditorComponent | MessageComponent;

export type EditorComponent = {
  type: 'editor';
  content: string;
  startLineNumber?: number;
  lines?: number;
};

export type MessageComponent = {
  type: 'message';
  content: HTMLDivElement;
  startLineNumber?: number;
  lines?: number;
};

export type CodeEditorProps = {
  text: string;
  isReadOnly?: boolean;
  language?: string;
  showLineNumbers?: boolean;
  scrollBeyondLastLine?: boolean;
  theme?: string;
};

export type SyntaxedTextProps = {
  text: string;
  language: string;
  theme?: string;
};
