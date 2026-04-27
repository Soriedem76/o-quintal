// src/components/Auth/AuthScreen.jsx  — Laretta-faithful redesign
import { useState, useMemo } from 'react';
import { useUser } from '../../lib/UserContext';

const COLORS = [
  '#D62828','#FF6B35','#F5C842','#4CAF50',
  '#2196F3','#9C27B0','#FF69B4','#00BCD4',
  '#FF3D00','#76FF03','#FFEA00','#F06292',
];

/* ── Stars background ── */
function Starfield() {
  const stars = useMemo(() => Array.from({ length: 120 }, (_, i) => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    r: 0.5 + Math.random() * 1.5,
    delay: Math.random() * 4,
    dur: 2 + Math.random() * 3,
  })), []);
  return (
    <svg style={{ position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none' }}>
      {stars.map((s, i) => (
        <circle key={i} cx={`${s.x}%`} cy={`${s.y}%`} r={s.r}
          fill="white" opacity="0.4"
          style={{ animation: `star-twinkle ${s.dur}s ease-in-out ${s.delay}s infinite` }} />
      ))}
    </svg>
  );
}

/* ── Laretta-style SVG lettering for "O QUINTAL" ──
   Blocky, chunky, with the distinctive rounded-cutout interior style */
function LarettaLogo() {
  return (
    <div style={S.logoArea}>
      {/* "O" — big, red, tilted */}
      <svg viewBox="0 0 90 110" style={S.letterO}>
        {/* Outer rounded rectangle */}
        <rect x="4" y="4" width="82" height="102" rx="14" ry="14"
          fill="white" stroke="none"/>
        {/* Inner cutout — the counter of O */}
        <rect x="18" y="18" width="54" height="68" rx="10" ry="10"
          fill="#0B0B0B"/>
        {/* Red tint overlay */}
        <rect x="4" y="4" width="82" height="102" rx="14" ry="14"
          fill="#D62828" opacity="0.9"/>
        <rect x="18" y="18" width="54" height="68" rx="10" ry="10"
          fill="#0B0B0B"/>
      </svg>

      {/* "QUINTAL" as individual chunky SVG letters */}
      <div style={S.quintalWord}>
        {/* We use a real bold chunky font rendered large */}
        <span style={S.quintalText}>QUINTAL</span>
      </div>
    </div>
  );
}

/* ── Cartoon wolf (side view, gritty/scrappy) ── */
function Wolf({ style }) {
  return (
    <svg viewBox="0 0 160 200" style={style} xmlns="http://www.w3.org/2000/svg">
      {/* Body — hunched posture */}
      <ellipse cx="80" cy="140" rx="42" ry="48" fill="white" stroke="black" strokeWidth="3"/>
      {/* Snout area / neck */}
      <path d="M55,108 Q80,95 105,108 Q100,85 80,80 Q60,85 55,108Z" fill="white" stroke="black" strokeWidth="2.5"/>
      {/* Head */}
      <ellipse cx="80" cy="72" rx="34" ry="30" fill="white" stroke="black" strokeWidth="3"/>
      {/* Pointy ears */}
      <polygon points="52,52 38,14 60,44" fill="white" stroke="black" strokeWidth="3"/>
      <polygon points="54,50 42,20 58,42" fill="#ddd"/>
      <polygon points="108,52 122,14 100,44" fill="white" stroke="black" strokeWidth="3"/>
      <polygon points="106,50 118,20 102,42" fill="#ddd"/>
      {/* Snout */}
      <path d="M62,82 Q80,96 98,82 Q96,72 80,70 Q64,72 62,82Z" fill="#e0e0e0" stroke="black" strokeWidth="2"/>
      {/* Nose */}
      <ellipse cx="80" cy="76" rx="7" ry="5" fill="black"/>
      <ellipse cx="78" cy="74.5" rx="2" ry="1.5" fill="#666"/>
      {/* Eyes — intense, slightly angry */}
      <ellipse cx="65" cy="62" rx="7" ry="8" fill="black"/>
      <ellipse cx="95" cy="62" rx="7" ry="8" fill="black"/>
      <circle cx="67" cy="60" r="2.5" fill="white"/>
      <circle cx="97" cy="60" r="2.5" fill="white"/>
      {/* Brow — angled, mean */}
      <path d="M57,54 Q65,50 73,55" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round"/>
      <path d="M87,55 Q95,50 103,54" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round"/>
      {/* Mouth — snarl with fang */}
      <path d="M68,88 Q80,94 92,88" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round"/>
      <polygon points="74,88 70,96 78,88" fill="white" stroke="black" strokeWidth="1.5"/>
      <polygon points="86,88 90,96 82,88" fill="white" stroke="black" strokeWidth="1.5"/>
      {/* Chest fur mark */}
      <path d="M62,118 Q70,112 80,115 Q90,112 98,118 Q90,108 80,110 Q70,108 62,118Z" fill="#ddd" stroke="black" strokeWidth="1.5"/>
      {/* Tail arching behind */}
      <path d="M122,155 Q148,128 142,100 Q136,112 126,120" fill="white" stroke="black" strokeWidth="3" strokeLinejoin="round"/>
      {/* Legs */}
      <rect x="52" y="172" width="18" height="26" rx="7" fill="white" stroke="black" strokeWidth="2.5"/>
      <rect x="90" y="172" width="18" height="26" rx="7" fill="white" stroke="black" strokeWidth="2.5"/>
      {/* Claws */}
      <path d="M52,196 Q56,202 60,196" fill="none" stroke="black" strokeWidth="2"/>
      <path d="M90,196 Q94,202 98,196" fill="none" stroke="black" strokeWidth="2"/>
      {/* Fur texture */}
      <path d="M68,132 Q74,126 80,132" fill="none" stroke="#bbb" strokeWidth="1.5"/>
      <path d="M80,132 Q86,126 92,132" fill="none" stroke="#bbb" strokeWidth="1.5"/>
      <path d="M64,144 Q72,138 80,144" fill="none" stroke="#bbb" strokeWidth="1.5"/>
    </svg>
  );
}

/* ── Cartoon goat ── */
function Goat({ style }) {
  return (
    <svg viewBox="0 0 150 200" style={style} xmlns="http://www.w3.org/2000/svg">
      {/* Body */}
      <ellipse cx="75" cy="140" rx="40" ry="45" fill="white" stroke="black" strokeWidth="3"/>
      {/* Neck */}
      <rect x="60" y="95" width="30" height="35" rx="8" fill="white" stroke="black" strokeWidth="2.5"/>
      {/* Head */}
      <ellipse cx="75" cy="78" rx="28" ry="26" fill="white" stroke="black" strokeWidth="3"/>
      {/* Long horns — goat-style */}
      <path d="M58,58 Q44,28 52,12 Q58,28 64,52" fill="white" stroke="black" strokeWidth="3" strokeLinejoin="round"/>
      <path d="M92,58 Q106,28 98,12 Q92,28 86,52" fill="white" stroke="black" strokeWidth="3" strokeLinejoin="round"/>
      {/* Ears floppy */}
      <ellipse cx="46" cy="76" rx="12" ry="7" fill="white" stroke="black" strokeWidth="2.5" transform="rotate(-25,46,76)"/>
      <ellipse cx="46" cy="76" rx="8" ry="4" fill="#ffcccc" transform="rotate(-25,46,76)"/>
      <ellipse cx="104" cy="76" rx="12" ry="7" fill="white" stroke="black" strokeWidth="2.5" transform="rotate(25,104,76)"/>
      <ellipse cx="104" cy="76" rx="8" ry="4" fill="#ffcccc" transform="rotate(25,104,76)"/>
      {/* Long face / snout */}
      <rect x="62" y="76" width="26" height="22" rx="8" fill="#e8e8e8" stroke="black" strokeWidth="2"/>
      {/* Nostrils */}
      <circle cx="69" cy="84" r="3.5" fill="black"/>
      <circle cx="81" cy="84" r="3.5" fill="black"/>
      {/* Eyes — rectangular pupils */}
      <ellipse cx="62" cy="66" rx="7" ry="8" fill="black"/>
      <rect x="59" y="62" width="6" height="8" rx="1" fill="white" opacity="0.15"/>
      <ellipse cx="88" cy="66" rx="7" ry="8" fill="black"/>
      <rect x="85" y="62" width="6" height="8" rx="1" fill="white" opacity="0.15"/>
      {/* Highlight */}
      <circle cx="63.5" cy="64" r="2" fill="white"/>
      <circle cx="89.5" cy="64" r="2" fill="white"/>
      {/* Beard — long wispy */}
      <path d="M68,97 Q75,108 82,97 Q80,112 75,118 Q70,112 68,97Z" fill="white" stroke="black" strokeWidth="1.5"/>
      {/* Legs */}
      <rect x="48" y="172" width="16" height="25" rx="5" fill="white" stroke="black" strokeWidth="2.5"/>
      <rect x="86" y="172" width="16" height="25" rx="5" fill="white" stroke="black" strokeWidth="2.5"/>
      {/* Hooves */}
      <rect x="47" y="192" width="18" height="7" rx="3" fill="black"/>
      <rect x="85" y="192" width="18" height="7" rx="3" fill="black"/>
      {/* Short tail */}
      <path d="M115,135 Q126,120 120,108" fill="none" stroke="black" strokeWidth="3.5" strokeLinecap="round"/>
      {/* Back fur */}
      <path d="M55,128 Q66,122 80,126 Q94,122 105,128" fill="none" stroke="#bbb" strokeWidth="1.5"/>
    </svg>
  );
}

/* ── Cartoon cat ── */
function Cat({ style }) {
  return (
    <svg viewBox="0 0 150 190" style={style} xmlns="http://www.w3.org/2000/svg">
      {/* Body */}
      <ellipse cx="75" cy="138" rx="38" ry="42" fill="white" stroke="black" strokeWidth="3"/>
      {/* Head */}
      <circle cx="75" cy="74" r="32" fill="white" stroke="black" strokeWidth="3"/>
      {/* Pointy cat ears */}
      <polygon points="50,52 36,16 60,46" fill="white" stroke="black" strokeWidth="3"/>
      <polygon points="51,50 40,22 58,44" fill="#ffb3ba"/>
      <polygon points="100,52 114,16 90,46" fill="white" stroke="black" strokeWidth="3"/>
      <polygon points="99,50 110,22 92,44" fill="#ffb3ba"/>
      {/* Eyes — big, expressive */}
      <circle cx="62" cy="72" r="10" fill="black"/>
      <circle cx="88" cy="72" r="10" fill="black"/>
      <circle cx="65" cy="69" r="3.5" fill="white"/>
      <circle cx="91" cy="69" r="3.5" fill="white"/>
      {/* Slit pupils */}
      <ellipse cx="62" cy="72" rx="3" ry="8" fill="#1a1a1a" opacity="0.5"/>
      <ellipse cx="88" cy="72" rx="3" ry="8" fill="#1a1a1a" opacity="0.5"/>
      {/* Nose — cute triangle */}
      <polygon points="75,83 71,88 79,88" fill="#ff9999" stroke="black" strokeWidth="1"/>
      {/* Mouth */}
      <path d="M71,88 Q75,93 79,88" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round"/>
      <path d="M75,88 L75,92" fill="none" stroke="black" strokeWidth="1.5"/>
      {/* Whiskers */}
      <line x1="24" y1="80" x2="64" y2="84" stroke="black" strokeWidth="1.5"/>
      <line x1="24" y1="86" x2="64" y2="86" stroke="black" strokeWidth="1.5"/>
      <line x1="26" y1="92" x2="64" y2="88" stroke="black" strokeWidth="1.5"/>
      <line x1="86" y1="84" x2="126" y2="80" stroke="black" strokeWidth="1.5"/>
      <line x1="86" y1="86" x2="126" y2="86" stroke="black" strokeWidth="1.5"/>
      <line x1="86" y1="88" x2="126" y2="92" stroke="black" strokeWidth="1.5"/>
      {/* Collar */}
      <path d="M47,94 Q75,106 103,94" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="75" cy="103" r="5" fill="#D62828" stroke="black" strokeWidth="1.5"/>
      {/* Tail — curvy */}
      <path d="M113,155 Q138,136 132,110 Q124,122 116,130" fill="white" stroke="black" strokeWidth="3.5" strokeLinejoin="round"/>
      {/* Tummy stripes */}
      <path d="M55,128 Q65,122 75,125 Q85,122 95,128" fill="none" stroke="#ccc" strokeWidth="2"/>
      <path d="M52,140 Q63,134 75,137 Q87,134 98,140" fill="none" stroke="#ccc" strokeWidth="2"/>
      {/* Legs */}
      <rect x="48" y="168" width="18" height="20" rx="9" fill="white" stroke="black" strokeWidth="2.5"/>
      <rect x="84" y="168" width="18" height="20" rx="9" fill="white" stroke="black" strokeWidth="2.5"/>
    </svg>
  );
}

export default function AuthScreen() {
  const { login } = useUser();
  const [name, setName] = useState('');
  const [color, setColor] = useState('#D62828');
  const [shaking, setShaking] = useState(false);

  const handleEnter = () => {
    if (!name.trim()) {
      setShaking(true);
      setTimeout(() => setShaking(false), 600);
      return;
    }
    login(name.trim(), color);
  };

  return (
    <div style={S.root}>
      {/* Stars */}
      <Starfield />

      {/* Vignette */}
      <div style={S.vignette} />

      {/* Spray splatters — ambient */}
      {COLORS.slice(0, 6).map((c, i) => (
        <div key={i} style={{
          position: 'absolute',
          borderRadius: '50%',
          filter: `blur(${50 + i * 10}px)`,
          background: c,
          width: `${100 + i * 40}px`,
          height: `${100 + i * 40}px`,
          left: `${8 + i * 15}%`,
          top: `${10 + (i % 3) * 28}%`,
          opacity: 0.04 + (i % 2) * 0.02,
          pointerEvents: 'none',
        }} />
      ))}

      {/* ── ANIMALS ── */}
      <div style={{ ...S.animal, left: '-10px', bottom: '0px', zIndex: 2 }}>
        <Wolf style={{ width: '130px', filter: 'drop-shadow(4px 4px 0 rgba(0,0,0,0.7))' }} />
      </div>
      <div style={{ ...S.animal, right: '-8px', bottom: '0px', zIndex: 2, transform: 'scaleX(-1)' }}>
        <Goat style={{ width: '120px', filter: 'drop-shadow(4px 4px 0 rgba(0,0,0,0.7))' }} />
      </div>
      <div style={{ ...S.animal, right: '12%', top: '4%', zIndex: 1 }}>
        <Cat style={{ width: '90px', filter: 'drop-shadow(3px 3px 0 rgba(0,0,0,0.6))', opacity: 0.85 }} />
      </div>

      {/* ── CARD ── */}
      <div style={S.card}>
        {/* Drips running down the top edge */}
        <div style={S.dripsTop}>
          {[12,22,36,52,66,78,88].map((l, i) => (
            <div key={i} style={{
              position: 'absolute',
              left: `${l}%`,
              top: 0,
              width: `${3 + (i % 2) * 2}px`,
              height: `${16 + (i % 4) * 12}px`,
              background: i === 2 ? color : 'var(--red)',
              borderRadius: '0 0 6px 6px',
              animation: `drip ${1.8 + i * 0.35}s ease-in ${i * 0.2}s infinite`,
              transformOrigin: 'top',
            }} />
          ))}
        </div>

        {/* ── LOGO ── */}
        <div style={S.logoRow}>
          {/* Big O in red — Laretta style with inner rounded cutout */}
          <svg viewBox="0 0 80 96" style={S.bigO}>
            <rect x="3" y="3" width="74" height="90" rx="12" fill="var(--red)"/>
            <rect x="16" y="16" width="48" height="60" rx="8" fill="var(--ink-black)"/>
          </svg>

          <div style={S.titleStack}>
            <div style={S.titleSmall}>— MURAL DA GALERA —</div>
            <div style={S.titleBig}>QUINTAL</div>
          </div>
        </div>

        {/* ── FORM ── */}
        <div style={S.form}>
          {/* Name input */}
          <div>
            <div style={S.label}>SEU NOME NO MURO</div>
            <input
              style={{
                ...S.input,
                borderColor: color,
                boxShadow: `0 0 0 2px ${color}33`,
                ...(shaking ? S.shake : {}),
              }}
              placeholder="ex: VANDAL_99"
              value={name}
              maxLength={20}
              onChange={e => setName(e.target.value.toUpperCase())}
              onKeyDown={e => e.key === 'Enter' && handleEnter()}
            />
          </div>

          {/* Color pick */}
          <div>
            <div style={S.label}>SUA COR — IDENTIDADE NO QUINTAL</div>
            <div style={S.colorGrid}>
              {COLORS.map(c => (
                <button key={c} onClick={() => setColor(c)} style={{
                  ...S.dot,
                  background: c,
                  border: color === c ? '3px solid var(--white)' : '3px solid transparent',
                  transform: color === c ? 'scale(1.3)' : 'scale(1)',
                  boxShadow: color === c ? `0 0 16px ${c}, 0 0 4px ${c}` : 'none',
                }} />
              ))}
            </div>
            <div style={S.customRow}>
              <span style={S.labelSmall}>OU ESCOLHA:</span>
              <input type="color" value={color} onChange={e => setColor(e.target.value)} style={S.picker} />
            </div>
          </div>

          {/* Preview */}
          <div style={S.previewRow}>
            <div style={{
              ...S.badge,
              background: color,
              boxShadow: `4px 4px 0 ${color}88, 0 0 20px ${color}55`,
            }}>
              {name || 'SEU_NOME'}
            </div>
            <span style={S.previewTip}>— assim você vai aparecer</span>
          </div>

          {/* CTA */}
          <button style={S.cta} onClick={handleEnter}>
            ▶ ENTRAR NO QUINTAL
          </button>
        </div>

        <p style={S.footer}>ACESSO PÚBLICO · MURAL COLABORATIVO</p>
      </div>
    </div>
  );
}

const S = {
  root: {
    position: 'fixed', inset: 0,
    background: 'var(--ink-black)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden',
  },
  vignette: {
    position: 'absolute', inset: 0, pointerEvents: 'none',
    background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.7) 100%)',
  },
  animal: { position: 'absolute', pointerEvents: 'none' },
  card: {
    position: 'relative', zIndex: 10,
    background: 'rgba(11,11,11,0.97)',
    border: '3px solid var(--red)',
    padding: '44px 38px 36px',
    maxWidth: '460px', width: '92%',
    boxShadow: '8px 8px 0 var(--red-dark), 0 0 60px rgba(214,40,40,0.15)',
    animation: 'stamp-in 0.55s cubic-bezier(0.175,0.885,0.32,1.275)',
    overflow: 'visible',
  },
  dripsTop: {
    position: 'absolute', top: '-2px', left: 0, right: 0,
    height: '60px', pointerEvents: 'none',
    overflow: 'visible',
  },
  logoRow: {
    display: 'flex', alignItems: 'center', gap: '12px',
    marginBottom: '28px',
  },
  bigO: {
    width: '72px', height: '86px', flexShrink: 0,
    filter: 'drop-shadow(3px 3px 0 #7B0000)',
  },
  titleStack: { display: 'flex', flexDirection: 'column', gap: '2px' },
  titleSmall: {
    fontFamily: 'var(--font-body)',
    fontSize: '9px', letterSpacing: '3px',
    color: 'var(--red)',
  },
  titleBig: {
    fontFamily: 'var(--font-display)',
    fontSize: '56px', letterSpacing: '2px',
    color: 'var(--white)', lineHeight: 0.9,
    textShadow: '3px 3px 0 var(--red)',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '14px' },
  label: {
    fontFamily: 'var(--font-body)',
    fontSize: '9px', letterSpacing: '2px',
    color: 'var(--paper)', marginBottom: '6px',
  },
  labelSmall: {
    fontFamily: 'var(--font-body)',
    fontSize: '9px', letterSpacing: '2px',
    color: 'var(--paper)',
  },
  input: {
    background: 'rgba(255,255,255,0.04)',
    border: '2px solid',
    borderRadius: '0',
    padding: '12px 16px',
    fontFamily: 'var(--font-display)',
    fontSize: '24px',
    color: 'var(--white)',
    outline: 'none',
    letterSpacing: '2px',
    width: '100%',
    transition: 'box-shadow 0.2s',
  },
  shake: { animation: 'wobble 0.12s ease 4' },
  colorGrid: {
    display: 'flex', flexWrap: 'wrap', gap: '8px',
    marginBottom: '8px',
  },
  dot: {
    width: '30px', height: '30px',
    borderRadius: '50%', cursor: 'pointer',
    transition: 'transform 0.15s, box-shadow 0.15s',
  },
  customRow: { display: 'flex', alignItems: 'center', gap: '12px' },
  picker: {
    width: '40px', height: '30px',
    border: '2px solid var(--white)',
    background: 'none', cursor: 'pointer', padding: 0,
  },
  previewRow: {
    display: 'flex', alignItems: 'center', gap: '12px',
    margin: '2px 0',
  },
  badge: {
    fontFamily: 'var(--font-display)',
    fontSize: '14px', padding: '5px 14px',
    color: 'var(--ink-black)', letterSpacing: '1px',
  },
  previewTip: {
    fontFamily: 'var(--font-body)',
    fontSize: '10px', color: 'var(--paper)',
    fontStyle: 'italic',
  },
  cta: {
    marginTop: '10px',
    background: 'var(--red)',
    border: 'none',
    padding: '17px',
    fontFamily: 'var(--font-display)',
    fontSize: '19px',
    color: 'var(--white)',
    letterSpacing: '2px',
    cursor: 'pointer',
    boxShadow: '5px 5px 0 var(--red-dark)',
    width: '100%',
    transition: 'transform 0.1s, box-shadow 0.1s',
  },
  footer: {
    marginTop: '20px',
    fontFamily: 'var(--font-body)',
    fontSize: '9px',
    color: 'rgba(240,237,230,0.2)',
    letterSpacing: '2px',
    textAlign: 'center',
  },
  logoArea: { display: 'flex', alignItems: 'center', gap: '8px' },
  letterO: { width: '80px', flexShrink: 0 },
  quintalWord: {},
  quintalText: {
    fontFamily: 'var(--font-display)',
    fontSize: '52px',
    color: 'var(--white)',
    textShadow: '3px 3px 0 var(--red)',
  },
};
