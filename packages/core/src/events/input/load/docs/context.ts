/**
 * Defines the structure for inputs used to create a readable context. This interface is for feeding page
 * content and associated metadata into processing workflows.
 *
 * @template Metadata The type for metadata associated with the context, allowing for custom data structures.
 */
export interface ContextInput<Metadata = Record<string, unknown>> {
  /**
   * The main content of the page, typically as a string.
   */
  pageContent: string;

  /**
   * Optional metadata associated with the page content, providing additional information or annotations.
   */
  metadata?: Metadata;
}

/**
 * Represents a single readable context derived from a page of content. This class encapsulates the content
 * and metadata, providing a structured way to handle such information within processing or analytical operations.
 *
 * @template Metadata The type for metadata that augments the page content with additional data or annotations.
 */
export class Context<Metadata = Record<string, unknown>>
  implements ContextInput<Metadata>
{
  /**
   * The content of the page stored as a string.
   */
  pageContent = '';

  /**
   * Metadata associated with the page content, of type Metadata.
   */
  metadata: Metadata;

  /**
   * Constructs a new instance of Context, initializing it with specified page content and optional metadata.
   * @param fields An object containing pageContent and optionally metadata, conforming to ContextInput.
   */
  constructor(fields: ContextInput<Metadata>) {
    this.pageContent = fields.pageContent
      ? fields.pageContent.toString()
      : this.pageContent;
    this.metadata = fields.metadata ?? ({} as Metadata);
  }

  /**
   * Static method to check if a given value is an instance of Context.
   * @param value The value to check.
   * @returns True if the value is an instance of Context, false otherwise.
   */
  static isContext(value: unknown): value is Context {
    return value instanceof Context;
  }
}

/**
 * Represents types that can be treated as a Context. This includes single Context instances,
 * arrays of Context, or strings that could potentially be converted into a Context.
 */
export type ContextLike = Context | Context[] | string;

/**
 * Determines whether a given value qualifies as a ContextLike. This function is used to validate
 * if a value can either be directly used as a Context, converted to one, or is an array of Contexts.
 *
 * @param value The value to evaluate.
 * @returns True if the value is a string, a Context instance, or an array of Context instances; false otherwise.
 */
export function isContextLike(value: unknown): value is ContextLike {
  if (Array.isArray(value)) {
    return value.every((v) => Context.isContext(v));
  }

  return typeof value === 'string' || Context.isContext(value);
}
