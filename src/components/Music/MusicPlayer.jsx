// src/components/Music/MusicPlayer.jsx
import { useState } from 'react';

function getEmbedUrl(url) {
  if (!url) return null;
  try {
    const u = new URL(url);

    // Spotify track
    if (u.hostname.includes('spotify.com')) {
      // https://open.spotify.com/track/ID → embed
      const match = url.match(/\/(track|album|playlist|episode)\/([a-zA-Z0-9]+)/);
      if (match) return `https://open.spotify.com/embed/${match[1]}/${match[2]}?utm_source=generator&theme=0`;
    }

    // YouTube
    if (u.hostname.includes('youtube.com') || u.hostname.includes('youtu.be')) {
      let id = u.searchParams.get('v');
      if (!id && u.hostname === 'youtu.be') id = u.pathname.slice(1);
      if (id) return `https://www.youtube.com/embed/${id}?autoplay=0`;
    }

    // SoundCloud - use iframe
    if (u.hostname.includes('soundcloud.com')) {
      return `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23D62828&auto_play=false&show_artwork=true`;
    }
  } catch {}
  return null;
}

export default function MusicPlayer({ url, color }) {
  const [expanded, setExpanded] = useState(false);
  const embedUrl = getEmbedUrl(url);

  if (!url) return null;

  return (
    <div style={styles.wrap}>
      <button
        style={{ ...styles.toggle, borderColor: color, color }}
        onClick={() => setExpanded(!expanded)}
      >
        🎵 {expanded ? 'FECHAR' : 'OUVIR'}
      </button>

      {expanded && embedUrl && (
        <div style={styles.player}>
          <iframe
            src={embedUrl}
            width="100%"
            height="80"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            style={styles.iframe}
          />
        </div>
      )}

      {expanded && !embedUrl && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ ...styles.link, color }}
        >
          ▶ Abrir música →
        </a>
      )}
    </div>
  );
}

const styles = {
  wrap: {
    marginTop: '6px',
  },
  toggle: {
    background: 'transparent',
    border: '1px solid',
    fontFamily: 'var(--font-body)',
    fontSize: '9px',
    padding: '3px 8px',
    cursor: 'pointer',
    letterSpacing: '1px',
  },
  player: {
    marginTop: '6px',
    animation: 'spray-fade 0.3s ease',
  },
  iframe: {
    display: 'block',
    borderRadius: 0,
  },
  link: {
    display: 'block',
    marginTop: '6px',
    fontFamily: 'var(--font-body)',
    fontSize: '10px',
    textDecoration: 'none',
    letterSpacing: '1px',
  },
};
