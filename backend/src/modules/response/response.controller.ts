import type { Request, Response } from "express";
import { sendResponse } from "../../common/utils/APIResponse.utils.js";
import ApiError from "../../common/utils/APIError.utils.js";
import * as responseService from "./response.service.js";

const submitResponse = async (req: Request, res: Response) => {
    const pollId = req.params.pollId;
    const userId = req.userId ?? null;
    const { answers } = req.body;

    if (!pollId || typeof pollId !== "string") {
        throw new ApiError(400, "Poll ID is required");
    }

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
        throw new ApiError(400, "At least one answer is required");
    }

    const result = await responseService.submitPollResponse({
        pollId,
        userId,
        answers,
    });

    return sendResponse(res, 201, "Response submitted successfully", {
        response: result,
    });
};

export { submitResponse };
