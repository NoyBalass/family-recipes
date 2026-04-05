import React, { useState, useEffect } from 'react';

const CATEGORIES = ['מרקים','סלטים','עיקריות','בשר','עוף','דגים','ירקות','קינוחים','עוגות','אפייה','ממרחים','שתייה','ארוחת בוקר','אחר'];
const DIFFICULTIES = ['קל','בינוני','מתקדם'];

const fieldStyle = {
  width: '100%', background: 'var(--bg)',
  border: '1.5px solid var(--border)', borderRadius: '12px',
  padding: '0.65rem 0.875rem', fontSize: '0.9rem',
  color: 'var(--text)', outline: 'none', direction: 'rtl',
  transition: 'border-color 0.2s',
};

export default function AddEditRecipe({ initial, onSave, onClose }) {
  const [name, setName]             = useState(initial?.name || '');
  const [category, setCategory]     = useState(initial?.category || '');
  const [description, setDesc]      = useState(initial?.description || '');
  const [ingredients, setIngredients] = useState(initial?.ingredients?.join('\n') || '');
  const [steps, setSteps]           = useState(initial?.steps?.join('\n') || '');
  const [notes, setNotes]           = useState(initial?.notes || '');
  const [prepTime, setPrepTime]     = useState(initial?.prepTime || '');
  const [servings, setServings]     = useState(initial?.servings || '');
  const [difficulty, setDifficulty] = useState(initial?.difficulty || '');
  const [saving, setSaving]         = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    await onSave({
      name: name.trim(),
      category,
      description: description.trim(),
      ingredients: ingredients.split('\n').map(s => s.trim()).filter(Boolean),
      steps: steps.split('\n').map(s => s.trim()).filter(Boolean),
      notes: notes.trim(),
      prepTime: prepTime.trim(),
      servings: servings.trim(),
      difficulty,
    });
    setSaving(false);
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(61,43,31,0.45)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'flex-end',
        animation: 'fadeIn 0.2s ease',
      }}
    >
      <form
        onClick={e => e.stopPropagation()}
        onSubmit={handleSubmit}
        className="slide-up"
        style={{
          background: 'var(--surface)', borderRadius: '28px 28px 0 0',
          width: '100%', maxWidth: '640px', margin: '0 auto',
          maxHeight: '92vh', overflowY: 'auto',
          padding: '0 0 3rem', direction: 'rtl',
        }}
      >
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '0.875rem 0 0' }}>
          <div style={{ width: '40px', height: '4px', borderRadius: '99px', background: 'var(--peach-light)' }} />
        </div>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem 1.25rem', borderBottom: '2px solid var(--surface2)' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text)' }}>
            {initial ? '✏️ עריכת מתכון' : '✨ מתכון חדש'}
          </h2>
          <button type="button" onClick={onClose} style={{
            background: 'var(--surface2)', borderRadius: '50%',
            width: '36px', height: '36px', color: 'var(--text-mid)', fontWeight: 900, fontSize: '1rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>✕</button>
        </div>

        <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Name */}
          <div>
            <label style={labelStyle}>שם המתכון *</label>
            <input value={name} onChange={e => setName(e.target.value)}
              placeholder="למשל: עוף בתנור של סבתא"
              required style={fieldStyle}
              onFocus={e => e.target.style.borderColor = 'var(--peach)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>

          {/* Category + Difficulty */}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>קטגוריה</label>
              <select value={category} onChange={e => setCategory(e.target.value)} style={{ ...fieldStyle, appearance: 'none' }}>
                <option value="">בחרי קטגוריה</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>רמת קושי</label>
              <select value={difficulty} onChange={e => setDifficulty(e.target.value)} style={{ ...fieldStyle, appearance: 'none' }}>
                <option value="">בחרי</option>
                {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          {/* Prep time + Servings */}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>⏱️ זמן הכנה</label>
              <input value={prepTime} onChange={e => setPrepTime(e.target.value)}
                placeholder="למשל: 45 דקות" style={fieldStyle}
                onFocus={e => e.target.style.borderColor = 'var(--peach)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>👥 מנות</label>
              <input value={servings} onChange={e => setServings(e.target.value)}
                placeholder="למשל: 4" style={fieldStyle}
                onFocus={e => e.target.style.borderColor = 'var(--peach)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label style={labelStyle}>תיאור קצר</label>
            <textarea value={description} onChange={e => setDesc(e.target.value)}
              placeholder="תיאור קצר של המתכון..." rows={2}
              style={{ ...fieldStyle, resize: 'vertical', lineHeight: 1.5 }}
              onFocus={e => e.target.style.borderColor = 'var(--peach)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>

          {/* Ingredients */}
          <div>
            <label style={labelStyle}>🧂 מרכיבים (שורה לכל מרכיב)</label>
            <textarea value={ingredients} onChange={e => setIngredients(e.target.value)}
              placeholder={'2 כפות שמן זית\n3 שיני שום\n1 ק"ג עוף'} rows={6}
              style={{ ...fieldStyle, resize: 'vertical', lineHeight: 1.6 }}
              onFocus={e => e.target.style.borderColor = 'var(--peach)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>

          {/* Steps */}
          <div>
            <label style={labelStyle}>👩‍🍳 שלבי הכנה (שורה לכל שלב)</label>
            <textarea value={steps} onChange={e => setSteps(e.target.value)}
              placeholder={'מחממים את התנור ל-200 מעלות\nמערבבים את כל המרכיבים\nאופים 45 דקות'} rows={6}
              style={{ ...fieldStyle, resize: 'vertical', lineHeight: 1.6 }}
              onFocus={e => e.target.style.borderColor = 'var(--peach)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>

          {/* Notes */}
          <div>
            <label style={labelStyle}>💡 טיפים והערות</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)}
              placeholder="טיפים, וריאציות, איך לשמור..." rows={3}
              style={{ ...fieldStyle, resize: 'vertical', lineHeight: 1.5 }}
              onFocus={e => e.target.style.borderColor = 'var(--peach)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>

          {/* Submit */}
          <button type="submit" disabled={saving || !name.trim()} style={{
            background: saving ? 'var(--peach-light)' : 'var(--peach)',
            color: saving ? 'var(--peach-dim)' : '#fff',
            borderRadius: '99px', padding: '0.85rem',
            fontWeight: 900, fontSize: '1rem',
            boxShadow: '0 4px 16px rgba(244,162,97,0.4)',
            transition: 'all 0.2s', marginTop: '0.5rem',
          }}>
            {saving ? '⏳ שומר...' : initial ? '💾 שמירת שינויים' : '✨ הוספת מתכון'}
          </button>
        </div>
      </form>
    </div>
  );
}

const labelStyle = {
  display: 'block', fontSize: '0.78rem', fontWeight: 800,
  color: 'var(--text-mid)', marginBottom: '0.35rem', letterSpacing: '0.02em',
};
