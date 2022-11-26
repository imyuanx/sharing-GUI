const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  emit: (channel, ...args) => ipcRenderer.invoke(channel, ...args),
});
