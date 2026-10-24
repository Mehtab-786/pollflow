import { sendResponse } from '../../common/utils/APIResponse.utils.js';
import type { Request, Response } from "express";
import * as authService from './auth.service.js'
import { ACCESS_TOKEN_MAX_AGE, cookieOptions, REFRESH_TOKEN_MAX_AGE } from '../../common/constants/contant.js';


const setAuthCookies = (res: Response, accessToken: string, refreshToken: string) => {
    res.cookie("accessToken", accessToken, { ...cookieOptions, maxAge: ACCESS_TOKEN_MAX_AGE });
    res.cookie("refreshToken", refreshToken, { ...cookieOptions, maxAge: REFRESH_TOKEN_MAX_AGE });
};

const register = async (req: Request, res: Response) => {

    const { user, accessToken, refreshToken } = await authService.register(req.body);

    setAuthCookies(res, accessToken, refreshToken)

    sendResponse(res, 201, 'Registration successful', user)
};

const login = async (req: Request, res: Response) => {
    const { user, accessToken, refreshToken } = await authService.login(req.body);

    setAuthCookies(res, accessToken, refreshToken)
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
    setAuthCookies(res, accessToken, refreshToken)

    return sendResponse(res, 200, "Token refreshed successfully", null);
};

const logout = async (req: Request, res: Response) => {

    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);

    return sendResponse(res, 200, "Logout successful", null);
};

const me = async (req: Request, res: Response) => {
    const user = await authService.me(req.userId!);
    return sendResponse(res, 200, "Current user fetched successfully", user);
};

export { register, login, logout, refresh, me };

