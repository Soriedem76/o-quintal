// src/components/Mural/Toolbar.jsx
import { useState } from 'react';

const tools = [
  { id: 'pan',   icon: '✋', label: 'MOVER'   },
  { id: 'draw',  icon: '🎨', label: 'GRAFITAR' },
  { id: 'pin',   icon: '📍', label: 'PIN'     },
  { id: 'photo', icon: '📷', label: 'FOTO'    },
];

export default function Toolbar({ mode, user, onMode, onPhotoClick }) {
  const [hovered, setHovered] = useState(null);

  const handleClick = (id) => {
    if (id === 'photo') {
      onPhotoClick();
    } else {
      onMode(id);
    }
  };

  return (
    <div style={styles.toolbar}>
      {/* Drip decoration */}
      <div style={styles.drips}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{
            ...styles.drip,
            left: `${20 + i * 20}%`,
            animationDelay: `${i * 0.5}s`,
            animationDuration: `${2 + i * 0.3}s`,
            background: i === 0 ? user?.color || 'var(--red)' : 'var(--red)',
          }} />
        ))}
      </div>

      <div style={styles.tools}>
        {tools.map(t => (
          <button
            key={t.id}
            style={{
              ...styles.tool,
              background: mode === t.id
                ? (user?.color || 'var(--red)')
                : 'rgba(13,13,13,0.9)',
              border: `2px solid ${mode === t.id ? (user?.color || 'var(--red)') : 'rgba(214,40,40,0.3)'}`,
              transform: hovered === t.id ? 'translateY(-4px)' : 'none',
              boxShadow: mode === t.id
                ? `0 0 16px ${user?.color || 'var(--red)'}66, var(--shadow-brutal)`
                : hovered === t.id ? 'var(--shadow-brutal)' : 'none',
            }}
            onClick={() => handleClick(t.id)}
            onMouseEnter={() => setHovered(t.id)}
            onMouseLeave={() => setHovered(null)}
            title={t.label}
          >
            <span style={styles.toolIcon}>{t.icon}</span>
            <span style={{
              ...styles.toolLabel,
              color: mode === t.id ? 'var(--black)' : 'var(--white)',
            }}>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Color indicator */}
      <div style={styles.colorBar}>
        <div style={styles.colorIndicatorWrap}>
          <div style={{
            ...styles.colorIndicator,
            background: user?.color || 'var(--red)',
            boxShadow: `0 0 12px ${user?.color || 'var(--red)'}66`,
          }} />
          <span style={styles.colorLabel}>{user?.name}</span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  toolbar: {
    position: 'relative',
    background: 'rgba(13,13,13,0.95)',
    borderTop: '2px solid rgba(214,40,40,0.4)',
    padding: '12px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexShrink: 0,
    zIndex: 100,
    backdropFilter: 'blur(4px)',
  },
  drips: {
    position: 'absolute',
    top: '-20px', left: 0, right: 0,
    height: '20px',
    pointerEvents: 'none',
  },
  drip: {
    position: 'absolute',
    top: 0,
    width: '4px',
    borderRadius: '0 0 4px 4px',
    animation: 'drip 3s ease-in infinite',
    transformOrigin: 'top',
  },
  tools: {
    display: 'flex', gap: '8px',
  },
  tool: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    gap: '2px',
    padding: '8px 14px',
    cursor: 'pointer',
    transition: 'transform 0.15s, box-shadow 0.15s, background 0.15s',
    minWidth: '64px',
  },
  toolIcon: {
    fontSize: '20px',
    lineHeight: 1,
  },
  toolLabel: {
    fontFamily: 'var(--font-body)',
    fontSize: '8px',
    letterSpacing: '1px',
    fontWeight: 700,
  },
  colorBar: {
    display: 'flex', alignItems: 'center',
  },
  colorIndicatorWrap: {
    display: 'flex', alignItems: 'center', gap: '8px',
  },
  colorIndicator: {
    width: '20px', height: '20px',
    borderRadius: '50%',
    border: '2px solid rgba(255,255,255,0.2)',
  },
  colorLabel: {
    fontFamily: 'var(--font-display)',
    fontSize: '13px',
    color: 'var(--white)',
    letterSpacing: '1px',
  },
};
