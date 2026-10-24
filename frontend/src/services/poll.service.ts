import { apiClient } from "./api/axios";
import type { POLL } from "../types/poll.types";

export const createPoll = async (payload: POLL) => {
    const { data } = await apiClient.post("/polls", payload);
    return data;
};

export const getMyPolls = async () => {
    const { data } = await apiClient.get("/polls/me");
    return data;
};

export const getAllPublishedPolls = async () => {
    const { data } = await apiClient.get("/polls");
    return data;
};


export const getPollById = async (id: string) => {
    const { data } = await apiClient.get(`/polls/${id}`);
    return data;
};

export const publishPoll = async (id: string) => {
    const { data } = await apiClient.post(`/polls/${id}/publish`);
    return data;
};

export const getPollAnalytics = async (id: string) => {
    const { data } = await apiClient.get(`/polls/${id}/analytics`);
    return data;
};

