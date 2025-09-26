import api from "./api-instance";

// Plus besoin de passer username en query param - l'authentification se fait via le token
export async function listerTaches() {
  const resp = await api.get(`/api/tasks`);
  return resp.data;
}

export async function creerTache(tache) {
  return (await api.post(`/api/tasks`, tache)).data;
}

export async function mettreAJourTache(id, tache) {
  return (await api.put(`/api/tasks/${id}`, tache)).data;
}

export async function supprimerTache(id) {
  return (await api.delete(`/api/tasks/${id}`)).data;
}