import { Handlers } from "../handlers";
import { ServerEvents } from "../events";

export function init(
  channel: Window | number, // in electron the port number, in web the worker
  handlers: Handlers,
): void;
export type Init = typeof init;

export function send<K extends keyof ServerEvents>(
  type: K,
  args?: ServerEvents[K],
): void;
export type Send = typeof send;
