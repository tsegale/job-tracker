// src/components/FilterBar.jsx
import { STATUSES } from '../api/jobs';

export default function FilterBar({ filters, onChange }) {
  const set = (k, v) => onChange({ ...filters, [k]: v });

  return (
    <div className="filter-bar">
      <div className="search-wrap">
        <span className="search-icon">⌕</span>
        <input
          className="search-input"
          type="text"
          placeholder="Search company, role, location…"
          value={filters.search || ''}
          onChange={e => set('search', e.target.value)}
        />
        {filters.search && (
          <button className="search-clear" onClick={() => set('search', '')}>✕</button>
        )}
      </div>

      <div className="status-filters">
        <button
          className={`filter-chip ${!filters.status ? 'active' : ''}`}
          onClick={() => set('status', '')}
        >
          All
        </button>
        {STATUSES.map(s => (
          <button
            key={s.value}
            className={`filter-chip ${filters.status === s.value ? 'active' : ''}`}
            style={{ '--c': s.color }}
            onClick={() => set('status', filters.status === s.value ? '' : s.value)}
          >
            <span className="chip-dot" style={{ background: s.color }} />
            {s.label}
          </button>
        ))}
      </div>

      <div className="sort-wrap">
        <label>Sort by</label>
        <select
          value={filters.ordering || '-created_at'}
          onChange={e => set('ordering', e.target.value)}
        >
          <option value="-created_at">Newest first</option>
          <option value="created_at">Oldest first</option>
          <option value="company">Company A–Z</option>
          <option value="-company">Company Z–A</option>
          <option value="-date_applied">Date Applied ↓</option>
        </select>
      </div>
    </div>
  );
}
