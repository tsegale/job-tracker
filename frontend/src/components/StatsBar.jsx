// src/components/StatsBar.jsx
import { STATUSES } from '../api/jobs';

export default function StatsBar({ stats }) {
  if (!stats) return null;
  const total = stats.total || 0;

  return (
    <div className="stats-bar">
      <div className="stat-total">
        <span className="stat-number">{total}</span>
        <span className="stat-label">Total Applications</span>
      </div>
      <div className="stat-divider" />
      <div className="stats-grid">
        {STATUSES.map(s => {
          const count = stats.by_status?.[s.value] || 0;
          const pct = total > 0 ? Math.round((count / total) * 100) : 0;
          return (
            <div key={s.value} className="stat-item">
              <div className="stat-pill" style={{ background: s.color + '22', borderColor: s.color + '55' }}>
                <span className="stat-dot" style={{ background: s.color }} />
                <span className="stat-count" style={{ color: s.color }}>{count}</span>
              </div>
              <span className="stat-name">{s.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
