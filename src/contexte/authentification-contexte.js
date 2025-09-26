// src/contexte/authentification-contexte.js
import React, { createContext, useState, useEffect } from "react";
import * as authApi from "../services/auth-api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Charger l'utilisateur et le token depuis localStorage au démarrage
  useEffect(() => {
    const raw = localStorage.getItem("auth");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setUser(parsed.user || null);
        setToken(parsed.token || null);
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
      // le backend renvoie une simple chaîne (token)
      const data = await authApi.login({ username, password });

      console.log("Données reçues du backend:", data); // Debug

      // data est la chaîne brute du token => on construit l'objet authData
      const authData = {
        user: { username }, // tu peux remplacer par data.user si ton back renvoie l'utilisateur
        token: typeof data === "string" ? data : data.token
      };

      console.log("Données à sauvegarder:", authData); // Debug

      localStorage.setItem("auth", JSON.stringify(authData));
      setUser(authData.user);
      setToken(authData.token);

      return { ok: true };
    } catch (err) {
      console.error("Erreur de connexion:", err); // Debug
      const message =
        err?.response?.data?.message || err.message || "Erreur de connexion";
      return { ok: false, message };
    }
  }

  // Inscription
  async function register({ username, email, password }) {
    try {
      const data = await authApi.register({ username, email, password });
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
    setToken(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        register,
        isAuthenticated: !!user && !!token, // Vérifier la présence du token aussi
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
