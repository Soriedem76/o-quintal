// AuthScreen.jsx — UI estilizada por cima das caixinhas guia
import { useState, useRef, useCallback } from 'react';
import { useUser } from '../../lib/UserContext';

const COLORS = [
  '#FF3B30','#FF6B00','#FFCC00','#34C759',
  '#007AFF','#AF52DE','#FF2D55','#00C7BE',
  '#FF9500','#30D158','#64D2FF','#BF5AF2',
];

/* ─── Canvas de pixo — cor dinâmica ─── */
function StickerCanvas({ canvasRef, strokeColor }) {
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
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 27;
    ctx.lineCap = ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(l.x, l.y); ctx.lineTo(p.x, p.y); ctx.stroke();
    last.current = p;
  }, [strokeColor]);
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
          position: 'absolute', bottom: 8, right: 10,
          background: 'rgba(10,10,10,0.85)',
          border: `1px solid ${strokeColor}`,
          borderRadius: 3,
          fontFamily: 'var(--font-display)', fontSize: 10,
          letterSpacing: 2, color: strokeColor,
          padding: '3px 10px', cursor: 'pointer',
          boxShadow: `2px 2px 0 rgba(0,0,0,0.8)`,
        }}>LIMPAR</button>
      )}
    </div>
  );
}

