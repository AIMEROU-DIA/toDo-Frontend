import api from "./api-instance";

export async function login({ username, password }) {
  const resp = await api.post("/api/auth/login", { username, password });
  return resp.data;
}

export async function register({ username, email, password }) {
  const resp = await api.post("/api/auth/register", { username, email, password });
  return resp.data;
}
    