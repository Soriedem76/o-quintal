// src/components/Mural/Canvas.jsx
// Fundo: #141414 puro, sem grade, com campo de estrelas estático
import { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import { updateItemPosition } from '../../hooks/useMural';
import PhotoCard from '../Photo/PhotoCard';
import PinItem from '../Pin/PinItem';
import DrawingItem from '../Drawing/DrawingItem';

export const CANVAS_W = 2400;
export const CANVAS_H = 1600;

/* ── Gera campo de estrelas uma única vez ── */
function useStars(count = 280) {
  return useMemo(() => Array.from({ length: count }, (_, i) => ({
    x: Math.random() * CANVAS_W,
    y: Math.random() * CANVAS_H,
    r: Math.random() < 0.15 ? 1.5 + Math.random() : 0.5 + Math.random() * 0.8,
    opacity: 0.15 + Math.random() * 0.65,
    delay: (Math.random() * 5).toFixed(2),
    dur:   (2.5 + Math.random() * 3.5).toFixed(2),
  })), []);
}

export default function Canvas({ items, loading, user, canvasOffset, mode }) {
  const vpRef    = useRef(null);
  const panning  = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const stars = useStars();

  const clamp = useCallback((ox, oy) => {
    const vp = vpRef.current;
    if (!vp) return { x: ox, y: oy };
    return {
      x: Math.max(Math.min(0, vp.offsetWidth  - CANVAS_W), Math.min(0, ox)),
      y: Math.max(Math.min(0, vp.offsetHeight - CANVAS_H), Math.min(0, oy)),
    };
  }, []);

  useEffect(() => {
    const vp = vpRef.current;
    if (!vp) return;
    const init = clamp(
      Math.floor((vp.offsetWidth  - CANVAS_W) / 2),
      Math.floor((vp.offsetHeight - CANVAS_H) / 2)
    );
    setOffset(init);
    canvasOffset.current = init;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { canvasOffset.current = offset; }, [offset, canvasOffset]);

  /* ── Pan ── */
  const beginPan = (x, y) => { panning.current = true; lastMouse.current = { x, y }; };
  const doPan = useCallback((x, y) => {
    if (!panning.current) return;
    const dx = x - lastMouse.current.x;
    const dy = y - lastMouse.current.y;
    lastMouse.current = { x, y };
    setOffset(prev => {
      const n = clamp(prev.x + dx, prev.y + dy);
      canvasOffset.current = n;
      return n;
    });
  }, [clamp, canvasOffset]);
  const endPan = () => { panning.current = false; };

  const onMD = (e) => { if (mode === 'pan' && e.button === 0) { e.preventDefault(); beginPan(e.clientX, e.clientY); } };
  const onMM = (e) => { if (mode === 'pan') doPan(e.clientX, e.clientY); };
  const onTS = (e) => { if (mode === 'pan') beginPan(e.touches[0].clientX, e.touches[0].clientY); };
  const onTM = (e) => { if (mode === 'pan') { e.preventDefault(); doPan(e.touches[0].clientX, e.touches[0].clientY); } };

  const handleMoved = useCallback((id, x, y) => {
    updateItemPosition(id, x, y).catch(console.error);
  }, []);

  if (loading) return (
    <div style={s.vp}>
      <div style={s.loadWrap}><span style={s.loadTxt}>CARREGANDO O QUINTAL...</span></div>
    </div>
  );

  return (
    <div
      ref={vpRef}
      style={{ ...s.vp, cursor: mode === 'pan' ? (panning.current ? 'grabbing' : 'grab') : 'default' }}
      onMouseDown={onMD} onMouseMove={onMM} onMouseUp={endPan} onMouseLeave={endPan}
      onTouchStart={onTS} onTouchMove={onTM} onTouchEnd={endPan}
    >
      {/* THE WALL — pure dark background, no grid */}
      <div style={{
        ...s.wall,
        width: CANVAS_W,
        height: CANVAS_H,
        transform: `translate(${offset.x}px,${offset.y}px)`,
      }}>

        {/* ── Stars field — SVG rendered once ── */}
        <svg
          style={s.starfield}
          viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
        >
          {stars.map((star, i) => (
            <circle
              key={i}
              cx={star.x} cy={star.y} r={star.r}
              fill="white"
              opacity={star.opacity}
              style={{
                animation: `star-twinkle ${star.dur}s ease-in-out ${star.delay}s infinite`,
              }}
            />
          ))}
          {/* Few brighter clusters like in the Laretta image */}
          {[
            { cx: 180, cy: 220 }, { cx: 920, cy: 80 }, { cx: 1800, cy: 140 },
            { cx: 400, cy: 900 }, { cx: 2100, cy: 600 }, { cx: 1200, cy: 1400 },
          ].map((c, i) => (
            <g key={`cluster-${i}`}>
              {Array.from({ length: 6 }, (_, j) => (
                <circle key={j}
                  cx={c.cx + (Math.random() * 30 - 15)}
                  cy={c.cy + (Math.random() * 30 - 15)}
                  r={0.4 + Math.random() * 0.6}
                  fill="white" opacity={0.4 + Math.random() * 0.5}
                />
              ))}
            </g>
          ))}
        </svg>

        {/* Items */}
        {items.map(item => {
          const x = item.x ?? 300;
          const y = item.y ?? 200;
          if (item.type === 'drawing') {
            return <DrawingItem key={item.id} item={item} style={{ left: x, top: y }} />;
          }
          return (
            <DraggableItem
              key={item.id}
              id={item.id}
              initX={x}
              initY={y}
              disabled={mode !== 'pan'}
              onMoved={handleMoved}
            >
              {(dragging) =>
                item.type === 'photo'
                  ? <PhotoCard item={item} user={user} dragging={dragging} />
                  : <PinItem item={item} user={user} />
              }
            </DraggableItem>
          );
        })}
      </div>

      {/* Vignette edges */}
      {['T','B','L','R'].map(d => <div key={d} style={s[`e${d}`]} />)}
    </div>
  );
}

/* ── DraggableItem ──────────────────────────────────────── */
function DraggableItem({ id, initX, initY, disabled, onMoved, children }) {
  const [pos, setPos]         = useState({ x: initX, y: initY });
  const [dragging, setDragging] = useState(false);
  const [tilt, setTilt]       = useState(0);
  const drag    = useRef(null);
  const posRef  = useRef(pos);
  const synced  = useRef(false);

  useEffect(() => {
    if (!synced.current) {
      setPos({ x: initX, y: initY });
      posRef.current = { x: initX, y: initY };
      synced.current = true;
    }
  }, [initX, initY]);

  const start = (mx, my) => {
    if (disabled) return;
    drag.current = { mx, my, px: posRef.current.x, py: posRef.current.y };
    setDragging(true);
  };
  const move = useCallback((mx, my) => {
    if (!drag.current) return;
    const dx = mx - drag.current.mx;
    const dy = my - drag.current.my;
    const nx = drag.current.px + dx;
    const ny = drag.current.py + dy;
    posRef.current = { x: nx, y: ny };
    setPos({ x: nx, y: ny });
    setTilt(Math.max(-22, Math.min(22, dx * 0.2)));
  }, []);
  const end = useCallback(() => {
    if (!drag.current) return;
    drag.current = null;
    setDragging(false);
    setTilt(0);
    onMoved(id, posRef.current.x, posRef.current.y);
  }, [id, onMoved]);

  useEffect(() => {
    if (!dragging) return;
    const mm = (e) => move(e.clientX, e.clientY);
    const mu = () => end();
    window.addEventListener('mousemove', mm);
    window.addEventListener('mouseup', mu);
    return () => { window.removeEventListener('mousemove', mm); window.removeEventListener('mouseup', mu); };
  }, [dragging, move, end]);

  useEffect(() => {
    if (!dragging) return;
    const tm = (e) => { e.preventDefault(); move(e.touches[0].clientX, e.touches[0].clientY); };
    const te = () => end();
    window.addEventListener('touchmove', tm, { passive: false });
    window.addEventListener('touchend', te);
    return () => { window.removeEventListener('touchmove', tm); window.removeEventListener('touchend', te); };
  }, [dragging, move, end]);

  return (
    <div
      style={{
        position: 'absolute',
        left: pos.x, top: pos.y,
        cursor: disabled ? 'default' : dragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        touchAction: 'none',
        zIndex: dragging ? 999 : 1,
        transform: dragging
          ? `rotate(${tilt}deg) scale(1.06) translateY(-8px)`
          : 'rotate(0deg) scale(1) translateY(0)',
        transition: dragging
          ? 'transform 0.07s ease'
          : 'transform 0.4s cubic-bezier(0.175,0.885,0.32,1.275)',
        willChange: dragging ? 'transform' : 'auto',
      }}
      onMouseDown={(e) => { e.stopPropagation(); start(e.clientX, e.clientY); }}
      onTouchStart={(e) => { e.stopPropagation(); start(e.touches[0].clientX, e.touches[0].clientY); }}
    >
      {children(dragging)}
    </div>
  );
}

const s = {
  vp: {
    position: 'absolute', inset: 0,
    overflow: 'hidden',
    background: '#0D0D0D',   /* outside the wall — deepest black */
  },
  wall: {
    position: 'absolute', top: 0, left: 0,
    /* exact Laretta background color */
    background: '#1A1A1A',
    boxShadow: '0 0 120px rgba(0,0,0,0.98)',
    willChange: 'transform',
  },
  starfield: {
    position: 'absolute', inset: 0,
    width: '100%', height: '100%',
    pointerEvents: 'none',
  },
  loadWrap: {
    position: 'absolute', inset: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  loadTxt: {
    fontFamily: "'Black Ops One',cursive",
    fontSize: 22, color: 'var(--red)',
    letterSpacing: 4,
    animation: 'flicker 1.2s ease infinite',
  },
  /* Edge vignette to blend canvas into viewport */
  eT: { position:'absolute', top:0,    left:0, right:0,  height:32, background:'linear-gradient(to bottom,rgba(0,0,0,0.7),transparent)', pointerEvents:'none', zIndex:5 },
  eB: { position:'absolute', bottom:0, left:0, right:0,  height:32, background:'linear-gradient(to top,   rgba(0,0,0,0.7),transparent)', pointerEvents:'none', zIndex:5 },
  eL: { position:'absolute', top:0,    left:0, bottom:0, width:32,  background:'linear-gradient(to right, rgba(0,0,0,0.7),transparent)', pointerEvents:'none', zIndex:5 },
  eR: { position:'absolute', top:0,    right:0,bottom:0, width:32,  background:'linear-gradient(to left,  rgba(0,0,0,0.7),transparent)', pointerEvents:'none', zIndex:5 },
};
