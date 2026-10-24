interface TextQuestion {
    question: string;
    type: "TEXT";
    isRequired: boolean;
}

interface ChoiceQuestion {
    question: string;
    type: "MULTIPLE_CHOICE";
    selectionMode: "SINGLE" | "MULTIPLE";
    isRequired: boolean;
    options: string[];
}

type QUESTIONS = TextQuestion | ChoiceQuestion;

export interface POLL {
    title: string;
    responseMode: "ANONYMOUS" | "AUTHENTICATED";
    type: "POLL" | "QUIZ";
    expiresAt?: string;
    questions: QUESTIONS[];
}

export interface PublishedPoll {
    id: string;
    title: string;
    type: string;
    createdAt: string;
    expiresAt: string | null;
    creator?: {
        id: string;
        username: string;
    } | null;
    _count?: {
        questions: number;
        responses: number;
    };
}

