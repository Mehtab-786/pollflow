import type { Server, Socket } from "socket.io";
import prisma from "../../common/config/db.config.js";

export const registerPollSocketHandlers = (_io: Server, socket: Socket): void => {
    const userId = socket.data.userId;

    // Helper handler for joining poll analytics room
    const handleJoinAnalytics = async (
        data: unknown,
        callback?: (response: { success: boolean; message: string; pollId?: string }) => void
    ) => {
        try {
            const pollId = typeof data === "string" ? data : (data as { pollId?: string })?.pollId;

            if (!pollId || typeof pollId !== "string") {
                const message = "Poll ID is required to join analytics room";
                socket.emit("error", { message });
                if (typeof callback === "function") {
                    callback({ success: false, message });
                }
                return;
            }

            // Verify poll exists and that the connecting user is the creator
            const poll = await prisma.poll.findUnique({
                where: { id: pollId },
                select: {
                    id: true,
                    creatorId: true,
                },
            });

            if (!poll) {
                const message = "Poll not found";
                socket.emit("error", { message });
                if (typeof callback === "function") {
                    callback({ success: false, message, pollId });
                }
                return;
            }

            if (poll.creatorId !== userId) {
                const message = "Unauthorized: Only the poll creator can access real-time analytics";
                socket.emit("error", { message });
                if (typeof callback === "function") {
                    callback({ success: false, message, pollId });
                }
                return;
            }

            const roomName = `poll:${pollId}:analytics`;
            await socket.join(roomName);

            console.log(`📊 Socket ${socket.id} (User: ${userId}) joined room: ${roomName}`);

            const successPayload = {
                success: true,
                message: `Joined analytics room for poll ${pollId}`,
                pollId,
            };

            // Emit confirmation events for both conventions
            socket.emit("joined_poll_analytics", successPayload);
            socket.emit("joined-analytics", successPayload);

            if (typeof callback === "function") {
                callback(successPayload);
            }
        } catch (error) {
            console.error("❌ Error in join analytics handler:", error);
            const message = "Internal server error while joining analytics room";
            socket.emit("error", { message });
            if (typeof callback === "function") {
                callback({ success: false, message });
            }
        }
    };

    // Helper handler for leaving poll analytics room
    const handleLeaveAnalytics = async (
        data: unknown,
        callback?: (response: { success: boolean; message: string; pollId?: string }) => void
    ) => {
        try {
            const pollId = typeof data === "string" ? data : (data as { pollId?: string })?.pollId;

            if (pollId && typeof pollId === "string") {
                const roomName = `poll:${pollId}:analytics`;
                await socket.leave(roomName);

                console.log(`📊 Socket ${socket.id} left room: ${roomName}`);

                const successPayload = {
                    success: true,
                    message: `Left analytics room for poll ${pollId}`,
                    pollId,
                };

                socket.emit("left_poll_analytics", successPayload);
                socket.emit("left-analytics", successPayload);

                if (typeof callback === "function") {
                    callback(successPayload);
                }
            }
        } catch (error) {
            console.error("❌ Error in leave analytics handler:", error);
        }
    };

    // Register listeners for both naming conventions
    socket.on("join_poll_analytics", handleJoinAnalytics);
    socket.on("join-analytics", handleJoinAnalytics);

    socket.on("leave_poll_analytics", handleLeaveAnalytics);
    socket.on("leave-analytics", handleLeaveAnalytics);
};

