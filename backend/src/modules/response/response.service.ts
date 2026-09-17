import prisma from "../../common/config/db.config.js";
import ApiError from "../../common/utils/APIError.utils.js";
import type { SubmitPollResponseParams } from "./response.types.js";
import { emitPollVoteUpdate } from "./response.socket.js";

const submitPollResponse = async ({
    pollId,
    userId,
    answers,
}: SubmitPollResponseParams) => {
    try {
        // 1. Verify pollId is provided
        if (!pollId) {
            throw new ApiError(400, "Poll ID is required");
        }

        // 2. Fetch poll with its questions and options
        const poll = await prisma.poll.findUnique({
            where: { id: pollId },
            include: {
                questions: {
                    include: {
                        options: true,
                    },
                },
            },
        });

        if (!poll) {
            throw new ApiError(404, "Poll not found");
        }

        // 3. Verify poll is not expired
        const isExpired = Boolean(poll.expiresAt && new Date() > new Date(poll.expiresAt));
        if (isExpired) {
            throw new ApiError(400, "Poll has expired already");
        }

        // 4. Response Mode Verification
        if (poll.responseMode === "AUTHENTICATED") {
            if (!userId) {
                throw new ApiError(401, "Authentication is required to vote on this poll");
            }

            // Check if this user has already voted on this poll
            const alreadyVoted = await prisma.response.findFirst({
                where: {
                    pollId,
                    respondentId: userId,
                },
            });

            if (alreadyVoted) {
                throw new ApiError(400, "You have already voted on this poll");
            }
        }

        // 5. Validate submitted questions & options
        const questionMap = new Map(poll.questions.map((q) => [q.id, q]));

        // Check each submitted answer belongs to this poll and its question
        for (const ans of answers) {
            const question = questionMap.get(ans.questionId);
            if (!question) {
                throw new ApiError(
                    400,
                    `Question ID "${ans.questionId}" does not belong to this poll`
                );
            }

            // If an optionId is supplied, ensure it belongs to this question
            if (ans.optionId) {
                const optionExists = question.options.some((opt) => opt.id === ans.optionId);
                if (!optionExists) {
                    throw new ApiError(
                        400,
                        `Option ID "${ans.optionId}" does not belong to question "${question.question}"`
                    );
                }
            }

            // Check selectionMode if question only allows a single selection
            if (question.selectionMode === "SINGLE") {
                const selectionsCount = answers.filter((a) => a.questionId === ans.questionId).length;
                if (selectionsCount > 1) {
                    throw new ApiError(
                        400,
                        `Multiple selections not allowed for question "${question.question}"`
                    );
                }
            }
        }

        // 6. Check required questions: ensure answer is provided
        for (const question of poll.questions) {
            if (question.isRequired) {
                const answered = answers.some(
                    (ans) => ans.questionId === question.id && ans.optionId && ans.optionId.trim() !== ""
                );
                if (!answered) {
                    throw new ApiError(
                        400,
                        `An answer is required for question: "${question.question}"`
                    );
                }
            }
        }

        // Filter valid answer entries to persist
        const answersToCreate = answers.filter(
            (ans) => ans.questionId && (ans.optionId || ans.optionId === null)
        );

        // 7. Execute in a Prisma database transaction
        const createdResponse = await prisma.$transaction(async (tx) => {
            const response = await tx.response.create({
                data: {
                    pollId,
                    respondentId: userId ?? null,
                    answers: {
                        create: answersToCreate.map((ans) => ({
                            questionId: ans.questionId,
                            optionId: ans.optionId ? ans.optionId : null,
                        })),
                    },
                },
                include: {
                    answers: {
                        select: {
                            id: true,
                            questionId: true,
                            optionId: true,
                        },
                    },
                },
            });

            return response;
        });

        // 8. Broadcast real-time update to active analytics listeners (if any)
        emitPollVoteUpdate(pollId, {
            totalResponseIncrement: 1,
            answers: createdResponse.answers.map((ans) => ({
                questionId: ans.questionId,
                optionId: ans.optionId,
            })),
            timestamp: createdResponse.createdAt,
        });



        // 9. Return response summary
        return {
            id: createdResponse.id,
            pollId: createdResponse.pollId,
            respondentId: createdResponse.respondentId,
            createdAt: createdResponse.createdAt,
            answers: createdResponse.answers.map((ans) => ({
                questionId: ans.questionId,
                optionId: ans.optionId,
            })),
        };
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(
            500,
            error instanceof Error ? error.message : "Failed to submit poll response"
        );
    }
};

export { submitPollResponse };
