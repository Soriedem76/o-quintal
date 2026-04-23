// src/components/Photo/PhotoCard.jsx
import { useState } from 'react';
import MusicPlayer from '../Music/MusicPlayer';

export default function PhotoCard({ item, user }) {
  const [showPin, setShowPin] = useState(false);
  const rotation = ((item.id?.charCodeAt(0) || 0) % 10) - 5;

  const ts = item.createdAt?.toDate?.() || new Date();
  const dateStr = ts.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });

  return (
    <div style={{
      ...styles.card,
      transform: `rotate(${rotation}deg)`,
    }}>
      {/* Tape strip */}
      <div style={{
        ...styles.tape,
        background: `${item.authorColor}55`,
        border: `1px solid ${item.authorColor}88`,
        transform: `rotate(${rotation * -1.5}deg) translateX(-50%)`,
      }} />

      {/* Photo */}
      <img src={item.url} alt="" style={styles.img} draggable={false} />

      {/* Bottom info */}
      <div style={styles.caption}>
        <div style={styles.authorRow}>
          <div style={{ ...styles.dot, background: item.authorColor }} />
          <span style={styles.author}>{item.author}</span>
          <span style={styles.date}>{dateStr}</span>
        </div>
      </div>

      {/* Music */}
      {item.music && <MusicPlayer url={item.music} color={item.authorColor} />}

      {/* Drip effect bottom */}
      <div style={styles.dripsBottom}>
        {[15, 30, 55, 70, 85].map((p, i) => (
          <div key={i} style={{
            ...styles.cardDrip,
            left: `${p}%`,
            background: item.authorColor,
            height: `${8 + (i % 3) * 6}px`,
            width: `${2 + (i % 2)}px`,
            animationDelay: `${i * 0.8}s`,
            opacity: 0.6,
          }} />
        ))}
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: 'var(--white-dirty)',
    boxShadow: '4px 6px 16px rgba(0,0,0,0.6)',
    padding: '8px 8px 16px 8px',
    width: '200px',
    cursor: 'grab',
    position: 'relative',
    userSelect: 'none',
    transition: 'box-shadow 0.2s',
  },
  tape: {
    position: 'absolute',
    top: '-10px', left: '50%',
    width: '60px', height: '18px',
    zIndex: 2,
  },
  img: {
    width: '100%',
    height: '160px',
    objectFit: 'cover',
    display: 'block',
    filter: 'contrast(1.05) saturate(0.9)',
  },
  caption: {
    padding: '6px 4px 0',
  },
  authorRow: {
    display: 'flex', alignItems: 'center', gap: '6px',
  },
  dot: {
    width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0,
  },
  author: {
    fontFamily: 'var(--font-body)',
    fontSize: '9px',
    color: 'var(--black)',
    fontWeight: 700,
    letterSpacing: '1px',
    flex: 1,
  },
  date: {
    fontFamily: 'var(--font-body)',
    fontSize: '8px',
    color: 'rgba(0,0,0,0.4)',
  },
  dripsBottom: {
    position: 'absolute',
    bottom: '-12px', left: 0, right: 0,
    height: '20px',
    overflow: 'visible',
    pointerEvents: 'none',
  },
  cardDrip: {
    position: 'absolute',
    top: 0,
    borderRadius: '0 0 3px 3px',
  },
};
