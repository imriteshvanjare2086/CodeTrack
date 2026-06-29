const rawBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
const trimmedBaseUrl = rawBaseUrl.replace(/\/+$/, "");
const BASE_URL = trimmedBaseUrl.endsWith("/api") ? trimmedBaseUrl : `${trimmedBaseUrl}/api`;

export default BASE_URL;
