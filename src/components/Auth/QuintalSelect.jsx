// src/components/Auth/QuintalSelect.jsx
import { useState } from 'react';
import { useQuintal } from '../../lib/QuintalContext';

export default function QuintalSelect({ user }) {
  const { createNew, joinByCode } = useQuintal();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [created, setCreated] = useState(null);

  const handleCreate = () => {
    const newCode = createNew();
    setCreated(newCode);
  };

  const handleJoin = () => {
    const clean = code.trim().toUpperCase();
    if (!clean || clean.length < 4) {
      setError('Código inválido');
      return;
    }
    joinByCode(clean);
  };

  const shareUrl = created ? `${window.location.origin}?q=${created}` : null;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
  };

  if (created) {
    return (
      <div style={styles.overlay}>
        <div style={styles.card}>
          <div style={styles.bigCode}>{created}</div>
          <p style={styles.hint}>Esse é o código do seu quintal.<br />Manda pra galera entrar!</p>
          <div style={styles.urlRow}>
            <span style={styles.urlText}>{shareUrl}</span>
            <button style={styles.copyBtn} onClick={handleCopy}>COPIAR</button>
          </div>
          <button style={styles.enterBtn} onClick={() => {}}>
            ▶ ENTRAR AGORA
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.wallBg} />

      <div style={styles.card}>
        <div style={styles.greeting}>
          <span style={{ ...styles.dot, background: user.color }} />
          <span style={styles.greetUser}>{user.name}</span>
        </div>

        <h2 style={styles.title}>QUAL QUINTAL?</h2>
        <p style={styles.sub}>Crie um novo ou entre no da galera</p>

        {/* Create */}
        <button style={styles.createBtn} onClick={handleCreate}>
          🧱 CRIAR NOVO QUINTAL
        </button>

        <div style={styles.divider}>
          <span style={styles.dividerLine} />
          <span style={styles.dividerText}>OU</span>
          <span style={styles.dividerLine} />
        </div>

        {/* Join */}
        <label style={styles.label}>CÓDIGO DO QUINTAL</label>
        <input
          style={styles.input}
          placeholder="ex: MURO-42"
          value={code}
          maxLength={12}
          onChange={e => { setCode(e.target.value.toUpperCase()); setError(''); }}
          onKeyDown={e => e.key === 'Enter' && handleJoin()}
        />
        {error && <span style={styles.error}>{error}</span>}
        <button style={styles.joinBtn} onClick={handleJoin}>
          ▶ ENTRAR NO QUINTAL
        </button>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed', inset: 0,
    background: 'var(--black)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden',
  },
  wallBg: {
    position: 'absolute', inset: 0,
    backgroundImage: `repeating-linear-gradient(
      45deg,
      transparent, transparent 40px,
      rgba(214,40,40,0.015) 40px, rgba(214,40,40,0.015) 41px
    )`,
  },
  card: {
    position: 'relative',
    background: 'rgba(13,13,13,0.97)',
    border: '2px solid var(--red)',
    padding: '40px 36px',
    maxWidth: '400px', width: '90%',
    boxShadow: '8px 8px 0 var(--red-dark)',
    animation: 'stamp-in 0.4s cubic-bezier(0.175,0.885,0.32,1.275)',
    display: 'flex', flexDirection: 'column', gap: '12px',
  },
  greeting: {
    display: 'flex', alignItems: 'center', gap: '8px',
    marginBottom: '4px',
  },
  dot: { width: '10px', height: '10px', borderRadius: '50%' },
  greetUser: {
    fontFamily: 'var(--font-display)',
    fontSize: '14px', color: 'var(--paper)',
    letterSpacing: '2px',
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontSize: '48px',
    color: 'var(--white)',
    letterSpacing: '-1px',
    textShadow: '3px 3px 0 var(--red)',
    lineHeight: 1,
  },
  sub: {
    fontFamily: 'var(--font-body)',
    fontSize: '11px',
    color: 'var(--paper)',
    letterSpacing: '1px',
    marginBottom: '8px',
  },
  createBtn: {
    background: 'var(--red)',
    border: 'none',
    color: 'var(--white)',
    fontFamily: 'var(--font-display)',
    fontSize: '18px',
    padding: '16px',
    cursor: 'pointer',
    letterSpacing: '1px',
    boxShadow: 'var(--shadow-brutal)',
    width: '100%',
  },
  divider: {
    display: 'flex', alignItems: 'center', gap: '12px',
    margin: '4px 0',
  },
  dividerLine: {
    flex: 1, height: '1px',
    background: 'rgba(214,40,40,0.25)',
  },
  dividerText: {
    fontFamily: 'var(--font-body)',
    fontSize: '10px', color: 'var(--paper)',
    letterSpacing: '3px',
  },
  label: {
    fontFamily: 'var(--font-body)',
    fontSize: '10px', letterSpacing: '2px',
    color: 'var(--paper)',
  },
  input: {
    background: 'rgba(255,255,255,0.04)',
    border: '2px solid rgba(214,40,40,0.4)',
    padding: '14px 16px',
    fontFamily: 'var(--font-display)',
    fontSize: '22px',
    color: 'var(--white)',
    outline: 'none',
    letterSpacing: '3px',
    width: '100%',
  },
  error: {
    fontFamily: 'var(--font-body)',
    fontSize: '10px',
    color: 'var(--red)',
    letterSpacing: '1px',
  },
  joinBtn: {
    background: 'transparent',
    border: '2px solid var(--red)',
    color: 'var(--red)',
    fontFamily: 'var(--font-display)',
    fontSize: '16px',
    padding: '14px',
    cursor: 'pointer',
    letterSpacing: '2px',
    width: '100%',
    transition: 'background 0.15s, color 0.15s',
  },
  // Created state
  bigCode: {
    fontFamily: 'var(--font-display)',
    fontSize: '52px',
    color: 'var(--red)',
    textShadow: '4px 4px 0 var(--red-dark)',
    textAlign: 'center',
    letterSpacing: '4px',
    animation: 'stamp-in 0.5s ease',
  },
  hint: {
    fontFamily: 'var(--font-body)',
    fontSize: '12px',
    color: 'var(--paper)',
    textAlign: 'center',
    lineHeight: 1.6,
    letterSpacing: '1px',
  },
  urlRow: {
    display: 'flex',
    border: '1px solid rgba(214,40,40,0.3)',
    overflow: 'hidden',
  },
  urlText: {
    flex: 1,
    fontFamily: 'var(--font-body)',
    fontSize: '10px',
    color: 'var(--paper)',
    padding: '8px 10px',
    wordBreak: 'break-all',
  },
  copyBtn: {
    background: 'var(--red)',
    border: 'none',
    color: 'var(--white)',
    fontFamily: 'var(--font-body)',
    fontSize: '9px',
    padding: '8px 12px',
    cursor: 'pointer',
    letterSpacing: '1px',
    flexShrink: 0,
  },
  enterBtn: {
    background: 'var(--red)',
    border: 'none',
    color: 'var(--white)',
    fontFamily: 'var(--font-display)',
    fontSize: '18px',
    padding: '16px',
    cursor: 'pointer',
    letterSpacing: '2px',
    boxShadow: 'var(--shadow-brutal)',
    marginTop: '8px',
  },
};
