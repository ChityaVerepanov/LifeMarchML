const { contextBridge, webUtils, shell } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getPathForFile: (file) => webUtils.getPathForFile(file),
  isElectron: true
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

window.addEventListener('keydown', (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'r') {
    event.preventDefault();
    // Принудительно всегда возвращаем пользователя на index.html#/
    window.location.href = 'index.html#/';
  }
});
