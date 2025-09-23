import React from "react";
import { 
  CheckCircle2, 
  RotateCcw,
  Edit3, 
  Trash2, 
  Clock,
  Calendar,
  User
} from "lucide-react";
import "./TacheElement.css";

export default function TacheElement({ tache, onToggleComplete, onSupprimer, onEdit }) {
  const isCompleted = tache.completed;

  return (
    <div className={`tache-row ${isCompleted ? "completed" : "pending"}`}>
      {/* Colonne Titre */}
      <div className="tache-col title">
        <h3 className={`tache-title ${isCompleted ? "completed" : ""}`}>
          {tache.title}
        </h3>
        {tache.description && (
          <p className={`tache-description ${isCompleted ? "completed" : ""}`}>
            {tache.description}
          </p>
        )}
      </div>

      {/* Colonne Statut */}
      <div className="tache-col status">
        {isCompleted ? (
          <span className="status-badge completed">
            <CheckCircle2 size={14} />
            Terminée
          </span>
        ) : (
          <span className="status-badge pending">
            <Clock size={14} />
            En cours
          </span>
        )}
      </div>

      {/* Colonne Date */}
      <div className="tache-col date">
        {tache.createdAt && (
          <span className="info-item">
            <Calendar size={14} />
            {new Date(tache.createdAt).toLocaleDateString("fr-FR")}
          </span>
        )}
      </div>

      {/* Colonne Assigné à */}
      <div className="tache-col assigned">
        {tache.assignedTo ? (
          <span className="info-item">
            <User size={14} />
            {tache.assignedTo}
          </span>
        ) : (
          <span className="info-item">—</span>
        )}
      </div>

      {/* Colonne Actions */}
      <div className="tache-col actions">
        <button
          className={`action-btn toggle ${isCompleted ? "completed" : "pending"}`}
          onClick={() => onToggleComplete(tache)}
          title={isCompleted ? "Marquer comme non terminée" : "Marquer comme terminée"}
        >
          {isCompleted ? (
            <>
              <RotateCcw size={16} />
              <span className="action-text">Réactiver</span>
            </>
          ) : (
            <>
              <CheckCircle2 size={16} />
              <span className="action-text">Terminer</span>
            </>
          )}
        </button>

        <button
          className="action-btn edit"
          onClick={() => onEdit(tache)}
          title="Modifier la tâche"
        >
          <Edit3 size={16} />
          <span className="action-text">Modifier</span>
        </button>

        <button
          className="action-btn delete"
          onClick={() => onSupprimer(tache)}
          title="Supprimer la tâche"
        >
          <Trash2 size={16} />
          <span className="action-text">Supprimer</span>
        </button>
      </div>
    </div>
  );
}
