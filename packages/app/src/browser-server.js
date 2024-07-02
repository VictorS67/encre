let hasInitialized = false;

const importScriptsWithRetry = async (/** @type {string} */ script, { maxRetries = 5 } = {}) => {
  try {
    // @ts-ignore
    importScripts(script);
  } catch (error) {
    // Break if maxRetries has exceeded
    if (maxRetries <= 0) {
      throw error;
    } else {
      console.groupCollapsed(
        `Failed to load backend, will retry ${maxRetries} more time(s)`
      );
      console.log(error);
      console.groupEnd();
    }

    // Attempt to retry after a small delay
    await new Promise((resolve) =>
      setTimeout(async () => {
        await importScriptsWithRetry(script, {
          maxRetries: maxRetries - 1,
        });
        // @ts-ignore
        resolve();
      }, 5000)
    );
  }
};

self.addEventListener("message", async (event) => {
  try {
    if (!hasInitialized) {
      const msg = event.data;

      if (msg.type === "init") {
        hasInitialized = true;
        const isDev = !!msg.isDev;
        // let version = msg.version;
        const hash = msg.hash;

        if (
          !self.SharedArrayBuffer &&
          !msg.isSharedArrayBufferOverrideEnabled
        ) {
          self.postMessage({
            type: "app-init-failure",
            SharedArrayBufferMissing: true,
          });
          return;
        }

        await importScriptsWithRetry(
          `${msg.publicUrl}/kcab/kcab.worker.${hash}.js`,
          { maxRetries: isDev ? 5 : 0 }
        );

        backend.initApp(isDev, self).catch((/** @type {{ message: string | string[]; }} */ err) => {
          console.log(err);
          const msg = {
            type: "app-init-failure",
          };
          self.postMessage(msg);

          throw err;
        });
      }
    }
  } catch (error) {
    console.log("Failed initializing backend:", error);
    self.postMessage({
      type: "app-init-failure",
      BackendInitFailure: true,
    });
  }
});
