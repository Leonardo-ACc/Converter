import React, { useState } from 'react';
import { Header } from './components/Header';
import './App.css';

function App() {
  const [pastaOrigem, setPastaOrigem] = useState('');
  const [pastaDestino, setPastaDestino] = useState('');
  const [formatoSaida, setFormatoSaida] = useState('png');
  const [status, setStatus] = useState('');
  const [convertendo, setConvertendo] = useState(false);

  const formatos = ['jpg', 'jpeg', 'png', 'jfif', 'bmp', 'tiff', 'webp', 'gif', 'pdf'];

  const selecionarPastaOrigem = async () => {
    if (window.electronAPI) {
      const path = await window.electronAPI.selecionarPasta();
      if (path) setPastaOrigem(path);
    }
  };

  const selecionarPastaDestino = async () => {
    if (window.electronAPI) {
      const path = await window.electronAPI.selecionarPasta();
      if (path) setPastaDestino(path);
    }
  };

  const iniciarConversao = () => {
    if (!pastaOrigem || !pastaDestino) {
      alert('Por favor, selecione as pastas de origem e destino!');
      return;
    }

    setConvertendo(true);
    setStatus('Iniciando conversão em massa...');

    if (window.electronAPI) {
      window.electronAPI.converterImagens({
        pastaOrigem,
        pastaDestino,
        formatoSaida
      });
    }
  };

  return (
    <div className="container">
      {/* Componente Header importado */}
      <Header />

      <main className="form-card">
        {/* Pasta Origem */}
        <div className="input-group">
          <label>Pasta de Origem (onde estão as imagens):</label>
          <div className="path-selector">
            <input type="text" value={pastaOrigem} readOnly placeholder="Nenhuma pasta selecionada..." />
            <button type="button" onClick={selecionarPastaOrigem}>Buscar</button>
          </div>
        </div>

        {/* Pasta Destino */}
        <div className="input-group">
          <label>Pasta de Destino (onde salvar as convertidas):</label>
          <div className="path-selector">
            <input type="text" value={pastaDestino} readOnly placeholder="Nenhuma pasta selecionada..." />
            <button type="button" onClick={selecionarPastaDestino}>Buscar</button>
          </div>
        </div>

        {/* Formato */}
        <div className="input-group">
          <label>Formato de Saída:</label>
          <select value={formatoSaida} onChange={(e) => setFormatoSaida(e.target.value)}>
            {formatos.map((fmt) => (
              <option key={fmt} value={fmt}>
                {fmt.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        {/* Botão */}
        <button
          type="button"
          className={`btn-convert ${convertendo ? 'disabled' : ''}`}
          onClick={iniciarConversao}
          disabled={convertendo}
        >
          {convertendo ? 'Convertendo...' : 'Converter Imagens em Lote'}
        </button>

        {/* Status */}
        {status && <div className="status-box">{status}</div>}
      </main>
    </div>
  );
}

export default App;