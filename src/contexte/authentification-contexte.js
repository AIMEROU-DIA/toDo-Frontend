import React, { createContext, useState, useEffect } from "react";
import * as authApi from "../services/auth-api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);   // infos utilisateur connecté
  const [loading, setLoading] = useState(true);

  // Charger l'utilisateur depuis localStorage au démarrage
  useEffect(() => {
    const raw = localStorage.getItem("auth");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setUser(parsed.user || null);
      } catch (err) {
        console.error("Erreur lecture auth:", err);
        localStorage.removeItem("auth");
      }
    }
    setLoading(false);
  }, []);

  // Connexion
  async function login({ username, password }) {
    try {
      const data = await authApi.login({ username, password });
      // ⚠️ on suppose que l’API renvoie les infos utilisateur (ex: { id, username, email })
      const saved = { user: data.user || { username } };
      localStorage.setItem("auth", JSON.stringify(saved));
      setUser(saved.user);
      return { ok: true };
    } catch (err) {
      const message =
        err?.response?.data?.message || err.message || "Erreur de connexion";
      return { ok: false, message };
    }
  }

  // Inscription
  async function register({ username, email, password }) {
    try {
      const data = await authApi.register({ username, email, password });
      // ici tu peux choisir de connecter direct ou non
      return { ok: true, data };
    } catch (err) {
      const message =
        err?.response?.data?.message || err.message || "Erreur inscription";
      return { ok: false, message };
    }
  }

  // Déconnexion
  function logout() {
    localStorage.removeItem("auth");
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        register,
        isAuthenticated: !!user, // basé uniquement sur la présence d'un utilisateur
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
