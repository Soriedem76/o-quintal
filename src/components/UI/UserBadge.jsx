import { useState } from 'react';
export default function UserBadge({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  if (!user) return null;
  return (
    <div style={{ position: 'relative' }}>
      <button
        style={{
          ...S.badge,
          background: user.color,
          boxShadow: `0 0 14px ${user.color}55, 3px 3px 0 var(--red-dark)`,
        }}
        onClick={() => setOpen(o => !o)}
      >
        {user.name}
      </button>
      {open && (
        <div style={S.menu}>
          <button style={S.item} onClick={() => { setOpen(false); onLogout(); }}>
            SAIR DO QUINTAL
          </button>
        </div>
      )}
    </div>
  );
}
const S = {
  badge: {
    fontFamily: 'var(--font-display)',
    fontSize: 13, padding: '5px 13px',
    color: 'var(--ink-black)', letterSpacing: 1,
    border: 'none', cursor: 'pointer',
    transition: 'transform 0.1s',
  },
  menu: {
    position: 'absolute', right: 0, top: '110%',
    background: 'var(--bg-card)',
    border: '1px solid rgba(240,237,232,0.12)',
    zIndex: 200, minWidth: 160,
    boxShadow: '4px 4px 0 var(--ink-black)',
  },
  item: {
    width: '100%', background: 'transparent',
    border: 'none', color: 'var(--white-ink)',
    fontFamily: 'var(--font-body)',
    fontSize: 10, padding: '12px 14px',
    cursor: 'pointer', letterSpacing: 1, textAlign: 'left',
  },
};
