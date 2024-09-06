import {
  Tiktoken,
  TiktokenBPE,
  TiktokenEncoding,
  TiktokenModel,
  getEncodingNameForModel,
} from 'js-tiktoken/lite';
import { AsyncCaller } from './asyncCaller.js';

const cache: Record<string, Promise<TiktokenBPE>> = {};

const caller = new AsyncCaller({});

export async function getNumTokens(
  text: string,
  model: string
) {
  // fallback for calulating text's tokens
  // 1 token ~= 4 chars in English
  if (text.length === 0) {
    return 0;
  }

  let numTokens: number = Math.ceil(text.length / 4);

  let token: Tiktoken | undefined;
  try {
    token = await encodingForModel(getTiktokenModel(model));
  } catch (e) {
    console.warn(
      `Failed to calculate correct number of tokens, now we use 1 token ~= 4 chars in English for approximate token calculation: ${e}`
    );
  }

  if (token) {
    numTokens = token.encode(text).length;
  }

  return numTokens;
}

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
