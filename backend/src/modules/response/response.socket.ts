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

export type EmitVoteUpdateInput = {
    totalResponsesIncrement?: number;
    totalResponseIncrement?: number;
    answers: Array<{
        questionId: string;
        optionId: string | null;
    }>;
    timestamp: Date | string;
};

export const emitPollVoteUpdate = (
    pollId: string,
    payload: EmitVoteUpdateInput
): void => {
    try {
        const io = getIO();
        const roomName = `poll:${pollId}:analytics`;

        // Check active listeners in the room
        const room = io.sockets.adapter.rooms.get(roomName);
        const listenerCount = room ? room.size : 0;

        const totalInc = payload.totalResponsesIncrement ?? payload.totalResponseIncrement ?? 1;

        const eventData = {
            pollId,
            totalResponsesIncrement: totalInc,
            totalResponseIncrement: totalInc,
            answers: payload.answers,
            timestamp: payload.timestamp,
        };

        // Emit if there are active listeners connected to this room
        if (listenerCount > 0) {
            io.to(roomName).emit("poll:analytics_update", eventData);
            io.to(roomName).emit("poll-vote-update", eventData);

            console.log(`⚡ Broadcasted poll analytics update to ${roomName} (${listenerCount} viewer(s))`);
        }
    } catch (error) {
        // Socket emission failure should never interrupt HTTP vote persistence
        console.error(`❌ Failed to emit vote update for poll ${pollId}:`, error);
    }
};
