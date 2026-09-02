import type { Request } from "express";
export interface RegisterInput {
    username: string,
    email: string,
    password: string
}

export interface LoginInput {
    email: string,
    password: string
}

export interface AuthTokens {
    accessToken: string,
    refreshToken: string
}

export interface AuthenticatedRequest extends Request {
    user: {
        id: string;
        email?: string;
        username?: string;
    };
}

// Extends Express Request right here inside auth.types.ts
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email?: string;
                username?: string;
            };
        }
    }
}