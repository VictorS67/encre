import { createClient, createCluster } from 'redis';
import { Generation } from '../events/output/provide/generation.js';
import {
  ChatGeneration,
  MessageGeneration,
  deserializeMessageGeneration,
  serializeMessageGeneration,
} from '../events/output/provide/message.js';
import {
  BaseCache,
  getCacheKey,
} from './base.js';

type RedisClientType =
  | ReturnType<typeof createClient>
  | ReturnType<typeof createCluster>;

export abstract class RedisCache extends BaseCache {
  protected _client: RedisClientType;

  constructor(client: RedisClientType) {
    super();
    this._client = client;
  }

  abstract lookup(keysStr: string[]): Promise<Generation[] | null>;

  abstract update(keysStr: string[], value: Generation[]): Promise<void>;
}

export class MessageRedisCache extends RedisCache {
  public async lookup(
    keysStr: string[]
  ): Promise<(MessageGeneration | ChatGeneration)[] | null> {
    let idx = 0;
    let key: string = getCacheKey(keysStr.concat(String(idx)));
    let value: string | null = await this._client.get(key);

    const generations: (MessageGeneration | ChatGeneration)[] = [];
    while (value) {
      const serializedMessageGeneration = JSON.parse(value);
      generations.push(
        deserializeMessageGeneration(serializedMessageGeneration)
      );

      idx += 1;
      key = getCacheKey(keysStr.concat(String(idx)));
      value = await this._client.get(key);
    }

    return generations.length > 0 ? generations : null;
  }

  public async update(
    keysStr: string[],
    value: (MessageGeneration | ChatGeneration)[]
  ): Promise<void> {
    for (let i = 0; i < value.length; i += 1) {
      const key: string = getCacheKey(keysStr.concat(String(i)));
      await this._client.set(
        key,
        JSON.stringify(serializeMessageGeneration(value[i]))
      );
    }
  }
}
