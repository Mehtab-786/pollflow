import type { Socket, Server } from "socket.io";
import prisma from "../../common/config/db.config.js";

export function registerPollSocketHandlers(_io: Server, socket: Socket) {
    const userId = socket.data.userId;

    // 1. Join Poll Analytics Room
    socket.on("join-analytics", async (pollId: unknown) => {
        try {
            // Validate input
            if (!pollId || typeof pollId !== "string") {
                socket.emit("error", { message: "Valid Poll ID is required" });
                return;
            }

            // Authorization: Ensure poll exists and user is the creator
            const poll = await prisma.poll.findUnique({
                where: { id: pollId },
                select: { id: true, creatorId: true },
            });

            if (!poll) {
                socket.emit("error", { message: "Poll not found" });
                return;
            }

            if (poll.creatorId !== userId) {
                socket.emit("error", { message: "Unauthorized: Only the creator can view real-time analytics" });
                return;
            }

            // Join the private analytics room for this poll
            const roomName = `poll:${pollId}:analytics`;
            await socket.join(roomName);

            console.log(`📊 User ${userId} joined room: ${roomName}`);
            socket.emit("joined-analytics", { pollId, message: "Successfully joined analytics room" });
        } catch (error) {
            console.error("Error joining analytics room:", error);
            socket.emit("error", { message: "Failed to join analytics room" });
        }
    });

    // 2. Leave Poll Analytics Room (Placed at top-level, not nested)
    socket.on("leave-analytics", async (pollId: unknown) => {
        try {
            if (pollId && typeof pollId === "string") {
                const roomName = `poll:${pollId}:analytics`;
                await socket.leave(roomName);
                console.log(`📊 Socket ${socket.id} left room: ${roomName}`);
                socket.emit("left-analytics", { pollId });
            }
        } catch (error) {
            console.error("Error leaving analytics room:", error);
        }
    });
}

