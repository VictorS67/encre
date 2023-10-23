import {
  Tiktoken,
  TiktokenBPE,
  TiktokenEncoding,
  TiktokenModel,
  getEncodingNameForModel,
} from 'js-tiktoken/lite';
import { AsyncCaller } from './asyncCaller';

const cache: Record<string, Promise<TiktokenBPE>> = {};

const caller = new AsyncCaller({});

export async function encodingForModel(
  model: TiktokenModel,
  options?: {
    signal?: AbortSignal;
    extendedSpecialTokens?: Record<string, number>;
  }
): Promise<Tiktoken> {
  const encoding: TiktokenEncoding = getEncodingNameForModel(model);

  return getEncoding(encoding, options);
}

export async function getEncoding(
  encoding: TiktokenEncoding,
  options?: {
    signal?: AbortSignal;
    extendedSpecialTokens?: Record<string, number>;
  }
): Promise<Tiktoken> {
  if (!(encoding in cache)) {
    cache[encoding] = caller
      .fetch(`https://tiktoken.pages.dev/js/${encoding}.json`, {
        signal: options?.signal,
      })
      .then((res) => res.json() as unknown as TiktokenBPE)
      .catch((e) => {
        delete cache[encoding];
        throw e;
      });
  }

  return new Tiktoken(await cache[encoding], options?.extendedSpecialTokens);
}

export function getTiktokenModel(modelName: string): TiktokenModel {
  if (modelName.startsWith('gpt-3.5-turbo-16k')) {
    return 'gpt-3.5-turbo-16k';
  }

  if (modelName.startsWith('gpt-3.5-turbo')) {
    return 'gpt-3.5-turbo';
  }

  if (modelName.startsWith('gpt-4-32k')) {
    return 'gpt-4-32k';
  }

  if (modelName.startsWith('gpt-4')) {
    return 'gpt-4';
  }

  return modelName as TiktokenModel;
}
