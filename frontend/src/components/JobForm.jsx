// src/components/JobForm.jsx
import { useState, useEffect } from "react";
import { STATUSES } from "../api/jobs";

const EMPTY = {
  company: "",
  role: "",
  status: "applied",
  location: "",
  job_url: "",
  salary_min: "",
  salary_max: "",
  notes: "",
  date_applied: "",
  date_interview: "",
};

export default function JobForm({ initial, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState({ ...EMPTY, ...initial });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm({ ...EMPTY, ...initial });
  }, [initial]);

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.company.trim()) e.company = "Required";
    if (!form.role.trim()) e.role = "Required";
    if (
      form.salary_min &&
      form.salary_max &&
      +form.salary_min > +form.salary_max
    )
      e.salary_max = "Must be ≥ min salary";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const payload = { ...form };
    if (!payload.salary_min) delete payload.salary_min;
    if (!payload.salary_max) delete payload.salary_max;
    if (!payload.date_applied) delete payload.date_applied;
    if (!payload.date_interview) delete payload.date_interview;
    onSubmit(payload);
  };

  const field = (label, key, type = "text", props = {}) => (
    <div className="field">
      <label>{label}</label>
      <input
        type={type}
        value={form[key]}
        onChange={(e) => set(key, e.target.value)}
        className={errors[key] ? "err" : ""}
        {...props}
      />
      {errors[key] && <span className="field-err">{errors[key]}</span>}
    </div>
  );

  return (
    <form className="job-form" onSubmit={handleSubmit}>
      <div className="form-row">
        {field("Company *", "company", "text", {
          placeholder: "e.g. Acme Corp",
        })}
        {field("Role *", "role", "text", {
          placeholder: "e.g. Senior Engineer",
        })}
      </div>
      <div className="form-row">
        <div className="field">
          <label>Status</label>
          <select
            value={form.status}
            onChange={(e) => set("status", e.target.value)}
          >
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        {field("Location", "location", "text", {
          placeholder: "Remote / City, Country",
        })}
      </div>
      {field("Job URL", "job_url", "url", { placeholder: "https://..." })}
      <div className="form-row">
        {field("Min Salary", "salary_min", "number", {
          placeholder: "50000",
          min: 0,
        })}
        {field("Max Salary", "salary_max", "number", {
          placeholder: "80000",
          min: 0,
        })}
      </div>
      <div className="form-row">
        {field("Date Applied", "date_applied", "date")}
        {field("Interview Date", "date_interview", "date")}
      </div>
      <div className="field">
        <label>Notes</label>
        <textarea
          value={form.notes}
          onChange={(e) => set("notes", e.target.value)}
          rows={3}
          placeholder="Recruiter name, interview notes, etc."
        />
      </div>
      <div className="form-actions">
        <button type="button" className="btn-ghost" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading
            ? "Saving…"
            : initial
              ? "Update Application"
              : "Add Application"}
        </button>
      </div>
    </form>
  );
}
