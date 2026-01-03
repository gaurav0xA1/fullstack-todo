import './WeeklyOverview.css';

function WeeklyOverview() {
  return (
    <div className="weekly-overview">
      <h3>Weekly Overview</h3>
      <div className="overview-stats">
        <div className="stat-item">
          <div className="circular-progress">
            <div className="progress-ring"></div>
            <svg width="80" height="80" style={{ position: 'absolute', transform: 'rotate(-90deg)' }}>
              <circle
                cx="40"
                cy="40"
                r="34"
                fill="none"
                stroke="#ff8c42"
                strokeWidth="6"
                strokeDasharray="213.6"
                strokeDashoffset="213.6"
                strokeLinecap="round"
              />
            </svg>
            <span className="progress-value">0</span>
          </div>
          <span className="stat-label">Tasks<br/>Completed</span>
        </div>

        <div className="stat-item">
          <div className="circular-progress">
            <div className="progress-ring"></div>
            <svg width="80" height="80" style={{ position: 'absolute', transform: 'rotate(-90deg)' }}>
              <circle
                cx="40"
                cy="40"
                r="34"
                fill="none"
                stroke="#ff8c42"
                strokeWidth="6"
                strokeDasharray="213.6"
                strokeDashoffset="213.6"
                strokeLinecap="round"
              />
            </svg>
            <span className="progress-value">0</span>
          </div>
          <span className="stat-label">Streak</span>
        </div>

        <div className="stat-item">
          <div className="circular-progress">
            <div className="progress-ring"></div>
            <svg width="80" height="80" style={{ position: 'absolute', transform: 'rotate(-90deg)' }}>
              <circle
                cx="40"
                cy="40"
                r="34"
                fill="none"
                stroke="#ff8c42"
                strokeWidth="6"
                strokeDasharray="213.6"
                strokeDashoffset="213.6"
                strokeLinecap="round"
              />
            </svg>
            <span className="progress-value">0</span>
          </div>
          <span className="stat-label">Workouts</span>
        </div>
      </div>
    </div>
  );
}

export default WeeklyOverview;
