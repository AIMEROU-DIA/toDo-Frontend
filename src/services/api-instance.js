import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

// Intercepteur pour ajouter le token à chaque requête (sauf login/register)
api.interceptors.request.use(
  (config) => {
    // Ne pas ajouter le token pour les endpoints d'authentification
    const isAuthEndpoint = config.url?.includes('/auth/login') || config.url?.includes('/auth/register');
    
    if (!isAuthEndpoint) {
      const auth = localStorage.getItem("auth");
      if (auth) {
        try {
          const parsed = JSON.parse(auth);
          if (parsed.token) {
            config.headers.Authorization = `Bearer ${parsed.token}`;
          }
        } catch (err) {
          console.error("Erreur lecture token:", err);
          localStorage.removeItem("auth");
        }
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs d'authentification
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      localStorage.removeItem("auth");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;