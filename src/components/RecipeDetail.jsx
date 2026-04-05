import React, { useEffect, useState, useRef, useCallback } from 'react';

function SectionHeading({ text, cookingMode }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '0.5rem',
      marginTop: '0.5rem', marginBottom: '0.1rem',
    }}>
      <span style={{
        flex: 1, height: '2px', borderRadius: '99px',
        background: cookingMode ? '#3a2a18' : 'var(--peach-light)',
      }} />
      <p style={{
        fontSize: '0.82rem', fontWeight: 900, letterSpacing: '0.04em',
        color: cookingMode ? '#f4a261' : 'var(--peach-dim)',
        whiteSpace: 'nowrap',
      }}>
        {text.replace(/:$/, '')}
      </p>
      <span style={{
        flex: 1, height: '2px', borderRadius: '99px',
        background: cookingMode ? '#3a2a18' : 'var(--peach-light)',
      }} />
    </div>
  );
}

function BulletRow({ text, cookingMode }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: '0.6rem',
      padding: '0.45rem 0.75rem',
      background: cookingMode ? '#2a1a08' : 'var(--surface2)',
      borderRadius: '10px', fontSize: cookingMode ? '1.05rem' : '0.9rem',
      fontWeight: 600, color: cookingMode ? '#fff' : 'var(--text)',
    }}>
      <span style={{ color: '#f4a261', fontWeight: 900, flexShrink: 0, marginTop: '2px' }}>•</span>
      {text}
    </div>
  );
}

