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

export { createPoll };
