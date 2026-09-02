import prisma from '../../common/config/db.config.js';
import ApiError from '../../common/utils/APIError.utils.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../common/utils/jwt.utils.js';
import bcrypt from "bcrypt";
import type { LoginInput, RegisterInput } from "./auth.types.js";

const SaltRounds = Number(process.env.SALTROUNDS) || 10;

const register = async ({ username, email, password }: RegisterInput) => {

    const isUserExist = await prisma.user.findUnique({ where: { email } });

    if (isUserExist) {
        throw new ApiError(409, 'Email already registered')
    };

    let hashedPassword = await bcrypt.hash(password, SaltRounds)

    const user = await prisma.user.create({
        data: { email, passwordHash: hashedPassword, username }, select: {
            id: true,
            username: true,
            email: true,
            createdAt: true,
        }
    })

    const accessToken = generateAccessToken({ id: user.id });
    const refreshToken = generateRefreshToken({ id: user.id, email: user.email });

    return { user, accessToken, refreshToken };

}

const login = async ({ email, password }: LoginInput) => {
    const user = await prisma.user.findUnique({
        where: {
            email,
        }
    });

    if (!user) {
        throw new ApiError(401, "Invalid email or password")
    }

    const isPasswordValid = await bcrypt.compare(
        password,
        user.passwordHash
    );

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid email or password")
    }

    const accessToken = generateAccessToken({ id: user.id, });

    const refreshToken = generateRefreshToken({ id: user.id, email: user.email, });

    const safeUser = {
        id: user.id,
        username: user.username,
        email: user.email,
    };

    return { user: safeUser, accessToken, refreshToken };
};

const refresh = async (token?: string) => {
    if (!token) {
        throw new ApiError(401, "Refresh token is missing");
    }

    let decoded;
    try {
        decoded = verifyRefreshToken(token);
    } catch {
        throw new ApiError(401, "Invalid or expired refresh token");
    }

    if (
        typeof decoded === "string" ||
        !decoded.id ||
        !decoded.email
    ) {
        throw new ApiError(401, "Invalid refresh token payload");
    }

    const accessToken = generateAccessToken({
        id: decoded.id,
    });

    const refreshToken = generateRefreshToken({
        id: decoded.id,
        email: decoded.email,
    })

    return { accessToken, refreshToken };
};

const profile = async (userId: string) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            username: true,
            email: true,
            createdAt: true,
        },
    });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return user;
};

export { register, login, refresh, profile };
