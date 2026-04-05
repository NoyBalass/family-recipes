import React, { useEffect } from 'react';

const CATEGORY_EMOJI = {
  'סלטים': '🥗', 'תבשילים': '🍲', 'לחמים חלות ומאפים': '🍞',
  'עוגות עוגיות וקינוחים': '🍰', 'שונות': '🥤', 'קל קל קל': '💡',
};

export default function MissingRecipesModal({ recipes, onClose, onEdit, onDelete }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(61,43,31,0.45)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'flex-end', animation: 'fadeIn 0.2s ease',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="slide-up"
        style={{
          background: 'var(--surface)', borderRadius: '28px 28px 0 0',
          width: '100%', maxWidth: '640px', margin: '0 auto',
          maxHeight: '85vh', display: 'flex', flexDirection: 'column',
        }}
      >
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '0.875rem 0 0', flexShrink: 0 }}>
          <div style={{ width: '40px', height: '4px', borderRadius: '99px', background: 'var(--peach-light)' }} />
        </div>

        {/* Header */}
        <div style={{
          padding: '0.75rem 1.5rem 1rem',
          borderBottom: '2px solid var(--surface2)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexShrink: 0,
        }}>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text)', margin: 0 }}>
              ✍️ מתכונים שצריך להשלים
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600, marginTop: '2px' }}>
              {recipes.length} מתכונים ממתינים לתוכן
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'var(--surface2)', borderRadius: '50%',
              width: '36px', height: '36px', fontSize: '1rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--text-mid)', fontWeight: 900, flexShrink: 0,
            }}>✕</button>
        </div>

        {/* List */}
        <div style={{ overflowY: 'auto', padding: '0.75rem 1rem 2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {recipes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-dim)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎉</div>
              <p style={{ fontWeight: 700 }}>כל המתכונים מלאים!</p>
            </div>
          ) : (
            recipes.map(r => (
              <div key={r.id} style={{
                background: 'var(--bg)', borderRadius: '12px',
                padding: '0.75rem 1rem',
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                border: '1.5px solid var(--border)',
              }}>
                {/* Emoji + info */}
                <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>
                  {CATEGORY_EMOJI[r.category] || '🍽️'}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {r.name}
                  </p>
                  {r.quote && (
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontStyle: 'italic', margin: '1px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      ❝ {r.quote} ❞
                    </p>
                  )}
                  <p style={{ fontSize: '0.72rem', color: 'var(--peach)', fontWeight: 700, margin: '2px 0 0' }}>
                    {r.category}
                  </p>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
                  <button
                    onClick={() => onEdit(r)}
                    style={{
                      background: 'var(--peach-light)', color: 'var(--peach-dim)',
                      borderRadius: '99px', padding: '0.35rem 0.75rem',
                      fontWeight: 800, fontSize: '0.78rem',
                    }}>✏️ עריכה</button>
                  <button
                    onClick={() => {
                      if (window.confirm(`למחוק את "${r.name}"?`)) onDelete(r.id);
                    }}
                    style={{
                      background: 'var(--rose-light)', color: 'var(--rose)',
                      borderRadius: '99px', padding: '0.35rem 0.75rem',
                      fontWeight: 800, fontSize: '0.78rem',
                    }}>🗑️</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
