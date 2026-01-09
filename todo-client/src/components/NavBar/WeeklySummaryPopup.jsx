import React, { useEffect, useState } from 'react';
import './WeeklySummaryPopup.css';
import API_BASE_URL from '../../config/api';

export default function WeeklySummaryPopup({ userId, onClose }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    fetch(`${API_BASE_URL}/api/weekly-summary/${userId}`)
      .then(res => res.json())
      .then(data => {
        setSummary(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch summary');
        setLoading(false);
      });
  }, [userId]);

  return (
    <div className="weekly-summary-popup-overlay" onClick={onClose}>
      <div className="weekly-summary-popup" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>Weekly Task Summary</h2>
        {loading && <div>Loading...</div>}
        {error && <div className="error">{error}</div>}
        {summary && !error && (
          <div>
            <div>Total tasks: {summary.total}</div>
            <div>Completed: {summary.completed}</div>
            <div>Pending: {summary.pending}</div>
            <h4>By Day:</h4>
            <ul>
              {Object.entries(summary.byDay).map(([date, stats]) => (
                <li key={date}>
                  <b>{date}:</b> {stats.total} total, {stats.completed} completed, {stats.pending} pending
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
