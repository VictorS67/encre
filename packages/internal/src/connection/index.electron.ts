import { Handlers } from "../handlers";
import { isMutating, runHandler } from "../mutators";
import { ServerEvents } from "../events";

import type * as T from ".";

function coerceError(error: Error) {
  return { type: "InternalError", message: error.message };
}

export const init: T.Init = function (
  channel: Window | number,
  handlers: Handlers,
) {
  process.parentPort.on("message", ({ data }) => {
    const { id, name, args, catchErrors } = data;

    if (handlers[name as keyof Handlers]) {
      runHandler(handlers[name as keyof Handlers], args, {
        name,
      }).then(
        (result) => {
          process.parentPort.postMessage({
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

      const error = new Error(`Unknown server method: ${name}`);
      console.log(`[Exception] ${error}`);

      process.parentPort.postMessage({
        type: "reply",
        id,
        result: null,
        error: { type: "APIError", message: `Unknown method: ${name}` },
      });
    }
  });
};

export const send: T.Send = function <K extends keyof ServerEvents>(
  type: K,
  args?: ServerEvents[K],
) {
  process.parentPort.postMessage({ type: "push", name: type, args });
};
