// src/components/Pin/PinItem.jsx
import { useState } from 'react';
import MusicPlayer from '../Music/MusicPlayer';

export default function PinItem({ item }) {
  const [open, setOpen] = useState(false);
  const rotation = ((item.id?.charCodeAt(2) || 0) % 12) - 6;

  return (
    <div style={{ position: 'relative' }}>
      {/* Pin needle */}
      <div style={{
        ...styles.needle,
        background: item.authorColor,
        boxShadow: `0 0 8px ${item.authorColor}`,
      }} />

      {/* The sticker/tag */}
      <div
        style={{
          ...styles.sticker,
          borderColor: item.authorColor,
          transform: `rotate(${rotation}deg)`,
          boxShadow: `3px 3px 0 ${item.authorColor}66`,
        }}
        onClick={() => setOpen(!open)}
      >
        {/* Author badge */}
        <div style={{ ...styles.authorBadge, background: item.authorColor }}>
          {item.author}
        </div>

        {/* Text */}
        <p style={styles.text}>{item.text}</p>

        {/* Music toggle */}
        {item.music && (
          <div style={styles.musicBadge} onClick={e => e.stopPropagation()}>
            🎵
          </div>
        )}
      </div>

      {/* Music player expanded */}
      {open && item.music && (
        <div style={styles.musicExpanded}>
          <MusicPlayer url={item.music} color={item.authorColor} />
        </div>
      )}
    </div>
  );
}

const styles = {
  needle: {
    position: 'absolute',
    top: '-6px', left: '12px',
    width: '8px', height: '8px',
    borderRadius: '50% 50% 50% 0',
    transform: 'rotate(-45deg)',
    zIndex: 2,
  },
  sticker: {
    background: '#F5F0E8',
    border: '2px solid',
    padding: '10px 12px',
    maxWidth: '180px',
    cursor: 'pointer',
    userSelect: 'none',
    transition: 'transform 0.15s',
    position: 'relative',
  },
  authorBadge: {
    fontFamily: 'var(--font-display)',
    fontSize: '9px',
    color: 'var(--black)',
    padding: '2px 6px',
    display: 'inline-block',
    marginBottom: '6px',
    letterSpacing: '1px',
  },
  text: {
    fontFamily: 'var(--font-body)',
    fontSize: '11px',
    color: 'var(--black)',
    lineHeight: 1.4,
    margin: 0,
    wordBreak: 'break-word',
  },
  musicBadge: {
    position: 'absolute',
    top: '4px', right: '4px',
    fontSize: '12px',
    cursor: 'pointer',
  },
  musicExpanded: {
    marginTop: '4px',
    animation: 'spray-fade 0.2s ease',
  },
};
