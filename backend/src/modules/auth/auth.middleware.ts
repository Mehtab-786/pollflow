import type { Request, Response, NextFunction } from "express";
import prisma from "../../common/config/db.config.js";
import ApiError from "../../common/utils/APIError.utils.js";
import { verifyAccessToken } from "../../common/utils/jwt.utils.js";

const authenticateUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // 1. Extract token from cookie (web) or Authorization header (Bearer)
    const token =
        req.cookies?.accessToken ||
        (req.headers.authorization?.startsWith("Bearer ")
            ? req.headers.authorization.split(" ")[1]
            : null);

    if (!token) {
        throw new ApiError(401, "Authentication token is missing");
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

    // 3. Verify user exists in Prisma database
    const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
            id: true,
            email: true,
            username: true,
        },
    });

    if (!user) {
        throw new ApiError(401, "User not found or account no longer exists");
    }

    // 4. Attach authenticated user to request
    req.user = user;

    next();
};

export { authenticateUser };
