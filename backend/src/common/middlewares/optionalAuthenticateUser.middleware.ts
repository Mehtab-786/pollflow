import type { Request, Response, NextFunction } from "express";
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
    try {
        let decoded: any = verifyAccessToken(token);

        if (decoded || typeof decoded !== "string" && decoded.id) {
            req.userId = decoded.id;
        }
    } catch {
        req.userId = undefined
    }


    next();
};

export default optionalAuthenticateUser;
