import PQueue from 'p-queue';
import pRetry from 'p-retry';

const STATUS_NO_RETRY = [
  400, // Bad Request
  401, // Unauthorized
  402, // Payment Required
  403, // Forbidden
  404, // Not Found
  405, // Method Not Allowed
  406, // Not Acceptable
  407, // Proxy Authentication Required
  408, // Request Timeout
  409, // Conflict
];

type AsyncFunc<T extends any[], R> = (...args: T) => Promise<R>;

export type AsyncCallError = {
  message?: string;
  name?: string;
  code?: string;
  response?: { status?: number };
  status?: number;
  error?: { code?: string };
};

export interface AsyncCallerParams {
  /**
   * The max number of concurrent calls that can be made.
   * Defaults to `Infinity`.
   */
  maxConcurrency?: number;

  /**
   * The max number of retries that can be made for a single call.
   * Defaults to 7.
   */
  maxRetries?: number;

  /**
   * Custom handler to handle failed attempts
   * @param e Throwed error object
   */
  onFailedAttempt?: (e: AsyncCallError) => any;
}

export interface AsyncCallerCallOptions {
  /**
   * Abort signal for the async call.
   * If provided, the call will be aborted when the signal is aborted.
   */
  signal?: AbortSignal;
}

export class AsyncCaller {
  protected _maxConcurrency: AsyncCallerParams['maxConcurrency'];

  protected _maxRetries: AsyncCallerParams['maxRetries'];

  protected _onFailedAttempt: AsyncCallerParams['onFailedAttempt'];

  private _queue: (typeof import('p-queue'))['default']['prototype'];

  constructor(params: object) {
    const asyncCallerParams = params as AsyncCallerParams;
    this._maxConcurrency = asyncCallerParams.maxConcurrency ?? Infinity;
    this._maxRetries = asyncCallerParams.maxRetries ?? 7;
    this._onFailedAttempt =
      asyncCallerParams.onFailedAttempt ?? baseFailedAttemptHandler;
    this._queue = new PQueue({ concurrency: this._maxConcurrency });
  }

  private _retriableCall<T extends AsyncFunc<any[], any>>(
    callable: T,
    ...args: Parameters<T>
  ): Promise<Awaited<ReturnType<T>>> {
    return pRetry(
      () =>
        callable(...args).catch((e) => {
          if (e instanceof Error) {
            throw e;
          } else {
            throw new Error(e);
          }
        }),
      {
        onFailedAttempt: this._onFailedAttempt,
        retries: this._maxRetries,
        randomize: true,
      }
    );
  }

  call<T extends AsyncFunc<any[], any>>(
    callable: T,
    ...args: Parameters<T>
  ): Promise<Awaited<ReturnType<T>>> {
    return this._queue.add(() => this._retriableCall(callable, ...args), {
      throwOnTimeout: true,
    });
  }

  callWithOptions<T extends AsyncFunc<any[], any>>(
    options: AsyncCallerCallOptions,
    callable: T,
    ...args: Parameters<T>
  ): Promise<Awaited<ReturnType<T>>> {
    if (options.signal) {
      return Promise.race([
        this.call<T>(callable, ...args),
        new Promise<never>((_, reject) => {
          options.signal?.addEventListener('abort', () => {
            reject(new Error('AbortError'));
          });
        }),
      ]);
    }

    return this.call<T>(callable, ...args);
  }

  fetch(
    ...args: Parameters<typeof fetch>
  ): Promise<Awaited<ReturnType<typeof fetch>>> {
    return this.call(() =>
      fetch(...args).then((res: Response) =>
        res.ok ? res : Promise.reject(res)
      )
    );
  }
}

export function baseFailedAttemptHandler(e: AsyncCallError) {
  const isTimeoutError = (err: AsyncCallError): boolean =>
    ['Cancel', 'TimeoutError', 'AbortError'].includes(err.message ?? '');

  const isAbortError = (err: AsyncCallError): boolean =>
    ['TimeoutError', 'AbortError'].includes(err.name ?? '');

  const isConnectionAborted = (err: AsyncCallError): boolean =>
    err.code === 'ECONNABORTED';

  const hasNoRetryStatusCode = (err: AsyncCallError): boolean => {
    const status: number | undefined = err.response?.status ?? err.status;
    return status ? STATUS_NO_RETRY.includes(status) : false;
  };

  const isInsufficientQuotaError = (err: AsyncCallError): boolean =>
    err.error?.code === 'insufficient_quota';

  if (isTimeoutError(e) || isAbortError(e) || isConnectionAborted(e)) {
    throw e as Error;
  }

  if (hasNoRetryStatusCode(e)) {
    throw e as Error;
  }

  if (isInsufficientQuotaError(e)) {
    const err = new Error(e.message);
    err.name = 'InsufficientQuotaError';
    throw err;
  }
}
