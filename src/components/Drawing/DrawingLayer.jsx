// src/components/Drawing/DrawingLayer.jsx
// KEY FIX: The HTML canvas covers the full viewport. When we save the drawing,
// we record x/y = canvasOffset (negated) so the drawing appears at EXACTLY
// the viewport position, translated into wall-space coordinates.
import { useRef, useEffect, useState, useCallback } from 'react';
import { addDrawing } from '../../hooks/useMural';

/* ── Spray can sound via Web Audio ── */
let audioCtx = null;
function getAudioCtx() {
  if (!audioCtx) {
    try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch {}
  }
  return audioCtx;
}
function playSprayBurst() {
  try {
    const ctx = getAudioCtx();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();
    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.12, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) {
      // White noise with quick envelope
      const env = Math.pow(1 - i / d.length, 0.4);
      d[i] = (Math.random() * 2 - 1) * env * 0.35;
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 3500;
    bp.Q.value = 0.7;
    const gain = ctx.createGain();
    gain.gain.value = 0.6;
    src.connect(bp);
    bp.connect(gain);
    gain.connect(ctx.destination);
    src.start();
  } catch {}
}

export default function DrawingLayer({ user, quintalId, canvasOffset, onFinish }) {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const last = useRef(null);
  const drips = useRef([]);
  const rafId = useRef(null);
  const sprayInterval = useRef(null);
  const [brushSize, setBrushSize] = useState(14);
  const [saving, setSaving] = useState(false);
  const color = user?.color || '#D62828';

  /* ── Resize canvas to fill viewport ── */
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const resize = () => {
      // Save existing content
      const tmp = document.createElement('canvas');
      tmp.width = c.width; tmp.height = c.height;
      tmp.getContext('2d').drawImage(c, 0, 0);
      c.width = c.offsetWidth;
      c.height = c.offsetHeight;
      c.getContext('2d').drawImage(tmp, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  /* ── Drip animation loop ── */
  useEffect(() => {
    const animate = () => {
      const c = canvasRef.current;
      if (!c) return;
      const ctx = c.getContext('2d');
      drips.current = drips.current.filter(d => d.len < d.maxLen);
      for (const d of drips.current) {
        d.len += d.speed;
        const t = d.len / d.maxLen;
        // Taper: wide at top, narrows to round blob
        const w = d.baseW * (1 - t * 0.6);
        ctx.save();
        ctx.globalAlpha = 0.7 * (1 - t * 0.5);
        // Body of drip
        ctx.beginPath();
        ctx.moveTo(d.x - w / 2, d.y);
        ctx.bezierCurveTo(
          d.x - w / 2, d.y + d.len * 0.4,
          d.x - w * 0.25, d.y + d.len * 0.75,
          d.x, d.y + d.len
        );
        ctx.bezierCurveTo(
          d.x + w * 0.25, d.y + d.len * 0.75,
          d.x + w / 2, d.y + d.len * 0.4,
          d.x + w / 2, d.y
        );
        ctx.closePath();
        ctx.fillStyle = d.color;
        ctx.fill();
        // Round drop at tip
        const r = w * 0.9;
        ctx.beginPath();
        ctx.arc(d.x, d.y + d.len, r, 0, Math.PI * 2);
        ctx.fillStyle = d.color;
        ctx.fill();
        ctx.restore();
      }
      rafId.current = requestAnimationFrame(animate);
    };
    rafId.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId.current);
  }, []);

  /* ── Spray stroke ── */
  const spray = useCallback((ctx, x1, y1, x2, y2, size) => {
    const dist = Math.hypot(x2 - x1, y2 - y1);
    const steps = Math.max(1, Math.floor(dist / 2));
    for (let s = 0; s <= steps; s++) {
      const t = steps ? s / steps : 0;
      const cx = x1 + (x2 - x1) * t;
      const cy = y1 + (y2 - y1) * t;

      // Core — dense center
      ctx.beginPath();
      ctx.arc(cx, cy, size * 0.5, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.7 + Math.random() * 0.3;
      ctx.fill();

      // Mid ring
      for (let m = 0; m < Math.floor(size * 1.2); m++) {
        const a = Math.random() * Math.PI * 2;
        const r = size * 0.5 * Math.sqrt(Math.random());
        ctx.beginPath();
        ctx.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 0.8 + Math.random() * 1.2, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.3 + Math.random() * 0.4;
        ctx.fill();
      }

      // Outer mist particles
      for (let m = 0; m < Math.floor(size * 0.6); m++) {
        const a = Math.random() * Math.PI * 2;
        const r = size * (0.8 + Math.random() * 0.6);
        ctx.beginPath();
        ctx.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 0.3 + Math.random() * 0.8, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.05 + Math.random() * 0.15;
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  }, [color]);

  /* ── Drip spawner ── */
  const spawnDrip = useCallback((x, y) => {
    if (Math.random() > 0.05) return;
    drips.current.push({
      x: x + (Math.random() - 0.5) * brushSize * 0.8,
      y,
      len: 0,
      maxLen: 28 + Math.random() * 55,
      speed: 0.9 + Math.random() * 1.4,
      baseW: 2.5 + Math.random() * (brushSize * 0.25),
      color,
    });
  }, [color, brushSize]);

  /* ── Pointer helpers ── */
  const getXY = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const src = e.touches ? e.touches[0] : e;
    return { x: src.clientX - rect.left, y: src.clientY - rect.top };
  };

  const startDraw = useCallback((e) => {
    e.preventDefault();
    drawing.current = true;
    last.current = getXY(e);
    // Loop spray sound while pressing
    playSprayBurst();
    sprayInterval.current = setInterval(playSprayBurst, 110);
  }, []);

  const moveDraw = useCallback((e) => {
    if (!drawing.current) return;
    e.preventDefault();
    const ctx = canvasRef.current.getContext('2d');
    const pos = getXY(e);
    spray(ctx, last.current.x, last.current.y, pos.x, pos.y, brushSize);
    spawnDrip(pos.x, pos.y);
    last.current = pos;
  }, [spray, spawnDrip, brushSize]);

  const stopDraw = useCallback(() => {
    drawing.current = false;
    clearInterval(sprayInterval.current);
  }, []);

  const clearCanvas = () => {
    const c = canvasRef.current;
    c.getContext('2d').clearRect(0, 0, c.width, c.height);
    drips.current = [];
  };

  /* ── SAVE: the drawing is already in screen-space.
     Wall-space position = screen-space top-left minus the canvas offset.
     So x = -canvasOffset.x, y = -canvasOffset.y
     This makes the drawing appear EXACTLY where the user drew it on screen. ── */
  const handleSave = async () => {
    setSaving(true);
    clearInterval(sprayInterval.current);
    const c = canvasRef.current;
    const dataUrl = c.toDataURL('image/png');
    // Position in wall (canvas) space
    const x = -canvasOffset.current.x;
    const y = -canvasOffset.current.y;
    try {
      await addDrawing({ quintalId, user, dataUrl, x, y });
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar graffiti.');
    }
    onFinish();
  };

  return (
    <div style={S.wrap}>
      <canvas
        ref={canvasRef}
        style={S.canvas}
        onMouseDown={startDraw}
        onMouseMove={moveDraw}
        onMouseUp={stopDraw}
        onMouseLeave={stopDraw}
        onTouchStart={startDraw}
        onTouchMove={moveDraw}
        onTouchEnd={stopDraw}
      />

      {/* Controls bar */}
      <div style={S.bar}>
        {/* Color swatch */}
        <div style={{ ...S.swatch, background: color, boxShadow: `0 0 10px ${color}` }} />
        <span style={S.name}>{user?.name}</span>

        {/* Brush size */}
        <div style={S.sliderGroup}>
          <span style={S.sliderLabel}>TAMANHO</span>
          <input type="range" min="4" max="44" value={brushSize}
            onChange={e => setBrushSize(+e.target.value)} style={S.slider} />
          <div style={{ ...S.dot, width: brushSize, height: brushSize, background: color }} />
        </div>

        <button style={S.btnGhost} onClick={clearCanvas}>LIMPAR</button>
        <button style={S.btnSave} onClick={handleSave} disabled={saving}>
          {saving ? '...' : '📌 COLAR'}
        </button>
        <button style={S.btnClose} onClick={onFinish}>✕</button>
      </div>
    </div>
  );
}

const S = {
  wrap: { position: 'absolute', inset: 0, zIndex: 50, pointerEvents: 'auto' },
  canvas: {
    position: 'absolute', inset: 0,
    width: '100%', height: '100%',
    touchAction: 'none', cursor: 'crosshair',
  },
  bar: {
    position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)',
    display: 'flex', alignItems: 'center', gap: 10,
    background: 'rgba(20,20,20,0.98)', border: '2px solid var(--red)',
    padding: '8px 14px', boxShadow: '4px 4px 0 var(--red-dark)',
    zIndex: 60, flexWrap: 'wrap', maxWidth: '94vw',
    animation: 'stamp-in 0.3s ease',
  },
  swatch: {
    width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
    border: '2px solid var(--white)',
  },
  name: {
    fontFamily: 'var(--font-display)', fontSize: 13,
    color: 'var(--white)', letterSpacing: 1,
  },
  sliderGroup: { display: 'flex', alignItems: 'center', gap: 6 },
  sliderLabel: {
    fontFamily: 'var(--font-body)', fontSize: 8,
    color: 'var(--paper)', letterSpacing: 1, whiteSpace: 'nowrap',
  },
  slider: { width: 80, accentColor: 'var(--red)', cursor: 'pointer' },
  dot: { borderRadius: '50%', flexShrink: 0, minWidth: 4, minHeight: 4, transition: 'all 0.15s' },
  btnGhost: {
    background: 'transparent', border: '1px solid rgba(255,255,255,0.25)',
    color: 'var(--white)', fontFamily: 'var(--font-body)',
    fontSize: 9, padding: '5px 10px', cursor: 'pointer', letterSpacing: 1,
  },
  btnSave: {
    background: 'var(--red)', border: 'none', color: 'var(--white)',
    fontFamily: 'var(--font-display)', fontSize: 14,
    padding: '7px 14px', cursor: 'pointer', letterSpacing: 1,
    boxShadow: '3px 3px 0 var(--red-dark)',
  },
  btnClose: {
    background: 'transparent', border: '1px solid rgba(255,255,255,0.2)',
    color: 'var(--white)', width: 28, height: 28, cursor: 'pointer',
    fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
};
