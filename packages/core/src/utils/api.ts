import { Agent } from 'http';
import { Stream } from './stream.js';

export type RequestClient = { fetch: Fetch };
export type Headers = Record<string, string | null | undefined>;
export type DefaultQuery = Record<string, string | undefined>;
// // export type KeysEnum<T> = { [P in keyof Required<T>]: true };

type HTTPMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

export type RequestOptions<
  Req extends Record<string, unknown> = Record<string, unknown>,
> = {
  method?: HTTPMethod;
  path?: string;
  query?: Req | undefined;
  body?: Req | undefined;
  headers?: Headers | undefined;

  maxRetries?: number;
  stream?: boolean | undefined;
  timeout?: number;
  httpAgent?: Agent;
  signal?: AbortSignal | undefined | null;
  idempotencyKey?: string;
};

export type Fetch = (
  url: NodeJS.fetch.RequestInfo,
  init?: RequestInit
) => Promise<Response>;

export type FinalRequestOptions<
  Req extends Record<string, unknown> = Record<string, unknown>,
> = RequestOptions<Req> & {
  method: HTTPMethod;
  path: string;
};

type PromiseOrValue<T> = T | Promise<T>;

type APIResponseProps = {
  response: Response;
  options: FinalRequestOptions;
  controller: AbortController;
};

async function defaultParseResponse<T>(props: APIResponseProps): Promise<T> {
  const { response } = props;
  if (props.options.stream) {
    // Note: there is an invariant here that isn't represented in the type system
    // that if you set `stream: true` the response type must also be `Stream<T>`
    return new Stream(response, props.controller) as any;
  }

  const contentType = response.headers.get('content-type');
  if (contentType?.includes('application/json')) {
    const json = await response.json();

    // debug('response', response.status, response.url, response.headers, json);

    return json as T;
  }

  // TODO handle blob, arraybuffer, other content types, etc.
  const text = await response.text();
  // debug('response', response.status, response.url, response.headers, text);
  return text as any as T;
}

export class APIPromise<T> extends Promise<T> {
  private parsedPromise: Promise<T> | undefined;

  constructor(
    private responsePromise: Promise<APIResponseProps>,
    private parseResponse: (
      props: APIResponseProps
    ) => PromiseOrValue<T> = defaultParseResponse
  ) {
    super((resolve) => {
      // this is maybe a bit weird but this has to be a no-op to not implicitly
      // parse the response body; instead .then, .catch, .finally are overridden
      // to parse the response
      resolve(null as any);
    });
  }

  _thenUnwrap<U>(transform: (data: T) => U): APIPromise<U> {
    return new APIPromise(this.responsePromise, async (props) =>
      transform(await this.parseResponse(props))
    );
  }

  /**
   * Gets the raw `Response` instance instead of parsing the response
   * data.
   *
   * If you want to parse the response body but still get the `Response`
   * instance, you can use {@link withResponse()}.
   *
   * 👋 Getting the wrong TypeScript type for `Response`?
   * Try setting `"moduleResolution": "NodeNext"` if you can
   */
  asResponse(): Promise<Response> {
    return this.responsePromise.then((p) => p.response);
  }

  /**
   * Gets the parsed response data and the raw `Response` instance.
   *
   * If you just want to get the raw `Response` instance without parsing it,
   * you can use {@link asResponse()}.
   *
   * 👋 Getting the wrong TypeScript type for `Response`?
   * Try setting `"moduleResolution": "NodeNext"` if you can
   */
  async withResponse(): Promise<{ data: T; response: Response }> {
    const [data, response] = await Promise.all([
      this.parse(),
      this.asResponse(),
    ]);
    return { data, response };
  }

  private parse(): Promise<T> {
    if (!this.parsedPromise) {
      this.parsedPromise = this.responsePromise.then(this.parseResponse);
    }
    return this.parsedPromise;
  }

  override then<TResult1 = T, TResult2 = never>(
    onfulfilled?:
      | ((value: T) => TResult1 | PromiseLike<TResult1>)
      | undefined
      | null,
    onrejected?:
      | ((reason: any) => TResult2 | PromiseLike<TResult2>)
      | undefined
      | null
  ): Promise<TResult1 | TResult2> {
    return this.parse().then(onfulfilled, onrejected);
  }

  override catch<TResult = never>(
    onrejected?:
      | ((reason: any) => TResult | PromiseLike<TResult>)
      | undefined
      | null
  ): Promise<T | TResult> {
    return this.parse().catch(onrejected);
  }

  override finally(onfinally?: (() => void) | undefined | null): Promise<T> {
    return this.parse().finally(onfinally);
  }
}

