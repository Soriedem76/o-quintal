// src/components/Mural/Toolbar.jsx — paleta Laretta
export default function Toolbar({ mode, user, onMode, onPhotoClick }) {
  const tools = [
    { id: 'pan',   icon: '✋', label: 'MOVER'    },
    { id: 'draw',  icon: '🎨', label: 'GRAFITAR'  },
    { id: 'pin',   icon: '📍', label: 'PIN'       },
    { id: 'photo', icon: '📷', label: 'FOTO', action: onPhotoClick },
  ];

  return (
    <nav style={S.bar}>
      {tools.map(t => {
        const active = mode === t.id;
        return (
          <button
            key={t.id}
            style={{
              ...S.btn,
              background:  active ? 'var(--red)'  : 'transparent',
              borderColor: active ? 'var(--red)'  : 'rgba(240,237,232,0.10)',
              boxShadow:   active ? '3px 3px 0 var(--red-dark)' : 'none',
              transform:   active ? 'translateY(-3px)' : 'none',
            }}
            onClick={() => t.action ? t.action() : onMode(t.id)}
          >
            <span style={S.icon}>{t.icon}</span>
            <span style={{ ...S.label, color: active ? 'var(--white-ink)' : 'var(--white-dim)' }}>
              {t.label}
            </span>
          </button>
        );
      })}

      {/* User color badge */}
      <div style={{
        ...S.chip,
        background: user?.color || 'var(--red)',
        boxShadow: `0 0 14px ${user?.color || 'var(--red)'}66`,
      }}>
        <span style={S.chipLetter}>{user?.name?.charAt(0) || '?'}</span>
      </div>
    </nav>
  );
}

const S = {
  bar: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    gap: 6, padding: '10px 16px',
    paddingBottom: 'max(10px, env(safe-area-inset-bottom))',
    background: 'rgba(20,20,20,0.97)',
    borderTop: '1px solid rgba(240,237,232,0.08)',
    flexShrink: 0, zIndex: 100,
    backdropFilter: 'blur(6px)',
  },
  btn: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
    padding: '8px 13px', border: '1px solid',
    cursor: 'pointer', transition: 'all 0.15s',
    minWidth: 58, background: 'transparent',
  },
  icon:  { fontSize: 19 },
  label: { fontFamily: 'var(--font-body)', fontSize: 8, letterSpacing: 1 },
  chip: {
    width: 34, height: 34, borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    marginLeft: 8, flexShrink: 0,
    border: '2px solid rgba(240,237,232,0.35)',
  },
  chipLetter: {
    fontFamily: 'var(--font-display)',
    fontSize: 14, color: 'var(--ink-black)', fontWeight: 700,
  },
};
