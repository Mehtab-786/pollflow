import { getIO } from "../../realtime/socket.js";

export interface PollVoteUpdatePayload {
    pollId: string;
    totalResponsesIncrement: number;
    answers: Array<{
        questionId: string;
        optionId: string | null;
    }>;
    timestamp: Date | string;
}

export const emitPollVoteUpdate = (
    pollId: string,
    payload: Omit<PollVoteUpdatePayload, "pollId">
): void => {
    try {
        const io = getIO();
        const roomName = `poll:${pollId}:analytics`;

        // Check active listeners in the room
        const room = io.sockets.adapter.rooms.get(roomName);
        const listenerCount = room ? room.size : 0;

        // Emit if there is at least one listener connected to this room
        if (listenerCount > 0) {
            io.to(roomName).emit("poll:analytics_update", {
                pollId,
                totalResponsesIncrement: payload.totalResponsesIncrement,
                answers: payload.answers,
                timestamp: payload.timestamp,
            });

            console.log(`⚡ Broadcasted poll:analytics_update to ${roomName} (${listenerCount} viewer(s))`);
        }
    } catch (error) {
        // Socket emission failure should never interrupt HTTP vote persistence
        console.error(`❌ Failed to emit vote update for poll ${pollId}:`, error);
    }
};
