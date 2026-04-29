// AuthScreen.jsx — posições medidas por pixel analysis na imagem original
import { useState, useRef, useCallback } from 'react';
import { useUser } from '../../lib/UserContext';

const COLORS = [
  '#FF3B30','#FF6B00','#FFCC00','#34C759',
  '#007AFF','#AF52DE','#FF2D55','#00C7BE',
  '#FF9500','#30D158','#64D2FF','#BF5AF2',
];

/* ─── Canvas de pixo ─── */
function StickerCanvas({ canvasRef }) {
  const drawing = useRef(false);
  const last    = useRef(null);
  const [drawn, setDrawn] = useState(false);

  const getXY = (e) => {
    const c = canvasRef.current;
    const r = c.getBoundingClientRect();
    const sx = c.width / r.width, sy = c.height / r.height;
    const s = e.touches ? e.touches[0] : e;
    return { x: (s.clientX - r.left) * sx, y: (s.clientY - r.top) * sy };
  };
  const down = useCallback((e) => {
    e.preventDefault(); drawing.current = true;
    last.current = getXY(e); setDrawn(true);
  }, []);
  const move = useCallback((e) => {
    e.preventDefault();
    if (!drawing.current) return;
    const p = getXY(e), l = last.current || p;
    const ctx = canvasRef.current.getContext('2d');
    ctx.strokeStyle = '#CC1F1A'; ctx.lineWidth = 8;
    ctx.lineCap = ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(l.x, l.y); ctx.lineTo(p.x, p.y); ctx.stroke();
    last.current = p;
  }, []);
  const up = useCallback(() => { drawing.current = false; last.current = null; }, []);
  const clear = (e) => {
    e.stopPropagation();
    canvasRef.current.getContext('2d').clearRect(0, 0, 800, 560);
    setDrawn(false);
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <canvas ref={canvasRef} width={800} height={560}
        style={{ width: '100%', height: '100%', touchAction: 'none', cursor: 'crosshair', display: 'block' }}
        onMouseDown={down} onMouseMove={move} onMouseUp={up} onMouseLeave={up}
        onTouchStart={down} onTouchMove={move} onTouchEnd={up}
      />
      {drawn && (
        <button onClick={clear} style={{
          position: 'absolute', bottom: 6, right: 8,
          background: 'rgba(0,0,0,0.3)', border: 'none', borderRadius: 4,
          fontFamily: 'var(--font-body)', fontSize: 10, letterSpacing: 1,
          color: 'rgba(255,255,255,0.6)', padding: '3px 9px', cursor: 'pointer',
        }}>LIMPAR</button>
      )}
    </div>
  );
}

/* ─── Popup de cores ─── */
function ColorPopup({ color, setColor, onClose }) {
  return (
    <div onClick={e => e.stopPropagation()} style={{
      position: 'absolute', top: '110%', left: 0,
      background: 'rgba(8,8,8,0.97)',
      border: '2px solid rgba(255,255,255,0.12)',
      borderRadius: 6, padding: '12px 14px',
      boxShadow: '6px 6px 0 rgba(0,0,0,0.8)', zIndex: 200, width: 200,
    }}>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 8, color: 'rgba(255,255,255,0.4)', letterSpacing: 2, marginBottom: 10 }}>SUA COR</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 10 }}>
        {COLORS.map(c => (
          <button key={c} onClick={() => { setColor(c); onClose(); }} style={{
            width: 26, height: 26, borderRadius: '50%', background: c,
            padding: 0, cursor: 'pointer',
            border: color === c ? '3px solid white' : '2px solid transparent',
            transform: color === c ? 'scale(1.3)' : 'scale(1)',
            boxShadow: color === c ? `0 0 12px ${c}` : 'none',
            transition: 'all 0.12s',
          }}/>
        ))}
      </div>
      <input type="color" value={color} onChange={e => setColor(e.target.value)}
        style={{ width: '100%', height: 28, border: '1.5px solid rgba(255,255,255,0.2)', background: 'none', cursor: 'pointer', padding: 0 }}/>
    </div>
  );
}

