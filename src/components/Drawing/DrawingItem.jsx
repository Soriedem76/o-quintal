// src/components/Drawing/DrawingItem.jsx

export default function DrawingItem({ item }) {
  return (
    <div style={styles.wrap}>
      <img src={item.dataUrl} alt="drawing" style={styles.img} />
      <div style={styles.tag}>
        <span style={{ color: item.authorColor }}>▶</span> {item.author}
      </div>
    </div>
  );
}

const styles = {
  wrap: {
    position: 'relative',
    cursor: 'grab',
    display: 'inline-block',
  },
  img: {
    display: 'block',
    maxWidth: '400px',
    pointerEvents: 'none',
    mixBlendMode: 'screen',
  },
  tag: {
    fontFamily: 'var(--font-body)',
    fontSize: '9px',
    color: 'var(--paper)',
    letterSpacing: '1px',
    padding: '2px 6px',
    background: 'rgba(13,13,13,0.6)',
    display: 'inline-block',
  },
};
