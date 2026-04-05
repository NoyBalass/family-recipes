import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from './firebase';
import RecipeCard from './components/RecipeCard';
import RecipeDetail from './components/RecipeDetail';
import AddEditRecipe from './components/AddEditRecipe';
import Header from './components/Header';
import LandingPanel from './components/LandingPanel';

const PAGE_SIZE = 12;

export default function App() {
  const [recipes, setRecipes]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [category, setCategory] = useState('הכל');
  const [selected, setSelected] = useState(null);
  const [editing, setEditing]   = useState(null);
  const [showAdd, setShowAdd]   = useState(false);
  const [page, setPage]         = useState(0);

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

  const categories    = ['הכל', ...Array.from(new Set(recipes.map(r => r.category).filter(Boolean)))];
  const totalMissing  = recipes.filter(r =>
    r.category !== 'קל קל קל' &&
    (!r.ingredients || r.ingredients.length === 0) &&
    (!r.steps || r.steps.length === 0)
  ).length;

  const filtered = recipes.filter(r => {
    const matchCat = category === 'הכל' || r.category === category;
    const q = search.trim();
    const matchSearch = !q ||
      r.name?.includes(q) ||
      r.ingredients?.some(i => i.includes(q)) ||
      r.description?.includes(q);
    return matchCat && matchSearch;
  });

  useEffect(() => { setPage(0); }, [search, category]);

  const totalPages  = Math.ceil(filtered.length / PAGE_SIZE);
  const pageRecipes = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div dir="rtl" style={{ minHeight: '100vh', background: 'var(--bg)', paddingBottom: '4rem' }}>
      <Header
        search={search}
        onSearch={setSearch}
        onAdd={() => { setEditing(null); setShowAdd(true); }}
      />

      <LandingPanel
        recipes={recipes}
        categories={categories}
        category={category}
        onCategoryChange={setCategory}
        totalMissing={totalMissing}
        onAdd={() => { setEditing(null); setShowAdd(true); }}
      />

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
          {/* Results count */}
          <p style={{ textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.8rem', fontWeight: 700, padding: '0.25rem 0' }}>
            {filtered.length} מתכונים
          </p>

          {/* 2-column grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '0.85rem',
            padding: '0.75rem 1rem 1rem',
          }}>
            {pageRecipes.map(recipe => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onClick={() => setSelected(recipe)}
              />
            ))}
          </div>

          {/* Prev / Next pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', padding: '0.5rem 1rem 1rem' }}>
              <button
                onClick={() => { setPage(p => p - 1); window.scrollTo(0, 0); }}
                disabled={page === 0}
                style={{
                  background: page === 0 ? 'var(--surface2)' : 'var(--peach)',
                  color: page === 0 ? 'var(--text-dim)' : '#fff',
                  borderRadius: '99px', padding: '0.5rem 1.25rem',
                  fontWeight: 800, fontSize: '1rem',
                  opacity: page === 0 ? 0.4 : 1,
                  cursor: page === 0 ? 'default' : 'pointer',
                  transition: 'all 0.2s',
                }}>
                ▶
              </button>
              <span style={{ fontWeight: 700, color: 'var(--text-mid)', fontSize: '0.85rem' }}>
                {page + 1} / {totalPages}
              </span>
              <button
                onClick={() => { setPage(p => p + 1); window.scrollTo(0, 0); }}
                disabled={page === totalPages - 1}
                style={{
                  background: page === totalPages - 1 ? 'var(--surface2)' : 'var(--peach)',
                  color: page === totalPages - 1 ? 'var(--text-dim)' : '#fff',
                  borderRadius: '99px', padding: '0.5rem 1.25rem',
                  fontWeight: 800, fontSize: '1rem',
                  opacity: page === totalPages - 1 ? 0.4 : 1,
                  cursor: page === totalPages - 1 ? 'default' : 'pointer',
                  transition: 'all 0.2s',
                }}>
                ◀
              </button>
            </div>
          )}
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
