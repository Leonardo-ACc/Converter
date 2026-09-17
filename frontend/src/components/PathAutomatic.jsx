import React from 'react';

export function PathAutomatic({ label, checked = false, onChange }) {
  return (
    <div className="input-group checkbox-group">
      <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
        <input 
          type="checkbox" 
          checked={checked} 
          onChange={onChange} 
        />
        <span>{label}</span>
      </label>
    </div>
  );
}