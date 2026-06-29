import { api, setToken } from "@/lib/apiClient";
import { fetchProfile } from "./user";

export async function login(payload: { email: string; password: string }) {
  const res = await api.post("/auth/login", payload);
  setToken(res.data.token);
  const user = await fetchProfile();
  localStorage.setItem("user", JSON.stringify(user));
  return { token: res.data.token, user };
}

export async function register(payload: { username: string; email: string; password: string }) {
  const res = await api.post("/auth/register", payload);
  setToken(res.data.token);
  const user = await fetchProfile();
  localStorage.setItem("user", JSON.stringify(user));
  return { token: res.data.token, user };
}
export async function googleLogin(credential: string) {
  const res = await api.post("/auth/google", { credential });
  setToken(res.data.token);
  const user = await fetchProfile();
  localStorage.setItem("user", JSON.stringify(user));
  return { token: res.data.token, user };
}
