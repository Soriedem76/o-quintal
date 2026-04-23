// src/components/Mural/Canvas.jsx
import { useRef, useState, useCallback, useEffect } from 'react';
import Draggable from 'react-draggable';
import { updateItemPosition } from '../../hooks/useMural';
import PhotoCard from '../Photo/PhotoCard';
import PinItem from '../Pin/PinItem';
import DrawingItem from '../Drawing/DrawingItem';

export default function Canvas({ items, loading, user, canvasOffset, mode }) {
  const containerRef = useRef(null);
  const isDraggingCanvas = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // Sync offset ref for parent access
  useEffect(() => {
    canvasOffset.current = offset;
  }, [offset, canvasOffset]);

  // Pan canvas on mouse drag (when in pan mode)
  const onMouseDown = useCallback((e) => {
    if (mode !== 'pan') return;
    if (e.button !== 0) return;
    isDraggingCanvas.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
  }, [mode]);

  const onMouseMove = useCallback((e) => {
    if (!isDraggingCanvas.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };
    setOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
  }, []);

  const onMouseUp = useCallback(() => {
    isDraggingCanvas.current = false;
  }, []);

  // Touch pan
  const onTouchStart = useCallback((e) => {
    if (mode !== 'pan') return;
    const t = e.touches[0];
    lastPos.current = { x: t.clientX, y: t.clientY };
  }, [mode]);

  const onTouchMove = useCallback((e) => {
    if (mode !== 'pan') return;
    const t = e.touches[0];
    const dx = t.clientX - lastPos.current.x;
    const dy = t.clientY - lastPos.current.y;
    lastPos.current = { x: t.clientX, y: t.clientY };
    setOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
  }, [mode]);

  const handleItemDragStop = useCallback((id, e, data) => {
    const newX = (data.x - offset.x);
    const newY = (data.y - offset.y);
    updateItemPosition(id, newX, newY).catch(console.error);
  }, [offset]);

  if (loading) {
    return (
      <div style={styles.loading}>
        <span style={styles.loadingText}>CARREGANDO O QUINTAL...</span>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      style={styles.canvas}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onMouseUp}
    >
      {/* The world that pans */}
      <div style={{ ...styles.world, transform: `translate(${offset.x}px, ${offset.y}px)` }}>
        {/* Grid lines — like a wall */}
        <svg style={styles.grid} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke="rgba(255,255,255,0.025)" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Render all items */}
        {items.map(item => (
          <Draggable
            key={item.id}
            defaultPosition={{ x: item.x + offset.x, y: item.y + offset.y }}
            position={undefined}
            disabled={mode !== 'pan'}
            onStop={(e, data) => handleItemDragStop(item.id, e, data)}
            bounds={false}
          >
            <div style={{ position: 'absolute', userSelect: 'none' }}>
              {item.type === 'photo' && <PhotoCard item={item} user={user} />}
              {item.type === 'pin' && <PinItem item={item} user={user} />}
              {item.type === 'drawing' && <DrawingItem item={item} />}
            </div>
          </Draggable>
        ))}
      </div>
    </div>
  );
}

const styles = {
  canvas: {
    position: 'absolute', inset: 0,
    overflow: 'hidden',
  },
  world: {
    position: 'absolute',
    width: '4000px', height: '4000px',
    top: '-1000px', left: '-1000px',
  },
  grid: {
    position: 'absolute', inset: 0,
    width: '100%', height: '100%',
  },
  loading: {
    position: 'absolute', inset: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  loadingText: {
    fontFamily: 'var(--font-display)',
    fontSize: '24px',
    color: 'var(--red)',
    letterSpacing: '4px',
    animation: 'flicker 1s ease infinite',
  },
};
