import { RecordId } from '../../load/keymap';

/**
 * Represents the basic structure of a comment in a graph-based application. 
 * This interface defines the common properties that all types of comments share, 
 * including identifier, visual styling, and optional textual content.
 */
export interface BaseComment {
  /**
   * The unique identifier for the comment.
   */
  id: RecordId;

  /**
   * Information about the visual presentation of the comment including its position, size, 
   * and optional content styling such as text alignment and color.
   */
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

  /**
   * Optional title for the comment.
   */
  title?: string | undefined;

  /**
   * Optional descriptive text for the comment.
   */
  description?: string | undefined;
}

/**
 * Extends `BaseComment` to specify a comment that contains plain text. 
 * This type of comment is straightforward and used for simple annotations without formatting needs.
 */
export interface PlainTextComment extends BaseComment {
  /**
   * Literal type indicating that this is a plain text comment.
   */
  type: 'plain';

  /**
   * The actual text content of the comment.
   */
  text: string;
}

/**
 * Extends `BaseComment` to allow comments containing Markdown formatted text, 
 * enabling rich text formatting such as headers, lists, and links within the comment.
 */
export interface MarkdownComment extends BaseComment {
  /**
   * Literal type indicating that this is a Markdown comment.
   */
  type: 'markdown';

  /**
   * The Markdown content of the comment.
   */
  text: string;
}

/**
 * Extends `BaseComment` for comments intended to display code snippets. 
 * This type supports syntax highlighting by specifying a programming language.

 */
export interface CodeComment extends BaseComment {
  /**
   * Literal type indicating that this is a code comment.
   */
  type: 'code';

  /**
   * The code snippet to be displayed in the comment.
   */
  text: string;

  /**
   * Optional programming language for syntax highlighting.
   */
  language?: string;

  /**
   * Optional list of keywords important in the context of the code snippet, 
   * which could be highlighted or indexed.
   */
  keywords?: string[];
}

/**
 * Union type representing any possible type of comment that can be attached to a graph 
 * element. This allows for flexible handling of different comment styles based on the 
 * content type.
 */
export type GraphComment = PlainTextComment | MarkdownComment | CodeComment;
