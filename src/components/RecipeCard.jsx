import React from 'react';

const CATEGORY_COLORS = {
  'מרקים':       { bg: '#FFF0D6', accent: '#F4A261', emoji: '🍲' },
  'סלטים':       { bg: '#E8F5E8', accent: '#7DAF7D', emoji: '🥗' },
  'עיקריות':     { bg: '#F5E8FF', accent: '#C3A8D1', emoji: '🍖' },
  'בשר':         { bg: '#FFE8E8', accent: '#E8A0A0', emoji: '🥩' },
  'עוף':         { bg: '#FFF8E0', accent: '#F7D070', emoji: '🍗' },
  'דגים':        { bg: '#E0F4FF', accent: '#A8D1E7', emoji: '🐟' },
  'ירקות':       { bg: '#E8F5E8', accent: '#7DAF7D', emoji: '🥦' },
  'קינוחים':     { bg: '#FFE8F0', accent: '#E8A0A0', emoji: '🍰' },
  'עוגות':       { bg: '#FFF0D6', accent: '#F4A261', emoji: '🎂' },
  'אפייה':       { bg: '#FFF0D6', accent: '#F4A261', emoji: '🥖' },
  'ממרחים':      { bg: '#E8F5E8', accent: '#7DAF7D', emoji: '🫙' },
  'שתייה':       { bg: '#E0F4FF', accent: '#A8D1E7', emoji: '🥤' },
  'ארוחת בוקר': { bg: '#FFF8E0', accent: '#F7D070', emoji: '🍳' },
  'default':     { bg: '#FFF3E8', accent: '#F4A261', emoji: '🍽️' },
};

function getCategoryStyle(category) {
  return CATEGORY_COLORS[category] || CATEGORY_COLORS['default'];
}

export default function RecipeCard({ recipe, onClick, active }) {
  const style = getCategoryStyle(recipe.category);
  const ingredients = recipe.ingredients || [];

  return (
    <div
      onClick={onClick}
      className={active ? 'scale-in' : ''}
      style={{
        background: style.bg,
        borderRadius: '24px',
        padding: '1.75rem',
        boxShadow: active ? 'var(--shadow-hover)' : 'var(--shadow)',
        cursor: 'pointer',
        transition: 'box-shadow 0.3s, transform 0.3s',
        transform: active ? 'scale(1)' : 'scale(0.97)',
        opacity: active ? 1 : 0.85,
        border: `2px solid ${active ? style.accent + '50' : 'transparent'}`,
        minHeight: '320px',
        display: 'flex', flexDirection: 'column',
      }}
      onMouseEnter={e => { if (active) e.currentTarget.style.transform = 'scale(1.01)'; }}
      onMouseLeave={e => { if (active) e.currentTarget.style.transform = 'scale(1)'; }}
    >
      {/* Category badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <span style={{
          background: style.accent + '25', color: style.accent,
          borderRadius: '99px', padding: '0.3rem 0.875rem',
          fontSize: '0.78rem', fontWeight: 800,
          border: `1.5px solid ${style.accent}40`,
        }}>
          {recipe.category || 'כללי'}
        </span>
        <span style={{ fontSize: '2rem' }}>{style.emoji}</span>
      </div>

      {/* Recipe name */}
      <h2 style={{
        fontSize: 'clamp(1.4rem, 5vw, 2rem)', fontWeight: 900,
        color: 'var(--text)', lineHeight: 1.2, marginBottom: '0.5rem',
        textAlign: 'right',
      }}>
        {recipe.name}
      </h2>

      {/* Description */}
      {recipe.description && (
        <p style={{
          color: 'var(--text-mid)', fontSize: '0.9rem', lineHeight: 1.5,
          marginBottom: '1.25rem', display: '-webkit-box',
          WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {recipe.description}
        </p>
      )}

      {/* Ingredients preview */}
      {ingredients.length > 0 && (
        <div style={{ marginTop: 'auto' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 800, color: style.accent, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            🧂 מרכיבים עיקריים
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
            {ingredients.slice(0, 5).map((ing, i) => (
              <span key={i} style={{
                background: '#ffffff80', borderRadius: '99px',
                padding: '0.2rem 0.65rem', fontSize: '0.78rem',
                fontWeight: 700, color: 'var(--text-mid)',
                border: '1.5px solid #ffffff',
              }}>
                {ing}
              </span>
            ))}
            {ingredients.length > 5 && (
              <span style={{
                background: style.accent + '20', borderRadius: '99px',
                padding: '0.2rem 0.65rem', fontSize: '0.78rem',
                fontWeight: 700, color: style.accent,
              }}>
                +{ingredients.length - 5}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Tap hint */}
      <p style={{ textAlign: 'center', color: style.accent + 'AA', fontSize: '0.75rem', fontWeight: 700, marginTop: '1.25rem' }}>
        לחצי לצפייה במתכון המלא ↗
      </p>
    </div>
  );
}
