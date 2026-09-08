import type { Request, Response, NextFunction } from "express";
import prisma from "../config/db.config.js";
import ApiError from "../utils/APIError.utils.js";
import { verifyAccessToken } from "../utils/jwt.utils.js";

const optionalAuthenticateUser = async (
    req: Request,
    _res: Response,
    next: NextFunction
) => {
    // 1. Extract token from cookie (web) or Authorization header (Bearer)
    const token =
        req.cookies?.accessToken ||
        (req.headers.authorization?.startsWith("Bearer ")
            ? req.headers.authorization.split(" ")[1]
            : null);

    // If no token is provided, continue with req.user undefined
    if (!token) {
        return next();
    }

    // 2. Verify token signature and expiration
    let decoded: any;
    try {
        decoded = verifyAccessToken(token);
    } catch {
        throw new ApiError(401, "Invalid or expired access token");
    }

    if (!decoded || typeof decoded === "string" || !decoded.id) {
        throw new ApiError(401, "Invalid access token payload");
    }

    // 3. Attach authenticated user to request
    req.userId = decoded.id;

    next();
};

export default optionalAuthenticateUser;