export abstract class APIClient {
  baseURL: string;
  maxRetries: number;
  timeout: number;
  httpAgent: Agent | undefined;

  private fetch: Fetch;
  protected idempotencyHeader?: string;

  constructor({
    baseURL,
    maxRetries,
    timeout = 600000, // 10 minutes
    httpAgent,
    fetch: overridenFetch,
  }: {
    baseURL: string;
    maxRetries?: number | undefined;
    timeout: number | undefined;
    httpAgent: Agent | undefined;
    fetch: Fetch | undefined;
  }) {
    this.baseURL = baseURL;
    this.maxRetries = maxRetries ?? 2;
    this.timeout = timeout;
    this.httpAgent = httpAgent;

    this.fetch = overridenFetch ?? fetch;
  }

  protected authHeaders(opts: FinalRequestOptions): Headers {
    return {};
  }

  /**
   * Override this to add your own default headers, for example:
   *
   *  {
   *    ...super.defaultHeaders(),
   *    Authorization: 'Bearer 123',
   *  }
   */
  protected defaultHeaders(opts: FinalRequestOptions): Headers {
    return {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      // "User-Agent": this.getUserAgent(),
      ...this.authHeaders(opts),
    };
  }

  protected abstract defaultQuery(): DefaultQuery | undefined;

  /**
   * Override this to add your own headers validation:
   */
  protected validateHeaders(headers: Headers, customHeaders: Headers) {}

  get<Req extends Record<string, unknown>, Rsp>(
    path: string,
    opts?: PromiseOrValue<RequestOptions<Req>>
  ): APIPromise<Rsp> {
    return this.methodRequest('get', path, opts);
  }

  post<Req extends Record<string, unknown>, Rsp>(
    path: string,
    opts?: PromiseOrValue<RequestOptions<Req>>
  ): APIPromise<Rsp> {
    return this.methodRequest('post', path, opts);
  }

  patch<Req extends Record<string, unknown>, Rsp>(
    path: string,
    opts?: PromiseOrValue<RequestOptions<Req>>
  ): APIPromise<Rsp> {
    return this.methodRequest('patch', path, opts);
  }

  put<Req extends Record<string, unknown>, Rsp>(
    path: string,
    opts?: PromiseOrValue<RequestOptions<Req>>
  ): APIPromise<Rsp> {
    return this.methodRequest('put', path, opts);
  }

  delete<Req extends Record<string, unknown>, Rsp>(
    path: string,
    opts?: PromiseOrValue<RequestOptions<Req>>
  ): APIPromise<Rsp> {
    return this.methodRequest('delete', path, opts);
  }

  private methodRequest<Req extends Record<string, unknown>, Rsp>(
    method: HTTPMethod,
    path: string,
    opts?: PromiseOrValue<RequestOptions<Req>>
  ): APIPromise<Rsp> {
    return this.request(
      Promise.resolve(opts).then((opts) => ({ method, path, ...opts }))
    );
  }

  getAPIList<Item, PageClass extends AbstractPage<Item> = AbstractPage<Item>>(
    path: string,
    Page: new (...args: any[]) => PageClass,
    opts?: RequestOptions<any>
  ): PagePromise<PageClass, Item> {
    return this.requestAPIList(Page, { method: 'get', path, ...opts });
  }

  private calculateContentLength(body: unknown): string | null {
    if (typeof body === 'string') {
      if (typeof Buffer !== 'undefined') {
        return Buffer.byteLength(body, 'utf8').toString();
      }

      if (typeof TextEncoder !== 'undefined') {
        const encoder = new TextEncoder();
        const encoded = encoder.encode(body);
        return encoded.length.toString();
      }
    }

    return null;
  }

