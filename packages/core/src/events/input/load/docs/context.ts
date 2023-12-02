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
  pageContent: string;

  metadata: Metadata;

  constructor(fields: ContextInput<Metadata>) {
    this.pageContent = fields.pageContent
      ? fields.pageContent.toString()
      : this.pageContent;
    this.metadata = fields.metadata ?? ({} as Metadata);
  }
}

export type ContextLike = Context | Context[] | string;
