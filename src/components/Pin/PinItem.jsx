import { useState } from 'react';
import MusicPlayer from '../Music/MusicPlayer';
export default function PinItem({ item }) {
  const [open, setOpen] = useState(false);
  const rot = ((item.id?.charCodeAt(2) || 0) % 14) - 7;
  return (
    <div style={{ position: 'relative' }}>
      <div style={{
        ...S.needle,
        background: item.authorColor,
        boxShadow: `0 0 8px ${item.authorColor}88`,
      }} />
      <div
        style={{
          ...S.sticker,
          borderColor: item.authorColor,
          transform: `rotate(${rot}deg)`,
          boxShadow: `3px 3px 0 ${item.authorColor}55, 0 4px 16px rgba(0,0,0,0.6)`,
        }}
        onClick={() => setOpen(o => !o)}
      >
        <div style={{ ...S.tag, background: item.authorColor }}>
          {item.author}
        </div>
        <p style={S.text}>{item.text}</p>
        {item.music && <div style={S.musicIcon}>🎵</div>}
      </div>
      {open && item.music && (
        <div style={S.player}>
          <MusicPlayer url={item.music} color={item.authorColor} />
        </div>
      )}
    </div>
  );
}
const S = {
  needle: {
    position: 'absolute', top: -6, left: 14,
    width: 8, height: 8,
    borderRadius: '50% 50% 50% 0',
    transform: 'rotate(-45deg)', zIndex: 2,
  },
  sticker: {
    background: '#F0EAE0',
    border: '2px solid',
    padding: '10px 12px',
    maxWidth: 180,
    cursor: 'pointer', userSelect: 'none',
    position: 'relative',
  },
  tag: {
    fontFamily: 'var(--font-display)',
    fontSize: 9, color: 'var(--ink-black)',
    padding: '2px 7px',
    display: 'inline-block',
    marginBottom: 6, letterSpacing: 1,
  },
  text: {
    fontFamily: 'var(--font-body)',
    fontSize: 11, color: '#1A1A1A',
    lineHeight: 1.45, margin: 0, wordBreak: 'break-word',
  },
  musicIcon: { position: 'absolute', top: 4, right: 6, fontSize: 11 },
  player: { marginTop: 4 },
};
