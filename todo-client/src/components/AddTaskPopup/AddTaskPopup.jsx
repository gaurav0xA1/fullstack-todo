import { useState, useRef } from 'react';
import './AddTaskPopup.css';


function AddTaskPopup({ onClose, onAdd, user, editTask }) {
  // If editTask is provided, prefill fields
  const [taskName, setTaskName] = useState(editTask?.title || '');
  const [taskDescription, setTaskDescription] = useState(editTask?.description || '');
  const [taskDate, setTaskDate] = useState(editTask?.date || '');
  const dateInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.uid) {
      alert('User not logged in. Please log in and try again.');
      return;
    }

    try {
      let res;
      if (editTask && editTask.id) {
        // Edit mode: PATCH
        res = await fetch(`http://localhost:5000/api/tasks/${editTask.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: taskName,
            description: taskDescription,
            date: taskDate,
            userId: user.uid
          })
        });
      } else {
        // Add mode: POST
        res = await fetch('http://localhost:5000/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: taskName,
            description: taskDescription,
            date: taskDate,
            userId: user.uid
          })
        });
      }

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to save task');
      }

      const result = await res.json();
      onAdd && onAdd(result);
      onClose();
    } catch (err) {
      console.error('Save task failed', err);
      alert('Failed to save task: ' + err.message);
    }
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <h2>{editTask ? 'Edit Task' : 'Add New Task'}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="taskName">Task Name</label>
            <input
              type="text"
              id="taskName"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="Enter task name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="taskDescription">Description</label>
            <textarea
              id="taskDescription"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              placeholder="Enter task description"
              rows="4"
            />
          </div>

          <div className="form-group date-row">
            <label htmlFor="taskDate">Due Date</label>
            <div style={{ position: 'relative', width: '100%', maxWidth: 380 }}>
              <input
                type="text"
                id="taskDate"
                value={taskDate}
                placeholder="YYYY-MM-DD"
                maxLength={10}
                style={{ width: '100%', paddingRight: '2.5rem' }}
                onChange={e => {
                  let v = e.target.value.replace(/[^0-9]/g, '');
                  if (v.length > 8) v = v.slice(0, 8);
                  let formatted = v;
                  if (v.length > 6) formatted = v.slice(0,4) + '-' + v.slice(4,6) + '-' + v.slice(6);
                  else if (v.length > 4) formatted = v.slice(0,4) + '-' + v.slice(4);
                  setTaskDate(formatted);
                }}
              />
              <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', justifyContent: 'center', height: 32, width: 32, zIndex: 2 }}>
                <svg width="22" height="22" fill="none" stroke="#4a6fa5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" style={{ pointerEvents: 'none', display: 'block' }}><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                <input
                  type="date"
                  ref={dateInputRef}
                  aria-label="Pick date"
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: '100%',
                    height: '100%',
                    opacity: 0,
                    cursor: 'pointer',
                    border: 'none',
                    padding: 0,
                    margin: 0,
                    zIndex: 3
                  }}
                  onChange={e => {
                    const val = e.target.value; // yyyy-mm-dd
                    if (val) {
                      setTaskDate(val);
                    }
                  }}
                />
              </span>
            </div>
          </div>

          <div className="popup-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              {editTask ? 'Save Changes' : 'Add Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddTaskPopup;
