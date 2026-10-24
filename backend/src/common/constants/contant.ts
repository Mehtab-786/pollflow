const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none" as const
};

const ACCESS_TOKEN_MAX_AGE = 15 * 60 * 1000; // 15 mins (900,000 ms)
const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days (604,800,000 ms)

const SaltRounds = Number(process.env.SALTROUNDS) || 10;

export {
    cookieOptions,
    ACCESS_TOKEN_MAX_AGE,
    REFRESH_TOKEN_MAX_AGE,
    SaltRounds
}

