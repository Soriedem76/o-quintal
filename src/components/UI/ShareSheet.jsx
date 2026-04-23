// src/components/UI/ShareSheet.jsx
// Uses Web Share API on mobile (native share sheet),
// falls back to clipboard copy on desktop.

import { useState } from 'react';

export default function ShareSheet({ code, url, onClose }) {
  const [copied, setCopied] = useState(false);

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'O Quintal — Mural da Galera',
          text: `Entra no quintal ${code} comigo!`,
          url,
        });
      } catch {} // user cancelled
    }
  };

  const handleCopy = async (text) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const hasNativeShare = !!navigator.share;

  return (
    <div style={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={styles.sheet}>
        <div style={styles.handle} />

        <h3 style={styles.title}>CHAMAR A GALERA</h3>
        <p style={styles.sub}>Compartilha o código ou o link</p>

        {/* Big code display */}
        <div style={styles.codeBlock}>
          <div style={styles.bigCode}>{code}</div>
          <button style={styles.copyCodeBtn} onClick={() => handleCopy(code)}>
            {copied ? '✓ COPIADO' : 'COPIAR CÓDIGO'}
          </button>
        </div>

        {/* URL */}
        <div style={styles.urlBlock}>
          <span style={styles.urlText}>{url}</span>
          <button style={styles.copyUrlBtn} onClick={() => handleCopy(url)}>
            {copied ? '✓' : '⧉'}
          </button>
        </div>

        {/* Native share button (shows on mobile) */}
        {hasNativeShare && (
          <button style={styles.shareBtn} onClick={handleNativeShare}>
            ↗ COMPARTILHAR VIA...
          </button>
        )}

        {/* QR hint */}
        <p style={styles.hint}>
          Quem acessar o link ou digitar o código entra direto no seu quintal
        </p>

        <button style={styles.closeBtn} onClick={onClose}>FECHAR</button>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
    display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 600,
  },
  sheet: {
    background: 'var(--black-soft)', border: '2px solid var(--red)', borderBottom: 'none',
    padding: '20px 24px',
    paddingBottom: 'max(24px, env(safe-area-inset-bottom))',
    width: '100%', maxWidth: '480px',
    animation: 'slideUp 0.3s cubic-bezier(0.175,0.885,0.32,1.1)',
    display: 'flex', flexDirection: 'column', gap: '14px', alignItems: 'stretch',
  },
  handle: {
    width: '40px', height: '4px', background: 'rgba(214,40,40,0.4)',
    borderRadius: '2px', alignSelf: 'center', marginBottom: '4px',
  },
  title: {
    fontFamily: 'var(--font-display)', fontSize: '28px',
    color: 'var(--white)', letterSpacing: '2px',
    textShadow: '2px 2px 0 var(--red)',
  },
  sub: { fontFamily: 'var(--font-body)', fontSize: '11px', color: 'var(--paper)', letterSpacing: '1px' },
  codeBlock: {
    background: 'rgba(214,40,40,0.1)', border: '2px solid rgba(214,40,40,0.4)',
    padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  },
  bigCode: {
    fontFamily: 'var(--font-display)', fontSize: '36px',
    color: 'var(--red)', letterSpacing: '4px',
    textShadow: '2px 2px 0 var(--red-dark)',
  },
  copyCodeBtn: {
    background: 'var(--red)', border: 'none',
    color: 'var(--white)', fontFamily: 'var(--font-body)',
    fontSize: '10px', padding: '8px 14px', cursor: 'pointer',
    letterSpacing: '1px',
  },
  urlBlock: {
    display: 'flex', gap: '0',
    border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden',
  },
  urlText: {
    flex: 1, fontFamily: 'var(--font-body)', fontSize: '10px',
    color: 'var(--paper)', padding: '8px 10px',
    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
  },
  copyUrlBtn: {
    background: 'rgba(255,255,255,0.08)', border: 'none',
    color: 'var(--white)', padding: '8px 14px', cursor: 'pointer', fontSize: '14px',
    flexShrink: 0,
  },
  shareBtn: {
    background: 'var(--white)', border: 'none',
    color: 'var(--black)', fontFamily: 'var(--font-display)',
    fontSize: '16px', padding: '14px', cursor: 'pointer',
    letterSpacing: '2px', boxShadow: 'var(--shadow-brutal)',
  },
  hint: {
    fontFamily: 'var(--font-body)', fontSize: '10px',
    color: 'rgba(240,237,230,0.4)', letterSpacing: '1px',
    textAlign: 'center', lineHeight: 1.6,
  },
  closeBtn: {
    background: 'transparent', border: '1px solid rgba(214,40,40,0.3)',
    color: 'var(--paper)', fontFamily: 'var(--font-body)',
    fontSize: '11px', padding: '10px', cursor: 'pointer', letterSpacing: '2px',
  },
};
