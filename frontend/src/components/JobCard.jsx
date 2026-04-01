// src/components/JobCard.jsx
import { useState } from 'react';
import { STATUSES, STATUS_MAP } from '../api/jobs';

export default function JobCard({ job, onEdit, onDelete, onStatusChange }) {
  const [changing, setChanging] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const statusInfo = STATUS_MAP[job.status] || {};

  const handleStatusChange = async (newStatus) => {
    setChanging(true);
    try { await onStatusChange(job.id, newStatus); }
    finally { setChanging(false); }
  };

  const fmt = (date) => date ? new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : null;
  const salary = job.salary_min || job.salary_max
    ? `$${(job.salary_min || 0).toLocaleString()}${job.salary_max ? ` – $${job.salary_max.toLocaleString()}` : '+'}`
    : null;

  return (
    <div className="job-card" style={{ '--accent': statusInfo.color }}>
      <div className="card-stripe" />
      <div className="card-header">
        <div className="card-titles">
          <h3 className="card-role">{job.role}</h3>
          <p className="card-company">{job.company}</p>
        </div>
        <div className="card-controls">
          <select
            className="status-select"
            value={job.status}
            disabled={changing}
            onChange={e => handleStatusChange(e.target.value)}
            style={{ '--c': statusInfo.color }}
          >
            {STATUSES.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          <div className="card-menu">
            <button
              className="menu-btn"
              onClick={() => setMenuOpen(o => !o)}
              onBlur={() => setTimeout(() => setMenuOpen(false), 150)}
            >⋯</button>
            {menuOpen && (
              <div className="menu-dropdown">
                <button onClick={() => { setMenuOpen(false); onEdit(job); }}>✏️ Edit</button>
                <button className="danger" onClick={() => { setMenuOpen(false); onDelete(job.id); }}>🗑 Delete</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card-meta">
        {job.location && <span className="meta-tag">📍 {job.location}</span>}
        {salary        && <span className="meta-tag">💰 {salary}</span>}
        {job.date_applied && <span className="meta-tag">📅 {fmt(job.date_applied)}</span>}
        {job.job_url   && (
          <a className="meta-tag link" href={job.job_url} target="_blank" rel="noreferrer">
            🔗 View Job
          </a>
        )}
      </div>

      {job.notes && <p className="card-notes">{job.notes}</p>}

      <div className="card-footer">
        <span className="card-date">Added {fmt(job.created_at)}</span>
      </div>
    </div>
  );
}
