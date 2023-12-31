
import { Context } from "../docs/context.js";
import { Callable } from "../../../../record/callable.js";
import { CallableConfig } from "../../../../record/callable.js";


export interface BaseRetrieverInput {
    callbacks?: any;
    tags?: string[];
    metadata?: Record<string, unknown>;
    verbose?: boolean;
}


export abstract class BaseRetriever extends Callable<string, Context[]> {
  callbacks?: any;

  tags?: string[];

  metadata?: Record<string, unknown>;

  verbose?: boolean;

  constructor(fields?: BaseRetrieverInput) {
    super(fields);
    this.callbacks = fields?.callbacks;
    this.tags = fields?.tags ?? [];
    this.metadata = fields?.metadata ?? {};
    this.verbose = fields?.verbose ?? false;
  }

  _getRelevantContexts(
    _query: string,
    _callbacks?: any
  ): Promise<Context[]> {
    throw new Error("Not implemented!");
  }

  async invoke(input: string, options?: CallableConfig): Promise<Context[]> {
    return this.getRelevantContexts(input, options);
  }

  async getRelevantContexts(
    query: string,
    config?: any
  ): Promise<Context[]> {
    try {
      const results = await this._getRelevantContexts(query);
      return results;
    } catch (error) {
      throw error;
    }
  }
}