/* ─── Popup de cores ─── */
function ColorPopup({ color, setColor, onClose }) {
  return (
    <div onClick={e => e.stopPropagation()} style={{
      position: 'absolute', top: 'calc(100% + 8px)', left: 0,
      background: '#111',
      border: '2px solid #CC1F1A',
      borderRadius: 4, padding: '14px',
      boxShadow: '4px 4px 0 #7B0000, 0 0 30px rgba(200,40,30,0.25)',
      zIndex: 300, width: 210,
    }}>
      <div style={{
        fontFamily: 'var(--font-display)', fontSize: 11,
        color: '#CC1F1A', letterSpacing: 3, marginBottom: 12,
      }}>SUA COR</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
        {COLORS.map(c => (
          <button key={c} onClick={() => { setColor(c); onClose(); }} style={{
            width: 28, height: 28, borderRadius: '50%', background: c,
            padding: 0, cursor: 'pointer',
            border: color === c ? '3px solid white' : '2px solid rgba(255,255,255,0.1)',
            transform: color === c ? 'scale(1.25)' : 'scale(1)',
            boxShadow: color === c ? `0 0 14px ${c}` : 'none',
            transition: 'all 0.12s',
          }}/>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: 8, color: 'rgba(255,255,255,0.4)', letterSpacing: 2 }}>CUSTOM</span>
        <input type="color" value={color} onChange={e => setColor(e.target.value)}
          style={{ flex: 1, height: 26, border: '2px solid rgba(255,255,255,0.15)', background: 'none', cursor: 'pointer', padding: 0, borderRadius: 3 }}/>
      </div>
    </div>
  );
}

/* ─── Caixinha estilo do site ─── */
function Box({ children, style, onClick, color, hover }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov && onClick ? 'rgba(26,26,26,0.92)' : 'rgba(20,20,20,0.88)',
        border: `2px solid ${hov && onClick ? (color || '#CC1F1A') : 'rgba(255,255,255,0.08)'}`,
        borderRadius: 10,
        boxShadow: hov && onClick
          ? `0 0 20px ${color || '#CC1F1A'}33, 4px 4px 0 rgba(0,0,0,0.7)`
          : '4px 4px 0 rgba(0,0,0,0.7)',
        transition: 'all 0.15s',
        backdropFilter: 'blur(4px)',
        cursor: onClick ? 'pointer' : 'default',
        overflow: 'visible',
        ...style,
      }}
    >{children}</div>
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
    <div style={{
      position: 'fixed', inset: 0,
      background: '#0D0D0D',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }} onClick={() => showColors && setShowColors(false)}>

      <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>

        {/* Imagem de fundo */}
        <img src="/OQuintal.png" style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          display: 'block', objectFit: 'cover',
        }} draggable={false}/>

        {/* ══ FOTO ══ */}
        <input ref={photoInputRef} type="file" accept="image/*"
          style={{ display: 'none' }} onChange={handlePhoto}/>
        <Box
          onClick={() => photoInputRef.current?.click()}
          color={color}
          style={{
            position: 'absolute',
            left: '6.4%', top: '28%',
            width: '15.4%', height: '30%',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 10,
            boxShadow: photoUrl
              ? `0 0 0 3px ${color}, 0 0 24px ${color}66, 4px 4px 0 rgba(0,0,0,0.7)`
              : '4px 4px 0 rgba(0,0,0,0.7)',
          }}
        >
          {photoUrl
            ? <img src={photoUrl} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}/>
            : (
              
                <svg width="38%" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
                

            )
          }
        </Box>

        {/* ══ NOME ══ */}
        <Box
          color={color}
          style={{
            position: 'absolute',
            left: '24.5%', top: '32.2%',
            width: '17.5%', height: '21.1%',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: '8%',
            animation: shaking ? 'wobble 0.12s ease 4' : 'none',
            zIndex: 10,
          }}
        >
          <span style={{
            fontFamily: 'var(--font-body)', fontSize: 'clamp(7px,0.7vw,11px)',
            color: 'rgba(255,255,255,0.35)', letterSpacing: 3,
          }}>NOME</span>
          <input
            style={{
              background: 'transparent', border: 'none', outline: 'none',
              borderBottom: `2px solid ${color}`,
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(12px, 1.6vw, 24px)',
              color: 'white', letterSpacing: 4, textAlign: 'center',
              width: '80%', caretColor: color,
              textShadow: `0 0 16px ${color}55`,
              transition: 'border-color 0.2s',
              paddingBottom: 4,
            }}
            placeholder="SUA TAG"
            value={name} maxLength={14}
            onChange={e => setName(e.target.value.toUpperCase())}
            onKeyDown={e => e.key === 'Enter' && handleEnter()}
            autoFocus
          />
        </Box>

        {/* ══ CORES ══ */}
        {/* Popup fora do Box para não ser cortado pelo overflow */}
        {showColors && (
          <div style={{ position: 'absolute', left: '6.4%', top: 'calc(62.0% + 11.0% + 6px)', zIndex: 400 }}>
            <ColorPopup color={color} setColor={setColor} onClose={() => setShowColors(false)}/>
          </div>
        )}
        <Box
          color={color}
          style={{
            position: 'absolute',
            left: '6.4%', top: '62.0%',
            width: '15.4%', height: '11.0%',
            display: 'flex', alignItems: 'center',
            padding: '0 5%',
            zIndex: 10,
          }}
        >
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 'clamp(3px,0.4vw,7px)', width: '100%',
          }}>
            {COLORS.slice(0, 6).map(c => (
              <div key={c} onClick={e => { e.stopPropagation(); setColor(c); }} style={{
                width: 'clamp(11px,1.1vw,18px)', height: 'clamp(11px,1.1vw,18px)',
                borderRadius: 3, background: c,
                border: color === c ? '2px solid white' : '1.5px solid rgba(255,255,255,0.1)',
                boxShadow: color === c ? `0 0 10px ${c}` : 'none',
                transform: color === c ? 'scale(1.2)' : 'scale(1)',
                transition: 'all 0.12s', cursor: 'pointer', flexShrink: 0,
              }}/>
            ))}
            {/* + abre popup com TODAS as cores + picker custom */}
            <div onClick={e => { e.stopPropagation(); setShowColors(v => !v); }} style={{
              width: 'clamp(11px,1.1vw,18px)', height: 'clamp(11px,1.1vw,18px)',
              borderRadius: 3, border: `1.5px solid ${showColors ? color : 'rgba(255,255,255,0.25)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: showColors ? color : 'rgba(255,255,255,0.5)',
              fontSize: 'clamp(9px,1vw,14px)',
              cursor: 'pointer', flexShrink: 0,
              background: showColors ? `${color}22` : 'transparent',
              transition: 'all 0.15s',
            }}>+</div>
            {/* Quadrado da cor atual */}
            <div style={{
              width: 'clamp(11px,1.1vw,18px)', height: 'clamp(11px,1.1vw,18px)',
              borderRadius: 3, background: color,
              border: '2px solid rgba(255,255,255,0.25)',
              boxShadow: `0 0 12px ${color}99`,
              flexShrink: 0, transition: 'background 0.2s',
            }}/>
          </div>
        </Box>

        {/* ══ STICKER CANVAS ══ */}
        <div style={{
          position: 'absolute',
          left: '64.0%', top: '24.0%',
          width: '31%', height: '37.0%',
          transform: 'rotate(8deg)',
          transformOrigin: 'top left',
          overflow: 'visible',
          zIndex: 10,
        }}>
          <StickerCanvas canvasRef={stickerCanvas} strokeColor={color}/>
        </div>

        {/* ══ ENTRAR ══ */}
        <Box
          onClick={handleEnter}
          color={color}
          style={{
            position: 'absolute',
            left: '36.5%', top: '76.5%',
            width: '24.5%', height: '11.0%',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2%',
            zIndex: 10,
          }}
        >
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(12px, 1.5vw, 22px)',
            color: 'rgba(255,255,255,0.9)',
            letterSpacing: 5,
            textShadow: '2px 2px 0 rgba(0,0,0,0.8)',
            pointerEvents: 'none',
          }}>▶ ENTRAR</span>
        </Box>

      </div>
    </div>
  );
}
