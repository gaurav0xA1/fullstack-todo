import React, { useState } from 'react';
import './TaskDescriptionPopup.css';
import AddTaskPopup from '../AddTaskPopup/AddTaskPopup';
import API_BASE_URL from '../../config/api';

function TaskDescriptionPopup({ task, onClose, onDelete, onEdit, user, onTaskUpdated }) {
  const [showEdit, setShowEdit] = useState(false);
  const [completed, setCompleted] = useState(task?.completed || false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEdit = () => {
    setShowEdit(true);
  };
  const handleEditClose = () => {
    setShowEdit(false);
  };
  const handleEditSuccess = (updatedTask) => {
    setShowEdit(false);
    if (onTaskUpdated) onTaskUpdated(updatedTask);
  };

  const handleToggleCompleted = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE_URL}/api/tasks/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !completed })
      });
      if (!res.ok) throw new Error('Failed to update task');
      setCompleted(!completed);
      if (onTaskUpdated) onTaskUpdated({ ...task, completed: !completed });
    } catch (err) {
      setError('Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="task-desc-popup-overlay" onClick={onClose}>
        <div className="task-desc-popup-content" onClick={e => e.stopPropagation()}>
          <h2 className="desc-title">{task?.title || 'No Title'}</h2>
          <div className="desc-date">{task?.date ? `Due: ${task.date}` : ''}</div>
          <div className="desc-description">{task?.description || 'No description provided.'}</div>
          <div style={{margin: '1rem 0'}}>
            <button
              className={completed ? 'toggle-btn completed' : 'toggle-btn incomplete'}
              onClick={handleToggleCompleted}
              disabled={loading}
            >
              {completed ? 'Completed' : 'Incomplete'}
            </button>
            {error && <div style={{color:'red', marginTop:'0.5rem'}}>{error}</div>}
          </div>
          <div className="desc-actions">
            <button className="edit-btn" onClick={handleEdit}>Edit</button>
            <button className="delete-btn" onClick={() => onDelete && onDelete(task)}>Delete</button>
          </div>
        </div>
      </div>
      {showEdit && (
        <AddTaskPopup
          onClose={handleEditClose}
          onAdd={handleEditSuccess}
          user={user}
          editTask={task}
        />
      )}
    </>
  );
}

export default TaskDescriptionPopup;
