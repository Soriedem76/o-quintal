// src/lib/QuintalContext.jsx
// Each "quintal" is a room with a unique code.
// Users share the code/link to invite friends.

import { createContext, useContext, useState, useEffect } from 'react';

const QuintalContext = createContext(null);
const STORAGE_KEY = 'quintal_room';

// Generate a short memorable code like "VANDAL-42"
function genCode() {
  const words = ['MURO', 'RUELA', 'BECO', 'VILA', 'LAJE', 'PATIO', 'RACHA', 'GRUDE'];
  const word = words[Math.floor(Math.random() * words.length)];
  const num = Math.floor(Math.random() * 90) + 10;
  return `${word}-${num}`;
}

export function QuintalProvider({ children }) {
  const [quintalId, setQuintalId] = useState(null);
  const [quintalCode, setQuintalCode] = useState(null);

  useEffect(() => {
    // Check URL param first: ?q=MURO-42
    const params = new URLSearchParams(window.location.search);
    const urlCode = params.get('q')?.toUpperCase();

    if (urlCode) {
      joinByCode(urlCode);
      return;
    }

    // Check localStorage
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const { id, code } = JSON.parse(stored);
        setQuintalId(id);
        setQuintalCode(code);
      } catch {}
    }
  }, []);

  const joinByCode = (code) => {
    // Deterministic ID from code (so all users with same code land in same room)
    const id = 'quintal_' + code.replace(/[^A-Z0-9]/g, '').toLowerCase();
    setQuintalId(id);
    setQuintalCode(code);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ id, code }));
    // Clean URL
    window.history.replaceState({}, '', '/');
  };

  const createNew = () => {
    const code = genCode();
    joinByCode(code);
    return code;
  };

  const leave = () => {
    setQuintalId(null);
    setQuintalCode(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const shareUrl = quintalCode
    ? `${window.location.origin}?q=${quintalCode}`
    : null;

  return (
    <QuintalContext.Provider value={{ quintalId, quintalCode, joinByCode, createNew, leave, shareUrl }}>
      {children}
    </QuintalContext.Provider>
  );
}

export const useQuintal = () => useContext(QuintalContext);
