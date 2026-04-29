// src/lib/UserContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from './firebase';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';

const UserContext = createContext(null);
const USER_KEY = 'quintal_user';

// Exportada separadamente para não misturar com o componente (Fast Refresh)
export const SHARED_QUINTAL_ID = 'quintal_shared_main';

export function UserProvider({ children }) {
  const [user, setUser]           = useState(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(USER_KEY);
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch {}
    }
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        try { await signInAnonymously(auth); } catch (e) { console.warn('Auth error', e); }
      }
      setAuthReady(true);
    });
    return unsub;
  }, []);

  const login = (name, color, extra = {}) => {
    const u = {
      name,
      color,
      id: auth.currentUser?.uid || crypto.randomUUID(),
      photoUrl: extra.photoUrl || null,
      tagData:  extra.tagData  || null,
    };
    setUser(u);
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(u));
    } catch {
      localStorage.setItem(USER_KEY, JSON.stringify({ name, color, id: u.id }));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(USER_KEY);
  };

  return (
    <UserContext.Provider value={{ user, login, logout, authReady }}>
      {children}
    </UserContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useUser() {
  return useContext(UserContext);
}
