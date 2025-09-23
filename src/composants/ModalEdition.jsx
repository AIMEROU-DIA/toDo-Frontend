// src/composants/ModalEdition.jsx
import React, { useState, useEffect } from "react";
import "./ModalEdition.css";

export default function ModalEdition({ tache, onClose, onSave }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (tache) {
      setTitle(tache.title || "");
      setDescription(tache.description || "");
    }
  }, [tache]);

  if (!tache) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...tache, title, description });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Modifier la tâche</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <label>
            Titre
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>
          <label>
            Description
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="btn-save">
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
