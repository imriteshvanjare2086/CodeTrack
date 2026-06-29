import axios from "axios";

const TOKEN_KEY = "token";
const rawApiUrl = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

function normalizeApiUrl(url: string) {
  const trimmed = url.replace(/\/+$/, "");
  return trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY) || "";
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export const api = axios.create({
  baseURL: normalizeApiUrl(rawApiUrl),
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

