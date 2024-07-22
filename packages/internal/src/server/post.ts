import { fetch } from "./fetch";

function throwIfNotOK(res: Response, text: string) {
  if (res.status !== 200) {
    if (res.status === 500) {
      throw new Error("internal");
    }

    const contentType = res.headers.get("Content-Type");
    if (
      contentType &&
      contentType.toLowerCase().indexOf("application/json") !== -1
    ) {
      const json = JSON.parse(text);
      throw new Error(json.reason);
    }

    throw new Error(text);
  }
}

/* eslint-disable  @typescript-eslint/no-explicit-any */
export async function post(
  url: RequestInfo | URL,
  data: Record<string, unknown>,
  headers: Record<string, string> = {},
  timeout: number | undefined = undefined,
) {
  let text: string;
  let res: Response;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    const signal = timeout ? controller.signal : null;

    console.log(url);
    // console.log(data);

    res = await fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
      signal,
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
    });

    // console.log(res);

    clearTimeout(timeoutId);
    text = await res.text();

    // console.log(text);
  } catch (err) {
    throw new Error("network-failure");
  }

  console.log(`text: ${text}`);

  throwIfNotOK(res, text);

  try {
    res = JSON.parse(text);
  } catch (err) {
    throw new Error("parse-json-error");
  }

  return res as any;
}

export function get(url: RequestInfo | URL, options?: unknown) {
  return fetch(url, options).then((res) => res.text());
}
