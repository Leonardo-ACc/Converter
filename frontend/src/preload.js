const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // 1. Abre a janela nativa do Windows para escolher pastas
  selecionarPasta: () => ipcRenderer.invoke('dialog:selecionarPasta'),
  
  // 2. Envia as pastas e o formato selecionados para o Electron rodar o Python
  converterImagens: (dados) => ipcRenderer.send('executar-conversao', dados),
  
  // 3. Recebe as atualizações de texto do Python para exibir na tela do React
  aoAtualizarStatus: (callback) => ipcRenderer.on('status-conversao', (event, value) => callback(value))
});