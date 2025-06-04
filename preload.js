const { contextBridge, webUtils } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getPathForFile: (file) => webUtils.getPathForFile(file)
});
