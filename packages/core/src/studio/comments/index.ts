import { RecordId } from '../../load/keymap';

export interface BaseComment {
  id: RecordId;

  visualInfo: {
    position: {
      x: number;
      y: number;
      zIndex?: number;
    };
    size: {
      width: number;
      height: number;
    };
    content?: {
      horitontal?: 'center' | 'start' | 'end' | 'justify';
      vertical?: 'center' | 'start' | 'end';
      color?:
        | 'red'
        | 'orange'
        | 'gold'
        | 'yellow'
        | 'palmera'
        | 'green'
        | 'meadow'
        | 'cyan'
        | 'blue'
        | 'cornflower'
        | 'purple'
        | 'pink'
        | 'razzmatazz'
        | 'silver'
        | 'dark';
    };
  };

  title?: string | undefined;

  description?: string | undefined;
}

export interface PlainTextComment extends BaseComment {
  type: 'plain';
  text: string;
}

export interface MarkdownComment extends BaseComment {
  type: 'markdown';
  text: string;
}

export interface CodeComment extends BaseComment {
  type: 'code';
  text: string;

  language?: string;
  keywords?: string[];
}

export type GraphComment = PlainTextComment | MarkdownComment | CodeComment;
