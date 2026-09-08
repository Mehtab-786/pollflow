import { Router } from "express";
import {
    createPoll,
    getPollById,
    getMyPolls,
    getPublishedPolls,
    publishPoll,
    getPollAnalytics,
} from "./poll.controller.js";
import validate from "../../common/middlewares/validate.middlewares.js";
import { CreatePollDTO } from "./poll.dto.js";
import { authenticateUser } from "../../common/middlewares/auth.middleware.js";
import optionalAuthenticateUser from "../../common/middlewares/optionalAuthenticateUser.middleware.js";

const router = Router();

// 1. Create a poll (Protected)
router.post("/", authenticateUser, validate(CreatePollDTO), createPoll);

// 2. Get all published polls (Public)
router.get("/", getPublishedPolls);

// 3. Get all polls created by logged-in user (Protected)
// Note: Placed before "/:id" so "me" is not parsed as a parameter ID
router.get("/me", authenticateUser, getMyPolls);

// 4. Get specific poll by ID if published (Public / Protected)
router.get("/:id", optionalAuthenticateUser, getPollById);

// 5. Publish a poll (Protected - Creator only)
router.post("/:id/publish", authenticateUser, publishPoll);

// 6. Get analytics/results for a poll (Protected)
router.get("/:id/analytics", authenticateUser, getPollAnalytics);

export default router;