  buildRequest<Req extends Record<string, unknown>>(
    options: FinalRequestOptions<Req>
  ): { req: RequestInit; url: string; timeout: number } {
    const { method, path, query, headers: headers = {} } = options;

    const body = isMultipartBody(options.body)
      ? options.body.body
      : options.body
      ? JSON.stringify(options.body, null, 2)
      : null;
    const contentLength = this.calculateContentLength(body);

    const url = this.buildURL(path!, query);
    // if ('timeout' in options) validatePositiveInteger('timeout', options.timeout);
    const timeout = options.timeout ?? this.timeout;
    const httpAgent = options.httpAgent ?? this.httpAgent;
    const minAgentTimeout = timeout + 1000;
    if (
      typeof (httpAgent as any)?.options?.timeout === 'number' &&
      minAgentTimeout > ((httpAgent as any).options.timeout ?? 0)
    ) {
      // Allow any given request to bump our agent active socket timeout.
      // This may seem strange, but leaking active sockets should be rare and not particularly problematic,
      // and without mutating agent we would need to create more of them.
      // This tradeoff optimizes for performance.
      (httpAgent as any).options.timeout = minAgentTimeout;
    }

    const reqHeaders: Record<string, string> = {
      ...(contentLength && { 'Content-Length': contentLength }),
      ...this.defaultHeaders(options),
      ...headers,
    };

    // let builtin fetch set the Content-Type for multipart bodies
    if (isMultipartBody(options.body)) {
      delete reqHeaders['Content-Type'];
    }

    // Strip any headers being explicitly omitted with null
    Object.keys(reqHeaders).forEach(
      (key) => reqHeaders[key] === null && delete reqHeaders[key]
    );

    const req: RequestInit = {
      method,
      ...(body && { body: body as any }),
      headers: reqHeaders,
      ...(httpAgent && { agent: httpAgent }),
      // node-fetch uses a custom AbortSignal type that is
      // not compatible with standard web types
      signal: options.signal ?? null,
    };

    this.validateHeaders(reqHeaders, headers);

    return { req, url, timeout };
  }

  /**
   * Used as a callback for mutating the given `RequestInit` object.
   *
   * This is useful for cases where you want to add certain headers based off of
   * the request properties, e.g. `method` or `url`.
   */
  protected async prepareRequest(
    request: RequestInit,
    { url, options }: { url: string; options: FinalRequestOptions }
  ): Promise<void> {}

  protected parseHeaders(
    headers: NodeJS.fetch.HeadersInit | null | undefined
  ): Record<string, string> {
    return !headers
      ? {}
      : Symbol.iterator in headers
      ? Object.fromEntries(
          Array.from(headers as Iterable<string[]>).map((header) => [...header])
        )
      : { ...headers };
  }

  protected makeStatusError(
    status: number | undefined,
    error: unknown | undefined,
    message: string | undefined,
    headers: Headers | undefined
  ) {
    return new Error(message);
  }

  request<Req extends Record<string, unknown>, Rsp>(
    options: PromiseOrValue<FinalRequestOptions<Req>>,
    remainingRetries: number | null = null
  ): APIPromise<Rsp> {
    return new APIPromise(this.makeRequest(options, remainingRetries));
  }

  private async makeRequest(
    optionsInput: PromiseOrValue<FinalRequestOptions>,
    retriesRemaining: number | null
  ): Promise<APIResponseProps> {
    const options = await optionsInput;
    if (retriesRemaining == null) {
      retriesRemaining = options.maxRetries ?? this.maxRetries;
    }

    const { req, url, timeout } = this.buildRequest(options);

    await this.prepareRequest(req, { url, options });

    // debug('request', url, options, req.headers);

    if (options.signal?.aborted) {
      throw new Error('AbortError');
    }

    const controller = new AbortController();
    const response = await this.fetchWithTimeout(
      url,
      req,
      timeout,
      controller
    ).catch((e: any) => {
      if (e instanceof Error) return e;

      return new Error(e);
    });

    if (response instanceof Error) {
      if (options.signal?.aborted) {
        throw new Error('AbortError');
      }
      if (retriesRemaining) {
        return this.retryRequest(options, retriesRemaining);
      }
      if (response.name === 'AbortError') {
        throw new Error('TimeoutError');
      }

      const e = new Error('ConnectionError');
      e.cause = response;
      throw e;
    }

    const responseHeaders = createResponseHeaders(response.headers);

    if (!response.ok) {
      if (retriesRemaining && this.shouldRetry(response)) {
        return this.retryRequest(options, retriesRemaining, responseHeaders);
      }

      const errText = await response
        .text()
        .catch((e: any) => {
          if (e instanceof Error) return e.message;
    
          return new Error(e).message;
        });
      const errJSON = safeJSON(errText);
      const errMessage = errJSON ? undefined : errText;

      // debug("response", response.status, url, responseHeaders, errMessage);

      const err = this.makeStatusError(
        response.status,
        errJSON,
        errMessage,
        responseHeaders
      );
      throw err;
    }

    return { response, options, controller };
  }

  requestAPIList<
    Item = unknown,
    PageClass extends AbstractPage<Item> = AbstractPage<Item>,
  >(
    Page: new (
      ...args: ConstructorParameters<typeof AbstractPage>
    ) => PageClass,
    options: FinalRequestOptions
  ): PagePromise<PageClass, Item> {
    const request = this.makeRequest(options, null);
    return new PagePromise<PageClass, Item>(this, request, Page);
  }

