import { v4 as uuidv4 } from "uuid";

import { ServerEvents } from "../events";

import type * as T from ".";

const replyHandlers = new Map();
const listeners = new Map<keyof ServerEvents, ((args: unknown) => void)[]>();

let socketClient: IPCClient | null = null;
let messageQueue: Array<unknown> = [];

/* eslint-disable @typescript-eslint/no-explicit-any */
interface IPCClient {
  on: (name: string, handler: (data: any) => void) => void;
  emit: (name: string, data: any) => void;
}

function connectSocket(onOpen: (value: unknown) => void) {
  global.Encre.ipcConnect(function (client: IPCClient) {
    client.on("message", (data) => {
      const msg = data;

      if (msg.type === "error") {
        const { id } = msg;

        replyHandlers.delete(id);
      } else if (msg.type === "reply") {
        let { result } = msg;
        const { id } = msg;

        if (result && result.type === "Buffer" && Array.isArray(result.data)) {
          result = new Uint8Array(result.data);
        }

        const handler = replyHandlers.get(id);
        if (handler) {
          replyHandlers.delete(id);

          handler.resolve(result);
        }
      } else if (msg.type === "push") {
        const { name, args } = msg;

        const listens = listeners.get(name);
        if (listens) {
          for (let i = 0; i < listens.length; i++) {
            const stop = listens[i](args) as any;
            if (stop === true) {
              break;
            }
          }
        }
      } else {
        throw new Error(`Unknown message type: ${JSON.stringify(msg)}`);
      }
    });

    socketClient = client;

    if (messageQueue.length > 0) {
      messageQueue.forEach((msg) => client.emit("message", msg));
      messageQueue = [];
    }

    onOpen(void 0);
  });
}

export const init: T.Init = async function () {
  return new Promise(connectSocket);
};

export const send: T.Send = function (name, args, options) {
  return new Promise((resolve, reject) => {
    const id = uuidv4();
    replyHandlers.set(id, { resolve, reject });

    if (socketClient) {
      socketClient.emit("message", {
        id,
        name,
        args,
        catchErrors: !!options?.catchErrors,
      });
    } else {
      messageQueue.push({
        id,
        name,
        args,
        catchErrors: options?.catchErrors,
      });
    }
  });
};

export const listen: T.Listen = function <K extends keyof ServerEvents>(
  name: K,
  cb: (args: ServerEvents[K]) => void,
): () => void {
  if (!listeners.get(name)) {
    listeners.set(name, []);
  }
  listeners.get(name)?.push(cb);

  return () => {
    const arr = listeners.get(name);
    if (arr) {
      listeners.set(
        name,
        arr.filter((cb_) => cb_ !== cb),
      );
    }
  };
};

export const unlisten: T.Unlisten = function (name) {
  listeners.set(name as keyof ServerEvents, []);
};
