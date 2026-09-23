import type { AuthResponse, LoginCredentials, RegisterCredentials } from "../types/auth.types";
import { apiClient } from "./api/axios";

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>("/auth/login", credentials);
    return data;
};

export const register = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>("/auth/register", credentials);
    return data;
};

