import React, { useState } from 'react';
import { Header } from './components/Header';
import { PathSelector } from './components/PathSelector';
import { FormatSelector } from './components/FormatSelector';
import { PathAutomatic } from './components/PathAutomatic';
import './App.css';

function App() {
  const [pastaOrigem, setPastaOrigem] = useState('');
  const [pastaDestino, setPastaDestino] = useState('');
  const [criarAutomatico, setCriarAutomatico] = useState(false);
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

  const iniciarConversao = async () => {
    if (!pastaOrigem || (!criarAutomatico && !pastaDestino)) {
      alert('Por favor, selecione as pastas necessárias!');
      return;
    }

    setConvertendo(true);
    setStatus('Iniciando conversão...');

    if (window.electronAPI) {
      const res = await window.electronAPI.converterImagens({
        pastaOrigem,
        pastaDestino: criarAutomatico ? null : pastaDestino,
        formatoSaida
      });

      if (res.sucesso) {
        setStatus(`Sucesso! ${res.convertidos} imagens convertidas em ${formatoSaida.toUpperCase()}.`);
        
        // Atualiza o estado da pasta de destino com o caminho novo (renomeado)
        if (res.pastaDestino) {
          setPastaDestino(res.pastaDestino);
        }
        
      // Abre a pasta recém-criada
        if (window.electronAPI?.abrirPasta) {
          await window.electronAPI.abrirPasta(res.pastaDestino);
        }
      
    } else if (res.jaExiste) {
      // Exibe a mensagem de que já foi feita
      setStatus("A conversão já foi feita!");
      
      // Abre a pasta automaticamente no Windows
      if (window.electronAPI?.abrirPasta) {
        await window.electronAPI.abrirPasta(res.pastaDestino);
      }
    } else {
      setStatus(`Erro: ${res.mensagem}`);
    }

    setConvertendo(false); 
    }
  };

  return (
    <div className="container">
      <Header />

      <main className="form-card">
        {/* Pasta Origem */}
        <PathSelector
          label="Pasta de Origem (onde estão as imagens):"
          path={pastaOrigem}
          onSelect={selecionarPastaOrigem}
        />

        {/* Checkbox Automático */}
        <PathAutomatic
          label="Criar pasta de destino automaticamente"
          checked={criarAutomatico}
          onChange={(e) => setCriarAutomatico(e.target.checked)}
        />

        {/* Esconde a escolha de destino se o automático estiver ativo */}
        {!criarAutomatico && (
          <PathSelector
            label="Pasta de Destino (onde salvar as convertidas):"
            path={pastaDestino}
            onSelect={selecionarPastaDestino}
          />
        )}

        {/* Formato de Saída */}
        <FormatSelector
          value={formatoSaida}
          onChange={(e) => setFormatoSaida(e.target.value)}
          options={formatos}
        />

        {/* Botão de Ação */}
        <button
          type="button"
          className={`btn-convert ${convertendo ? 'disabled' : ''}`}
          onClick={iniciarConversao}
          disabled={convertendo}
        >
          {convertendo ? 'Convertendo...' : 'Converter Imagens em Lote'}
        </button>

        {/* Caixa de Status */}
        {status && <div className="status-box">{status}</div>}
      </main>
    </div>
  );
}

export default App;