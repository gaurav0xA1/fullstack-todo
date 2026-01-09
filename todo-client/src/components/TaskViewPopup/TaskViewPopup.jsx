import React, { useState, useMemo } from 'react';
import TaskDescriptionPopup from './TaskDescriptionPopup';
import './TaskViewPopup.css';
import API_BASE_URL from '../../config/api';

function TaskViewPopup({ show, onClose, tasks = [], user }) {
    const [search, setSearch] = useState("");
    const [descPopupTask, setDescPopupTask] = useState(null);
    const [localTasks, setLocalTasks] = useState(tasks);

    // Keep localTasks in sync with tasks prop
    React.useEffect(() => {
        setLocalTasks(tasks);
    }, [tasks]);

    // Fuzzy filter tasks by search (matches any word, partial, any order)
    // Normalize text: remove non-alphanumeric chars for fuzzy matching
    function normalize(str) {
        return str.toLowerCase().replace(/[^a-z0-9]/gi, '');
    }
    const filteredTasks = useMemo(() => {
        if (!Array.isArray(localTasks)) return [];
        if (!search.trim()) return localTasks;
        const words = search.toLowerCase().split(/\s+/).filter(Boolean).map(normalize);
        return localTasks.filter(task => {
            const text = `${task.title || ''} ${task.description || ''}`;
            const normText = normalize(text);
            // Each word must be found somewhere in the normalized text (partial match)
            return words.every(word => normText.includes(word));
        });
    }, [localTasks, search]);

    if (!show) return null;

    // Update a task in localTasks when toggled in popup
    const handleTaskUpdated = (updatedTask) => {
        setLocalTasks(prev => prev.map(t => t.id === updatedTask.id ? { ...t, ...updatedTask } : t));
        setDescPopupTask(updatedTask); // update popup with new state
    };

    return (
        <>
        <div className="tasklist-popup-overlay" onClick={onClose}>
            <div
                className="tasklist-popup-content large-popup"
                onClick={e => e.stopPropagation()}
            >
                <div className="tasklist-searchbox-container">
                    <input
                        type="text"
                        className="tasklist-searchbox"
                        placeholder="Search tasks..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        autoFocus
                        onKeyDown={e => {
                            if (e.key === 'Escape') onClose();
                        }}
                    />
                </div>
                <div className="popup-task-grid">
                    {filteredTasks.length === 0 ? (
                        <div className="empty-state">No tasks found.</div>
                    ) : (
                        filteredTasks.map(task => (
                            <div className="popup-task-card" key={task.id} onClick={() => setDescPopupTask(task)} style={{cursor:'pointer'}}>
                                <div className="popup-task-title">{task.title}</div>
                                <div className="popup-task-desc">
                                    {task.description ? (task.description.length > 60 ? task.description.slice(0, 60) + '...' : task.description) : 'No description'}
                                </div>
                                <div className="popup-task-date">{task.date}</div>
                                <div className="popup-task-status">
                                    {task.completed ? <span className="completed">Completed</span> : <span className="incomplete">Incomplete</span>}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
        {descPopupTask && (
            <TaskDescriptionPopup
                task={descPopupTask}
                onClose={() => setDescPopupTask(null)}
                user={user}
                onTaskUpdated={handleTaskUpdated}
                onDelete={async (task) => {
                  // Delete from backend
                  await fetch(`${API_BASE_URL}/api/tasks/${task.id}`, { method: 'DELETE' });
                  setDescPopupTask(null);
                  // Remove from localTasks
                  setLocalTasks(prev => prev.filter(t => t.id !== task.id));
                }}
            />
        )}
        </>
    );
}

export default TaskViewPopup;