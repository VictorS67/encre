import { EventType, Handler, WildcardHandler } from "mitt";

import * as asyncStorage from "../asyncStorage";
import * as connection from "../connection";
import { ServerEvents } from "../events";
import { Handlers } from "../handlers";
import { app as apiApp } from "../handlers/api/app";
import { app as studioApp } from "../handlers/studio/app";
import { app as serverApp } from "../handlers/server/app";
import { runHandler } from "../mutators";
import { createApp } from "./app";
import { setServer } from "./config";

/* eslint-disable  @typescript-eslint/no-explicit-any */
export const app = createApp<Handlers>();

app.combine(apiApp, studioApp, serverApp);

export async function initApp(isDev: boolean, sockerName: Window | number) {
  await Promise.all([asyncStorage.init()]);

  const url = await asyncStorage.get("server-url");

  setServer(url);

  connection.init(sockerName, app.handlers);

  console.log(`backend is init`);

  if (isDev) {
    global.$send = (name: string, args: any) =>
      runHandler(app.handlers[name], args);
  }
}

export const lib = {
  sendMessage: <K extends keyof ServerEvents>(msg: K, args: ServerEvents[K]) =>
    connection.send(msg, args),
  send: async <K extends keyof Handlers, T extends Handlers[K]>(
    name: K,
    args?: Parameters<T>[0],
  ) => {
    const res = await runHandler(app.handlers[name], args);
    return res;
  },
  on: (
    name: "*",
    func: WildcardHandler<Record<EventType, unknown>> | Handler<unknown>,
  ) => app.events.on(name, func),
};
