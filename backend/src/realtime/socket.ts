import { Server as SocketIOServer } from "socket.io";
import type { Server as HttpServer } from "node:http";
import type { Socket } from "socket.io";
import { verifyAccessToken } from "../common/utils/jwt.utils.js";
import { registerPollSocketHandlers } from "../modules/poll/poll.socket.js";

let io: SocketIOServer | null = null;

export const initSocket = (httpServer: HttpServer): SocketIOServer => {
    io = new SocketIOServer(httpServer, {
        cors: {
            origin: process.env.CORS_ORIGIN || "http://localhost:5173",
            credentials: true,
        },
    });

    // Handshake Authentication Middleware for creators
    io.use((socket: Socket, next) => {
        try {
            // 1. Extract token from handshake auth, authorization header, or cookies
            let token: string | undefined = socket.handshake.auth?.token;

            if (!token && socket.handshake.headers.authorization) {
                const parts = socket.handshake.headers.authorization.split(" ");
                if (parts[0] === "Bearer" && parts[1]) {
                    token = parts[1];
                }
            }

            if (!token && socket.handshake.headers.cookie) {
                const match = socket.handshake.headers.cookie.match(/(?:^|;\s*)accessToken=([^;]+)/);
                if (match?.[1]) {
                    token = decodeURIComponent(match[1]);
                }
            }

            if (!token) {
                return next(new Error("Authentication token is missing"));
            }

            // 2. Verify access token
            const decoded = verifyAccessToken(token);

            if (!decoded || typeof decoded === "string" || !decoded.id) {
                return next(new Error("Invalid access token payload"));
            }

            // 3. Attach userId to socket session data
            socket.data.userId = decoded.id;
            return next();
        } catch {
            return next(new Error("Unauthorized: Invalid or expired access token"));
        }
    });

    // Root connection listener
    io.on("connection", (socket: Socket) => {
        console.log(`🔌 Socket connected: ${socket.id} (User: ${socket.data.userId})`);

        // Register domain event listeners for poll analytics
        registerPollSocketHandlers(io!, socket);

        socket.on("disconnect", (reason) => {
            console.log(`🔌 Socket disconnected: ${socket.id} (Reason: ${reason})`);
        });
    });

    return io;
};

export const getIO = (): SocketIOServer => {
    if (!io) {
        throw new Error("Socket.io has not been initialized. Call initSocket first.");
    }
    return io;
};
