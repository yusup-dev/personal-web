import axios from "axios";
import { ApiValidationError } from "./response";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 8000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorDetails = {
      message: error.message,
      status: error.response?.status,
      url: error.config?.url,
      method: error.config?.method,
      validationIssues:
        error instanceof ApiValidationError ? error.issues : undefined,
    };
    console.warn("[API Error Interceptor]:", errorDetails);
    return Promise.reject(error);
  }
);

export default axiosClient;