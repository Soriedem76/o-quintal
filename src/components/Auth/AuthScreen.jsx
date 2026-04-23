// src/components/Auth/AuthScreen.jsx
import { useState } from 'react';
import { useUser } from '../../lib/UserContext';
import DripText from '../UI/DripText';

const PRESET_COLORS = [
  '#D62828', '#FF6B35', '#F5C842', '#4CAF50',
  '#2196F3', '#9C27B0', '#FF69B4', '#00BCD4',
  '#FF3D00', '#76FF03', '#FFEA00', '#F06292',
];

export default function AuthScreen() {
  const { login } = useUser();
  const [name, setName] = useState('');
  const [color, setColor] = useState('#D62828');
  const [shaking, setShaking] = useState(false);

  const handleEnter = () => {
    if (!name.trim()) {
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
      return;
    }
    login(name.trim(), color);
  };

  return (
    <div style={styles.overlay}>
      {/* Wall texture background */}
      <div style={styles.wall} />

      {/* Spray paint splatters decoration */}
      {[...Array(6)].map((_, i) => (
        <div key={i} style={{
          ...styles.splatter,
          left: `${10 + i * 15}%`,
          top: `${Math.random() * 80 + 10}%`,
          background: PRESET_COLORS[i],
          width: `${60 + i * 20}px`,
          height: `${60 + i * 20}px`,
          opacity: 0.08 + i * 0.02,
          animationDelay: `${i * 0.3}s`,
        }} />
      ))}

      <div style={styles.card}>
        {/* Title with drip effect */}
        <div style={styles.titleWrap}>
          <div style={styles.titleLine}>O</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <div style={styles.titleBig}>QUINTAL</div>
          </div>
          {/* Drip lines */}
          {[25, 45, 65, 82].map((left, i) => (
            <div key={i} style={{
              position: 'absolute',
              left: `${left}%`,
              bottom: '-20px',
              width: '4px',
              background: 'var(--red)',
              borderRadius: '0 0 4px 4px',
              animation: `drip ${1.5 + i * 0.4}s ease-in ${i * 0.2}s infinite`,
              transformOrigin: 'top',
            }} />
          ))}
        </div>

        <p style={styles.subtitle}>// O MURAL DA GALERA //</p>

        <div style={styles.form}>
          <label style={styles.label}>SEU NOME NO MURO</label>
          <input
            style={{
              ...styles.input,
              ...(shaking ? styles.shake : {}),
              borderColor: color,
            }}
            placeholder="ex: VANDAL_99"
            value={name}
            maxLength={20}
            onChange={e => setName(e.target.value.toUpperCase())}
            onKeyDown={e => e.key === 'Enter' && handleEnter()}
          />

          <label style={styles.label}>SUA COR — IDENTIDADE NO QUINTAL</label>
          <div style={styles.colorGrid}>
            {PRESET_COLORS.map(c => (
              <button
                key={c}
                onClick={() => setColor(c)}
                style={{
                  ...styles.colorDot,
                  background: c,
                  border: color === c ? `3px solid var(--white)` : '3px solid transparent',
                  transform: color === c ? 'scale(1.2)' : 'scale(1)',
                  boxShadow: color === c ? `0 0 12px ${c}88` : 'none',
                }}
              />
            ))}
          </div>

          {/* Custom color */}
          <div style={styles.customColor}>
            <span style={styles.label}>OU ESCOLHA A SUA:</span>
            <input
              type="color"
              value={color}
              onChange={e => setColor(e.target.value)}
              style={styles.colorPicker}
            />
          </div>

          {/* Preview badge */}
          <div style={styles.preview}>
            <div style={{
              ...styles.badge,
              background: color,
              boxShadow: `0 0 20px ${color}66`,
            }}>
              {name || 'SEU_NOME'}
            </div>
            <span style={styles.previewLabel}>— assim você vai aparecer</span>
          </div>

          <button
            style={styles.enterBtn}
            onClick={handleEnter}
          >
            ▶ ENTRAR NO QUINTAL
          </button>
        </div>

        <p style={styles.footer}>ACESSO PÚBLICO · MURAL COLABORATIVO</p>
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
  wall: {
    position: 'absolute', inset: 0,
    backgroundImage: `
      repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.012) 40px, rgba(255,255,255,0.012) 41px),
      repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.012) 40px, rgba(255,255,255,0.012) 41px)
    `,
  },
  splatter: {
    position: 'absolute',
    borderRadius: '50%',
    filter: 'blur(30px)',
    animation: 'flicker 4s ease-in-out infinite',
  },
  card: {
    position: 'relative',
    background: 'rgba(13,13,13,0.95)',
    border: '2px solid var(--red)',
    padding: '48px 40px',
    maxWidth: '480px',
    width: '90%',
    boxShadow: '8px 8px 0 var(--red-dark), 16px 16px 0 rgba(214,40,40,0.2)',
    animation: 'stamp-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },
  titleWrap: {
    position: 'relative',
    marginBottom: '24px',
    lineHeight: 1,
  },
  titleLine: {
    fontFamily: 'var(--font-display)',
    fontSize: '28px',
    color: 'var(--red)',
    letterSpacing: '4px',
  },
  titleBig: {
    fontFamily: 'var(--font-display)',
    fontSize: '72px',
    color: 'var(--white)',
    letterSpacing: '-2px',
    textShadow: '4px 4px 0 var(--red)',
    lineHeight: 1,
  },
  subtitle: {
    fontFamily: 'var(--font-body)',
    fontSize: '11px',
    color: 'var(--red)',
    letterSpacing: '3px',
    marginBottom: '32px',
  },
  form: {
    display: 'flex', flexDirection: 'column', gap: '12px',
  },
  label: {
    fontFamily: 'var(--font-body)',
    fontSize: '10px',
    color: 'var(--paper)',
    letterSpacing: '2px',
    marginBottom: '4px',
  },
  input: {
    background: 'rgba(255,255,255,0.04)',
    border: '2px solid',
    borderRadius: '0',
    padding: '12px 16px',
    fontFamily: 'var(--font-display)',
    fontSize: '22px',
    color: 'var(--white)',
    outline: 'none',
    letterSpacing: '2px',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    width: '100%',
  },
  shake: {
    animation: 'wobble 0.1s ease 4',
  },
  colorGrid: {
    display: 'flex', flexWrap: 'wrap', gap: '8px',
    marginBottom: '8px',
  },
  colorDot: {
    width: '32px', height: '32px',
    borderRadius: '50%',
    cursor: 'pointer',
    transition: 'transform 0.15s, box-shadow 0.15s',
  },
  customColor: {
    display: 'flex', alignItems: 'center', gap: '12px',
  },
  colorPicker: {
    width: '40px', height: '32px',
    border: '2px solid var(--white)',
    background: 'none',
    cursor: 'pointer',
    padding: 0,
  },
  preview: {
    display: 'flex', alignItems: 'center', gap: '12px',
    margin: '8px 0',
  },
  badge: {
    fontFamily: 'var(--font-display)',
    fontSize: '14px',
    padding: '4px 12px',
    color: 'var(--black)',
    letterSpacing: '1px',
  },
  previewLabel: {
    fontFamily: 'var(--font-body)',
    fontSize: '10px',
    color: 'var(--paper)',
    fontStyle: 'italic',
  },
  enterBtn: {
    marginTop: '16px',
    background: 'var(--red)',
    border: 'none',
    padding: '16px',
    fontFamily: 'var(--font-display)',
    fontSize: '18px',
    color: 'var(--white)',
    letterSpacing: '2px',
    cursor: 'pointer',
    boxShadow: 'var(--shadow-brutal)',
    transition: 'transform 0.1s, box-shadow 0.1s',
    width: '100%',
  },
  footer: {
    marginTop: '24px',
    fontFamily: 'var(--font-body)',
    fontSize: '9px',
    color: 'rgba(240,237,230,0.3)',
    letterSpacing: '2px',
    textAlign: 'center',
  },
};
