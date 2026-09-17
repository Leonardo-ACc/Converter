import React from 'react';

export function FormatSelector({ value, onChange, options }) {
  return (
    <div className="input-group">
      <label>Formato de Saída:</label>
      <select value={value} onChange={onChange}>
        {options.map((fmt) => (
          <option key={fmt} value={fmt}>
            {fmt.toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  );
}