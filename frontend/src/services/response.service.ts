import { apiClient } from "./api/axios";

interface SubmitAnswerPayload {
    questionId: string;
    optionId: string | null;
}

interface SubmitResponsePayload {
    answers: SubmitAnswerPayload[];
}

export const submitPollResponse = async (pollId: string, payload: SubmitResponsePayload) => {
    const { data } = await apiClient.post(`/polls/${pollId}/response`, payload);
    return data;
};
