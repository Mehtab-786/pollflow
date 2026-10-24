import '../styles/questionCard.styles.css';

type QuestionCardProps = {
  form: any;
  index: number;
};

export default function QuestionCard({
  form,
  index
}: QuestionCardProps) {
  return (
    <div className="question-card">
      {/* Header */}
      <div className="question-card-header">
        <h3 className="question-card-title">
          <span>Question</span>
          <span className="question-badge">#{index + 1}</span>
        </h3>
      </div>

      {/* Question Prompt */}
      <form.Field
        name={`questions[${index}].question`}
        children={(field: any) => (
          <div className="question-field-group">
            <label className="question-label" htmlFor={field.name}>Question</label>

            <input
              id={field.name}
              name={field.name}
              type="text"
              value={field.state.value}
              placeholder="Enter question"
              onChange={(e) => field.handleChange(e.target.value)}
              className={`question-input ${field.state.meta.errors?.length ? 'has-error' : ''}`}
            />

            {field.state.meta.errors.map((error: any, i: number) => (
              <div key={i} className="error question-error">
                {typeof error === "string" ? error : error?.message}
              </div>
            ))}
          </div>
        )}
      />

      <div className="question-field-grid">
        {/* Type */}
        <form.Field
          name={`questions[${index}].type`}
          children={(field: any) => (
            <div className="question-field-group">
              <label className="question-label" htmlFor={field.name}>Type</label>

              <select
                id={field.name}
                name={field.name}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                className="question-select"
              >
                <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                <option value="TEXT" disabled>Text (v2 - Coming soon)</option>
              </select>
            </div>
          )}
        />

        {/* Selection Mode */}
        <form.Field
          name={`questions[${index}].selectionMode`}
          children={(field: any) => (
            <div className="question-field-group">
              <label className="question-label" htmlFor={field.name}>Selection Mode</label>

              <select
                id={field.name}
                name={field.name}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                className="question-select"
              >
                <option value="SINGLE">Single</option>
                <option value="MULTIPLE" disabled> Multiple (v2 - Coming soon) </option>
              </select>
            </div>
          )}
        />
      </div>

      {/* Required Checkbox */}
      <form.Field
        name={`questions[${index}].isRequired`}
        children={(field: any) => (
          <div className="question-checkbox-group">
            <label className="question-checkbox-label">
              <input
                type="checkbox"
                checked={field.state.value}
                onChange={(e) => field.handleChange(e.target.checked)}
                className="question-checkbox"
              />
              Required
            </label>
          </div>
        )}
      />

      {/* Options */}
      <div className="question-options-section">
        <label className="question-options-label">Options</label>

        {/* Option A */}
        <form.Field
          name={`questions[${index}].options[0]`}
          children={(field: any) => (
            <div className="question-option-item">
              <div className="question-option-row">
                <span className="question-option-badge">A</span>

                <input
                  id={field.name}
                  name={field.name}
                  type="text"
                  value={field.state.value}
                  placeholder="Option A"
                  onChange={(e) => field.handleChange(e.target.value)}
                  className={`question-input question-option-input ${field.state.meta.errors?.length ? 'has-error' : ''}`}
                />
              </div>
              {field.state.meta.errors.map((error: any, i: number) => (
                <div key={i} className="error question-error">
                  {typeof error === "string" ? error : error?.message}
                </div>
              ))}
            </div>
          )}
        />

        {/* Option B */}
        <form.Field
          name={`questions[${index}].options[1]`}
          children={(field: any) => (
            <div className="question-option-item">
              <div className="question-option-row">
                <span className="question-option-badge">B</span>

                <input
                  id={field.name}
                  name={field.name}
                  type="text"
                  value={field.state.value}
                  placeholder="Option B"
                  onChange={(e) => field.handleChange(e.target.value)}
                  className={`question-input question-option-input ${field.state.meta.errors?.length ? 'has-error' : ''}`}
                />
              </div>
              {field.state.meta.errors.map((error: any, i: number) => (
                <div key={i} className="error question-error">
                  {typeof error === "string" ? error : error?.message}
                </div>
              ))}
            </div>
          )}
        />

        {/* Option C */}
        <form.Field
          name={`questions[${index}].options[2]`}
          children={(field: any) => (
            <div className="question-option-item">
              <div className="question-option-row">
                <span className="question-option-badge">C</span>

                <input
                  id={field.name}
                  name={field.name}
                  type="text"
                  value={field.state.value}
                  placeholder="Option C"
                  onChange={(e) => field.handleChange(e.target.value)}
                  className={`question-input question-option-input ${field.state.meta.errors?.length ? 'has-error' : ''}`}
                />
              </div>
              {field.state.meta.errors.map((error: any, i: number) => (
                <div key={i} className="error question-error">
                  {typeof error === "string" ? error : error?.message}
                </div>
              ))}
            </div>
          )}
        />

        {/* Option D */}
        <form.Field
          name={`questions[${index}].options[3]`}
          children={(field: any) => (
            <div className="question-option-item">
              <div className="question-option-row">
                <span className="question-option-badge">D</span>

                <input
                  id={field.name}
                  name={field.name}
                  type="text"
                  value={field.state.value}
                  placeholder="Option D"
                  onChange={(e) => field.handleChange(e.target.value)}
                  className={`question-input question-option-input ${field.state.meta.errors?.length ? 'has-error' : ''}`}
                />
              </div>
              {field.state.meta.errors.map((error: any, i: number) => (
                <div key={i} className="error question-error">
                  {typeof error === "string" ? error : error?.message}
                </div>
              ))}
            </div>
          )}
        />

      </div>
    </div>
  );
}