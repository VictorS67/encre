import { MessageRole } from '../events/input/load/msgs/base.js';
import { exhaustiveTuple } from '../utils/exhuastive.js';
import { DataType } from './data.js';
import { SerializedRuleCollection } from './serde.js';

/**
 * Base UI context properties common to various UI elements.
 */
export type BaseUIContext = {
  /**
   * Optional font size for the text.
   */
  fontSize?: number;

  /**
   * Optional font family, can be either 'monospace' or 'sans-serif'.
   */
  fontFamily?: 'monospace' | 'sans-serif';

  /**
   * Optional flag indicating if the UI element is read-only.
   */
  isReadOnly?: boolean;
};

/**
 * UI context for plain text.
 */
export type PlainUIContext = {
  /**
   * Specifies the context type as 'plain'.
   */
  type: 'plain';

  /**
   * The plain text content.
   */
  text: string;
};

/**
 * UI context for markdown formatted text.
 */
export type MarkdownUIContext = {
  /**
   * Specifies the context type as 'markdown'.
   */
  type: 'markdown';

  /**
   * The markdown formatted text content.
   */
  text: string;
};

/**
 * UI context for code snippets.
 */
export type CodeUIContext = {
  /**
   * Specifies the context type as 'code'.
   */
  type: 'code';

  /**
   * The code text content.
   */
  text: string;

  /**
   * Optional programming language of the code.
   */
  language?: string;

  /**
   * Optional list of keywords highlighted in the code.
   */
  keywords?: string[];

  /**
   * Optional flag indicating whether the code context holds variable values.
   */
  isHoldingValues?: boolean;
};

/**
 * UI context for handling binary large objects (BLOBs) such as images, audio, or files.
 */
export type BlobUIContext = {
  /**
   * Specifies the context type as 'blob'.
   */
  type: 'blob';

  /**
   * Array of UI contexts for each BLOB item, can include images, audio files, or other file types.
   */
  blob: Array<ImageUIContext | AudioUIContext | FileUIContext>;

  /**
   * The total size of all blobs combined.
   */
  size: number;

  /**
   * A string describing the type of blob (e.g., 'image', 'audio').
   */
  blobType: string;
};

/**
 * UI context for complex nested UI elements.
 */
export type ContextUIContext = {
  /**
   * Specifies the context type as 'context'.
   */
  type: 'context';

  /**
   * An array of UI contexts that can include plain, markdown, or code contexts.
   */
  text: Array<PlainUIContext | MarkdownUIContext | CodeUIContext>;

  /**
   * Additional metadata as an array of plain, markdown, or code contexts.
   */
  metadata: Array<PlainUIContext | MarkdownUIContext | CodeUIContext>;
};

/**
 * UI context for displaying messages, possibly in a chat or log format.
 */
export type MessageUIContext = {
  /**
   * Specifies the context type as 'message'.
   */
  type: 'message';

  /**
   * An array of UI contexts that make up the content of the message.
   */
  content: Array<PlainUIContext | MarkdownUIContext | CodeUIContext>;

  /**
   * An array of UI contexts representing additional data or parameters associated with the message.
   */
  kwargs: Array<PlainUIContext | MarkdownUIContext | CodeUIContext>;

  /**
   * The role of the message sender, can be a predefined string or a MessageRole enum.
   */
  role: string | MessageRole;

  /**
   * Optional name of the message sender.
   */
  name?: string;
};

/**
 * UI context for images.
 */
export type ImageUIContext = {
  /**
   * Specifies the context type as 'image'.
   */
  type: 'image';

  /**
   * MIME type of the image (e.g., 'image/png', 'image/jpeg').
   */
  mimeType: 'image/png' | 'image/jpeg' | 'image/gif' | 'image/svg+xml';

  /**
   * Binary data of the image in a Uint8Array.
   */
  data: Uint8Array;
};

/**
 * UI context for audio content.
 */
