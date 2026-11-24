import axios from "axios";

const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || "https://petadoptbackend.onrender.com/api").replace(/\/$/, ""),
  headers: { "Content-Type": "application/json" },
});

export default api;
