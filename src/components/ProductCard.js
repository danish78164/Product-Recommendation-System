import React from 'react';

function StarRating({ rating }) {
  return (
    <span style={{ color: '#f59e0b', fontSize: 13, letterSpacing: 1 }}>
      {'★'.repeat(Math.round(rating))}{'☆'.repeat(5 - Math.round(rating))}
      <span style={{ color: '#94a3b8', fontFamily: 'monospace', marginLeft: 4 }}>{rating}</span>
    </span>
  );
}

export default function ProductCard({ product, highlighted, rank }) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: highlighted
          ? 'linear-gradient(135deg,#0f172a 0%,#1e293b 100%)'
          : '#1e293b',
        border: highlighted ? '1.5px solid #6366f1' : '1.5px solid #334155',
        borderRadius: 14,
        padding: '18px 20px',
        position: 'relative',
        transition: 'transform .18s, box-shadow .18s',
        transform: hovered ? 'translateY(-3px)' : 'none',
        boxShadow: hovered
          ? '0 8px 32px #00000055'
          : highlighted
          ? '0 0 24px #6366f144'
          : 'none',
        cursor: 'default',
      }}
    >
      {highlighted && rank && (
        <span style={{
          position: 'absolute', top: -10, left: 14,
          background: 'linear-gradient(90deg,#6366f1,#8b5cf6)',
          color: '#fff', fontSize: 11, fontWeight: 700,
          padding: '2px 10px', borderRadius: 20, letterSpacing: 1,
        }}>
          #{rank} PICK
        </span>
      )}

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <span style={{ fontSize: 32, lineHeight: 1 }}>{product.img}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
            <span style={{ fontWeight: 700, fontSize: 15, color: '#f1f5f9', lineHeight: 1.3 }}>
              {product.name}
            </span>
            <span style={{
              fontFamily: 'monospace', fontWeight: 800, fontSize: 16,
              color: highlighted ? '#a5b4fc' : '#cbd5e1', whiteSpace: 'nowrap',
            }}>
              ${product.price}
            </span>
          </div>
          <div style={{ marginTop: 4 }}>
            <StarRating rating={product.rating} />
          </div>
          <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            <span style={{
              background: '#0f172a', border: '1px solid #334155',
              color: '#94a3b8', fontSize: 11, padding: '2px 8px', borderRadius: 20,
            }}>
              {product.category}
            </span>
            {product.tags.slice(0, 3).map((tag) => (
              <span key={tag} style={{
                background: highlighted ? '#1e1b4b' : '#0f172a',
                border: `1px solid ${highlighted ? '#4338ca' : '#334155'}`,
                color: highlighted ? '#a5b4fc' : '#64748b',
                fontSize: 11, padding: '2px 8px', borderRadius: 20,
              }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
