import React, { useState, useRef, useEffect } from 'react';
import PRODUCTS from './products';
import { getRecommendations } from './api';
import ProductCard from './components/ProductCard';

const SUGGESTIONS = [
  'Phone under $400 with great camera',
  'Budget laptop for students',
  'Best noise-cancelling headphones',
  'Apple ecosystem devices',
  'Fitness tracker under $200',
  'Lightweight laptop for travel',
];

function SuggestionPill({ text, onClick }) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <button
      onClick={() => onClick(text)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'transparent',
        border: `1px solid ${hovered ? '#6366f1' : '#334155'}`,
        color: hovered ? '#a5b4fc' : '#94a3b8',
        padding: '6px 14px', borderRadius: 20,
        fontSize: 13, cursor: 'pointer',
        transition: 'all .15s', fontFamily: 'inherit',
      }}
    >
      {text}
    </button>
  );
}

export default function App() {
  const [query, setQuery]                   = useState('');
  const [loading, setLoading]               = useState(false);
  const [result, setResult]                 = useState(null);
  const [error, setError]                   = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const inputRef = useRef(null);

  const categories = ['All', ...Array.from(new Set(PRODUCTS.map((p) => p.category)))];

  const filteredProducts =
    activeCategory === 'All' ? PRODUCTS : PRODUCTS.filter((p) => p.category === activeCategory);

  const recommendedIds      = result?.ids ?? [];
  const recommendedProducts = recommendedIds.map((id) => PRODUCTS.find((p) => p.id === id)).filter(Boolean);
  const remainingProducts   = filteredProducts.filter((p) => !recommendedIds.includes(p.id));

  async function handleSearch(q) {
    const trimmed = (q || query).trim();
    if (!trimmed) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setActiveCategory('All');
    try {
      const res = await getRecommendations(trimmed);
      setResult(res);
    } catch (e) {
      setError(e.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleSuggestion(text) {
    setQuery(text);
    handleSearch(text);
  }

  useEffect(() => { inputRef.current?.focus(); }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0f1e',
      color: '#e2e8f0',
      fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
    }}>

      {/* ── Header ── */}
      <div style={{
        background: 'linear-gradient(180deg,#0d1117 0%,#0a0f1e 100%)',
        borderBottom: '1px solid #1e293b',
        padding: '28px 24px 24px',
        textAlign: 'center',
      }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <span style={{ fontSize: 26 }}>🛍️</span>
          <span style={{
            fontWeight: 800, fontSize: 22, letterSpacing: '-0.5px',
            background: 'linear-gradient(90deg,#818cf8,#c084fc)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            Product Recommendation System
          </span>
        </div>
        <p style={{ color: '#64748b', fontSize: 14, margin: 0 }}>
          Tell us what you need — our AI finds the best match.
        </p>
        <span style={{
          display: 'inline-block', marginTop: 8,
          background: '#052e16', border: '1px solid #166534',
          color: '#4ade80', fontSize: 11, fontWeight: 700,
          padding: '3px 10px', borderRadius: 20, letterSpacing: 1,
        }}>
          ✦ Powered by Groq AI (LLaMA 3) — Free API
        </span>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '28px 16px' }}>

        {/* ── Search Bar ── */}
        <div style={{
          display: 'flex', gap: 8,
          background: '#1e293b', border: '1.5px solid #334155',
          borderRadius: 12, padding: '6px 6px 6px 16px',
          boxShadow: '0 4px 24px #00000044',
          marginBottom: 16,
        }}>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder='e.g. "I want a phone under $500 with great camera"'
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              color: '#f1f5f9', fontSize: 15, fontFamily: 'inherit', minWidth: 0,
            }}
          />
          <button
            onClick={() => handleSearch()}
            disabled={loading || !query.trim()}
            style={{
              background: loading || !query.trim()
                ? '#334155'
                : 'linear-gradient(135deg,#6366f1,#8b5cf6)',
              color: '#fff', border: 'none', borderRadius: 8,
              padding: '10px 20px', fontWeight: 700, fontSize: 14,
              cursor: loading || !query.trim() ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit', transition: 'opacity .15s', whiteSpace: 'nowrap',
              opacity: !query.trim() ? 0.5 : 1,
            }}
          >
            {loading ? 'Thinking…' : 'Get Recommendations'}
          </button>
        </div>

        {/* ── Suggestion Pills ── */}
        {!result && !loading && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
            {SUGGESTIONS.map((s) => (
              <SuggestionPill key={s} text={s} onClick={handleSuggestion} />
            ))}
          </div>
        )}

        {/* ── Loading ── */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '48px 0', color: '#64748b' }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              border: '3px solid #1e293b', borderTopColor: '#6366f1',
              margin: '0 auto 16px',
              animation: 'spin 0.8s linear infinite',
            }} />
            <p style={{ margin: 0, fontSize: 14 }}>AI is analyzing your preferences…</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
          </div>
        )}

        {/* ── Error ── */}
        {error && (
          <div style={{
            background: '#1e0a0a', border: '1px solid #7f1d1d',
            borderRadius: 10, padding: '14px 18px',
            color: '#fca5a5', marginBottom: 20, fontSize: 14,
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* ── AI Reasoning Banner ── */}
        {result && !loading && (
          <div style={{
            background: 'linear-gradient(135deg,#1e1b4b,#1e293b)',
            border: '1.5px solid #4338ca', borderRadius: 12,
            padding: '14px 18px', marginBottom: 24,
            display: 'flex', alignItems: 'flex-start', gap: 12,
          }}>
            <span style={{ fontSize: 20 }}>🤖</span>
            <div>
              <span style={{ fontWeight: 700, color: '#a5b4fc', fontSize: 13 }}>
                AI Reasoning
              </span>
              <p style={{ margin: '4px 0 0', color: '#cbd5e1', fontSize: 14, lineHeight: 1.5 }}>
                {result.reasoning}
              </p>
              <button
                onClick={() => { setResult(null); setQuery(''); }}
                style={{
                  marginTop: 8, background: 'transparent', border: 'none',
                  color: '#6366f1', fontSize: 12, cursor: 'pointer',
                  padding: 0, fontFamily: 'inherit',
                }}
              >
                ← Start over
              </button>
            </div>
          </div>
        )}

        {/* ── Recommended Products ── */}
        {result && recommendedProducts.length > 0 && (
          <section style={{ marginBottom: 36 }}>
            <h2 style={{
              fontSize: 13, fontWeight: 700, letterSpacing: 2,
              color: '#6366f1', textTransform: 'uppercase', margin: '0 0 14px',
            }}>
              ✦ AI Recommended for You
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))',
              gap: 14,
            }}>
              {recommendedProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} highlighted rank={i + 1} />
              ))}
            </div>
          </section>
        )}

        {/* ── Category Filter ── */}
        {!result && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  background: activeCategory === cat
                    ? 'linear-gradient(135deg,#6366f1,#8b5cf6)'
                    : 'transparent',
                  border: activeCategory === cat ? 'none' : '1px solid #334155',
                  color: activeCategory === cat ? '#fff' : '#64748b',
                  padding: '6px 14px', borderRadius: 20, fontSize: 13,
                  fontWeight: activeCategory === cat ? 700 : 400,
                  cursor: 'pointer', fontFamily: 'inherit', transition: 'all .15s',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* ── All Products ── */}
        <section>
          <h2 style={{
            fontSize: 13, fontWeight: 700, letterSpacing: 2,
            color: '#475569', textTransform: 'uppercase', margin: '0 0 14px',
          }}>
            {result
              ? 'All Products'
              : `${activeCategory === 'All' ? 'All' : activeCategory} Products · ${filteredProducts.length} items`}
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))',
            gap: 14,
          }}>
            {(result ? remainingProducts : filteredProducts).map((p) => (
              <ProductCard key={p.id} product={p} highlighted={false} />
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
