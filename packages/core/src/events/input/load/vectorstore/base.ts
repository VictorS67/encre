import { Serializable } from '../../../../load/serializable.js';
import { Context } from '../docs/context.js';

export interface BaseVectorStoreField {}

export abstract class BaseVectorStore
  extends Serializable
  implements BaseVectorStoreField
{
  declare FilterType: object | string;

  _isSerializable = false;

  _namespace: string[] = [
    'events',
    'input',
    'load',
    'vectorstore',
    this._vectorstoreType(),
  ];

  constructor(fields?: Partial<BaseVectorStoreField>) {
    super(fields);
  }

  abstract _vectorstoreType(): string;

  abstract addVectors(
    embeddings: number[][],
    context: Context[],
    options?: Record<string, unknown>
  ): Promise<void>;

  abstract deleteVectors(params?: Record<string, unknown>): Promise<void>;

  abstract similaritySearch(
    query: number[],
    topK: number,
    filter?: this['FilterType']
  ): Promise<[Context, number][]>;

  abstract maxMarginalRelevanceSearch(
    query: number[],
    topK: number,
    lambda: number,
    filter?: this['FilterType']
  ): Promise<[Context, number][]>;
}
