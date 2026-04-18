import axios from "axios";
import { API_URL } from "../utils/constants";

const TOKEN_KEY = "token";
const USER_KEY = "user";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor — attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

<<<<<<< HEAD
/// Response interceptor — handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // شيلنا السطور اللي بتعمل logout و redirect
      console.warn("401 Error: Redirect disabled for testing");
=======
// Response interceptor — handle 401 globally
// Skip redirect for auth endpoints (login/register) so their own error handling works
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthRequest = error.config?.url?.includes("/auth/");
    if (error.response && error.response.status === 401 && !isAuthRequest) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      window.location.href = "/login";
>>>>>>> Pair-1
    }
    return Promise.reject(error);
  }
);

export default api;
