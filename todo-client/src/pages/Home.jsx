import NavBar from '../components/NavBar/NavBar';
import TaskList from '../components/TaskList/TaskList';
import CalanderView from '../components/CalanderView/CalanderView';
import Sidebar from '../components/Sidebar/Sidebar';

import './Home.css';
import AddTaskPopup from '../components/AddTaskPopup/AddTaskPopup';
import { useState } from 'react';
import { useEffect } from 'react';

function Home({ user, onSignOut }) {

  const [tasks, setTasks] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [expandedTaskId, setExpandedTaskId] = useState(null);


  //fetch tasks from backend
  const fetchTasks = async () => {
    const res = await fetch(`http://localhost:5000/api/tasks?userId=${user?.uid}`);
    const data = await res.json();
    // Map MongoDB _id to id for consistency
    const tasksWithId = data.tasks.map(task => ({
      ...task,
      id: String(task._id || task.id)
    }));
    setTasks(tasksWithId);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  //called after a new task is added
  const handleAdd = () => {
    fetchTasks();
  };

  return (
    <div className="home-page">
      <div className="top-bar">
        <div className="logo">ToDo</div>

        <div className="user-info" onClick={() => setShowSidebar(true)} style={{ cursor: 'pointer' }}>
          <img src={user.photoURL} alt={user.displayName} className="user-avatar" />
          <span className="user-name">{user.displayName}</span>
        </div>
      </div>

      {showSidebar && (
        <Sidebar user={user} onClose={() => setShowSidebar(false)} onSignOut={onSignOut} />
      )}

      {user && user.uid && showPopup && (
        <AddTaskPopup
          onClose={() => setShowPopup(false)}
          onAdd={handleAdd}
          user={user}
        />
      )}

      <TaskList
        user={user}
        tasks={tasks}
        expandedTaskId={expandedTaskId}
        onExpand={setExpandedTaskId}
        onTasksChanged={fetchTasks}
      />
      <div className="hide-on-mobile">
        <CalanderView />
        <NavBar user={user} onTaskAdded={handleAdd} />
      </div>
    </div>
  );
}

export default Home;
