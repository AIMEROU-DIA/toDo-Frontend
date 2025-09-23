import api from "./api-instance";

export async function listerTaches(username) {
  const resp = await api.get(`/api/tasks?username=${username}`);
  return resp.data;
}

export async function creerTache(username, tache) {
  return (await api.post(`/api/tasks?username=${username}`, tache)).data;
}

export async function mettreAJourTache(id, username, tache) {
  return (await api.put(`/api/tasks/${id}?username=${username}`, tache)).data;
}

export async function supprimerTache(id, username) {
  return (await api.delete(`/api/tasks/${id}?username=${username}`)).data;
}

