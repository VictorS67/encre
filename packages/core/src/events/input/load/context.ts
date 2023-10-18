export type ContextMetadata = Record<string, unknown>;

/**
 * Interface for interacting with a readable context.
 */
export interface ContextInput<ContextMetadata = Record<string, unknown>> {
  pageContent: string;

  metadata?: ContextMetadata;
}

/**
 * Class for constructing a readable context with content in one page.
 */
export class Context<ContextMetadata = Record<string, unknown>>
  implements ContextInput<ContextMetadata>
{
  pageContent: string;

  metadata: ContextMetadata;

  constructor(fields: ContextInput<ContextMetadata>) {
    this.pageContent = fields.pageContent
      ? fields.pageContent.toString()
      : this.pageContent;
    this.metadata = fields.metadata ?? ({} as ContextMetadata);
  }
}
