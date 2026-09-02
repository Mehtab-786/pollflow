import jwt, {
    type JwtPayload,
    type SignOptions,
} from "jsonwebtoken";

const ACCESS_SECRET = process.env.JWT_ACCESS_TOKEN!;

const REFRESH_SECRET = process.env.JWT_REFRESH_TOKEN!;

const ACCESS_EXPIRES_IN =
    (process.env.JWT_ACCESS_EXPIRES_IN || "15m") as NonNullable<SignOptions["expiresIn"]>;

const REFRESH_EXPIRES_IN =
    (process.env.JWT_REFRESH_EXPIRES_IN || "7d") as NonNullable<SignOptions["expiresIn"]>;

const generateAccessToken = (payload: object): string => {
    return jwt.sign(payload, ACCESS_SECRET, {
        expiresIn: ACCESS_EXPIRES_IN,
    });
};

const verifyAccessToken = (token: string): string | JwtPayload => {
    return jwt.verify(token, ACCESS_SECRET);
};

const generateRefreshToken = (payload: object): string => {
    return jwt.sign(payload, REFRESH_SECRET, {
        expiresIn: REFRESH_EXPIRES_IN,
    });
};

const verifyRefreshToken = (token: string): string | JwtPayload => {
    return jwt.verify(token, REFRESH_SECRET);
};

export {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
};
