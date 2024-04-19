/**
 * Interface for interacting with a readable context.
 */
export interface ContextInput<Metadata = Record<string, unknown>> {
  pageContent: string;

  metadata?: Metadata;
}

/**
 * Class for constructing a readable context with content in one page.
 */
export class Context<Metadata = Record<string, unknown>>
  implements ContextInput<Metadata>
{
  pageContent = '';

  metadata: Metadata;

  constructor(fields: ContextInput<Metadata>) {
    this.pageContent = fields.pageContent
      ? fields.pageContent.toString()
      : this.pageContent;
    this.metadata = fields.metadata ?? ({} as Metadata);
  }

  static isContext(value: unknown): value is Context {
    return value instanceof Context;
  }
}

export type ContextLike = Context | Context[] | string;

export function isContextLike(value: unknown): value is ContextLike {
  if (Array.isArray(value)) {
    return value.every((v) => Context.isContext(v));
  }

  return typeof value === 'string' || Context.isContext(value);
}
