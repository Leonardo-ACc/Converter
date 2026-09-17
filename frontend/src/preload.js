const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  selecionarPasta: () => ipcRenderer.invoke('dialog:selecionarPasta'),
  
  converterImagens: (dados) => ipcRenderer.invoke('converter:imagens', dados),
  
  abrirPasta: (caminho) => ipcRenderer.invoke('abrir:pasta', caminho)
});