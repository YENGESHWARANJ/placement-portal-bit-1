import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/**
 * Premium API Client
 * Optimized for secure JWT dual-token authentication.
 */
const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // Crucial for HttpOnly cookies (refresh token)
});

// Request Interceptor: Attach Access Token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor: Handle Token Refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 (Unauthorized) and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to call the refresh endpoint
        // Backend should receive 'refreshToken' cookie automatically with withCredentials: true
        const response = await axios.post(
          `${API_BASE.replace(/\/$/, "")}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const { token } = response.data;

        // Store new access token
        localStorage.setItem("token", token);

        // Update authorization header & retry original request
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, logout user
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        if (typeof window !== "undefined") {
          window.location.href = "/login?session=expired";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
