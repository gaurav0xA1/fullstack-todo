import './TaskList.css';
import { useState } from 'react';
import TaskDescriptionPopup from './TaskDescriptionPopup';
import AddTaskPopup from '../AddTaskPopup/AddTaskPopup';
import API_BASE_URL from '../../config/api';

function TaskList({ user, tasks = [], expandedTaskId, onExpand, onTasksChanged }) {

        // State for description popup
        const [descPopupTask, setDescPopupTask] = useState(null);
        const [editPopupTask, setEditPopupTask] = useState(null);

        const handleShowDescription = (task) => {
            setDescPopupTask(task);
        };
        const handleShowEdit = (task) => {
            setEditPopupTask(task);
        };
        const handleCloseEdit = () => {
            setEditPopupTask(null);
        };
        const handleEditSuccess = () => {
            setEditPopupTask(null);
            if (onTasksChanged) onTasksChanged();
        };
        const handleCloseDescription = () => {
            setDescPopupTask(null);
        };
        const handleDeleteTask = async (task) => {
            try {
                await fetch(`${API_BASE_URL}/api/tasks/${task.id}`, {
                    method: 'DELETE',
                });
                setDescPopupTask(null);
                if (onTasksChanged) onTasksChanged();
            } catch (err) {
                alert('Failed to delete task');
            }
        };
        const handleTaskUpdated = () => {
            setDescPopupTask(null);
            if (onTasksChanged) onTasksChanged();
        };
    // Get today's date in YYYY-MM-DD format
    const todayDate = new Date().toISOString().split('T')[0];

    // Filter tasks into completed and incomplete
    const incompleteTasks = tasks.filter(task => !task.completed && task.date === todayDate);
    const completedTasks = tasks.filter(task => task.completed && task.date === todayDate);

    const today = new Date().toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
    });

    // For hover-based expansion, track hovered task
    const handleMouseEnter = (taskId) => {
        if (onExpand) onExpand(taskId);
    };
    const handleMouseLeave = () => {
        if (onExpand) onExpand(null);
    };

    const toggleTask = async (taskId, currentCompleted) => {
        try {
            await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ completed: !currentCompleted })
            });
            // Refresh just the task list data
            if (onTasksChanged) {
                onTasksChanged();
            }
        } catch (err) {
            console.error('Failed to toggle task:', err);
        }
    };



    // Delete task handler
    const handleDelete = async (taskId) => {
        try {
            await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
                method: 'DELETE',
            });
            if (onTasksChanged) {
                onTasksChanged();
            }
        } catch (err) {
            console.error('Failed to delete task:', err);
        }
    };




    return (
        <>
        <main className="home-main">
            <div className="today-section">
                <h2 className="section-title">Today</h2>
                <p className="section-date">{today}</p>
                <div className="tasks-list">
                    {incompleteTasks.length === 0 ? (
                        <div className="empty-state">
                            <p>No tasks for today</p>
                            <span>Add a new task to get started!</span>
                        </div>
                    ) : (
                        incompleteTasks.map((task) => (
                            <div
                                key={task.id}
                                className={`task-item${expandedTaskId === task.id ? ' expanded' : ''}${task.completed ? ' completed' : ''}`}
                                onMouseEnter={() => handleMouseEnter(task.id)}
                                onMouseLeave={handleMouseLeave}
                                style={{ cursor: 'pointer' }}
                            >
                                <button
                                    className="task-checkbox"
                                    onClick={e => { e.stopPropagation(); toggleTask(task.id, task.completed); }}
                                >
                                    <div className="checkbox-circle"></div>
                                </button>
                                <div className="task-info">
                                    <h3 className="task-title">{task.title}</h3>
                                    <p className="task-date">{task.date}</p>
                                    {expandedTaskId === task.id && (
                                        <div className="task-details">
                                            <button className="edit-btn" onClick={e => { e.stopPropagation(); handleShowEdit(task); }}>Edit</button>
                                            <button className="delete-btn" onClick={e => { e.stopPropagation(); handleDelete(task.id); }}>Delete</button>
                                        </div>
                                    )}
                                </div>
                                <button
                                    className="view-more-btn"
                                    onClick={e => { e.stopPropagation(); handleShowDescription(task); }}
                                    title="View details"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4a6fa5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {completedTasks.length > 0 && (
                <div className="completed-section">
                    <h2 className="section-title">Completed</h2>
                    <div className="tasks-list">
                        {completedTasks.map((task) => (
                            <div key={task.id} className="task-item completed">
                                <button
                                    className="task-checkbox completed"
                                    onClick={e => { e.stopPropagation(); toggleTask(task.id, task.completed); }}
                                >
                                    <div className="checkbox-circle">
                                        <span className="check-icon">✓</span>
                                    </div>
                                </button>
                                <div className="task-info">
                                    <h3 className="task-title">{task.title}</h3>
                                    <p className="task-date">{task.date}</p>
                                </div>
                                <span className="completed-badge">Completed</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </main>
        {descPopupTask && (
            <TaskDescriptionPopup
                task={descPopupTask}
                onClose={handleCloseDescription}
                onDelete={handleDeleteTask}
                user={user}
                onTaskUpdated={handleTaskUpdated}
            />
        )}
        {editPopupTask && (
            <AddTaskPopup
                onClose={handleCloseEdit}
                onAdd={handleEditSuccess}
                user={user}
                editTask={editPopupTask}
            />
        )}
        </>
    );
}

export default TaskList;