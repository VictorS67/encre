import { app, BrowserWindow } from "electron";
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

  mainWindow.loadURL(process.env.ELECTRON_START_URL || "http://localhost:3000");

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
