import { useForm } from '@tanstack/react-form'
import { pollSchema } from '../schema/poll';
import type { POLL } from '../types/poll.types';
import CreatePollDetails from '../components/CreatePollDetails';
import { useState } from 'react';
import CreateQuestions from '../components/CreateQuestions';
import { createPoll } from '../services/poll.service';
import { useNavigate } from '@tanstack/react-router';


const defaultPollValues: POLL = {
    title: "",
    responseMode: "AUTHENTICATED",
    type: "POLL",
    expiresAt: "",
    questions: [],
};

export const defaultQuestion = {
    question: "",
    type: "MULTIPLE_CHOICE",
    selectionMode: "SINGLE",
    isRequired: false,
    options: ["", "", "", ""],
};


export default function CreatePoll() {

    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const navigate = useNavigate();

    const form = useForm({
        defaultValues: defaultPollValues,

        validators: {
            onSubmit: pollSchema,
        },

        onSubmitInvalid: ({ formApi }) => {
            const result = pollSchema.safeParse(formApi.state.values);
            if (!result.success) {
                const hasStep1Errors = result.error.issues.some((issue) =>
                    ["title", "responseMode", "type"].includes(String(issue.path[0]))
                );

                if (hasStep1Errors) {
                    setStep(1);
                    return;
                }
            }
            setStep(2);
        },

        onSubmit: async ({ value }) => {
            const finalExpiresAt =
                value.expiresAt && value.expiresAt.trim() !== ""
                    ? new Date(value.expiresAt).toISOString()
                    : undefined;

            const payload: POLL = {
                ...value,
                expiresAt: finalExpiresAt,
            };

            setIsLoading(true);
            setServerError(null);

            try {
                const response = await createPoll(payload);
                if (response?.success) {
                    navigate({ to: "/dashboard" });
                } else {
                    setServerError(response?.message || "Failed to create poll");
                }
            } catch (error: any) {
                console.error("Failed to create poll:", error);
                const message =
                    error?.response?.data?.message ||
                    error?.message ||
                    "Failed to create poll. Please try again.";
                setServerError(message);
            } finally {
                setIsLoading(false);
            }
        },
    });

    return (
        <div>
            {serverError && (
                <div
                    style={{
                        maxWidth: "680px",
                        margin: "16px auto 0 auto",
                        padding: "12px 16px",
                        backgroundColor: "#fef2f2",
                        border: "1px solid #f87171",
                        borderRadius: "8px",
                        color: "#991b1b",
                        fontSize: "14px",
                    }}
                >
                    {serverError}
                </div>
            )}

            {isLoading && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(255, 255, 255, 0.7)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 9999,
                        gap: "12px",
                        fontWeight: 600,
                        color: "#4f46e5",
                    }}
                >
                    <div
                        style={{
                            width: "40px",
                            height: "40px",
                            border: "4px solid #e0e7ff",
                            borderTopColor: "#4f46e5",
                            borderRadius: "50%",
                            animation: "spin 1s linear infinite",
                        }}
                    />
                    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                    <span>Creating your poll...</span>
                </div>
            )}

            {step === 1 && (
                <CreatePollDetails
                    form={form}
                    onNext={() => setStep(2)}
                />
            )}

            {step === 2 && (
                <CreateQuestions
                    form={form}
                    onBack={() => setStep(1)}
                />
            )}
        </div>
    );
}

