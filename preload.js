const { contextBridge, webUtils, shell } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getPathForFile: (file) => webUtils.getPathForFile(file)
});

window.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('click', (event) => {
    // Ищем ближайший <a> с href
    let target = event.target;
    while (target && target !== document) {
      if (target.tagName === 'A' && target.href && target.href.startsWith('http')) {
        event.preventDefault();
        console.log('Opening external:', target.href);
        shell.openExternal(target.href);
        break;
      }
      target = target.parentElement;
    }
  });
});
