// src/components/UI/UserBadge.jsx
import { useState } from 'react';

export default function UserBadge({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={styles.wrap}>
      <button
        style={{ ...styles.badge, background: user.color, boxShadow: `0 0 10px ${user.color}44` }}
        onClick={() => setOpen(!open)}
      >
        <span style={styles.name}>{user.name}</span>
        <span style={styles.arrow}>{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div style={styles.dropdown}>
          <div style={styles.info}>
            <div style={{ ...styles.dot, background: user.color }} />
            <div>
              <div style={styles.infoName}>{user.name}</div>
              <div style={styles.infoSub}>no quintal</div>
            </div>
          </div>
          <button style={styles.logoutBtn} onClick={() => { setOpen(false); onLogout(); }}>
            SAIR DO QUINTAL
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  wrap: { position: 'relative' },
  badge: {
    border: 'none', padding: '5px 12px',
    fontFamily: 'var(--font-display)', fontSize: '12px',
    color: 'var(--black)', letterSpacing: '1px', cursor: 'pointer',
    display: 'flex', alignItems: 'center', gap: '6px',
  },
  name: { letterSpacing: '1px', maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  arrow: { fontSize: '9px' },
  dropdown: {
    position: 'absolute', top: 'calc(100% + 4px)', right: 0,
    background: 'var(--black-soft)', border: '2px solid var(--red)',
    padding: '12px', minWidth: '170px',
    boxShadow: '4px 4px 0 var(--red-dark)', zIndex: 999,
    animation: 'spray-fade 0.15s ease',
  },
  info: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' },
  dot: { width: '10px', height: '10px', borderRadius: '50%', flexShrink: 0 },
  infoName: { fontFamily: 'var(--font-display)', fontSize: '15px', color: 'var(--white)' },
  infoSub: { fontFamily: 'var(--font-body)', fontSize: '9px', color: 'var(--paper)', letterSpacing: '1px' },
  logoutBtn: {
    width: '100%', background: 'transparent',
    border: '1px solid rgba(214,40,40,0.4)',
    color: 'var(--red)', fontFamily: 'var(--font-body)',
    fontSize: '10px', padding: '8px', cursor: 'pointer', letterSpacing: '2px',
  },
};
