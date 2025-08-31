// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../lib/api";

const AuthCtx = createContext(null);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // hydrate session on mount
  useEffect(() => {
    (async () => {
      try {
        const me = await api.me();
        if (me?.user) setUser(me.user);
      } catch {}
      finally { setLoading(false); }
    })();
  }, []);

  const login = async (email, password) => {
    const res = await api.login({ email, password });
    if (res?.user) setUser(res.user);
    return res;
  };

  const logout = async () => {
    await api.logout();   // must exist in api.js
    setUser(null);
  };

  const value = { user, setUser, loading, login, logout };
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export const useAuth = () => useContext(AuthCtx);
