// src/components/Drawing/DrawingItem.jsx
// The drawing dataUrl covers the full viewport.
// It's positioned at (item.x, item.y) in wall-space = (-offsetX, -offsetY) when saved.
// So it renders EXACTLY where the user drew it. No extra transforms needed.
export default function DrawingItem({ item, style }) {
  const src = item.dataUrl || item.url;
  if (!src) return null;
  return (
    <div style={{ ...S.wrap, ...style }}>
      <img
        src={src}
        alt="graffiti"
        style={S.img}
        draggable={false}
      />
      {/* Author tag bottom-left */}
      <div style={{ ...S.tag, borderColor: item.authorColor || 'var(--red)' }}>
        <span style={{ color: item.authorColor }}>▮</span>{' '}{item.author}
      </div>
    </div>
  );
}

const S = {
  wrap: {
    display: 'inline-block',
    position: 'absolute',
    pointerEvents: 'none',
  },
  img: {
    display: 'block',
    // Exact viewport size — no scaling
    width: '100vw',
    height: '100vh',
    maxWidth: 'none',
    maxHeight: 'none',
    objectFit: 'none',
    objectPosition: 'top left',
    pointerEvents: 'none',
    mixBlendMode: 'screen',
  },
  tag: {
    fontFamily: 'var(--font-body)',
    fontSize: 9,
    color: 'var(--paper)',
    letterSpacing: 1,
    padding: '2px 6px',
    background: 'rgba(11,11,11,0.7)',
    display: 'inline-block',
    borderLeft: '2px solid',
    position: 'absolute',
    bottom: 4,
    left: 4,
    whiteSpace: 'nowrap',
    pointerEvents: 'none',
  },
};