/* ─── Tela principal ─── */
export default function AuthScreen() {
  const { login } = useUser();
  const [name,       setName]       = useState('');
  const [color,      setColor]      = useState('#FF3B30');
  const [photoUrl,   setPhotoUrl]   = useState(null);
  const [showColors, setShowColors] = useState(false);
  const [shaking,    setShaking]    = useState(false);
  const photoInputRef = useRef(null);
  const stickerCanvas = useRef(null);

  const handlePhoto = (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const tmp = document.createElement('canvas');
        tmp.width = tmp.height = 200;
        const ctx = tmp.getContext('2d');
        const s = Math.min(img.width, img.height);
        ctx.drawImage(img, (img.width-s)/2, (img.height-s)/2, s, s, 0, 0, 200, 200);
        setPhotoUrl(tmp.toDataURL('image/jpeg', 0.8));
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleEnter = () => {
    if (!name.trim()) { setShaking(true); setTimeout(() => setShaking(false), 600); return; }
    const tagData = stickerCanvas.current?.toDataURL('image/png') || null;
    login(name.trim(), color, { photoUrl, tagData });
  };

  return (
    /*
      Outer: tela preta completa, centraliza o frame
    */
    <div style={{
      position: 'fixed', inset: 0,
      background: '#000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }} onClick={() => showColors && setShowColors(false)}>

      {/*
        Frame: proporção 16:9 exata.
        max-width + max-height com aspect-ratio garante que
        a imagem NUNCA é cortada — encolhe para caber.
      */}
      <div style={{
        position: 'relative',
        aspectRatio: '16 / 9',
        maxWidth: '100vw',
        maxHeight: '100vh',
        width: 'auto',
        height: '100vh',
      }}>
        {/* Imagem de fundo */}
        <img
          src="/OQuintal.png"
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            display: 'block',
            objectFit: 'fill',  /* fill = estica para ocupar exatamente o frame */
          }}
          draggable={false}
        />

        {/* ══════════════════════════════════════
            FOTO — circle
            Medido: left=6.4% top=32.2% w=15.4% h=21.1%
        ══════════════════════════════════════ */}
        <input ref={photoInputRef} type="file" accept="image/*"
          style={{ display: 'none' }} onChange={handlePhoto}/>
        <div onClick={() => photoInputRef.current?.click()} style={{
          position: 'absolute',
          left: '6.4%', top: '32.2%',
          width: '15.4%', height: '21.1%',
          borderRadius: '50%',
          cursor: 'pointer', overflow: 'hidden',
          zIndex: 10,
        }}>
          {photoUrl && (
            <img src={photoUrl} style={{
              width: '100%', height: '100%',
              objectFit: 'cover', borderRadius: '50%', opacity: 0.92,
            }}/>
          )}
        </div>

        {/* ══════════════════════════════════════
            NOME — input
            Medido: left=24.5% top=32.2% w=17.5% h=21.1%
        ══════════════════════════════════════ */}
        <div style={{
          position: 'absolute',
          left: '24.5%', top: '32.2%',
          width: '17.5%', height: '21.1%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: shaking ? 'wobble 0.12s ease 4' : 'none',
          zIndex: 10,
        }}>
          <input style={{
            background: 'transparent', border: 'none', outline: 'none',
            borderBottom: `2px solid ${color}`,
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(12px, 2vw, 28px)',
            color: 'white', letterSpacing: 3, textAlign: 'center',
            width: '85%', caretColor: color,
            textShadow: '0 1px 6px rgba(0,0,0,0.9)',
          }}
            placeholder="SEU TAG" value={name} maxLength={14}
            onChange={e => setName(e.target.value.toUpperCase())}
            onKeyDown={e => e.key === 'Enter' && handleEnter()}
            autoFocus
          />
        </div>

        {/* ══════════════════════════════════════
            CORES — seletor
            Medido: left=6.4% top=70.3% w=15.4% h=19.7%
        ══════════════════════════════════════ */}
        <div onClick={e => { e.stopPropagation(); setShowColors(v => !v); }} style={{
          position: 'absolute',
          left: '6.4%', top: '61.8%',
          width: '15.4%', height: '15.0%',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 10,
        }}>
          <div style={{
            width: '28%', aspectRatio: '1', borderRadius: '50%',
            background: color,
            boxShadow: `0 0 20px ${color}bb, 0 0 6px ${color}`,
            opacity: 0.9, transition: 'background 0.2s',
          }}/>
          {showColors && (
            <ColorPopup color={color} setColor={setColor} onClose={() => setShowColors(false)}/>
          )}
        </div>

        {/* ══════════════════════════════════════
            STICKER CANVAS — cobre o card inteiro
            Medido: left=50.5% top=23.1% w=39.9% h=38.4%
            Rotação: ~10deg
        ══════════════════════════════════════ */}
        <div style={{
          position: 'absolute',
          left: '64.5%', top: '29.0%',
          width: '30.0%', height: '30.0%',
          transform: 'rotate(9deg)',
          transformOrigin: 'top left',
          overflow: 'hidden',
          zIndex: 10,
        }}>
          <StickerCanvas canvasRef={stickerCanvas}/>
        </div>

        {/* ══════════════════════════════════════
            ENTRAR — botão
            Medido: left=24.5% top=70.3% w=38.4% h=19.7%
        ══════════════════════════════════════ */}
        <button onClick={handleEnter} style={{
          position: 'absolute',
          left: '36.5%', top: '73.5%',
          width: '27%', height: '17.0%',
          background: 'transparent', border: 'none',
          cursor: 'pointer', borderRadius: 8, zIndex: 10,
        }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        />

      </div>
    </div>
  );
}
