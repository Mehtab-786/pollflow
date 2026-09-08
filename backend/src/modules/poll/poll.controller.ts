import type { Request, Response } from "express";
import { sendResponse } from "../../common/utils/APIResponse.utils.js";
import ApiError from "../../common/utils/APIError.utils.js";
import * as pollService from "./poll.service.js";

const createPoll = async (req: Request, res: Response) => {
    const creatorId = req.userId;

    if (!creatorId) {
        throw new ApiError(401, "Unauthorized");
    }

    const {
        title,
        type = "POLL",
        responseMode = "ANONYMOUS",
        expiresAt,
        questions,
    } = req.body;

    // Required fields check (throw error if no value and no default exists)
    if (!title || typeof title !== "string" || !title.trim()) {
        throw new ApiError(400, "Title is required");
    }

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
        throw new ApiError(400, "At least one question is required");
    }

    // Call poll service to handle the creation and database transaction
    const result = await pollService.createPoll({
        creatorId,
        title: title.trim(),
        responseMode,
        expiresAt,
        type,
        questions,
    });

    return sendResponse(res, 201, "Poll created successfully", {
        poll: result,
    });
};

const getPublishedPolls = async (_req: Request, res: Response) => {
    const polls = await pollService.getPublishedPolls();

    return sendResponse(res, 200, "Published polls fetched successfully", {
        polls,
    });
};

const getMyPolls = async (req: Request, res: Response) => {
    const userId = req.userId;

    if (!userId) {
        throw new ApiError(401, "Unauthorized");
    }

    const polls = await pollService.getMyPolls(userId);

    return sendResponse(res, 200, "User polls fetched successfully", {
        polls,
    });
};

const getPollById = async (req: Request, res: Response) => {
    const id = req.params.id;
    const userId = req.userId ?? null;

    if (!id || typeof id !== "string") {
        throw new ApiError(400, "Poll ID is required");
    }

    const poll = await pollService.getPollById(id, userId);

    return sendResponse(res, 200, "Poll fetched successfully", {
        poll,
    });
};

export { createPoll, getPublishedPolls, getMyPolls, getPollById };


