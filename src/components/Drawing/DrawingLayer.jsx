// src/components/Drawing/DrawingLayer.jsx
import { useRef, useEffect, useState, useCallback } from 'react';
import { addDrawing } from '../../hooks/useMural';

export default function DrawingLayer({ user, quintalId, canvasOffset, onFinish }) {
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const lastPoint = useRef(null);
  const dripsRef = useRef([]);
  const animFrameRef = useRef(null);
  const [saved, setSaved] = useState(false);

  const getCtx = () => canvasRef.current?.getContext('2d');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const animateDrips = () => {
      const ctx = getCtx();
      if (!ctx) return;
      dripsRef.current = dripsRef.current.filter(d => d.length < 80);
      dripsRef.current.forEach(drip => {
        drip.length += drip.speed;
        ctx.beginPath();
        ctx.moveTo(drip.x, drip.y);
        ctx.lineTo(drip.x, drip.y + drip.length);
        ctx.strokeStyle = drip.color + 'bb';
        ctx.lineWidth = drip.width;
        ctx.lineCap = 'round';
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(drip.x, drip.y + drip.length, drip.width * 1.6, 0, Math.PI * 2);
        ctx.fillStyle = drip.color + '77';
        ctx.fill();
      });
      animFrameRef.current = requestAnimationFrame(animateDrips);
    };
    animFrameRef.current = requestAnimationFrame(animateDrips);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, []);

  const roughStroke = (ctx, x1, y1, x2, y2, color) => {
    ctx.beginPath();
    ctx.moveTo(x1 + (Math.random()-0.5)*3, y1 + (Math.random()-0.5)*3);
    ctx.lineTo(x2 + (Math.random()-0.5)*3, y2 + (Math.random()-0.5)*3);
    ctx.strokeStyle = color;
    ctx.lineWidth = 5 + Math.random() * 10;
    ctx.globalAlpha = 0.7 + Math.random() * 0.25;
    ctx.lineCap = 'round';
    ctx.stroke();
    ctx.globalAlpha = 1;
  };

  const spawnDrip = (x, y, color) => {
    if (Math.random() > 0.06) return;
    dripsRef.current.push({ x: x + (Math.random()-0.5)*10, y, length: 0, speed: 0.4 + Math.random() * 1.8, color, width: 1.5 + Math.random() * 3 });
  };

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const src = e.touches ? e.touches[0] : e;
    return { x: src.clientX - rect.left, y: src.clientY - rect.top };
  };

  const startDraw = useCallback((e) => { e.preventDefault(); isDrawing.current = true; lastPoint.current = getPos(e); }, []);
  const draw = useCallback((e) => {
    if (!isDrawing.current) return;
    e.preventDefault();
    const pos = getPos(e);
    roughStroke(getCtx(), lastPoint.current.x, lastPoint.current.y, pos.x, pos.y, user?.color || '#D62828');
    spawnDrip(pos.x, pos.y, user?.color || '#D62828');
    lastPoint.current = pos;
  }, [user]);
  const stopDraw = useCallback(() => { isDrawing.current = false; }, []);

  const handleSave = async () => {
    setSaved(true);
    const dataUrl = canvasRef.current.toDataURL('image/png');
    try {
      await addDrawing({ quintalId, user, dataUrl, x: 150 + Math.random() * 200, y: 150 + Math.random() * 200 });
    } catch (e) { console.error(e); }
    onFinish();
  };

  const handleClear = () => {
    const c = canvasRef.current;
    getCtx()?.clearRect(0, 0, c.width, c.height);
    dripsRef.current = [];
  };

  return (
    <div style={styles.overlay}>
      <canvas ref={canvasRef} style={styles.canvas}
        onMouseDown={startDraw} onMouseMove={draw} onMouseUp={stopDraw} onMouseLeave={stopDraw}
        onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={stopDraw}
      />
      <div style={styles.controls}>
        <div style={styles.brush}>
          <div style={{ width: 16, height: 16, borderRadius: '50%', background: user?.color || 'var(--red)', boxShadow: `0 0 8px ${user?.color}`, flexShrink: 0 }} />
          <span style={styles.brushLabel}>{user?.name}</span>
        </div>
        <button style={styles.clearBtn} onClick={handleClear}>LIMPAR</button>
        <button style={styles.saveBtn} onClick={handleSave} disabled={saved}>{saved ? '...' : '📌 COLAR'}</button>
        <button style={styles.cancelBtn} onClick={onFinish}>✕</button>
      </div>
    </div>
  );
}

const styles = {
  overlay: { position: 'absolute', inset: 0, zIndex: 50 },
  canvas: { position: 'absolute', inset: 0, width: '100%', height: '100%', touchAction: 'none', cursor: 'crosshair' },
  controls: {
    position: 'absolute', top: '12px', left: '50%', transform: 'translateX(-50%)',
    display: 'flex', alignItems: 'center', gap: '8px',
    background: 'rgba(13,13,13,0.95)', border: '2px solid var(--red)',
    padding: '8px 14px', boxShadow: 'var(--shadow-brutal)', zIndex: 60,
  },
  brush: { display: 'flex', alignItems: 'center', gap: '6px' },
  brushLabel: { fontFamily: 'var(--font-body)', fontSize: '9px', color: 'var(--white)', letterSpacing: '1px' },
  clearBtn: { background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'var(--white)', fontFamily: 'var(--font-body)', fontSize: '9px', padding: '5px 10px', cursor: 'pointer', letterSpacing: '1px' },
  saveBtn: { background: 'var(--red)', border: 'none', color: 'var(--white)', fontFamily: 'var(--font-display)', fontSize: '13px', padding: '7px 14px', cursor: 'pointer', letterSpacing: '1px' },
  cancelBtn: { background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'var(--white)', width: '28px', height: '28px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
};
