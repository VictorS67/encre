export type NodeBodyBaseStyle = {
  fontSize?: number;
  fontFamily?: 'monospace' | 'sans-serif';
};

export type NodeBodyPlainStyle = {
  type: 'plain';
  text: string;
};

export type NodeBodyMarkdownStyle = {
  type: 'markdown';
  text: string;
};

export type NodeBodyCodeStyle = {
  type: 'code';
  text: string;

  language?: string;
  keywords?: string[];
};

export type NodeBodyStyle = NodeBodyBaseStyle &
  (NodeBodyPlainStyle | NodeBodyMarkdownStyle | NodeBodyCodeStyle);

export type NodeBody = string | NodeBodyStyle | NodeBodyStyle[] | undefined;
