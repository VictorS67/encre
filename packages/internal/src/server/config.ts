import * as fs from "../fs";

type ServerConfig = {
  BASE_SERVER: string;
  API_SERVER: string;
};

let config: ServerConfig | null = null;

function joinURL(base: string | URL, ...paths: string[]): string {
  const url = new URL(base);
  url.pathname = fs.join(...paths);
  return url.toString();
}

export function setServer(url: string): void {
  if (url == null) {
    config = null;
  } else {
    config = getServer(url);
  }
}

export function getServer(url?: string): ServerConfig | null {
  if (url) {
    return {
      BASE_SERVER: url,
      API_SERVER: joinURL(url, "/api/v1"),
    };
  }
  return config;
}
