class ApiError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;

    constructor(
        statusCode: number,
        message: string,
        options?: {
            cause?: unknown;
        }
    ) {
        super(message, options);

        this.name = "ApiError";
        this.statusCode = statusCode;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

export default ApiError;