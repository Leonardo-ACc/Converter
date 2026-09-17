import React from 'react';

export function PathSelector({ label, path, onSelect, placeholder = 'Nenhuma pasta selecionada...' }) {
  return (
    <div className="input-group">
      <label>{label}</label>
      <div className="path-selector">
        <input type="text" value={path} readOnly placeholder={placeholder} />
        <button type="button" onClick={onSelect}>Buscar</button>
      </div>
    </div>
  );
}