import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexte/authentification-contexte";
import Connexion from "./pages/Connexion";
import Inscription from "./pages/Inscription";
import TableauDeBord from "./pages/TableauDeBord";
import ProtectedRoute from "./composants/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/tableau-de-bord" replace />} />
          <Route path="/connexion" element={<Connexion />} />
          <Route path="/inscription" element={<Inscription />} />
          <Route
            path="/tableau-de-bord"
            element={
              <ProtectedRoute>
                <TableauDeBord />
              </ProtectedRoute>
            }
          />
          {/* route 404 simple */}
          <Route path="*" element={<div>Page non trouvée</div>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
