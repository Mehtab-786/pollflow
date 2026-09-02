import { sendResponse } from '../../common/utils/APIResponse.utils.js';
import type { Request, Response } from "express";
import * as authService from './auth.service.js'

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const
};

const ACCESS_TOKEN_MAX_AGE = 15 * 60 * 1000; // 15 mins (900,000 ms)
const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days (604,800,000 ms)

const register = async (req: Request, res: Response) => {

    const { user, accessToken, refreshToken } = await authService.register(req.body);

    res.cookie("accessToken", accessToken, {
        ...cookieOptions,
        maxAge: ACCESS_TOKEN_MAX_AGE,
    });

    res.cookie("refreshToken", refreshToken, {
        ...cookieOptions,
        maxAge: REFRESH_TOKEN_MAX_AGE,
    });

    sendResponse(res, 201, 'Registration successful', user)
};

const login = async (req: Request, res: Response) => {
    const { user, accessToken, refreshToken } =
        await authService.login(req.body);

    res.cookie("accessToken", accessToken, {
        ...cookieOptions,
        maxAge: ACCESS_TOKEN_MAX_AGE,
    });

    res.cookie("refreshToken", refreshToken, {
        ...cookieOptions,
        maxAge: REFRESH_TOKEN_MAX_AGE,
    });

    return sendResponse(
        res,
        200,
        "Login successful",
        user
    );
};

const refresh = async (req: Request, res: Response) => {
    // 1. Extract refreshToken from cookies
    const token = req.cookies?.refreshToken;

    // 2. Call the refresh service
    const { accessToken, refreshToken } = await authService.refresh(token);

    // 3. Set updated cookies
    res.cookie("accessToken", accessToken, {
        ...cookieOptions,
        maxAge: ACCESS_TOKEN_MAX_AGE,
    });

    res.cookie("refreshToken", refreshToken, {
        ...cookieOptions,
        maxAge: REFRESH_TOKEN_MAX_AGE,
    });

    return sendResponse(res, 200, "Token refreshed successfully", null);
};

const logout = async (req: Request, res: Response) => {

    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);

    return sendResponse(res, 200, "Logout successful", null);
};

const profile = async (req: Request, res: Response) => {
    const user = await authService.profile(req.user!.id);
    return sendResponse(res, 200, "User profile", user);
};

export { register, login, logout, refresh, profile };
