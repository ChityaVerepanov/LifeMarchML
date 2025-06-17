const { app, BrowserWindow, globalShortcut, Menu } = require("electron");
const path = require("path");
const url = require("url");
const isMac = process.platform === 'darwin';
let browserWindow;

function createBrowserWindow() {
  browserWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // --- Меню ---
  const template = [
    // App menu для macOS
    ...(isMac ? [{
      label: app.name,
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'quit' } // <-- пункт выхода
      ]
    }] : []),
    {
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'CmdOrCtrl+R',
          click: () => {
            if (browserWindow) {
              browserWindow.loadURL(
                url.format({
                  pathname: path.join(__dirname, "dist/life-march-ml/browser/index.html"),
                  protocol: "file:",
                  slashes: true,
                })
              );
            }
          }
        },
        // ... другие пункты меню
      ]
    },
    // File menu для Windows/Linux
    ...(!isMac ? [{
      label: 'File',
      submenu: [
        { role: 'quit' } // <-- пункт выхода
      ]
    }] : [])
  ];
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
  // --- конец меню ---

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
  browserWindow.webContents.on('before-input-event', (event, input) => {
    if (
      (input.control || input.meta) &&
      input.key.toLowerCase() === 'r'
    ) {
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
