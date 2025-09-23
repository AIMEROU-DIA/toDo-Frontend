import React, { useEffect, useState, useContext } from "react";
import {
  listerTaches,
  creerTache,
  mettreAJourTache,
  supprimerTache,
} from "../services/tache-api";
import TacheListe from "../composants/TacheListe";
import { AuthContext } from "../contexte/authentification-contexte";
import ModalEdition from "../composants/ModalEdition"; 
import {
  LogOut,
  Plus,
  CheckCircle2,
  Circle,
  Clock,
  TrendingUp,
  AlertCircle,
  Loader2,
  Sparkles,
  Target
} from "lucide-react";
import "./TableauDeBord.css";

export default function TableauDeBord() {
  const { logout, user } = useContext(AuthContext);
  const [taches, setTaches] = useState([]);
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState(null);
  const [nouveauTitre, setNouveauTitre] = useState("");
  const [nouvelleDescription, setNouvelleDescription] = useState("");
  
    const [tacheEnEdition, setTacheEnEdition] = useState(null);

  // Charger toutes les tâches
  async function fetchTaches() {
    setChargement(true);
    setErreur(null);
    try {
      const data = await listerTaches(user?.username);
      setTaches(data);
    } catch (err) {
      console.error(err);
      setErreur(
        err?.response?.data?.message || "Impossible de charger les tâches"
      );
    } finally {
      setChargement(false);
    }
  }

  useEffect(() => {
    if (user?.username) {
      fetchTaches();
    }
  }, [user]);

  // Ajouter une tâche
  async function handleAjouter(e) {
    e.preventDefault();
    if (!nouveauTitre.trim()) return;

    try {
      const created = await creerTache(user?.username, {
        title: nouveauTitre,
        description: nouvelleDescription,
        completed: false,
      });

      setTaches((prev) => [created, ...prev]);
      setNouveauTitre("");
      setNouvelleDescription("");
    } catch (err) {
      console.error(err);
      setErreur(err?.response?.data?.message || "Erreur création tâche");
    }
  }

  // Bascule completed
  async function handleToggle(tache) {
    try {
      const updated = await mettreAJourTache(
        tache.id,
        user?.username,
        { ...tache, completed: !tache.completed }
      );
      setTaches((prev) =>
        prev.map((p) => (p.id === updated.id ? updated : p))
      );
    } catch (err) {
      console.error(err);
      setErreur(err?.response?.data?.message || "Erreur mise à jour");
    }
  }

  async function handleSupprimer(tache) {
    if (!window.confirm("Supprimer cette tâche ?")) return;
    try {
      await supprimerTache(tache.id, user?.username);
      setTaches((prev) => prev.filter((p) => p.id !== tache.id));
    } catch (err) {
      console.error(err);
      setErreur(err?.response?.data?.message || "Erreur suppression");
    }
  }

 function handleEdit(tache) {
    setTacheEnEdition(tache);
  }

  // sauvegarde via API et met à jour l'état
  async function handleSaveEdition(tacheModifiee) {
    try {
      const updated = await mettreAJourTache(
        tacheModifiee.id,
        user?.username,
        tacheModifiee
      );
      setTaches((prev) =>
        prev.map((p) => (p.id === updated.id ? updated : p))
      );
      setTacheEnEdition(null);
    } catch (err) {
      console.error(err);
      setErreur(err?.response?.data?.message || "Erreur édition");
    }
  }

  const tachesCompletes = taches.filter((t) => t.completed).length;
  const tachesTotales = taches.length;
  const pourcentageCompletion =
    tachesTotales > 0
      ? Math.round((tachesCompletes / tachesTotales) * 100)
      : 0;

  return (
    <div className="tableau-container">
      {/* Header with gradient background */}
      <header className="header">
        <div className="header-content">
          <div className="header-left">
            <div className="title-wrapper">
              <Sparkles className="title-icon" />
              <div>
                <h1 className="title">Tableau de bord</h1>
                <p className="subtitle">Bienvenue, {user?.username}</p>
              </div>
            </div>
          </div>
          <button className="logout-btn" onClick={logout}>
            <LogOut size={18} />
            Se déconnecter
          </button>
        </div>
      </header>

      <main className="main-content">
        {/* Enhanced Statistics Section */}
        <div className="stats-section">
          <div className="stat-card total">
            <div className="stat-icon-wrapper">
              <Target className="stat-icon" />
            </div>
            <div className="stat-content">
              <div className="stat-number">{tachesTotales}</div>
              <div className="stat-label">Tâches totales</div>
            </div>
          </div>

          <div className="stat-card completed">
            <div className="stat-icon-wrapper">
              <CheckCircle2 className="stat-icon" />
            </div>
            <div className="stat-content">
              <div className="stat-number">{tachesCompletes}</div>
              <div className="stat-label">Terminées</div>
            </div>
          </div>

          <div className="stat-card pending">
            <div className="stat-icon-wrapper">
              <Clock className="stat-icon" />
            </div>
            <div className="stat-content">
              <div className="stat-number">{tachesTotales - tachesCompletes}</div>
              <div className="stat-label">En cours</div>
            </div>
          </div>

          <div className="stat-card progress">
            <div className="stat-icon-wrapper">
              <TrendingUp className="stat-icon" />
            </div>
            <div className="stat-content">
              <div className="stat-number">{pourcentageCompletion}%</div>
              <div className="stat-label">Progression</div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${pourcentageCompletion}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        
        {/* Enhanced Tasks Section */}
        <section className="tasks-section">
          <div className="section-header">
            <div className="section-title-wrapper">
              <Circle className="section-icon" />
              <h2 className="section-title">Mes tâches</h2>
            </div>
            {tachesTotales > 0 && (
              <div className="tasks-summary">
                {tachesTotales - tachesCompletes > 0 ? (
                  <span className="tasks-remaining">
                    {tachesTotales - tachesCompletes} tâche{tachesTotales - tachesCompletes > 1 ? 's' : ''} restante{tachesTotales - tachesCompletes > 1 ? 's' : ''}
                  </span>
                ) : (
                  <span className="tasks-completed-all">
                    🎉 Toutes les tâches terminées !
                  </span>
                )}
              </div>
            )}
          </div>

          {erreur && (
            <div className="error-message">
              <AlertCircle size={20} />
              <span>{erreur}</span>
            </div>
          )}

          {chargement ? (
            <div className="loading">
              <Loader2 className="spinner" size={32} />
              <span>Chargement de vos tâches...</span>
            </div>
          ) : (
            <div className="tasks-container">
              {tachesTotales === 0 ? (
                <div className="empty-state">
                  <Circle size={64} className="empty-icon" />
                  <h3>Aucune tâche pour le moment</h3>
                  <p>Commencez par créer votre première tâche ci-dessus</p>
                </div>
              ) : (
                <TacheListe
                  taches={taches}
                  onToggleComplete={handleToggle}
                  onSupprimer={handleSupprimer}
                  onEdit={handleEdit}
                />
              )}
            </div>
          )}
        </section>

        {/* Enhanced Add Task Section */}
        <section className="add-task-section">
          <div className="section-header">
            <div className="section-title-wrapper">
              <Plus className="section-icon" />
              <h2 className="section-title">Ajouter une nouvelle tâche</h2>
            </div>
          </div>

          <form className="add-task-form" onSubmit={handleAjouter}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="titre" className="form-label">
                  Titre de la tâche *
                </label>
                <input
                  id="titre"
                  type="text"
                  className="form-input"
                  placeholder="Ex: Finaliser le rapport mensuel"
                  value={nouveauTitre}
                  onChange={(e) => setNouveauTitre(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description" className="form-label">
                Description détaillée
              </label>
              <textarea
                id="description"
                className="form-textarea"
                placeholder="Décrivez les détails de votre tâche..."
                value={nouvelleDescription}
                onChange={(e) => setNouvelleDescription(e.target.value)}
                rows="4"
              />
            </div>

            <button type="submit" className="submit-btn" disabled={!nouveauTitre.trim()}>
              <Plus size={20} />
              Ajouter la tâche
            </button>
          </form>
        </section>

      </main>

      {/* Modal édition */}
      <ModalEdition
        tache={tacheEnEdition}
        onClose={() => setTacheEnEdition(null)}
        onSave={handleSaveEdition}
      />
    </div>
  );
}