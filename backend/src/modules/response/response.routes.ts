import { Router } from "express";
import { submitResponse } from "./response.controller.js";
import validate from "../../common/middlewares/validate.middlewares.js";
import { SubmitResponseDTO } from "./response.dto.js";
import optionalAuthenticateUser from "../../common/middlewares/optionalAuthenticateUser.middleware.js";

const router = Router();

// Submit response to a poll
router.post(
    "/:pollId/response",
    optionalAuthenticateUser,
    validate(SubmitResponseDTO),
    submitResponse
);

export default router;
