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
    expiresAt: string;
    questions: QUESTIONS[];
}

