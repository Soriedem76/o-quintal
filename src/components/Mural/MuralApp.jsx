// src/components/Mural/MuralApp.jsx
import { useState, useRef, useCallback } from 'react';
import { useMuralItems } from '../../hooks/useMural';
import { useUser, SHARED_QUINTAL_ID } from '../../lib/UserContext';
import Canvas from './Canvas';
import Toolbar from './Toolbar';
import DrawingLayer from '../Drawing/DrawingLayer';
import PhotoUploadModal from '../Photo/PhotoUploadModal';
import PinModal from '../Pin/PinModal';
import UserBadge from '../UI/UserBadge';

export default function MuralApp() {
  const { user, logout } = useUser();
  const quintalId = SHARED_QUINTAL_ID;
  const { items, loading } = useMuralItems(quintalId);
  const [mode, setMode] = useState('pan');
  const [showPhoto, setShowPhoto] = useState(false);
  const [pinPos, setPinPos] = useState(null);
  const canvasOffset = useRef({ x: 0, y: 0 });

  const handleAreaClick = useCallback((e) => {
    if (mode !== 'pin') return;
    const rect = e.currentTarget.getBoundingClientRect();
    setPinPos({
      x: (e.clientX - rect.left) - canvasOffset.current.x,
      y: (e.clientY - rect.top)  - canvasOffset.current.y,
    });
    setMode('pan');
  }, [mode]);

  const hints = {
    draw: '🎨  MODO GRAFFITI — desenhe com o dedo ou mouse',
    pin:  '📍  TOQUE no mural onde quer fixar o pin',
  };

  return (
    <div style={S.root}>
      {/* ── Top bar ── */}
      <header style={S.topBar}>
        <div style={S.logoRow}>
          {/* O — SVG com corte interno, estilo Laretta */}
          <svg viewBox="0 0 44 54" style={S.logoO}>
            <rect x="2"  y="2"  width="40" height="50" rx="7"  fill="var(--red)"/>
            <rect x="10" y="10" width="24" height="32" rx="5"  fill="var(--bg)"/>
          </svg>
          <div style={S.logoTexts}>
            <div style={S.logoSub}>MURAL DA GALERA</div>
            <div style={S.logoMain}>QUINTAL</div>
          </div>
        </div>
        <UserBadge user={user} onLogout={logout} />
      </header>

      {/* ── Mural ── */}
      <div
        style={{ ...S.mural, cursor: mode === 'pin' ? 'crosshair' : 'default' }}
        onClick={handleAreaClick}
      >
        <Canvas
          items={items}
          loading={loading}
          user={user}
          canvasOffset={canvasOffset}
          mode={mode}
        />
        {mode === 'draw' && (
          <DrawingLayer
            user={user}
            quintalId={quintalId}
            canvasOffset={canvasOffset}
            onFinish={() => setMode('pan')}
          />
        )}
      </div>

      {/* ── Mode hint ── */}
      {hints[mode] && <div style={S.hint} key={mode}>{hints[mode]}</div>}

      <Toolbar mode={mode} user={user} onMode={setMode} onPhotoClick={() => setShowPhoto(true)} />

      {showPhoto && (
        <PhotoUploadModal
          user={user}
          quintalId={quintalId}
          canvasOffset={canvasOffset}
          onClose={() => setShowPhoto(false)}
        />
      )}
      {pinPos && (
        <PinModal
          user={user}
          quintalId={quintalId}
          position={pinPos}
          onClose={() => setPinPos(null)}
        />
      )}
    </div>
  );
}

const S = {
  root: {
    position: 'fixed', inset: 0,
    display: 'flex', flexDirection: 'column',
    overflow: 'hidden',
    background: 'var(--bg)',
    paddingTop: 'env(safe-area-inset-top)',
  },
  topBar: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '8px 18px',
    /* separador linha branca bem fina, igual ao estilo da tipografia */
    borderBottom: '1px solid rgba(240,237,232,0.10)',
    background: 'rgba(20,20,20,0.97)',
    backdropFilter: 'blur(6px)',
    zIndex: 100, flexShrink: 0, minHeight: 52,
  },
  logoRow: { display: 'flex', alignItems: 'center', gap: 10 },
  logoO: {
    width: 30, height: 36, flexShrink: 0,
    filter: 'drop-shadow(2px 2px 0 var(--red-dark))',
  },
  logoTexts: { display: 'flex', flexDirection: 'column', gap: 1 },
  logoSub: {
    fontFamily: 'var(--font-body)',
    fontSize: 7, letterSpacing: 3,
    color: 'var(--red)',
    lineHeight: 1,
  },
  logoMain: {
    fontFamily: 'var(--font-display)',
    fontSize: 22, letterSpacing: 3,
    color: 'var(--white-ink)',
    textShadow: '2px 2px 0 var(--red)',
    lineHeight: 1,
  },
  mural: { flex: 1, position: 'relative', overflow: 'hidden', touchAction: 'none' },
  hint: {
    position: 'absolute', bottom: 86, left: '50%', transform: 'translateX(-50%)',
    background: 'var(--red)', color: 'var(--white-ink)',
    fontFamily: 'var(--font-body)', fontSize: 10,
    padding: '8px 22px', letterSpacing: 1,
    boxShadow: '4px 4px 0 var(--red-dark)',
    zIndex: 200, pointerEvents: 'none',
    whiteSpace: 'nowrap',
    animation: 'stamp-in 0.3s ease',
  },
};
