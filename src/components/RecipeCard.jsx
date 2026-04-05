import React from 'react';

const CATEGORY_COLORS = {
  'סלטים':         { bg: '#E8F5E8', accent: '#7DAF7D', emoji: '🥗' },
  'תבשילים':       { bg: '#FFF0D6', accent: '#F4A261', emoji: '🍲' },
  'לחמים ומאפים':  { bg: '#FFF8E0', accent: '#E8C84A', emoji: '🍞' },
  'קינוחים':       { bg: '#FFE8F0', accent: '#E8A0A0', emoji: '🍰' },
  'ממרחים':        { bg: '#E8F5E8', accent: '#60A060', emoji: '🫙' },
  'שתייה':         { bg: '#E0F4FF', accent: '#A8D1E7', emoji: '☕' },
  'שונות':         { bg: '#F5E8FF', accent: '#C3A8D1', emoji: '🥤' },
  'default':       { bg: '#FFF3E8', accent: '#F4A261', emoji: '🍽️' },
};

function getCategoryStyle(category) {
  return CATEGORY_COLORS[category] || CATEGORY_COLORS['default'];
}

export default function RecipeCard({ recipe, onClick }) {
  const style       = getCategoryStyle(recipe.category);
  const ingredients = recipe.ingredients || [];

  return (
    <div
      onClick={onClick}
      style={{
        background: style.bg,
        borderRadius: '20px',
        padding: '1.25rem 1.4rem',
        boxShadow: 'var(--shadow)',
        cursor: 'pointer',
        transition: 'box-shadow 0.2s, transform 0.2s',
        border: `1.5px solid ${style.accent}30`,
        display: 'flex', flexDirection: 'column', gap: '0.5rem',
      }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-hover)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow)'; e.currentTarget.style.transform = 'none'; }}
    >
      {/* Category badge + emoji */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{
          background: style.accent + '22', color: style.accent,
          borderRadius: '99px', padding: '0.2rem 0.7rem',
          fontSize: '0.73rem', fontWeight: 800,
        }}>
          {recipe.category || 'כללי'}
        </span>
        <span style={{ fontSize: '1.5rem' }}>{style.emoji}</span>
      </div>

      {/* Quote — main hero text */}
      {recipe.quote && (
        <p style={{
          fontSize: 'clamp(1.05rem, 3.5vw, 1.3rem)',
          fontWeight: 900,
          color: 'var(--text)',
          lineHeight: 1.3,
          fontStyle: 'italic',
        }}>
          ❝ {recipe.quote} ❞
        </p>
      )}

      {/* Dish name — subtitle */}
      <p style={{ fontSize: '0.88rem', fontWeight: 700, color: style.accent }}>
        {recipe.name}
      </p>

      {/* Author */}
      {recipe.author && (
        <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: 600 }}>
          👨‍🍳 {recipe.author}
        </p>
      )}

      {/* Ingredients preview pills */}
      {ingredients.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginTop: '0.25rem' }}>
          {ingredients.slice(0, 3).map((ing, i) => (
            <span key={i} style={{
              background: '#ffffff90', borderRadius: '99px',
              padding: '0.15rem 0.55rem', fontSize: '0.72rem',
              fontWeight: 700, color: 'var(--text-mid)',
            }}>
              {ing.length > 20 ? ing.slice(0, 20) + '…' : ing}
            </span>
          ))}
          {ingredients.length > 3 && (
            <span style={{
              background: style.accent + '18', borderRadius: '99px',
              padding: '0.15rem 0.55rem', fontSize: '0.72rem',
              fontWeight: 700, color: style.accent,
            }}>+{ingredients.length - 3}</span>
          )}
        </div>
      )}
    </div>
  );
}
