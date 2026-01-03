import React, { useState } from 'react';
import './TaskDescriptionPopup.css';
import AddTaskPopup from '../AddTaskPopup/AddTaskPopup';

function TaskDescriptionPopup({ task, onClose, onDelete, onEdit, user, onTaskUpdated }) {
  const [showEdit, setShowEdit] = useState(false);

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

  return (
    <>
      <div className="task-desc-popup-overlay" onClick={onClose}>
        <div className="task-desc-popup-content" onClick={e => e.stopPropagation()}>
          <button className="close-btn" onClick={onClose}>×</button>
          <h2 className="desc-title">{task?.title || 'No Title'}</h2>
          <div className="desc-date">{task?.date ? `Due: ${task.date}` : ''}</div>
          <div className="desc-description">{task?.description || 'No description provided.'}</div>
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
