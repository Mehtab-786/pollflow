export interface SubmitAnswerInput {
    questionId: string;
    optionId?: string | null;
}

export interface SubmitPollResponseParams {
    pollId: string;
    userId?: string | null;
    answers: SubmitAnswerInput[];
}
