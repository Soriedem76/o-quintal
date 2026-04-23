// src/components/Photo/PhotoUploadModal.jsx
// On mobile (installed PWA), uses native camera via input capture.
// On desktop, uses getUserMedia stream.

import { useState, useRef } from 'react';
import { addPhoto } from '../../hooks/useMural';

const isMobile = () => /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

export default function PhotoUploadModal({ user, quintalId, onClose, canvasOffset }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [music, setMusic] = useState('');
  const [loading, setLoading] = useState(false);
  const [useWebcam, setUseWebcam] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const cameraInputRef = useRef(null);   // capture=environment (mobile)
  const galleryInputRef = useRef(null);  // gallery pick

  const setFileFromBlob = (blob, name = 'photo.jpg') => {
    const f = new File([blob], name, { type: blob.type || 'image/jpeg' });
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  // Mobile: trigger native camera app
  const handleMobileCamera = () => cameraInputRef.current?.click();

  // Desktop: open webcam stream
  const handleDesktopWebcam = async () => {
    setUseWebcam(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch {
      alert('Câmera não acessível. Use a galeria.');
      setUseWebcam(false);
    }
  };

  const snapDesktop = () => {
    const canvas = document.createElement('canvas');
    const v = videoRef.current;
    canvas.width = v.videoWidth;
    canvas.height = v.videoHeight;
    canvas.getContext('2d').drawImage(v, 0, 0);
    canvas.toBlob(blob => {
      setFileFromBlob(blob, 'webcam.jpg');
      stopWebcam();
    }, 'image/jpeg', 0.85);
  };

  const stopWebcam = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    setUseWebcam(false);
  };

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handlePost = async () => {
    if (!file) return;
    setLoading(true);
    try {
      await addPhoto({
        quintalId,
        user,
        file,
        x: 300 + Math.random() * 200,
        y: 200 + Math.random() * 200,
        music: music.trim() || null,
      });
      onClose();
    } catch (e) {
      console.error(e);
      alert('Erro ao enviar foto. Verifique as configs do Firebase Storage.');
    } finally {
      setLoading(false);
    }
  };

  const mobile = isMobile();

  return (
    <div style={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      {/* Hidden inputs */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      <div style={styles.modal}>
        <div style={styles.header}>
          <span style={styles.title}>📷 COLAR FOTO</span>
          <button style={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        {/* Step 1: pick source */}
        {!preview && !useWebcam && (
          <div style={styles.uploadArea}>
            <div style={styles.uploadGrid}>
              {/* Camera button — native on mobile, webcam on desktop */}
              <button
                style={styles.bigBtn}
                onClick={mobile ? handleMobileCamera : handleDesktopWebcam}
              >
                <span style={styles.bigBtnIcon}>📸</span>
                <span style={styles.bigBtnLabel}>CÂMERA</span>
                {mobile && <span style={styles.bigBtnSub}>nativa do celular</span>}
              </button>

              <button
                style={{ ...styles.bigBtn, background: 'rgba(255,255,255,0.06)' }}
                onClick={() => galleryInputRef.current?.click()}
              >
                <span style={styles.bigBtnIcon}>🖼️</span>
                <span style={styles.bigBtnLabel}>GALERIA</span>
                <span style={styles.bigBtnSub}>fotos salvas</span>
              </button>
            </div>
          </div>
        )}

        {/* Desktop webcam */}
        {useWebcam && (
          <div>
            <video ref={videoRef} autoPlay playsInline style={styles.video} />
            <div style={styles.camControls}>
              <button style={styles.snapBtn} onClick={snapDesktop}>⚫ TIRAR</button>
              <button style={styles.cancelCamBtn} onClick={stopWebcam}>CANCELAR</button>
            </div>
          </div>
        )}

        {/* Preview */}
        {preview && (
          <div style={styles.previewWrap}>
            <img src={preview} alt="preview" style={styles.previewImg} />
            <button
              style={styles.retakeBtn}
              onClick={() => { setPreview(null); setFile(null); }}
            >↩ TROCAR</button>
          </div>
        )}

        {/* Music link */}
        <div style={styles.field}>
          <label style={styles.label}>🎵 LINK DE MÚSICA (opcional)</label>
          <input
            style={styles.input}
            placeholder="spotify.com/... ou youtu.be/..."
            value={music}
            onChange={e => setMusic(e.target.value)}
          />
        </div>

        {/* Author */}
        <div style={styles.authorRow}>
          <div style={{ ...styles.dot, background: user.color }} />
          <span style={styles.authorName}>{user.name}</span>
          <span style={styles.date}>{new Date().toLocaleDateString('pt-BR')}</span>
        </div>

        <button
          style={{ ...styles.postBtn, opacity: (!file || loading) ? 0.45 : 1 }}
          onClick={handlePost}
          disabled={!file || loading}
        >
          {loading ? 'ENVIANDO...' : '📌 COLAR NO MURAL'}
        </button>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)',
    display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
    zIndex: 500,
  },
  modal: {
    background: 'var(--black-soft)', border: '2px solid var(--red)',
    borderBottom: 'none',
    padding: '24px 20px',
    width: '100%', maxWidth: '480px',
    boxShadow: '0 -8px 40px rgba(214,40,40,0.2)',
    animation: 'slideUp 0.3s cubic-bezier(0.175,0.885,0.32,1.1)',
    display: 'flex', flexDirection: 'column', gap: '14px',
    paddingBottom: 'max(24px, env(safe-area-inset-bottom))',
  },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--white)', letterSpacing: '2px' },
  closeBtn: { background: 'transparent', border: 'none', color: 'var(--paper)', fontSize: '18px', cursor: 'pointer', padding: '4px 8px' },
  uploadArea: { padding: '8px 0' },
  uploadGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' },
  bigBtn: {
    background: 'rgba(214,40,40,0.15)', border: '2px solid rgba(214,40,40,0.4)',
    padding: '20px 12px', cursor: 'pointer',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
    transition: 'background 0.15s',
    minHeight: '100px',
  },
  bigBtnIcon: { fontSize: '28px' },
  bigBtnLabel: { fontFamily: 'var(--font-display)', fontSize: '16px', color: 'var(--white)', letterSpacing: '1px' },
  bigBtnSub: { fontFamily: 'var(--font-body)', fontSize: '9px', color: 'var(--paper)', letterSpacing: '1px' },
  video: { width: '100%', display: 'block', maxHeight: '240px', objectFit: 'cover' },
  camControls: { display: 'flex', gap: '8px', marginTop: '8px' },
  snapBtn: {
    flex: 1, background: 'var(--white)', border: 'none',
    fontFamily: 'var(--font-display)', fontSize: '16px', color: 'var(--black)',
    padding: '12px', cursor: 'pointer',
  },
  cancelCamBtn: {
    background: 'transparent', border: '1px solid rgba(255,255,255,0.2)',
    color: 'var(--white)', padding: '12px 16px', cursor: 'pointer', fontSize: '13px',
  },
  previewWrap: { position: 'relative' },
  previewImg: { width: '100%', display: 'block', maxHeight: '200px', objectFit: 'cover', border: '2px solid rgba(214,40,40,0.4)' },
  retakeBtn: {
    position: 'absolute', top: '8px', right: '8px',
    background: 'rgba(13,13,13,0.9)', border: '1px solid var(--red)',
    color: 'var(--white)', fontFamily: 'var(--font-body)',
    fontSize: '10px', padding: '4px 10px', cursor: 'pointer', letterSpacing: '1px',
  },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontFamily: 'var(--font-body)', fontSize: '10px', letterSpacing: '2px', color: 'var(--paper)' },
  input: {
    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(214,40,40,0.35)',
    padding: '10px 12px', fontFamily: 'var(--font-body)', fontSize: '13px',
    color: 'var(--white)', outline: 'none', width: '100%',
  },
  authorRow: { display: 'flex', alignItems: 'center', gap: '8px' },
  dot: { width: '10px', height: '10px', borderRadius: '50%', flexShrink: 0 },
  authorName: { fontFamily: 'var(--font-display)', fontSize: '14px', color: 'var(--white)', flex: 1 },
  date: { fontFamily: 'var(--font-body)', fontSize: '10px', color: 'var(--paper)' },
  postBtn: {
    background: 'var(--red)', border: 'none', color: 'var(--white)',
    fontFamily: 'var(--font-display)', fontSize: '18px', padding: '16px',
    cursor: 'pointer', letterSpacing: '2px', boxShadow: 'var(--shadow-brutal)',
    transition: 'opacity 0.2s', width: '100%',
  },
};
