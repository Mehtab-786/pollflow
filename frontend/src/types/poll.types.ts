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

export type CreatePollDetailsProps = {
    form: any;
    onNext: () => void;
};

export type CreateQuestionsProps = {
    form: any;
    onBack: () => void;
};


export interface PollItem {
    id: string
    title: string
    type: string
    isPublished: boolean
    createdAt: string
    expiresAt?: string | null
}

export interface PollCardProps {
    poll: PollItem
}

export interface PublishedPollCardProps {
    poll: PublishedPoll
}

export type QuestionCardProps = {
    form: any;
    index: number;
};


export interface AnalyticsOption {
    id: string
    text: string
    votes: number
    votesCount: number
    percentage: number
}

export interface AnalyticsQuestion {
    id: string
    question: string
    position: number
    isRequired: boolean
    type: string
    selectionMode: string
    totalVotes: number
    totalAnswers?: number
    options: AnalyticsOption[]
}

export interface AnalyticsData {
    id: string
    title: string
    type: string
    responseMode: string
    expiresAt: string | null
    isPublished: boolean
    createdAt: string
    creator: {
        id: string
        username: string
    }
    totalResponses: number
    questions: AnalyticsQuestion[]
}


export interface OptionData {
    id: string
    text: string
    votesCount?: number
}

export interface QuestionData {
    id: string
    question: string
    position: number
    isRequired: boolean
    type: string
    selectionMode: string
    options: OptionData[]
}

export interface PollData {
    id: string
    title: string
    type: string
    responseMode: string
    expiresAt: string | null
    isPublished: boolean
    isExpired: boolean
    isCreator: boolean
    createdAt: string
    creator: {
        id: string
        username: string
        email: string
    }
    totalResponses?: number
    questions: QuestionData[]
}
