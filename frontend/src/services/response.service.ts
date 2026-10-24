import type { SubmitResponsePayload } from "../types/response.types";
import { apiClient } from "./api/axios";


export const submitPollResponse = async (pollId: string, payload: SubmitResponsePayload) => {
    const { data } = await apiClient.post(`/polls/${pollId}/response`, payload);
    return data;
};
