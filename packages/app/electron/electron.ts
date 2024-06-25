import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import url from "url";

let mainWindow: Electron.BrowserWindow | null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // if (process.env.REACT_APP_ENV === "local") {
  //   mainWindow.loadURL(`http://localhost:3000`);
  // } else {
  //   mainWindow.loadURL(
  //     url.format({
  //       pathname: path.join(__dirname, "../index.html"),
  //       protocol: "file:",
  //       slashes: true,
  //     })
  //   );
  // }

  mainWindow.loadURL(process.env.ELECTRON_START_URL || "http://localhost:8080");
  // mainWindow.loadFile(path.join(__dirname, "public", "index.html"));

  // ipcMain.handle("globalNodeRegistry", async (event, arg) => {
  //   const encre = await import("@encrejs/core");

  //   return encre.globalNodeRegistry;
  // });

  ipcMain.handle("nodeCreateDynamic", async (event, arg) => {
    const encre = await import("@encrejs/core");

    const { nodeType, nodeSubType, registerArgs } = arg as {
      nodeType: string;
      nodeSubType: string;
      registerArgs?: string;
    };

    return encre.globalNodeRegistry.createDynamic(
      nodeType,
      nodeSubType,
      registerArgs ? JSON.parse(registerArgs) : undefined
    );
  });

  mainWindow.webContents.on("before-input-event", (_, input) => {
    if (input.type === "keyDown" && input.key === "F12") {
      mainWindow?.webContents.isDevToolsOpened()
        ? mainWindow?.webContents.closeDevTools()
        : mainWindow?.webContents.openDevTools({ mode: "left" });
    }
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
