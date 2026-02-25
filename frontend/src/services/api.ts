import axios from "axios";

const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/$/, "");

/**
 * Secure API Client
 * - Attaches JWT access token from localStorage on every request
 * - Auto-refreshes token on 401 via HttpOnly refresh cookie
 * - Redirects to /login?session=expired if refresh fails
 */
const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // Required for HttpOnly cookie (refresh token)
  timeout: 15000,
});

// ── Request Interceptor: Attach Access Token ──────────────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response Interceptor: Auto Token Refresh ─────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only retry once, only on 401, and not on the refresh/auth endpoints
    const isAuthRoute = originalRequest.url?.includes("/auth/refresh") ||
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/google");

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRoute) {
      originalRequest._retry = true;

      try {
        const { data } = await axios.post<{ token: string }>(
          `${API_BASE}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newToken: string = data.token;
        localStorage.setItem("auth_token", newToken);
        api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return api(originalRequest);
      } catch {
        // Refresh failed → force logout
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
        delete api.defaults.headers.common["Authorization"];
        if (typeof window !== "undefined") {
          window.location.href = "/login?session=expired";
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
