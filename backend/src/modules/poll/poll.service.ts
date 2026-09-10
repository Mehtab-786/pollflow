import prisma from "../../common/config/db.config.js";
import ApiError from "../../common/utils/APIError.utils.js";
import type { CreatePollInput } from "./poll.types.js";
import type {
    ResponseMode,
    PollType,
    QuestionType,
    SelectionMode,
} from "../../generated/prisma/enums.js";

const createPoll = async ({
    creatorId,
    title,
    responseMode = "ANONYMOUS",
    expiresAt,
    type = "POLL",
    questions,
}: CreatePollInput) => {
    try {
        // Begin Transaction
        const result = await prisma.$transaction(async (tx) => {
            // 1. Create Poll row
            const poll = await tx.poll.create({
                data: {
                    title,
                    creatorId,
                    responseMode: (responseMode === "AUTHENTICATED"
                        ? "AUTHENTICATED"
                        : "ANONYMOUS") as ResponseMode,
                    expiresAt: expiresAt ? new Date(expiresAt) : null,
                    isPublished: false,
                    type: (type === "QUIZ" ? "QUIZ" : "POLL") as PollType,
                },
            });

            const createdQuestions = [];

            // 2. Create all question rows with position = index + 1
            for (let i = 0; i < questions.length; i++) {
                const q = questions[i]!;
                const questionText = q.text || q.question;

                if (!questionText || !questionText.trim()) {
                    throw new ApiError(
                        400,
                        `Question at position ${i + 1} must have a prompt text`
                    );
                }

                const questionType: QuestionType =
                    q.type?.toUpperCase() === "TEXT"
                        ? "TEXT"
                        : "MULTIPLE_CHOICE";

                const selectionMode: SelectionMode =
                    q.selectionMode?.toUpperCase() === "MULTIPLE"
                        ? "MULTIPLE"
                        : "SINGLE";

                const questionRecord = await tx.question.create({
                    data: {
                        question: questionText.trim(),
                        position: i + 1,
                        pollId: poll.id,
                        isRequired: q.isRequired ?? true,
                        type: questionType,
                        selectionMode: selectionMode,
                    },
                });

                // 3. Create options for the question if multiple choice
                let createdOptions: { id: string; text: string }[] = [];

                if (questionType === "MULTIPLE_CHOICE") {
                    if (!q.options || !Array.isArray(q.options) || q.options.length < 2) {
                        throw new ApiError(
                            400,
                            `Question "${questionText}" must contain at least 2 options`
                        );
                    }

                    const optionsToCreate = q.options.map((opt) => {
                        const optText = typeof opt === "string" ? opt : opt.text;
                        if (!optText || !optText.trim()) {
                            throw new ApiError(400, "Option text cannot be empty");
                        }
                        return {
                            text: optText.trim(),
                            questionId: questionRecord.id,
                        };
                    });

                    await tx.option.createMany({
                        data: optionsToCreate,
                    });

                    createdOptions = await tx.option.findMany({
                        where: { questionId: questionRecord.id },
                        select: { id: true, text: true },
                    });
                }

                createdQuestions.push({
                    id: questionRecord.id,
                    text: questionRecord.question,
                    position: questionRecord.position,
                    isRequired: questionRecord.isRequired,
                    type: questionRecord.type,
                    selectionMode: questionRecord.selectionMode,
                    options: createdOptions,
                });
            }

            // Transaction commits automatically on successful return
            return {
                id: poll.id,
                title: poll.title,
                responseMode: poll.responseMode,
                expiresAt: poll.expiresAt,
                isPublished: poll.isPublished,
                type: poll.type,
                questions: createdQuestions,
            };
        });

        return result;
    } catch (error) {
        // If anything fails, Prisma rolls back the transaction automatically
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(
            500,
            error instanceof Error ? error.message : "Failed to create poll"
        );
    } finally {
        // Any final cleanup or telemetry logic
    }
};

const getPublishedPolls = async () => {
    try {
        // Query published polls for list/card view (lightweight summary)
        const polls = await prisma.poll.findMany({
            where: {
                isPublished: true,
            },
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                title: true,
                type: true,
                createdAt: true,
                expiresAt: true,
                creator: {
                    select: {
                        id: true,
                        username: true,
                    },
                },
                _count: {
                    select: {
                        questions: true,
                        responses: true,
                    },
                },
            },
        });

        return polls;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(
            500,
            error instanceof Error ? error.message : "Failed to fetch published polls"
        );
    }
};

const getMyPolls = async (userId: string) => {
    try {
        const polls = await prisma.poll.findMany({
            where: {
                creatorId: userId,
            },
            orderBy: {
                createdAt: "desc",
            },
            select: {
                id: true,
                title: true,
                type: true,
                expiresAt: true,
                isPublished: true,
                createdAt: true,
            },
        });

        return polls;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(
            500,
            error instanceof Error ? error.message : "Failed to fetch user polls"
        );
    }
};

