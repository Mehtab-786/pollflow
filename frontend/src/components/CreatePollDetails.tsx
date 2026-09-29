import "../styles/createPoll.styles.css";

type CreatePollDetailsProps = {
    form: any;
    onNext: () => void;
};

export default function CreatePollDetails({
    form,
    onNext,
}: CreatePollDetailsProps) {

    const handleNext = async () => {
        const title = form.getFieldValue("title");

        if (!title || title.trim().length < 3) {
            form.setFieldMeta("title", (meta: any) => ({
                ...meta,
                isTouched: true,
                errors: ["Title must be at least 3 characters"],
            }));
            return;
        }

        form.setFieldMeta("title", (meta: any) => ({
            ...meta,
            errors: [],
        }));
        onNext();
    };

    return (
        <div className="create-poll-container">
            <div className="create-poll-header">
                <span className="create-poll-step">Step 1 of 2</span>
                <h2 className="create-poll-title">Poll Details</h2>
                <p className="create-poll-subtitle">Configure basic details and access settings for your poll.</p>
            </div>

            <form className="create-poll-form" onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }}>
                {/* Title */}
                <form.Field
                    name="title"
                    validators={{
                        onChange: ({ value }: any) =>
                            !value || value.trim().length < 3
                                ? "Title must be at least 3 characters"
                                : undefined,
                    }}
                    children={(field: any) => (
                        <div className="create-poll-field">
                            <label className="create-poll-label" htmlFor={field.name}>Title</label>

                            <input
                                className="create-poll-input"
                                id={field.name}
                                name={field.name}
                                type="text"
                                placeholder="Enter poll title..."
                                value={field.state.value}
                                onChange={(e) => field.handleChange(e.target.value)}
                            />
                            {
                                field.state.meta.errors.map((error: any, i: number) => (
                                    <div key={i} className="error">
                                        {typeof error === "string" ? error : error?.message}
                                    </div>
                                ))
                            }
                        </div>
                    )}
                />

                <div className="create-poll-grid">
                    {/* Response Mode */}
                    <form.Field
                        name="responseMode"
                        children={(field: any) => (
                            <div className="create-poll-field">
                                <label className="create-poll-label" htmlFor={field.name}>Response Mode</label>

                                <select
                                    className="create-poll-select"
                                    id={field.name}
                                    name={field.name}
                                    value={field.state.value}
                                    onChange={(e) =>
                                        field.handleChange(
                                            e.target.value as "ANONYMOUS" | "AUTHENTICATED"
                                        )
                                    }
                                >
                                    <option value="AUTHENTICATED">Authenticated</option>
                                    <option value="ANONYMOUS">Anonymous</option>
                                </select>
                            </div>
                        )}
                    />

                    {/* Type */}
                    <form.Field
                        name="type"
                        children={(field: any) => (
                            <div className="create-poll-field">
                                <label className="create-poll-label" htmlFor={field.name}>Type</label>

                                <select
                                    className="create-poll-select"
                                    id={field.name}
                                    name={field.name}
                                    value={field.state.value}
                                    onChange={(e) =>
                                        field.handleChange(e.target.value as "POLL" | "QUIZ")
                                    }
                                >
                                    <option value="POLL">Poll</option>
                                    <option disabled value="QUIZ">Quiz</option>
                                </select>
                            </div>
                        )}
                    />
                </div>

                {/* Expires At */}
                <form.Field
                    name="expiresAt"
                    children={(field: any) => (
                        <div className="create-poll-field">
                            <label className="create-poll-label" htmlFor={field.name}>Expires At</label>

                            <input
                                className="create-poll-input"
                                id={field.name}
                                name={field.name}
                                type="datetime-local"
                                value={field.state.value}
                                onChange={(e) => field.handleChange(e.target.value)}
                            />
                            {field.state.meta.errors.map((error: any, i: number) => (
                                <div key={i} className="error">
                                    {typeof error === "string" ? error : error?.message}
                                </div>
                            ))}
                        </div>
                    )}
                />

                {/* Navigation */}
                <div className="create-poll-actions create-poll-actions--end">
                    <button type="button" className="btn-primary" onClick={handleNext}>
                        Next
                    </button>
                </div>
            </form>
        </div>
    );
}