  buildURL<Req extends Record<string, unknown>>(
    path: string,
    query: Req | null | undefined
  ): string {
    const url = isAbsoluteURL(path)
      ? new URL(path)
      : new URL(
          this.baseURL +
            (this.baseURL.endsWith('/') && path.startsWith('/')
              ? path.slice(1)
              : path)
        );

    const defaultQuery = this.defaultQuery();
    if (!isEmptyObj(defaultQuery)) {
      query = { ...defaultQuery, ...query } as Req;
    }

    if (query) {
      url.search = this.stringifyQuery(query);
    }

    return url.toString();
  }

  protected stringifyQuery(query: Record<string, unknown>): string {
    return Object.entries(query)
      .filter(([_, value]) => typeof value !== 'undefined')
      .map(([key, value]) => {
        if (
          typeof value === 'string' ||
          typeof value === 'number' ||
          typeof value === 'boolean'
        ) {
          return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
        }
        if (value === null) {
          return `${encodeURIComponent(key)}=`;
        }
        throw new Error(
          `Cannot stringify type ${typeof value}; Expected string, number, boolean, or null. If you need to pass nested query parameters, you can manually encode them, e.g. { query: { 'foo[key1]': value1, 'foo[key2]': value2 } }, and please open a GitHub issue requesting better support for your use case.`
        );
      })
      .join('&');
  }

  async fetchWithTimeout(
    url: NodeJS.fetch.RequestInfo,
    init: RequestInit | undefined,
    ms: number,
    controller: AbortController
  ): Promise<Response> {
    const { signal, ...options } = init || {};
    if (signal) signal.addEventListener('abort', () => controller.abort());

    const timeout = setTimeout(() => controller.abort(), ms);

    return (
      this.getRequestClient()
        // use undefined this binding; fetch errors if bound to something else in browser/cloudflare
        .fetch.call(undefined, url, {
          signal: controller.signal as any,
          ...options,
        })
        .finally(() => {
          clearTimeout(timeout);
        })
    );
  }

  protected getRequestClient(): RequestClient {
    return { fetch: this.fetch };
  }

  private shouldRetry(response: Response): boolean {
    // Note this is not a standard header.
    const shouldRetryHeader = response.headers.get('x-should-retry');

    // If the server explicitly says whether or not to retry, obey.
    if (shouldRetryHeader === 'true') return true;
    if (shouldRetryHeader === 'false') return false;

    // Retry on request timeouts.
    if (response.status === 408) return true;

    // Retry on lock timeouts.
    if (response.status === 409) return true;

    // Retry on rate limits.
    if (response.status === 429) return true;

    // Retry internal errors.
    if (response.status >= 500) return true;

    return false;
  }

  private async retryRequest(
    options: FinalRequestOptions,
    retriesRemaining: number,
    responseHeaders?: Headers | undefined
  ): Promise<APIResponseProps> {
    retriesRemaining -= 1;

    // About the Retry-After header: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Retry-After
    let timeoutMillis: number | undefined;
    const retryAfterHeader = responseHeaders?.['retry-after'];
    if (retryAfterHeader) {
      const timeoutSeconds = parseInt(retryAfterHeader);
      if (!Number.isNaN(timeoutSeconds)) {
        timeoutMillis = timeoutSeconds * 1000;
      } else {
        timeoutMillis = Date.parse(retryAfterHeader) - Date.now();
      }
    }

    // If the API asks us to wait a certain amount of time (and it's a reasonable amount),
    // just do what it says, but otherwise calculate a default
    if (
      !timeoutMillis ||
      !Number.isInteger(timeoutMillis) ||
      timeoutMillis <= 0 ||
      timeoutMillis > 60 * 1000
    ) {
      const maxRetries = options.maxRetries ?? this.maxRetries;
      timeoutMillis = this.calculateDefaultRetryTimeoutMillis(
        retriesRemaining,
        maxRetries
      );
    }
    await sleep(timeoutMillis);

    return this.makeRequest(options, retriesRemaining);
  }

  private calculateDefaultRetryTimeoutMillis(
    retriesRemaining: number,
    maxRetries: number
  ): number {
    const initialRetryDelay = 0.5;
    const maxRetryDelay = 2;

    const numRetries = maxRetries - retriesRemaining;

    // Apply exponential backoff, but not more than the max.
    const sleepSeconds = Math.min(
      initialRetryDelay * Math.pow(numRetries - 1, 2),
      maxRetryDelay
    );

    // Apply some jitter, plus-or-minus half a second.
    const jitter = Math.random() - 0.5;

    return (sleepSeconds + jitter) * 1000;
  }
}

