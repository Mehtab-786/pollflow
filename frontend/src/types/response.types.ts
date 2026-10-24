export interface SubmitAnswerInput {
    questionId: string;
    optionId?: string | null;
}

export interface SubmitPollResponsePayload {
    pollId: string;
    userId?: string | null;
    answers: SubmitAnswerInput[];
}
