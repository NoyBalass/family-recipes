import React, { useState } from 'react';

const CATEGORY_COLORS = {
  'סלטים':                    { emoji: '🥗', accent: '#7DAF7D' },
  'תבשילים':                   { emoji: '🍲', accent: '#F4A261' },
  'לחמים חלות ומאפים':         { emoji: '🍞', accent: '#E8C84A' },
  'עוגות עוגיות וקינוחים':     { emoji: '🍰', accent: '#E8A0A0' },
  'שונות':                     { emoji: '🥤', accent: '#C3A8D1' },
  'קל קל קל':                  { emoji: '💡', accent: '#A8D1E7' },
  'הכל':                       { emoji: '📖', accent: '#F4A261' },
};

const INSTRUCTIONS = [
  { icon: '🔍', title: 'חיפוש מתכון', text: 'הקלידי בשורת החיפוש בראש המסך את שם המתכון, שם מצרך, או שם בן משפחה — התוצאות יופיעו מיד.' },
  { icon: '📂', title: 'סינון לפי קטגוריה', text: 'לחצי על אחת הקטגוריות (סלטים, תבשילים וכו׳) כדי לראות רק את המתכונים מאותה קטגוריה.' },
  { icon: '➕', title: 'הוספת מתכון חדש', text: 'לחצי על הכפתור הכתום "+ מתכון" בפינה השמאלית של הכותרת. מלאי את הפרטים ולחצי "שמור".' },
  { icon: '✏️', title: 'עריכת מתכון קיים', text: 'לחצי על כרטיס המתכון כדי לפתוח אותו, ואז לחצי על "עריכה". ערכי את מה שצריך ולחצי "שמור".' },
  { icon: '🗑️', title: 'מחיקת מתכון', text: 'פתחי את המתכון ולחצי על "מחיקה". תופיע הודעת אישור לפני המחיקה.' },
  { icon: '📄', title: 'מעבר בין עמודים', text: 'המתכונים מוצגים 12 בכל עמוד. לחצי על ◀ ▶ בתחתית העמוד כדי לעבור הלאה או אחורה.' },
];

export default function LandingPanel({
  recipes, categories, category, onCategoryChange, totalMissing, onAdd, onShowMissing,
}) {
  const [showInstructions, setShowInstructions] = useState(false);

  const totalReal = recipes.filter(r => r.category !== 'קל קל קל').length;

  return (
    <div style={{ padding: '1rem 1rem 0.5rem', maxWidth: '680px', margin: '0 auto' }}>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
        <StatCard emoji="📖" value={totalReal} label="מתכונים בספר" accent="#F4A261" />
        <StatCard emoji="✍️" value={totalMissing} label="עוד צריך להוסיף" accent="#E8A0A0" onClick={onShowMissing} clickable />
      </div>

      {/* Category pills */}
      <div style={{
        display: 'flex', gap: '0.5rem',
        overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none',
        paddingBottom: '0.25rem', marginBottom: '0.75rem',
      }}>
        {categories.map(cat => {
          const c      = CATEGORY_COLORS[cat] || CATEGORY_COLORS['הכל'];
          const active = category === cat;
          return (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.35rem',
                padding: '0.4rem 0.9rem', borderRadius: '99px',
                fontSize: '0.82rem', fontWeight: 700, whiteSpace: 'nowrap',
                transition: 'all 0.2s',
                background: active ? c.accent : 'var(--surface)',
                color:      active ? '#fff'   : 'var(--text-mid)',
                border:     active ? 'none'   : '1.5px solid var(--border)',
                boxShadow:  active ? `0 2px 10px ${c.accent}55` : 'var(--shadow)',
              }}>
              <span>{c.emoji}</span>
              {cat}
            </button>
          );
        })}
      </div>

      {/* Add recipe button (large, inviting) */}
      <button
        onClick={onAdd}
        style={{
          width: '100%', padding: '0.75rem',
          background: 'var(--peach)', color: '#fff',
          borderRadius: '14px', fontWeight: 800, fontSize: '1rem',
          boxShadow: '0 3px 14px rgba(244,162,97,0.4)',
          transition: 'all 0.2s', marginBottom: '0.85rem',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'var(--peach-dim)'}
        onMouseLeave={e => e.currentTarget.style.background = 'var(--peach)'}
      >
        ✏️ הוספת מתכון חדש לספר
      </button>

      {/* Instructions accordion */}
      <div style={{
        background: 'var(--surface)', borderRadius: '14px',
        border: '1.5px solid var(--border)', overflow: 'hidden',
        marginBottom: '0.5rem',
      }}>
        <button
          onClick={() => setShowInstructions(v => !v)}
          style={{
            width: '100%', padding: '0.8rem 1rem',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-mid)',
          }}
        >
          <span>❓ איך משתמשים באפליקציה?</span>
          <span style={{
            fontSize: '0.75rem', transition: 'transform 0.2s',
            display: 'inline-block',
            transform: showInstructions ? 'rotate(180deg)' : 'none',
          }}>▼</span>
        </button>

        {showInstructions && (
          <div style={{ padding: '0 1rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {INSTRUCTIONS.map(({ icon, title, text }) => (
              <div key={title} style={{
                background: 'var(--bg)', borderRadius: '10px',
                padding: '0.65rem 0.875rem',
                borderRight: '3px solid var(--peach-light)',
              }}>
                <p style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text)', marginBottom: '0.2rem' }}>
                  {icon} {title}
                </p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-mid)', lineHeight: 1.5 }}>{text}</p>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

function StatCard({ emoji, value, label, accent, onClick, clickable }) {
  return (
    <div
      onClick={onClick}
      style={{
        flex: 1, background: 'var(--surface)', borderRadius: '14px',
        padding: '0.875rem 1rem', border: `1.5px solid ${accent}30`,
        display: 'flex', flexDirection: 'column', gap: '0.2rem',
        cursor: clickable ? 'pointer' : 'default',
        transition: clickable ? 'transform 0.15s, box-shadow 0.15s' : undefined,
        boxShadow: 'var(--shadow)',
      }}
      onMouseEnter={e => { if (clickable) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-hover)'; }}}
      onMouseLeave={e => { if (clickable) { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow)'; }}}
    >
      <span style={{ fontSize: '1.4rem' }}>{emoji}</span>
      <span style={{ fontSize: '1.6rem', fontWeight: 900, color: accent, lineHeight: 1 }}>{value}</span>
      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)' }}>
        {label}{clickable && value > 0 ? ' ←' : ''}
      </span>
    </div>
  );
}
