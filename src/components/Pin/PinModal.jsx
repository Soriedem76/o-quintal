// src/components/Pin/PinModal.jsx
import { useState } from 'react';
import { addPin } from '../../hooks/useMural';

export default function PinModal({ user, quintalId, position, onClose }) {
  const [text, setText] = useState('');
  const [music, setMusic] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePost = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      // Position is already in canvas space (calculated in MuralApp)
      await addPin({ quintalId, user, text: text.trim(), x: position.x, y: position.y, music: music.trim() || null });
      onClose();
    } catch (e) {
      console.error(e);
      alert('Erro ao postar pin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={styles.modal}>
        <div style={styles.pinNeedle} />
        <div style={styles.header}>
          <span style={styles.title}>NOVO PIN</span>
          <div style={{ ...styles.badge, background: user.color }}>{user.name}</div>
        </div>
        <textarea
          style={styles.textarea}
          placeholder="O que você quer marcar aqui?"
          value={text}
          maxLength={280}
          onChange={e => setText(e.target.value)}
          autoFocus
        />
        <div style={styles.charCount}>{text.length}/280</div>
        <div style={styles.field}>
          <label style={styles.label}>🎵 MÚSICA (opcional)</label>
          <input style={styles.input} placeholder="spotify.com/... ou youtu.be/..." value={music} onChange={e => setMusic(e.target.value)} />
        </div>
        <div style={styles.actions}>
          <button style={styles.cancelBtn} onClick={onClose}>CANCELAR</button>
          <button style={{ ...styles.postBtn, opacity: (!text.trim() || loading) ? 0.45 : 1 }} onClick={handlePost} disabled={!text.trim() || loading}>
            {loading ? 'FIXANDO...' : '📍 FIXAR PIN'}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 500 },
  modal: { background: 'var(--bg-card)', border: '2px solid var(--red)', borderBottom: 'none', padding: '24px 20px', paddingBottom: 'max(24px, env(safe-area-inset-bottom))', width: '100%', maxWidth: '480px', boxShadow: '0 -8px 40px rgba(214,40,40,0.2)', animation: 'slideUp 0.3s cubic-bezier(0.175,0.885,0.32,1.1)', position: 'relative', display: 'flex', flexDirection: 'column', gap: '12px' },
  pinNeedle: { position: 'absolute', top: '-10px', left: '24px', width: '10px', height: '10px', background: 'var(--red)', borderRadius: '50% 50% 50% 0', transform: 'rotate(-45deg)', boxShadow: '0 0 10px var(--red)' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--white)', letterSpacing: '2px' },
  badge: { fontFamily: 'var(--font-display)', fontSize: '12px', padding: '3px 10px', color: 'var(--black)', letterSpacing: '1px' },
  textarea: { width: '100%', background: 'rgba(255,255,255,0.04)', border: '2px solid rgba(214,40,40,0.3)', padding: '12px', fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--white)', outline: 'none', resize: 'none', height: '90px', lineHeight: 1.5 },
  charCount: { fontFamily: 'var(--font-body)', fontSize: '9px', color: 'rgba(240,237,230,0.3)', textAlign: 'right' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontFamily: 'var(--font-body)', fontSize: '10px', letterSpacing: '2px', color: 'var(--paper)' },
  input: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(214,40,40,0.3)', padding: '8px 12px', fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--white)', outline: 'none', width: '100%' },
  actions: { display: 'flex', gap: '10px' },
  cancelBtn: { flex: 1, background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'var(--white)', fontFamily: 'var(--font-body)', fontSize: '11px', padding: '12px', cursor: 'pointer', letterSpacing: '1px' },
  postBtn: { flex: 2, background: 'var(--red)', border: 'none', color: 'var(--white)', fontFamily: 'var(--font-display)', fontSize: '16px', padding: '12px', cursor: 'pointer', letterSpacing: '1px', boxShadow: 'var(--shadow-brutal)' },
};
