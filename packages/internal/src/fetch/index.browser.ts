import { v4 as uuidv4 } from "uuid";

import { ServerEvents } from "../events";

import type * as T from ".";

const replyHandlers = new Map();
const listeners = new Map<keyof ServerEvents, ((args: unknown) => void)[]>();

let messageQueue: Array<unknown> | null = [];
let globalWorker: MessagePort | null = null;

/* eslint-disable @typescript-eslint/no-explicit-any */
function handleMessage(msg: any) {
  if (msg.type === "error") {
    const { id } = msg;

    replyHandlers.delete(id);
  } else if (msg.type === "reply") {
    const { id, result } = msg;

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
    if (!msg.type.startsWith("__")) {
      throw new Error(`Unknown message type: ${JSON.stringify(msg)}`);
    }
  }
}

function connectWorker(
  worker: MessagePort,
  onOpen: any,
  onError: (reason?: any) => void,
) {
  globalWorker = worker;

  console.log("worker is connecting");

  worker.onmessage = (event) => {
    const msg = event.data;

    console.log(`worker is posting message: ${JSON.stringify(msg)}`);

    if (msg.type === "connect") {
      if (messageQueue && messageQueue.length > 0) {
        messageQueue.forEach((msg) => worker.postMessage(msg));
        messageQueue = null;
      }

      onOpen();
    } else if (msg.type === "app-init-failure") {
      onError(msg);
    } else {
      handleMessage(msg);
    }
  };

  console.log(worker);

  if (worker instanceof MessagePort) {
    console.log("worker is starting");

    worker.start();
  }
}

export const init: T.Init = async function (worker) {
  return new Promise((resolve, reject) =>
    connectWorker(worker as unknown as MessagePort, resolve, reject),
  );
};

export const send: T.Send = function (name, args, options) {
  return new Promise((resolve, reject) => {
    const id = uuidv4();

    replyHandlers.set(id, { resolve, reject });
    const message = {
      id,
      name,
      args,
      catchErrors: options?.catchErrors,
    };

    console.log(`send message: ${JSON.stringify(message)}`);

    console.log(`globalWorker is posting message: ${JSON.stringify(message)}`);

    globalWorker?.postMessage(message);

    // if (messageQueue) {
    //   messageQueue.push(message);
    // } else {
    //   console.log(`globalWorker is posting message: ${JSON.stringify(message)}`);

    //   globalWorker?.postMessage(message);
    // }
  });
};

export const listen: T.Listen = function (name, cb) {
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
