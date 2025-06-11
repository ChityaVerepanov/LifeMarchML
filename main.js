const { app, BrowserWindow, globalShortcut } = require("electron");
const path = require("path");
const url = require("url");
let browserWindow;

function createBrowserWindow() {
  browserWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });
  browserWindow.webContents.setWindowOpenHandler(({url}) => {
    if (url.startsWith('http')) {
      require('electron').shell.openExternal(url);
      return {action: 'deny'};
    }
    return {action: 'allow'};
  });
  browserWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "dist/life-march-ml/browser/index.html"),
      protocol: "file:",
      slashes: true,
    })
  );
  browserWindow.on("closed", () => {
    browserWindow = null;
  });
  browserWindow.webContents.on('will-navigate', (event, url) => {
    // Если пользователь случайно попал на /browser/, перенаправляем на index.html
    if (url.endsWith('/browser/') || url.endsWith('/browser')) {
      event.preventDefault();
      browserWindow.loadURL(
        url.format({
          pathname: path.join(__dirname, "dist/life-march-ml/browser/index.html"),
          protocol: "file:",
          slashes: true,
        })
      );
    }
  });
}

app.on('ready', () => {
  createBrowserWindow();
  globalShortcut.register('CommandOrControl+R', () => {
    if (browserWindow) {
      browserWindow.loadURL(
        url.format({
          pathname: path.join(__dirname, "dist/life-march-ml/browser/index.html"),
          protocol: "file:",
          slashes: true,
        })
      );
    }
  });
});
app.on("activate", () => {
  if (browserWindow === null) {
    createBrowserWindow();
  }
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

