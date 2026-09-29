import { defaultQuestion } from "../pages/CreatePoll";
import QuestionCard from "./QuestionCard";
import "../styles/createPoll.styles.css";

type CreateQuestionsProps = {
    form: any;
    onBack: () => void;
};

export default function CreateQuestions({
    form,
    onBack,
}: CreateQuestionsProps) {

    const handleAddQuestion = () => {
        form.setFieldValue("questions", (prev: any) => [
            ...prev,
            defaultQuestion
        ])
    };

    return (
        <div className="create-poll-container">
            <div className="create-poll-header">
                <span className="create-poll-step">Step 2 of 2</span>
                <h2 className="create-poll-title">Create Questions</h2>
                <p className="create-poll-subtitle">Add and configure questions for your poll or quiz.</p>
            </div>

            <form
                className="create-poll-form"
                onSubmit={(e) => {
                    e.preventDefault();
                    form.handleSubmit();
                }}
            >

                <div className="questions-list">
                    <form.Field
                        name="questions"
                        children={(field: any) => (
                            <>
                                {field.state.meta.errors.map((error: any, i: number) => (
                                    <div key={i} className="error" style={{ marginBottom: "12px" }}>
                                        {typeof error === "string" ? error : error?.message}
                                    </div>
                                ))}
                                {field.state.value.map((_: any, index: number) => (
                                    <QuestionCard
                                        key={index}
                                        form={form}
                                        index={index}
                                    />
                                ))}
                            </>
                        )}
                    />
                </div>

                {/* Add another question */}
                <button type="button" className="btn-add-question" onClick={handleAddQuestion}>
                    + Add Question
                </button>

                {/* Navigation */}
                <div className="create-poll-actions">
                    <button type="button" className="btn-secondary" onClick={onBack}>
                        Back
                    </button>

                    <button type="submit" className="btn-primary">
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
}
