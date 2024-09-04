import packageJson from "../package.json";

const backendWorkerUrl = new URL("./browser-server.js", import.meta.url);

const IS_DEV = process.env.NODE_ENV === 'development';
const ENCRE_VERSION = packageJson.version;

/**
 * @type {Worker}
 */
let worker;

function createBackendWorker() {
  worker = new Worker(backendWorkerUrl);

  if (window.SharedArrayBuffer) {
    localStorage.removeItem('SharedArrayBufferOverride');
  }

  worker.postMessage({
    type: 'init',
    version: ENCRE_VERSION,
    isDev: IS_DEV,
    publicUrl: process.env.PUBLIC_URL,
    hash: process.env.REACT_APP_BACKEND_WORKER_HASH,
    isSharedArrayBufferOverrideEnabled: localStorage.getItem(
      'SharedArrayBufferOverride',
    ),
  });
}

createBackendWorker();

// @ts-ignore
global.Encre = {
  IS_DEV,
  ENCRE_VERSION,

  logToTerminal: (/** @type {any} */ ...args) => {
    console.log(...args);
  },

  relaunch: () => {
    window.location.reload();
  },

  saveFile: (/** @type {BlobPart} */ contents, /** @type {string} */ defaultFilename) => {
    const temp = document.createElement('a');
    // @ts-ignore
    temp.style = 'display: none';
    temp.download = defaultFilename;
    temp.rel = 'noopener';

    const blob = new Blob([contents]);
    temp.href = URL.createObjectURL(blob);
    temp.dispatchEvent(new MouseEvent('click'));
  },

  openURLInBrowser: (/** @type {string | URL | undefined} */ url) => {
    window.open(url, '_blank');
  },

  onEventFromMain: () => {},
  applyAppUpdate: () => {},
  updateAppMenu: () => {},

  ipcConnect: () => {},
  getServerSocket: async () => {
    return worker;
  },
}