export default function RecipeDetail({ recipe, onClose, onEdit, onDelete }) {
  const [cookingMode, setCookingMode]   = useState(false);
  const [wakeLockOn,  setWakeLockOn]    = useState(false);
  const [copied,      setCopied]        = useState(false);
  const [timerSecs,   setTimerSecs]     = useState(5 * 60); // default 5 min
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerDone,   setTimerDone]     = useState(false);
  const wakeLockRef   = useRef(null);
  const timerRef      = useRef(null);

  const ingredients = recipe.ingredients || [];
  const steps       = recipe.steps || [];

  // ── Scroll lock ────────────────────────────────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // ── Wake Lock ──────────────────────────────────────────────────────────────
  async function acquireWakeLock() {
    if (!('wakeLock' in navigator)) return;
    try {
      wakeLockRef.current = await navigator.wakeLock.request('screen');
      wakeLockRef.current.addEventListener('release', () => setWakeLockOn(false));
      setWakeLockOn(true);
    } catch { /* browser may deny */ }
  }

  function releaseWakeLock() {
    if (wakeLockRef.current) {
      wakeLockRef.current.release();
      wakeLockRef.current = null;
    }
    setWakeLockOn(false);
  }

  function toggleCookingMode() {
    if (cookingMode) {
      releaseWakeLock();
      clearInterval(timerRef.current);
      setTimerRunning(false);
    } else {
      acquireWakeLock();
    }
    setCookingMode(v => !v);
  }

  // Re-acquire wake lock if page regains visibility while cooking mode is on
  useEffect(() => {
    if (!cookingMode) return;
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') acquireWakeLock();
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [cookingMode]);

  // Clean up wake lock when modal closes
  useEffect(() => () => { releaseWakeLock(); clearInterval(timerRef.current); }, []);

  // ── Timer ──────────────────────────────────────────────────────────────────
  const tick = useCallback(() => {
    setTimerSecs(s => {
      if (s <= 1) {
        clearInterval(timerRef.current);
        setTimerRunning(false);
        setTimerDone(true);
        return 0;
      }
      return s - 1;
    });
  }, []);

  function startTimer()  {
    setTimerDone(false);
    timerRef.current = setInterval(tick, 1000);
    setTimerRunning(true);
  }
  function pauseTimer()  { clearInterval(timerRef.current); setTimerRunning(false); }
  function resetTimer()  { clearInterval(timerRef.current); setTimerRunning(false); setTimerDone(false); setTimerSecs(5 * 60); }
  function addMinute()   { if (!timerRunning) setTimerSecs(s => s + 60); }
  function subMinute()   { if (!timerRunning) setTimerSecs(s => Math.max(60, s - 60)); }

  async function shareRecipe() {
    const url = `${window.location.origin}${window.location.pathname}?recipe=${recipe.id}`;
    if (navigator.share) {
      try { await navigator.share({ title: recipe.name, text: `❝ ${recipe.quote} ❞ — ${recipe.name}`, url }); } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  const mm  = String(Math.floor(timerSecs / 60)).padStart(2, '0');
  const ss  = String(timerSecs % 60).padStart(2, '0');

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
          background: cookingMode ? '#1a1208' : 'var(--surface)',
          borderRadius: '28px 28px 0 0',
          width: '100%', maxWidth: '640px', margin: '0 auto',
          maxHeight: '92vh', overflowY: 'auto',
          padding: '0 0 3rem',
          transition: 'background 0.4s',
        }}
      >
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '0.875rem 0 0' }}>
          <div style={{ width: '40px', height: '4px', borderRadius: '99px', background: cookingMode ? '#5a3a1a' : 'var(--peach-light)' }} />
        </div>

        {/* Header */}
        <div style={{ padding: '1rem 1.5rem 1rem', borderBottom: `2px solid ${cookingMode ? '#2a1a08' : 'var(--surface2)'}` }}>
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
              {recipe.quote && (
                <p style={{
                  fontSize: '0.9rem', fontStyle: 'italic',
                  color: cookingMode ? '#f4a261' : 'var(--peach)',
                  marginBottom: '0.4rem', lineHeight: 1.4,
                }}>
                  ❝ {recipe.quote} ❞
                </p>
              )}
              <h2 style={{
                fontSize: 'clamp(1.4rem, 5vw, 1.9rem)', fontWeight: 900,
                color: cookingMode ? '#fff' : 'var(--text)',
                lineHeight: 1.2, textAlign: 'right', marginBottom: '0.2rem',
              }}>
                {recipe.name}
              </h2>
              {recipe.author && (
                <p style={{ fontSize: '0.85rem', color: cookingMode ? '#c8a87a' : 'var(--text-mid)', fontWeight: 700 }}>
                  👨‍🍳 {recipe.author}
                </p>
              )}
            </div>
            <button onClick={onClose} style={{
              background: cookingMode ? '#2a1a08' : 'var(--surface2)', borderRadius: '50%',
              width: '36px', height: '36px', fontSize: '1rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, color: cookingMode ? '#f4a261' : 'var(--text-mid)', fontWeight: 900,
            }}>✕</button>
          </div>
        </div>

        {/* ── Cooking mode + Timer toolbar ─────────────────────────────────── */}
        <div style={{
          display: 'flex', gap: '0.6rem', padding: '0.75rem 1.5rem',
          borderBottom: `1.5px solid ${cookingMode ? '#2a1a08' : 'var(--surface2)'}`,
          flexWrap: 'wrap', alignItems: 'center',
        }}>
          {/* Cooking mode toggle */}
          <button
            onClick={toggleCookingMode}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.45rem 1rem', borderRadius: '99px',
              background: cookingMode ? '#f4a261' : 'var(--surface2)',
              color:      cookingMode ? '#fff'    : 'var(--text-mid)',
              fontWeight: 800, fontSize: '0.82rem',
              border: cookingMode ? 'none' : '1.5px solid var(--border)',
              transition: 'all 0.2s',
            }}
          >
            🍳 {cookingMode ? 'מצב בישול פעיל' : 'מצב בישול'}
            {wakeLockOn && <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>• מסך דלוק</span>}
          </button>

          {/* Timer */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.35rem',
            background: cookingMode ? '#2a1a08' : 'var(--bg)',
            borderRadius: '99px', padding: '0.3rem 0.6rem',
            border: `1.5px solid ${timerDone ? '#E8A0A0' : cookingMode ? '#3a2a18' : 'var(--border)'}`,
          }}>
            <span style={{ fontSize: '0.82rem' }}>⏱️</span>

            {/* - min */}
            <button onClick={subMinute} style={{ fontWeight: 900, fontSize: '0.9rem', color: 'var(--text-dim)', padding: '0 0.1rem', lineHeight: 1 }}>−</button>

            {/* Time display */}
            <span style={{
              fontWeight: 900, fontSize: '1rem', fontVariantNumeric: 'tabular-nums',
              color: timerDone ? '#E8A0A0' : cookingMode ? '#f4a261' : 'var(--text)',
              minWidth: '3.2rem', textAlign: 'center',
              animation: timerDone ? 'pulse 0.6s infinite alternate' : 'none',
            }}>
              {mm}:{ss}
            </span>

            {/* + min */}
            <button onClick={addMinute} style={{ fontWeight: 900, fontSize: '0.9rem', color: 'var(--text-dim)', padding: '0 0.1rem', lineHeight: 1 }}>+</button>

            {/* Start / Pause */}
            {!timerRunning ? (
              <button
                onClick={startTimer}
                style={{
                  background: '#7DAF7D', color: '#fff',
                  borderRadius: '99px', padding: '0.2rem 0.6rem',
                  fontWeight: 800, fontSize: '0.75rem',
                }}>▶</button>
            ) : (
              <button
                onClick={pauseTimer}
                style={{
                  background: '#F4A261', color: '#fff',
                  borderRadius: '99px', padding: '0.2rem 0.6rem',
                  fontWeight: 800, fontSize: '0.75rem',
                }}>⏸</button>
            )}

            {/* Reset */}
            <button
              onClick={resetTimer}
              style={{ color: 'var(--text-dim)', fontSize: '0.75rem', padding: '0 0.1rem' }}>↺</button>
          </div>
        </div>

        {/* Ingredients */}
        {ingredients.length > 0 && (
          <section style={{ padding: '1.25rem 1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 900, color: cookingMode ? '#f4a261' : 'var(--peach-dim)', marginBottom: '0.875rem' }}>
              🧂 מרכיבים
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              {ingredients.map((ing, i) =>
                ing.endsWith(':') ? (
                  <SectionHeading key={i} text={ing} cookingMode={cookingMode} />
                ) : (
                  <BulletRow key={i} text={ing} cookingMode={cookingMode} />
                )
              )}
            </div>
          </section>
        )}

        {/* Steps */}
        {steps.length > 0 && (
          <section style={{ padding: '0 1.5rem 1rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 900, color: cookingMode ? '#f4a261' : 'var(--peach-dim)', marginBottom: '0.875rem' }}>
              👩‍🍳 הכנה
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {(() => {
                let stepNum = 0;
                return steps.map((step, i) => {
                  if (step.endsWith(':')) {
                    return <SectionHeading key={i} text={step} cookingMode={cookingMode} />;
                  }
                  stepNum++;
                  return (
                    <div key={i} style={{ display: 'flex', gap: '0.875rem', alignItems: 'flex-start' }}>
                      <span style={{
                        background: '#f4a261', color: '#fff', borderRadius: '50%',
                        width: '28px', height: '28px', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontWeight: 900, fontSize: cookingMode ? '1rem' : '0.8rem',
                        flexShrink: 0, marginTop: '2px',
                      }}>{stepNum}</span>
                      <p style={{
                        fontSize: cookingMode ? '1.1rem' : '0.9rem',
                        color: cookingMode ? '#fff' : 'var(--text)',
                        lineHeight: 1.6, fontWeight: 500, paddingTop: '2px',
                      }}>{step}</p>
                    </div>
                  );
                });
              })()}
            </div>
          </section>
        )}

        {/* Notes / קל קל קל */}
        {recipe.notes && (
          <section style={{ padding: '0 1.5rem 1rem' }}>
            <div style={{
              background: cookingMode ? '#2a1808' : 'var(--yellow-light)',
              borderRadius: '16px', padding: '1rem',
              border: `1.5px solid ${cookingMode ? '#5a3a10' : 'var(--yellow)'}`,
            }}>
              <p style={{ fontSize: '0.82rem', fontWeight: 800, color: '#9A7A20', marginBottom: '0.35rem' }}>💡 קל קל קל</p>
              <p style={{ fontSize: cookingMode ? '1rem' : '0.875rem', color: cookingMode ? '#f4c27a' : 'var(--text)', lineHeight: 1.6 }}>{recipe.notes}</p>
            </div>
          </section>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.75rem', padding: '0.5rem 1.5rem 0', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          {/* Share — always visible */}
          <button onClick={shareRecipe} style={{
            background: copied ? 'var(--sage-light)' : 'var(--sky-light)',
            color: copied ? 'var(--sage)' : 'var(--sky)',
            borderRadius: '99px', padding: '0.55rem 1.25rem',
            fontWeight: 800, fontSize: '0.875rem',
            transition: 'all 0.2s',
            border: `1.5px solid ${copied ? 'var(--sage)' : 'var(--sky)'}30`,
          }}>
            {copied ? '✓ הועתק!' : '🔗 שיתוף'}
          </button>

          {!cookingMode && <>
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
          </>}
        </div>
      </div>
    </div>
  );
}
