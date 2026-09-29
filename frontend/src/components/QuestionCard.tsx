
type QuestionCardProps = {
  form: any;
  index: number;
};

export default function QuestionCard({
  form,
  index
}: QuestionCardProps) {
  return (
    <div style={{ border: "1px solid #ccc", padding: "16px", marginBottom: "16px" }}>
      {/* Header */}
      <h3>Question {index + 1}</h3>

      {/* Question Prompt */}
      <form.Field
        name={`questions[${index}].question`}
        children={(field: any) => (
          <div>
            <label htmlFor={field.name}>Question</label>

            <input
              id={field.name}
              name={field.name}
              type="text"
              value={field.state.value}
              placeholder="Enter question"
              onChange={(e) => field.handleChange(e.target.value)}
              style={{ width: "100%", padding: "6px" }}
            />

            {field.state.meta.errors.map((error: any, i: number) => (
              <div key={i} className="error">
                {typeof error === "string" ? error : error?.message}
              </div>
            ))}
          </div>
        )}
      />


      {/* Type */}
      <form.Field
        name={`questions[${index}].type`}
        children={(field: any) => (
          <div>
            <label htmlFor={field.name}>Type</label>

            <select
              id={field.name}
              name={field.name}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              style={{ width: "100%", padding: "6px" }}
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
          <div>
            <label htmlFor={field.name}>Selection Mode</label>

            <select
              id={field.name}
              name={field.name}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              style={{ width: "100%", padding: "6px" }}
            >
              <option value="SINGLE">Single</option>
              <option value="MULTIPLE" disabled> Multiple (v2 - Coming soon) </option>
            </select>
          </div>
        )}
      />

      {/* Required Checkbox */}
      <form.Field
        name={`questions[${index}].isRequired`}
        children={(field: any) => (
          <div style={{ marginBottom: "12px" }}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <input
                type="checkbox"
                checked={field.state.value}
                onChange={(e) => field.handleChange(e.target.checked)}
              />

              Required
            </label>
          </div>
        )}
      />

      {/* Options */}
      <div>
        <label>Options</label>

        {/* Option A */}
        <form.Field
          name={`questions[${index}].options[0]`}
          children={(field: any) => (
            <div style={{ marginTop: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span>A</span>

                <input
                  id={field.name}
                  name={field.name}
                  type="text"
                  value={field.state.value}
                  placeholder="Option A"
                  onChange={(e) => field.handleChange(e.target.value)}
                  style={{ flex: 1, padding: "6px" }}
                />
              </div>
              {field.state.meta.errors.map((error: any, i: number) => (
                <div key={i} className="error">
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
            <div style={{ marginTop: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span>B</span>

                <input
                  id={field.name}
                  name={field.name}
                  type="text"
                  value={field.state.value}
                  placeholder="Option B"
                  onChange={(e) => field.handleChange(e.target.value)}
                  style={{ flex: 1, padding: "6px" }}
                />
              </div>
              {field.state.meta.errors.map((error: any, i: number) => (
                <div key={i} className="error">
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
            <div style={{ marginTop: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span>C</span>

                <input
                  id={field.name}
                  name={field.name}
                  type="text"
                  value={field.state.value}
                  placeholder="Option C"
                  onChange={(e) => field.handleChange(e.target.value)}
                  style={{ flex: 1, padding: "6px" }}
                />
              </div>
              {field.state.meta.errors.map((error: any, i: number) => (
                <div key={i} className="error">
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
            <div style={{ marginTop: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span>D</span>

                <input
                  id={field.name}
                  name={field.name}
                  type="text"
                  value={field.state.value}
                  placeholder="Option D"
                  onChange={(e) => field.handleChange(e.target.value)}
                  style={{ flex: 1, padding: "6px" }}
                />
              </div>
              {field.state.meta.errors.map((error: any, i: number) => (
                <div key={i} className="error">
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