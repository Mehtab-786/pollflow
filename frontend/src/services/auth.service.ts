import type { AuthResponse, LoginCredentials, RegisterCredentials } from "../types/auth.types";
import { apiClient, refreshAuthToken } from "./api/axios";
import { useAuthStore } from "../store/auth.store";

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>("/auth/login", credentials);
    return data;
};

export const register = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>("/auth/register", credentials);
    return data;
};

export const logout = async () => {
    const { data } = await apiClient.post("/auth/logout");
    return data;
};

export const getCurrentUser = async (): Promise<AuthResponse> => {
    const { data } = await apiClient.get<AuthResponse>("/auth/me");
    return data;
};

export const refreshToken = async (): Promise<void> => {
    await refreshAuthToken();
};

// Singleton promise to prevent concurrent duplicate initializations (e.g. React StrictMode)
let initPromise: Promise<void> | null = null;

export const initializeAuth = async (): Promise<void> => {
    if (initPromise) {
        return initPromise;
    }

    initPromise = (async () => {
        const { login, logout, setInitialized } = useAuthStore.getState();

        try {
            // Attempt to fetch current user. If access token is expired,
            // the Axios response interceptor automatically handles /auth/refresh and retries.
            const response = await getCurrentUser();
            if (response?.success && response?.data) {
                login(response.data);
                return;
            }
            logout();
        } catch {
            // Session missing, expired, or refresh token invalid
            logout();
        } finally {
            setInitialized(true);
        }
    })().finally(() => {
        initPromise = null;
    });

    return initPromise;
};



