import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 10000,
  transformResponse: [
    (data) => {
      return data;
    },
    (error) => {
      return Promise.reject(error);
    },
  ],
});

export default api;
