import axios from "axios";

const api = axios.create({
  baseURL: "https://petadoptbackend-4dt0.onrender.com/api",
});

export default api;