export type AudioUIContext = {
  /**
   * Specifies the context type as 'audio'.
   */
  type: 'audio';

  /**
   * MIME type of the audio (e.g., 'audio/mp3', 'audio/wav').
   */
  mimeType: 'audio/mp3' | 'audio/wav' | 'audio/ogg';

  /**
   * Binary data of the audio in a Uint8Array.
   */
  data: Uint8Array;
};

/**
 * UI context for generic files.
 */
export type FileUIContext = {
  /**
   * Specifies the context type as 'file'.
   */
  type: 'file';

  /**
   * MIME type of the file.
   */
  mimeType:
    | 'text/plain'
    | 'text/html'
    | 'text/javascript'
    | 'text/css'
    | 'application/json'
    | 'application/pdf'
    | 'application/xml';

  /**
   * Binary data of the file in a Uint8Array.
   */
  data: Uint8Array;
};

/**
 * UI representation for an 'if' condition.
 */
export type IfConditionUI = {
  /**
   * Specifies the context type as 'if'.
   */
  type: 'if';

  /**
   * Optional description of the condition for better readability or documentation.
   */
  description?: string;

  /**
   * Optional metadata holding a serialized rule collection that defines the logical structure of the condition.
   */
  metadata?: SerializedRuleCollection;

  /**
   * Optional source identifier that this condition can obtain the data from.
   */
  source?: string;
};

/**
 * UI representation for an 'else-if' condition.
 */
export type ElseIfConditionUI = {
  /**
   * Specifies the context type as 'else-if'.
   */
  type: 'else-if';

  /**
   * Optional description of the condition, providing insights into the condition's purpose or logic.
   */
  description?: string;

  /**
   * Optional metadata containing a serialized rule collection that specifies the condition logic.
   */
  metadata?: SerializedRuleCollection;

  /**
   * Optional source identifier that this condition can obtain the data from.
   */
  source?: string;
};

/**
 * UI representation for an 'otherwise' or 'else' condition.
 */
export type OtherwiseConditionUI = {
  /**
   * Specifies the context type as 'otherwise'.
   */
  type: 'otherwise';

  /**
   * Optional source identifier that this condition can obtain the data from.
   */
  source?: string;
};

/**
 * Union type for various condition UI elements.
 * This type can be one of `IfConditionUI`, `ElseIfConditionUI`, or `OtherwiseConditionUI`, 
 * representing different parts of a conditional structure in UI context systems.
 */
export type ConditionUI =
  | IfConditionUI
  | ElseIfConditionUI
  | OtherwiseConditionUI;

/**
 * UI context for representing conditions, typically used in conditional rendering or logic scenarios.
 */
export type ConditionUIContext = {
  /**
   * Specifies the context type as 'condition'.
   */
  type: 'condition';

  /**
   * The target variable can obtain data from by the conditions.
   */
  target: string;

  /**
   * Array of source identifiers that influence the conditions, as well as providing its data to any target.
   */
  sources: string[];

  /**
   * An array of conditions, each defined by either an IfConditionUI, ElseIfConditionUI, or OtherwiseConditionUI.
   */
  conditions: ConditionUI[];
};

/**
 * Union type representing different possible UI contexts. Each type defines a specific structure and purpose for displaying information in a user interface.
 * 
 * @extends BaseUIContext Base properties that apply across all UI contexts, such as `fontSize` and `fontFamily`.
 * @property PlainUIContext Plain text display context.
 * @property MarkdownUIContext Context for rendering Markdown text.
 * @property CodeUIContext Context specifically for displaying code, with optional syntax highlighting based on `language`.
 * @property BlobUIContext Context for managing binary large objects like images or files, showing a collection of `ImageUIContext`, `AudioUIContext`, or `FileUIContext`.
 * @property ContextUIContext Container for multiple UI contexts, each possibly of different types.
 * @property MessageUIContext Represents a message in a chat or similar interface.
 * @property ImageUIContext Displays image data with specific MIME types.
 * @property AudioUIContext Plays audio content with specific MIME types.
 * @property FileUIContext Allows interaction with files of specific MIME types.
 * @property ConditionUIContext Represents conditional logic UI, often used in configurable interfaces or workflows.
 */
