// src/lib/UserContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from './firebase';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';

const UserContext = createContext(null);

const USER_KEY = 'quintal_user';

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
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

  const login = (name, color) => {
    const u = { name, color, id: auth.currentUser?.uid || crypto.randomUUID() };
    setUser(u);
    localStorage.setItem(USER_KEY, JSON.stringify(u));
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

export const useUser = () => useContext(UserContext);
