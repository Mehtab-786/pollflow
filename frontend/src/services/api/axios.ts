import axios, { type InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "../../store/auth.store";

interface CustomRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL || "http://localhost:5000/api/v1",
    timeout: 10000,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor
apiClient.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Endpoints where a 401 response should not trigger token refresh
const isAuthEndpoint = (url?: string): boolean => {
    if (!url) return false;
    return [
        "/auth/login",
        "/auth/register",
        "/auth/refresh",
        "/auth/logout",
    ].some((endpoint) => url.includes(endpoint));
};

// Singleton promise for in-flight refresh to avoid race conditions with token rotation
let refreshPromise: Promise<void> | null = null;

export const refreshAuthToken = async (): Promise<void> => {
    if (!refreshPromise) {
        refreshPromise = (async () => {
            try {
                await apiClient.post("/auth/refresh");
            } catch (err) {
                // If refresh token is expired or invalid, log user out
                useAuthStore.getState().logout();
                throw err;
            } finally {
                refreshPromise = null;
            }
        })();
    }
    return refreshPromise;
};

// Response interceptor
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config as CustomRequestConfig | undefined;

        // If no config or status is not 401, reject immediately
        if (!originalRequest || error.response?.status !== 401) {
            return Promise.reject(error);
        }

        // Prevent loops on auth endpoints or already-retried requests
        if (isAuthEndpoint(originalRequest.url) || originalRequest._retry) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        try {
            await refreshAuthToken();
            return apiClient(originalRequest);
        } catch (refreshError) {
            return Promise.reject(refreshError);
        }
    }
);

export default apiClient;

