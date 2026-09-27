import * as z from "zod";

const textQuestionSchema = z.object({
    question: z.string().min(3).max(255).trim(),
    type: z.literal("TEXT"),
    isRequired: z.boolean(),
});

const choiceQuestionSchema = z.object({
    question: z.string().min(3).max(255).trim(),
    type: z.literal("MULTIPLE_CHOICE"),
    isRequired: z.boolean(),
    selectionMode: z.enum(["SINGLE", "MULTIPLE"]),
    options: z
        .array(
            z.string().trim().min(1, "Option cannot be empty")
        )
        .length(4, "Exactly 4 options are required"),
});

const questionSchema = z.discriminatedUnion("type", [
    textQuestionSchema,
    choiceQuestionSchema,
]);


export const pollSchema = z.object({
    title: z.string().min(3).max(255).trim(),
    responseMode: z.enum(["ANONYMOUS", "AUTHENTICATED"]),
    type: z.enum(["POLL", "QUIZ"]),
    expiresAt: z.string(),
    questions: z.array(questionSchema).min(1),
});

