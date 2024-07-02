import { ServerEvents } from "src/events";
import { Handlers } from "../handlers";

export function init(socketName: string): Promise<unknown>;
export type Init = typeof init;

export function send<K extends keyof Handlers>(
  name: K,
  args?: Parameters<Handlers[K]>[0],
  options?: { catchErrors: true },
): ReturnType<
  | { data: Handlers[K] }
  | { error: { type: "APIError" | "InternalError"; message: string } }
>;
export function send<K extends keyof Handlers>(
  name: K,
  args?: Parameters<Handlers[K]>[0],
  options?: { catchErrors: true },
): ReturnType<Handlers[K]>;
export type Send = typeof send;

export function listen<K extends keyof ServerEvents>(
  name: K,
  cb: (args: ServerEvents[K]) => void,
): () => void;
export type Listen = typeof listen;

export function unlisten(name: string): void;
export type Unlisten = typeof unlisten;
