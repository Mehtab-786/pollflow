export interface User {
    id: string
    username: string
    email: string
    createdAt?: string;
}

export interface AuthContext {
    user: User | null
    isAuthenticated: boolean

    login: (user: User) => void
    logout: () => void
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    email: string;
    password: string;
    username: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    data: User;
}