const getPollById = async (pollId: string, userId?: string | null) => {
    try {
        if (!pollId) {
            throw new ApiError(400, "Poll ID is required");
        }

        const poll = await prisma.poll.findUnique({
            where: { id: pollId },
            include: {
                creator: {
                    select: {
                        id: true,
                        username: true,
                    },
                },
                questions: {
                    orderBy: { position: "asc" },
                    include: {
                        options: {
                            select: {
                                id: true,
                                text: true,
                                _count: {
                                    select: { answers: true },
                                },
                            },
                        },
                    },
                },
                _count: {
                    select: { responses: true },
                },
            },
        });

        if (!poll) {
            throw new ApiError(404, "Poll not found");
        }

        const isExpired = Boolean(poll.expiresAt && new Date() > new Date(poll.expiresAt));
        const isCreator = Boolean(userId && poll.creatorId === userId);

        // 1. If user is the creator: no more checking, return full details
        if (isCreator) {
            return {
                id: poll.id,
                title: poll.title,
                type: poll.type,
                responseMode: poll.responseMode,
                expiresAt: poll.expiresAt,
                isPublished: poll.isPublished,
                isExpired,
                isCreator: true,
                createdAt: poll.createdAt,
                creator: poll.creator,
                totalResponses: poll._count.responses,
                questions: poll.questions.map((q) => ({
                    id: q.id,
                    question: q.question,
                    position: q.position,
                    isRequired: q.isRequired,
                    type: q.type,
                    selectionMode: q.selectionMode,
                    options: q.options.map((opt) => ({
                        id: opt.id,
                        text: opt.text,
                        votesCount: opt._count.answers,
                    })),
                })),
            };
        }

        // 2. If expired and not published & user is not creator -> Reject / Not available
        if (isExpired && !poll.isPublished) {
            throw new ApiError(400, "Poll is not available");
        }

        // 3. If expired and published -> return results only (userId doesn't matter)
        if (isExpired && poll.isPublished) {
            return {
                id: poll.id,
                title: poll.title,
                type: poll.type,
                responseMode: poll.responseMode,
                expiresAt: poll.expiresAt,
                isPublished: true,
                isExpired: true,
                isCreator: false,
                createdAt: poll.createdAt,
                creator: poll.creator,
                totalResponses: poll._count.responses,
                questions: poll.questions.map((q) => ({
                    id: q.id,
                    question: q.question,
                    position: q.position,
                    isRequired: q.isRequired,
                    type: q.type,
                    selectionMode: q.selectionMode,
                    options: q.options.map((opt) => ({
                        id: opt.id,
                        text: opt.text,
                        votesCount: opt._count.answers,
                    })),
                })),
            };
        }

        // 4. If not expired (published or unpublished direct-link) & not creator -> return questions & options only
        return {
            id: poll.id,
            title: poll.title,
            type: poll.type,
            responseMode: poll.responseMode,
            expiresAt: poll.expiresAt,
            isPublished: poll.isPublished,
            isExpired: false,
            isCreator: false,
            createdAt: poll.createdAt,
            creator: poll.creator,
            questions: poll.questions.map((q) => ({
                id: q.id,
                question: q.question,
                position: q.position,
                isRequired: q.isRequired,
                type: q.type,
                selectionMode: q.selectionMode,
                options: q.options.map((opt) => ({
                    id: opt.id,
                    text: opt.text,
                })),
            })),
        };
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(
            500,
            error instanceof Error ? error.message : "Failed to fetch poll"
        );
    }
};

const publishPoll = async ({
    pollId,
    userId,
}: {
    pollId: string;
    userId: string;
}) => {
    try {
        if (!pollId) {
            throw new ApiError(400, "Poll ID is required");
        }

        if (!userId) {
            throw new ApiError(401, "User ID is required");
        }

        // 1. Verify user exists
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true },
        });

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        // 2. Verify poll exists
        const poll = await prisma.poll.findUnique({
            where: { id: pollId },
        });

        if (!poll) {
            throw new ApiError(404, "Poll not found");
        }

        // 3. Verify user is the creator
        if (poll.creatorId !== userId) {
            throw new ApiError(403, "You are not authorized to publish this poll");
        }

        // 4. Verify poll is expired
        const isExpired = Boolean(poll.expiresAt && new Date() > new Date(poll.expiresAt));
        if (!isExpired) {
            throw new ApiError(400, "Cannot publish poll before it has expired");
        }

        // 5. Check if already published
        if (poll.isPublished) {
            throw new ApiError(400, "Poll is already published");
        }

        // 6. Update isPublished to true
        const updatedPoll = await prisma.poll.update({
            where: { id: pollId },
            data: { isPublished: true },
            select: {
                id: true,
            },
        });

        return updatedPoll;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(
            500,
            error instanceof Error ? error.message : "Failed to publish poll"
        );
    }
};

export { createPoll, getPublishedPolls, getMyPolls, getPollById, publishPoll };

