import type { AuthResponse, LoginCredentials, RegisterCredentials } from "../types/auth.types";
import { apiClient } from "./api/axios";
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
    await apiClient.post("/auth/refresh");
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
            // 1. Attempt to fetch current user with existing access token cookie
            const response = await getCurrentUser();
            if (response?.success && response?.data) {
                login(response.data);
                return;
            }
        } catch {
            // 2. Access token may be expired or missing; attempt refreshing tokens
            try {
                await refreshToken();
                // 3. If refresh succeeded, retry fetching current user with new access cookie
                const retryResponse = await getCurrentUser();

                if (retryResponse?.success && retryResponse?.data) {
                    login(retryResponse.data);
                    return;
                }
            } catch {
                // Refresh token also missing or expired; clear auth state
                logout();
                return;
            }
        } finally {
            setInitialized(true);
        }

        logout();
    })().finally(() => {
        initPromise = null;
    });

    return initPromise;
};


