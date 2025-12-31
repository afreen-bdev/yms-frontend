import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000, // important
});

// Wake backend on first load
export const wakeBackend = async () => {
  try {
    await axios.get(`${import.meta.env.VITE_API_BASE_URL}/healthz`);
  } catch {
    // ignore – backend may be waking up
  }
};

// Attach JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;