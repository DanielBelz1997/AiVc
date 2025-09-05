import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
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