export class MultipartBody {
  constructor(public body: any) {}
  get [Symbol.toStringTag](): string {
    return 'MultipartBody';
  }
}

export type PageInfo = { url: URL } | { params: Record<string, unknown> | null };

export abstract class AbstractPage<Item> implements AsyncIterable<Item> {
  #client: APIClient;
  protected options: FinalRequestOptions;

  protected response: Response;
  protected body: unknown;

  constructor(
    client: APIClient,
    response: Response,
    body: unknown,
    options: FinalRequestOptions
  ) {
    this.#client = client;
    this.options = options;
    this.response = response;
    this.body = body;
  }

  /**
   * @deprecated Use nextPageInfo instead
   */
  abstract nextPageParams(): Partial<Record<string, unknown>> | null;
  abstract nextPageInfo(): PageInfo | null;

  abstract getPaginatedItems(): Item[];

  hasNextPage(): boolean {
    const items = this.getPaginatedItems();
    if (!items.length) return false;
    return this.nextPageInfo() != null;
  }

  async getNextPage(): Promise<this> {
    const nextInfo = this.nextPageInfo();
    if (!nextInfo) {
      throw new Error(
        'No next page expected; please check `.hasNextPage()` before calling `.getNextPage()`.'
      );
    }
    const nextOptions = { ...this.options };
    if ('params' in nextInfo) {
      nextOptions.query = { ...nextOptions.query, ...nextInfo.params };
    } else if ('url' in nextInfo) {
      const params = [
        ...Object.entries(nextOptions.query || {}),
        ...nextInfo.url.searchParams.entries(),
      ];
      for (const [key, value] of params) {
        nextInfo.url.searchParams.set(key, value as any);
      }
      nextOptions.query = undefined;
      nextOptions.path = nextInfo.url.toString();
    }
    return await this.#client.requestAPIList(
      this.constructor as any,
      nextOptions
    );
  }

  async *iterPages() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let page: AbstractPage<Item> = this;
    yield page;
    while (page.hasNextPage()) {
      page = await page.getNextPage();
      yield page;
    }
  }

  async *[Symbol.asyncIterator]() {
    for await (const page of this.iterPages()) {
      for (const item of page.getPaginatedItems()) {
        yield item;
      }
    }
  }
}

/**
 * This subclass of Promise will resolve to an instantiated Page once the request completes.
 *
 * It also implements AsyncIterable to allow auto-paginating iteration on an unawaited list call, eg:
 *
 *    for await (const item of client.items.list()) {
 *      console.log(item)
 *    }
 */
export class PagePromise<
    PageClass extends AbstractPage<Item>,
    Item = ReturnType<PageClass['getPaginatedItems']>[number],
  >
  extends APIPromise<PageClass>
  implements AsyncIterable<Item>
{
  constructor(
    client: APIClient,
    request: Promise<APIResponseProps>,
    Page: new (...args: ConstructorParameters<typeof AbstractPage>) => PageClass
  ) {
    super(
      request,
      async (props) =>
        new Page(
          client,
          props.response,
          await defaultParseResponse(props),
          props.options
        )
    );
  }

  /**
   * Allow auto-paginating iteration on an unawaited list call, eg:
   *
   *    for await (const item of client.items.list()) {
   *      console.log(item)
   *    }
   */
  async *[Symbol.asyncIterator]() {
    const page = await this;
    for await (const item of page) {
      yield item;
    }
  }
}

export const isMultipartBody = (body: any): body is MultipartBody =>
  body &&
  typeof body === 'object' &&
  body.body &&
  body[Symbol.toStringTag] === 'MultipartBody';

const startsWithSchemeRegexp = new RegExp('^(?:[a-z]+:)?//', 'i');
const isAbsoluteURL = (url: string): boolean => {
  return startsWithSchemeRegexp.test(url);
};

export function isEmptyObj(obj: unknown | null | undefined): boolean {
  if (!obj) return true;
  for (const _k in obj) return false;
  return true;
}

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const createResponseHeaders = (
  headers: Awaited<ReturnType<Fetch>>['headers']
): Record<string, string> => {
  return new Proxy(
    Object.fromEntries(
      headers.entries()
    ),
    {
      get(target, name) {
        const key = name.toString();
        return target[key.toLowerCase()] || target[key];
      },
    }
  );
};

export const safeJSON = (text: string) => {
  try {
    return JSON.parse(text);
  } catch (err) {
    return undefined;
  }
};
