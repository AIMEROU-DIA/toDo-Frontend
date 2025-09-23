import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexte/authentification-contexte";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    // Affichage simple pendant le chargement : tu peux remplacer par un spinner
    return <div>Chargement...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/connexion" replace />;
  }

  return children;
}
