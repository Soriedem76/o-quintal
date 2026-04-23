// src/components/Mural/MuralApp.jsx
import { useState, useRef, useCallback } from 'react';
import { useMuralItems } from '../../hooks/useMural';
import { useUser } from '../../lib/UserContext';
import { useQuintal } from '../../lib/QuintalContext';
import Canvas from './Canvas';
import Toolbar from './Toolbar';
import DrawingLayer from '../Drawing/DrawingLayer';
import PhotoUploadModal from '../Photo/PhotoUploadModal';
import PinModal from '../Pin/PinModal';
import UserBadge from '../UI/UserBadge';
import ShareSheet from '../UI/ShareSheet';

export default function MuralApp() {
  const { user, logout } = useUser();
  const { quintalId, quintalCode, shareUrl, leave } = useQuintal();
  const { items, loading } = useMuralItems(quintalId);

  const [mode, setMode] = useState('pan');
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [pinPosition, setPinPosition] = useState({ x: 0, y: 0 });
  const canvasOffset = useRef({ x: 0, y: 0 });

  const handleMuralClick = useCallback((e) => {
    if (mode === 'pin') {
      const rect = e.currentTarget.getBoundingClientRect();
      setPinPosition({
        x: e.clientX - rect.left - canvasOffset.current.x,
        y: e.clientY - rect.top - canvasOffset.current.y,
      });
      setShowPinModal(true);
      setMode('pan');
    }
  }, [mode]);

  return (
    <div style={styles.root}>
      <div style={styles.wallBg} />
      <div style={styles.topBar}>
        <button style={styles.codeChip} onClick={() => setShowShare(true)}>
          <span style={styles.codeDot} />
          <span style={styles.codeText}>{quintalCode}</span>
          <span style={styles.shareIcon}>↗</span>
        </button>
        <div style={styles.logo}>O QUINTAL</div>
        <UserBadge user={user} onLogout={() => { logout(); leave(); }} />
      </div>
      <div
        style={{ ...styles.muralArea, cursor: mode === 'pin' ? 'crosshair' : mode === 'draw' ? 'none' : 'grab' }}
        onClick={handleMuralClick}
      >
        <Canvas items={items} loading={loading} user={user} canvasOffset={canvasOffset} mode={mode} />
        {mode === 'draw' && (
          <DrawingLayer user={user} quintalId={quintalId} canvasOffset={canvasOffset} onFinish={() => setMode('pan')} />
        )}
      </div>
      <Toolbar mode={mode} user={user} onMode={setMode} onPhotoClick={() => setShowPhotoModal(true)} />
      {mode !== 'pan' && (
        <div style={styles.modeHint}>
          {mode === 'draw' && '✏️  GRAFITANDO — desenhe com o dedo'}
          {mode === 'pin' && '📍 TOQUE no mural para fixar um pin'}
        </div>
      )}
      {showPhotoModal && <PhotoUploadModal user={user} quintalId={quintalId} onClose={() => setShowPhotoModal(false)} canvasOffset={canvasOffset} />}
      {showPinModal && <PinModal user={user} quintalId={quintalId} position={pinPosition} onClose={() => setShowPinModal(false)} />}
      {showShare && <ShareSheet code={quintalCode} url={shareUrl} onClose={() => setShowShare(false)} />}
    </div>
  );
}

const styles = {
  root: {
    position: 'fixed', inset: 0,
    display: 'flex', flexDirection: 'column',
    overflow: 'hidden', background: 'var(--black)',
    paddingTop: 'env(safe-area-inset-top)',
    paddingBottom: 'env(safe-area-inset-bottom)',
  },
  wallBg: {
    position: 'absolute', inset: 0, pointerEvents: 'none',
    backgroundImage: `radial-gradient(ellipse at 20% 50%, rgba(214,40,40,0.04) 0%, transparent 50%), repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.008) 2px, rgba(255,255,255,0.008) 3px)`,
  },
  topBar: {
    position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '10px 16px', borderBottom: '2px solid rgba(214,40,40,0.35)',
    background: 'rgba(13,13,13,0.92)', backdropFilter: 'blur(8px)',
    zIndex: 100, flexShrink: 0, minHeight: '52px',
  },
  codeChip: {
    display: 'flex', alignItems: 'center', gap: '6px',
    background: 'rgba(214,40,40,0.15)', border: '1px solid rgba(214,40,40,0.4)',
    padding: '5px 10px', cursor: 'pointer', color: 'var(--white)',
  },
  codeDot: {
    width: '6px', height: '6px', borderRadius: '50%',
    background: 'var(--red)', animation: 'pulse-red 2s ease infinite', flexShrink: 0,
  },
  codeText: { fontFamily: 'var(--font-display)', fontSize: '13px', letterSpacing: '2px', color: 'var(--red)' },
  shareIcon: { fontSize: '14px', color: 'var(--paper)' },
  logo: {
    fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--white)',
    letterSpacing: '3px', textShadow: '2px 2px 0 var(--red)',
    position: 'absolute', left: '50%', transform: 'translateX(-50%)',
  },
  muralArea: { flex: 1, position: 'relative', overflow: 'hidden', touchAction: 'none' },
  modeHint: {
    position: 'absolute', bottom: '90px', left: '50%', transform: 'translateX(-50%)',
    background: 'var(--red)', color: 'var(--white)', fontFamily: 'var(--font-body)',
    fontSize: '11px', padding: '8px 20px', letterSpacing: '1px',
    boxShadow: 'var(--shadow-brutal)', zIndex: 200, pointerEvents: 'none',
    animation: 'stamp-in 0.3s ease', whiteSpace: 'nowrap',
  },
};
