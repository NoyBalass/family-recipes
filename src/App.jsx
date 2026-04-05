import React, { useState, useEffect, useRef } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from './firebase';
import RecipeCard from './components/RecipeCard';
import RecipeDetail from './components/RecipeDetail';
import AddEditRecipe from './components/AddEditRecipe';
import Header from './components/Header';

export default function App() {
  const [recipes, setRecipes]           = useState([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState('');
  const [category, setCategory]         = useState('הכל');
  const [selected, setSelected]         = useState(null);
  const [editing, setEditing]           = useState(null);
  const [showAdd, setShowAdd]           = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragStartX, setDragStartX]     = useState(null);
  const [dragDeltaX, setDragDeltaX]     = useState(0);
  const [isDragging, setIsDragging]     = useState(false);

  async function loadRecipes() {
    setLoading(true);
    try {
      const q = query(collection(db, 'recipes'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setRecipes(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch {
      const snap = await getDocs(collection(db, 'recipes'));
      setRecipes(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }
    setLoading(false);
  }

  useEffect(() => { loadRecipes(); }, []);

  async function saveRecipe(data) {
    if (editing) {
      await updateDoc(doc(db, 'recipes', editing.id), { ...data, updatedAt: new Date().toISOString() });
    } else {
      await addDoc(collection(db, 'recipes'), { ...data, createdAt: new Date().toISOString() });
    }
    await loadRecipes();
    setShowAdd(false);
    setEditing(null);
  }

  async function deleteRecipe(id) {
    await deleteDoc(doc(db, 'recipes', id));
    setSelected(null);
    await loadRecipes();
  }

  const categories = ['הכל', ...Array.from(new Set(recipes.map(r => r.category).filter(Boolean)))];

  const filtered = recipes.filter(r => {
    const matchCat = category === 'הכל' || r.category === category;
    const q = search.trim();
    const matchSearch = !q ||
      r.name?.includes(q) ||
      r.ingredients?.some(i => i.includes(q)) ||
      r.description?.includes(q);
    return matchCat && matchSearch;
  });

  useEffect(() => { setCurrentIndex(0); }, [search, category]);

  function onPointerDown(clientX) {
    setDragStartX(clientX);
    setIsDragging(true);
    setDragDeltaX(0);
  }
  function onPointerMove(clientX) {
    if (!isDragging || dragStartX === null) return;
    setDragDeltaX(clientX - dragStartX);
  }
  function onPointerUp() {
    if (!isDragging) return;
    const threshold = 60;
    if (dragDeltaX > threshold && currentIndex > 0) setCurrentIndex(i => i - 1);
    else if (dragDeltaX < -threshold && currentIndex < filtered.length - 1) setCurrentIndex(i => i + 1);
    setIsDragging(false);
    setDragStartX(null);
    setDragDeltaX(0);
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingBottom: '3rem' }}>
      <Header
        search={search}
        onSearch={setSearch}
        onAdd={() => { setEditing(null); setShowAdd(true); }}
      />

      {/* Category pills */}
      <div style={{
        display: 'flex', gap: '0.5rem', padding: '1rem 1.25rem 0.75rem',
        overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none',
      }}>
        {categories.map(cat => (
          <button key={cat} onClick={() => setCategory(cat)} style={{
            padding: '0.4rem 1rem', borderRadius: '99px', fontSize: '0.875rem',
            fontWeight: 700, whiteSpace: 'nowrap', transition: 'all 0.2s',
            background: category === cat ? 'var(--peach)' : 'var(--surface)',
            color: category === cat ? '#fff' : 'var(--text-mid)',
            boxShadow: category === cat ? '0 2px 12px rgba(244,162,97,0.35)' : 'var(--shadow)',
            border: category === cat ? 'none' : '1.5px solid var(--border)',
          }}>
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '5rem 1rem', color: 'var(--text-dim)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>⏳</div>
          <p style={{ fontWeight: 700 }}>טוען מתכונים...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 1rem', color: 'var(--text-dim)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🍽️</div>
          <p style={{ fontWeight: 700, fontSize: '1.05rem' }}>לא נמצאו מתכונים</p>
          <p style={{ fontSize: '0.875rem', marginTop: '0.3rem' }}>נסי לחפש משהו אחר</p>
        </div>
      ) : (
        <>
          <div style={{ textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.82rem', fontWeight: 700, padding: '0.5rem 0 0.25rem' }}>
            {currentIndex + 1} / {filtered.length}
          </div>

          {/* Swipeable slider */}
          <div
            onMouseDown={e => onPointerDown(e.clientX)}
            onMouseMove={e => onPointerMove(e.clientX)}
            onMouseUp={onPointerUp}
            onMouseLeave={onPointerUp}
            onTouchStart={e => onPointerDown(e.touches[0].clientX)}
            onTouchMove={e => onPointerMove(e.touches[0].clientX)}
            onTouchEnd={onPointerUp}
            style={{
              overflow: 'hidden', padding: '0.75rem 1.25rem 1.25rem',
              userSelect: 'none', touchAction: 'pan-y',
              cursor: isDragging ? 'grabbing' : 'grab',
            }}
          >
            <div style={{
              display: 'flex',
              transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.4,0,0.2,1)',
              transform: `translateX(calc(${currentIndex * -100}% + ${dragDeltaX}px))`,
            }}>
              {filtered.map((recipe, i) => (
                <div key={recipe.id} style={{ minWidth: '100%', flexShrink: 0, padding: '0 0.25rem' }}>
                  <RecipeCard
                    recipe={recipe}
                    onClick={() => setSelected(recipe)}
                    active={i === currentIndex}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Dot indicators */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', paddingTop: '0.25rem' }}>
            {filtered.slice(0, 30).map((_, i) => (
              <button key={i} onClick={() => setCurrentIndex(i)} style={{
                width: i === currentIndex ? '22px' : '7px', height: '7px',
                borderRadius: '99px', padding: 0,
                background: i === currentIndex ? 'var(--peach)' : 'var(--peach-light)',
                transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
              }} />
            ))}
          </div>
        </>
      )}

      {selected && (
        <RecipeDetail
          recipe={selected}
          onClose={() => setSelected(null)}
          onEdit={() => { setEditing(selected); setSelected(null); setShowAdd(true); }}
          onDelete={() => deleteRecipe(selected.id)}
        />
      )}
      {(showAdd || editing) && (
        <AddEditRecipe
          initial={editing}
          onSave={saveRecipe}
          onClose={() => { setShowAdd(false); setEditing(null); }}
        />
      )}
    </div>
  );
}
