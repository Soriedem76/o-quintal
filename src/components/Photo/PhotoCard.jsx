// src/components/Photo/PhotoCard.jsx — with swinging animation while dragging
import { useState } from 'react';
import MusicPlayer from '../Music/MusicPlayer';

export default function PhotoCard({ item, user, dragging }) {
  const [showMusic, setShowMusic] = useState(false);
  const rotation = ((item.id?.charCodeAt(0) || 0) % 10) - 5;

  const ts = item.createdAt?.toDate?.() || new Date();
  const dateStr = ts.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  const isOwn = user?.id === item.authorId;

  return (
    <div
      style={{
        ...S.card,
        '--card-rot': `${rotation}deg`,
        // While dragging (passed from DraggableItem via CSS class or direct prop),
        // the parent DraggableItem already applies tilt; here we add sway animation
        animation: dragging ? `sway 0.35s ease-in-out infinite` : `float-bob 4s ease-in-out infinite`,
        transform: `rotate(${rotation}deg)`,
        filter: `drop-shadow(${dragging ? '0 20px 30px rgba(0,0,0,0.85)' : '4px 6px 16px rgba(0,0,0,0.55)'})`,
      }}
    >
      {/* Tape strip top */}
      <div style={{
        ...S.tape,
        background: `${item.authorColor}44`,
        border: `1px solid ${item.authorColor}66`,
      }} />

      {/* Photo */}
      <img src={item.url} alt="" style={S.img} draggable={false} />

      {/* Bottom strip */}
      <div style={S.strip}>
        <div style={S.authorRow}>
          <div style={{ ...S.dot, background: item.authorColor }} />
          <span style={S.authorName}>{item.author}</span>
          <span style={S.date}>{dateStr}</span>
          {item.music && (
            <button style={S.musicBtn} onClick={e => { e.stopPropagation(); setShowMusic(v => !v); }}>
              🎵
            </button>
          )}
        </div>
      </div>

      {/* Paint drips from bottom */}
      <div style={S.dripsRow} aria-hidden>
        {[12, 28, 48, 68, 84].map((left, i) => (
          <div key={i} style={{
            ...S.drip,
            left: `${left}%`,
            height: `${8 + (i % 3) * 7}px`,
            width: `${2 + (i % 2)}px`,
            background: item.authorColor,
            animationDelay: `${i * 0.5}s`,
          }} />
        ))}
      </div>

      {showMusic && item.music && (
        <div style={S.musicWrap} onClick={e => e.stopPropagation()}>
          <MusicPlayer url={item.music} color={item.authorColor} />
        </div>
      )}
    </div>
  );
}

const S = {
  card: {
    background: '#E8E0D0',
    padding: '8px 8px 20px',
    width: 200,
    position: 'relative',
    userSelect: 'none',
    cursor: 'grab',
    willChange: 'transform',
    transition: 'filter 0.2s',
  },
  tape: {
    position: 'absolute',
    top: -10, left: '50%', transform: 'translateX(-50%) rotate(-2deg)',
    width: 60, height: 18,
    zIndex: 2,
  },
  img: {
    width: '100%', height: 160,
    objectFit: 'cover', display: 'block',
    filter: 'contrast(1.05) saturate(0.88)',
  },
  strip: { paddingTop: 7, paddingBottom: 2 },
  authorRow: { display: 'flex', alignItems: 'center', gap: 5 },
  dot: { width: 8, height: 8, borderRadius: '50%', flexShrink: 0 },
  authorName: {
    fontFamily: 'var(--font-body)', fontSize: 9,
    color: '#111', fontWeight: 700, letterSpacing: 1, flex: 1,
  },
  date: { fontFamily: 'var(--font-body)', fontSize: 8, color: 'rgba(0,0,0,0.45)' },
  musicBtn: {
    background: 'none', border: 'none', cursor: 'pointer',
    fontSize: 12, padding: 0,
  },
  dripsRow: {
    position: 'absolute', bottom: -14, left: 0, right: 0,
    height: 20, pointerEvents: 'none',
  },
  drip: {
    position: 'absolute', top: 0,
    borderRadius: '0 0 4px 4px',
    animation: 'drip 2.5s ease-in infinite',
    transformOrigin: 'top',
    opacity: 0.65,
  },
  musicWrap: {
    position: 'absolute', top: '100%', left: 0, right: 0,
    marginTop: 4, zIndex: 10,
  },
};
