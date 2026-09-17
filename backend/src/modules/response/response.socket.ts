import { getIO } from "../../realtime/socket.js";
import type { PollVoteUpdatePayload } from "./response.types.js";


export function emitPollVoteUpdate(pollId: string, payload: PollVoteUpdatePayload) {
    try {
        const io = getIO();

        const roomName = `poll:${pollId}:analytics`;

        // Emit to a specific room
        io.to(roomName).emit("poll-vote-update", {
            pollId,
            ...payload
        });

        console.log(`📊 Emitted real-time vote update for poll: ${pollId}`);

    } catch (error) {
        console.error(`Failed to emit poll vote update for poll ${pollId}:`, error);
    }
}
