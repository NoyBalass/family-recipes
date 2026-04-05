import React from 'react';

export default function Header({ search, onSearch, onAdd }) {
  return (
    <header style={{
      background: 'var(--surface)',
      borderBottom: '2px solid var(--peach-light)',
      padding: '1rem 1.25rem',
      position: 'sticky', top: 0, zIndex: 50,
      boxShadow: '0 2px 16px rgba(244,162,97,0.1)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', maxWidth: '640px', margin: '0 auto' }}>
        {/* Title */}
        <div style={{ flex: 1 }}>
          <h1 style={{
            fontSize: '1.3rem', fontWeight: 900, color: 'var(--peach-dim)',
            lineHeight: 1, margin: 0,
          }}>
            📖 ספר המתכונים
          </h1>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 600, marginTop: '1px' }}>
            של המשפחה 💛
          </p>
        </div>

        {/* Search */}
        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', right: '0.65rem', top: '50%', transform: 'translateY(-50%)', fontSize: '0.85rem' }}>🔍</span>
          <input
            type="text"
            value={search}
            onChange={e => onSearch(e.target.value)}
            placeholder="חיפוש מתכון..."
            style={{
              background: 'var(--bg)', border: '1.5px solid var(--border)',
              borderRadius: '99px', padding: '0.45rem 2rem 0.45rem 0.9rem',
              fontSize: '0.875rem', color: 'var(--text)', outline: 'none',
              width: '140px', transition: 'border-color 0.2s, width 0.3s',
              direction: 'rtl',
            }}
            onFocus={e => { e.target.style.borderColor = 'var(--peach)'; e.target.style.width = '180px'; }}
            onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.width = '140px'; }}
          />
        </div>

        {/* Add button */}
        <button
          onClick={onAdd}
          style={{
            background: 'var(--peach)', color: '#fff',
            borderRadius: '99px', padding: '0.5rem 1rem',
            fontWeight: 800, fontSize: '0.875rem',
            boxShadow: '0 2px 12px rgba(244,162,97,0.4)',
            transition: 'all 0.2s', flexShrink: 0,
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--peach-dim)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--peach)'}
        >
          + מתכון
        </button>
      </div>
    </header>
  );
}
