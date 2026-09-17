const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  const startUrl = process.env.ELECTRON_START_URL || `file://${path.join(__dirname, '../dist/index.html')}`;
  win.loadURL(startUrl);
}

// ---------------------------------------------------------
// IPC HANDLERS (Ficam no escopo global, fora de createWindow)
// ---------------------------------------------------------

// 1. Seleção de Pastas/Arquivos via Dialog
ipcMain.handle('dialog:selecionarPasta', async () => {
  const result = await dialog.showOpenDialog(win, { 
    properties: ['openDirectory', 'openFile'],
    filters: [
      { name: 'Imagens e Pastas', extensions: ['png', 'jpg', 'jpeg', 'webp', 'bmp', 'pdf'] }
    ]
  });
  return result.canceled ? null : result.filePaths[0];
});

// 2. Handler para abrir a pasta no Explorador de Arquivos
ipcMain.handle('abrir:pasta', async (event, caminhoPasta) => {
  if (caminhoPasta) {
    spawn('explorer.exe', [caminhoPasta]);
  }
});

// 3. Chamada do Script Python (Ajustado canal para 'converter:imagens')
ipcMain.handle('converter:imagens', async (event, dados) => {
  return new Promise((resolve) => {
    const scriptPath = path.resolve(__dirname, '../../backend/Conversor_IMAGENS.py');

    const pythonProcess = spawn('python', [
      scriptPath,
      dados.pastaOrigem,
      dados.pastaDestino || 'null',
      dados.formatoSaida
    ]);

    let resultData = '';
    let errorData = '';

    pythonProcess.stdout.on('data', (data) => {
      resultData += data.toString('utf-8');
    });

    pythonProcess.stderr.on('data', (data) => {
      errorData += data.toString('utf-8');
    });

    pythonProcess.on('close', () => {
      if (errorData && !resultData) {
        return resolve({ sucesso: false, mensagem: `Erro no Python: ${errorData}` });
      }

      try {
        const parsed = JSON.parse(resultData.trim());
        resolve(parsed);
      } catch (e) {
        resolve({
          sucesso: false,
          mensagem: `Erro ao processar JSON. Saída recebida: "${resultData}"`
        });
      }
    });

    pythonProcess.on('error', (err) => {
      resolve({ sucesso: false, mensagem: `Falha ao iniciar Python: ${err.message}` });
    });
  });
});

// ---------------------------------------------------------
// CICLO DE VIDA DO ELECTRON
// ---------------------------------------------------------

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});