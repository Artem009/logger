import axios from "redaxios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://206.81.23.12:3000";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