export type UIContext = BaseUIContext &
  (
    | PlainUIContext
    | MarkdownUIContext
    | CodeUIContext
    | BlobUIContext
    | ContextUIContext
    | MessageUIContext
    | ImageUIContext
    | AudioUIContext
    | FileUIContext
    | ConditionUIContext
  );

/**
 * Represents a tuple of all supported image MIME types used within the system.
 * This tuple is used for validating and handling image data operations, ensuring compatibility and correct processing.
 *
 * - 'image/png': Standard PNG format, useful for images that require transparency.
 * - 'image/jpeg': Commonly used for photographs and other images with gradients.
 * - 'image/gif': Used for images with simple animations.
 * - 'image/svg+xml': Used for vector graphics which are scalable without loss of quality.
 */
export const imageTypes = exhaustiveTuple<ImageUIContext['mimeType']>()(
  'image/png',
  'image/jpeg',
  'image/gif',
  'image/svg+xml'
);

/**
 * Represents a tuple of all supported audio MIME types used within the system.
 * This tuple is crucial for handling audio data operations, such as playback and storage, ensuring that only compatible audio formats are processed.
 *
 * - 'audio/mp3': Standard format for music files, widely supported across all platforms.
 * - 'audio/ogg': Often used for higher quality audio or for applications supporting open formats.
 * - 'audio/wav': Commonly used for uncompressed audio in professional audio editing and archival.
 */
export const audioTypes = exhaustiveTuple<AudioUIContext['mimeType']>()(
  'audio/mp3',
  'audio/ogg',
  'audio/wav'
);

/**
 * Represents a tuple of MIME types for various file formats that the system can handle.
 * This tuple is used to guide file operations like uploads, downloads, and internal file management, ensuring correct handling based on file type.
 *
 * - 'text/plain': Plain text files without any formatting.
 * - 'text/html': HTML files, which are the backbone of web pages.
 * - 'text/javascript': JavaScript files, used in web development.
 * - 'text/css': CSS files, used to style HTML content.
 * - 'application/json': JSON files, commonly used for data interchange.
 * - 'application/pdf': PDF files, widely used for documents that require fixed formatting.
 * - 'application/xml': XML files, used for structured data and various configurations.
 */
export const fileTypes = exhaustiveTuple<FileUIContext['mimeType']>()(
  'text/plain',
  'text/html',
  'text/javascript',
  'text/css',
  'application/json',
  'application/pdf',
  'application/xml'
);

/**
 * Map from `DataType` to `UIContext['type']` providing a linkage between internal data types and the UI contexts they should be rendered with.
 * 
 * This map ensures that data types such as strings, numbers, or complex objects are associated with appropriate UI contexts like code or blob, 
 * facilitating the dynamic rendering of data in a user interface.
 */
export const UIDataTypesMap: Record<DataType, UIContext['type']> = {
  string: 'code',
  number: 'code',
  boolean: 'code',
  object: 'code',
  unknown: 'code',
  blob: 'blob',
  context: 'context',
  'chat-message': 'message',
  'string[]': 'code',
  'number[]': 'code',
  'boolean[]': 'code',
  'object[]': 'code',
  'unknown[]': 'code',
  'blob[]': 'blob',
  'context[]': 'context',
  'chat-message[]': 'message',
};

/**
 * Mapping of MIME types to their corresponding file extensions.
 * This map is used primarily for file operations like downloads and uploads, ensuring that files have the correct extensions based on their MIME type.
 * 
 * Examples include mapping 'text/plain' to 'bin', 'application/json' to 'json', or 'image/jpeg' to 'jpeg'.
 */
export const extMap: Record<
  | ImageUIContext['mimeType']
  | AudioUIContext['mimeType']
  | FileUIContext['mimeType'],
  string
> = {
  'text/plain': 'bin',
  'text/html': 'html',
  'text/javascript': 'js',
  'text/css': 'css',
  'application/json': 'json',
  'application/pdf': 'pdf',
  'application/xml': 'xml',
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/gif': 'gif',
  'image/svg+xml': 'svg',
  'audio/mp3': 'mp3',
  'audio/ogg': 'ogg',
  'audio/wav': 'wav',
};
