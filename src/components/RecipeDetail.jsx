import React, { useEffect } from 'react';

export default function RecipeDetail({ recipe, onClose, onEdit, onDelete }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const ingredients = recipe.ingredients || [];
  const steps = recipe.steps || [];

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(61,43,31,0.45)',
        backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'flex-end',
        animation: 'fadeIn 0.2s ease',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="slide-up"
        style={{
          background: 'var(--surface)',
          borderRadius: '28px 28px 0 0',
          width: '100%', maxWidth: '640px', margin: '0 auto',
          maxHeight: '92vh', overflowY: 'auto',
          padding: '0 0 3rem',
        }}
      >
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '0.875rem 0 0' }}>
          <div style={{ width: '40px', height: '4px', borderRadius: '99px', background: 'var(--peach-light)' }} />
        </div>

        {/* Header */}
        <div style={{ padding: '1rem 1.5rem 1.25rem', borderBottom: '2px solid var(--surface2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              {recipe.category && (
                <span style={{
                  display: 'inline-block', background: 'var(--peach-light)',
                  color: 'var(--peach-dim)', borderRadius: '99px',
                  padding: '0.2rem 0.75rem', fontSize: '0.78rem', fontWeight: 800,
                  marginBottom: '0.5rem',
                }}>
                  {recipe.category}
                </span>
              )}

              {/* Quote */}
              {recipe.quote && (
                <p style={{
                  fontSize: '0.85rem', fontStyle: 'italic', color: 'var(--peach)',
                  marginBottom: '0.4rem', lineHeight: 1.4,
                }}>
                  ❝ {recipe.quote} ❞
                </p>
              )}

              <h2 style={{
                fontSize: 'clamp(1.4rem, 5vw, 1.9rem)', fontWeight: 900,
                color: 'var(--text)', lineHeight: 1.2, textAlign: 'right',
                marginBottom: '0.2rem',
              }}>
                {recipe.name}
              </h2>

              {recipe.author && (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-mid)', fontWeight: 700, marginBottom: '0.25rem' }}>
                  👨‍🍳 {recipe.author}
                </p>
              )}

              {recipe.description && (
                <p style={{ color: 'var(--text-mid)', fontSize: '0.9rem', marginTop: '0.4rem', lineHeight: 1.5 }}>
                  {recipe.description}
                </p>
              )}
            </div>
            <button onClick={onClose} style={{
              background: 'var(--surface2)', borderRadius: '50%',
              width: '36px', height: '36px', fontSize: '1rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, color: 'var(--text-mid)', fontWeight: 900,
            }}>✕</button>
          </div>

          {/* Meta */}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.875rem', flexWrap: 'wrap' }}>
            {recipe.prepTime && <MetaBadge emoji="⏱️" label={recipe.prepTime} />}
            {recipe.servings && <MetaBadge emoji="👥" label={`${recipe.servings} מנות`} />}
            {recipe.difficulty && <MetaBadge emoji="📊" label={recipe.difficulty} />}
          </div>
        </div>

        {/* Ingredients */}
        {ingredients.length > 0 && (
          <section style={{ padding: '1.25rem 1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--peach-dim)', marginBottom: '0.875rem' }}>
              🧂 מרכיבים
            </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              {ingredients.map((ing, i) => (
                <li key={i} style={{
                  display: 'flex', alignItems: 'flex-start', gap: '0.6rem',
                  padding: '0.45rem 0.75rem', background: 'var(--surface2)',
                  borderRadius: '10px', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)',
                }}>
                  <span style={{ color: 'var(--peach)', fontWeight: 900, flexShrink: 0, marginTop: '2px' }}>•</span>
                  {ing}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Steps */}
        {steps.length > 0 && (
          <section style={{ padding: '0 1.5rem 1rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--peach-dim)', marginBottom: '0.875rem' }}>
              👩‍🍳 הכנה
            </h3>
            <ol style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {steps.map((step, i) => (
                <li key={i} style={{ display: 'flex', gap: '0.875rem', alignItems: 'flex-start' }}>
                  <span style={{
                    background: 'var(--peach)', color: '#fff', borderRadius: '50%',
                    width: '26px', height: '26px', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontWeight: 900, fontSize: '0.8rem', flexShrink: 0, marginTop: '2px',
                  }}>{i + 1}</span>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text)', lineHeight: 1.6, fontWeight: 500, paddingTop: '2px' }}>{step}</p>
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* Notes */}
        {recipe.notes && (
          <section style={{ padding: '0 1.5rem 1rem' }}>
            <div style={{ background: 'var(--yellow-light)', borderRadius: '16px', padding: '1rem', border: '1.5px solid var(--yellow)' }}>
              <p style={{ fontSize: '0.82rem', fontWeight: 800, color: '#9A7A20', marginBottom: '0.35rem' }}>💡 טיפים והערות</p>
              <p style={{ fontSize: '0.875rem', color: 'var(--text)', lineHeight: 1.6 }}>{recipe.notes}</p>
            </div>
          </section>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.75rem', padding: '0.5rem 1.5rem 0', justifyContent: 'flex-end' }}>
          <button onClick={onEdit} style={{
            background: 'var(--peach-light)', color: 'var(--peach-dim)',
            borderRadius: '99px', padding: '0.55rem 1.25rem',
            fontWeight: 800, fontSize: '0.875rem',
          }}>✏️ עריכה</button>
          <button onClick={() => { if (window.confirm('למחוק את המתכון?')) onDelete(); }} style={{
            background: 'var(--rose-light)', color: 'var(--rose)',
            borderRadius: '99px', padding: '0.55rem 1.25rem',
            fontWeight: 800, fontSize: '0.875rem',
          }}>🗑️ מחיקה</button>
        </div>
      </div>
    </div>
  );
}

function MetaBadge({ emoji, label }) {
  return (
    <span style={{
      display: 'flex', alignItems: 'center', gap: '0.3rem',
      background: 'var(--surface2)', borderRadius: '99px',
      padding: '0.3rem 0.75rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-mid)',
    }}>
      {emoji} {label}
    </span>
  );
}
