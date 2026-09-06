export interface QuestionOptionInput {
    text: string;
}

export interface QuestionInput {
    text?: string;
    question?: string;
    options?: (string | QuestionOptionInput)[];
    isRequired?: boolean;
    type?: "TEXT" | "MULTIPLE_CHOICE" | "text" | "multiple_choice";
    selectionMode?: "SINGLE" | "MULTIPLE" | "single" | "multiple";
}

export interface CreatePollInput {
    creatorId: string;
    title: string;
    responseMode?: "AUTHENTICATED" | "ANONYMOUS";
    expiresAt?: Date | string | null;
    type?: "POLL" | "QUIZ";
    questions: QuestionInput[];
}
