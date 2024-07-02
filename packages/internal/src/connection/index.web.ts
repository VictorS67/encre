import { Handlers } from "../handlers";
import { isMutating, runHandler } from "../mutators";
import { ServerEvents } from "../events";

import type * as T from ".";

function getGlobalObject() {
  const obj =
    typeof window !== "undefined"
      ? window
      : typeof self !== "undefined"
        ? self
        : null;

  if (!obj) {
    throw new Error("Cannot get global object");
  }

  return obj as unknown as typeof globalThis & {
    __globalServerChannel: Window | null;
  };
}

getGlobalObject().__globalServerChannel = null;

function coerceError(error: Error) {
  return { type: "InternalError", message: error.message };
}

export const init: T.Init = function (
  channel: Window | number,
  handlers: Handlers,
) {
  const serverChannel = channel as Window;
  getGlobalObject().__globalServerChannel = serverChannel;

  serverChannel.addEventListener(
    "message",
    (e) => {
      const data = e.data;
      const msg = typeof data === "string" ? JSON.parse(data) : data;

      if (msg.type && (msg.type === "init" || msg.type.startsWith("__"))) {
        return;
      }

      const { id, name, args, catchErrors } = msg;

      if (handlers[name as keyof Handlers]) {
        runHandler(handlers[name as keyof Handlers], args, {
          name,
        }).then(
          (result) => {
            serverChannel.postMessage({
              type: "reply",
              id,
              result: catchErrors ? { data: result, error: null } : result,
              mutated: isMutating(handlers[name as keyof Handlers]),
            });
          },
          (nativeError) => {
            const error = coerceError(nativeError);

            if (catchErrors) {
              process.parentPort.postMessage({
                type: "reply",
                id,
                result: { data: null, error },
              });
            } else {
              process.parentPort.postMessage({
                type: "error",
                id,
              });
            }

            if (error.type === "InternalError") {
              console.log(`[Exception] ${nativeError}`);
            }

            if (!catchErrors) {
              send("server-error");
            }
          },
        );
      } else {
        console.warn(`Unknown method: ${name}`);

        serverChannel.postMessage({
          type: "reply",
          id,
          result: null,
          error: { type: "APIError", message: `Unknown method: ${name}` },
        });
      }
    },
    false,
  );

  serverChannel.postMessage({ type: "connect" });
};

export const send: T.Send = function <K extends keyof ServerEvents>(
  type: K,
  args?: ServerEvents[K],
) {
  const { __globalServerChannel } = getGlobalObject();

  if (__globalServerChannel) {
    __globalServerChannel.postMessage({
      type: "push",
      name: type,
      args,
    });
  }
};
