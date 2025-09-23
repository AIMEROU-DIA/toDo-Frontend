import React from "react";
import {
  CheckCircle2,
  Circle,
  Pencil,   // icône modifier
  Trash2,   // icône supprimer
  RotateCcw // icône réactiver
} from "lucide-react";
import "./TacheListe.css";

export default function TacheListe({ taches, onToggleComplete, onSupprimer, onEdit }) {
  if (!taches || taches.length === 0) {
    return (
      <div className="empty-task-state">
        <h3 className="empty-title">Aucune tâche pour le moment</h3>
        <p className="empty-description">
          Créez votre première tâche pour commencer à organiser votre travail
        </p>
      </div>
    );
  }

  return (
    <div className="tache-liste-container">
      <table className="task-table">
        <thead>
          <tr>
            <th>Titre</th>
            <th>Description</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {taches.map((t) => (
            <tr key={t.id} className={t.completed ? "completed" : ""}>
              <td className="task-title">{t.title}</td>
              <td className="task-desc">{t.description || "—"}</td>
              <td className="task-status">
                {t.completed ? (
                  <span className="status completed">
                    <CheckCircle2 size={14} /> Terminé
                  </span>
                ) : (
                  <span className="status pending">
                    <Circle size={14} /> En cours
                  </span>
                )}
              </td>
              <td className="task-actions">
                <button
                  className="btn toggle"
                  title={t.completed ? "Réactiver" : "Marquer comme terminée"}
                  onClick={() => onToggleComplete(t)}
                >
                  {t.completed ? (
                    <RotateCcw size={16} />
                  ) : (
                    <CheckCircle2 size={16} />
                  )}
                </button>
                <button
                  className="btn edit"
                  title="Modifier la tâche"
                  onClick={() => onEdit(t)}
                >
                  <Pencil size={16} />
                </button>
                <button
                  className="btn delete"
                  title="Supprimer la tâche"
                  onClick={() => onSupprimer(t)}
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
