import './NavBar.css';
import { FaPlus, FaClipboardList } from 'react-icons/fa';
import { AiOutlineRobot } from 'react-icons/ai';
import { useState } from 'react';
import AddTaskPopup from '../AddTaskPopup/AddTaskPopup';
import WeeklySummaryPopup from './WeeklySummaryPopup';
import API_BASE_URL from '../../config/api';

function NavBar({ user, onTaskAdded, onTaskListClick }) {
  const [showChatPopup, setShowChatPopup] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [showAIPopup, setShowAIPopup] = useState(false);

  const handleChatClick = () => {
    setShowChatPopup(true);
    setTimeout(() => setShowChatPopup(false), 2000);
  };

  const handleAIClick = () => {
    setShowAIPopup(true);
  };

  const handleAddClick = () => {
    setShowAddTask(true);
    fetch(`${API_BASE_URL}/api/click`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'button clicked' })
    }).catch(() => {});
  };

  

  return (
    <>
      <nav className="bottom-navbar">
        <button className="nav-item" onClick={onTaskListClick}>
          <FaClipboardList size={24} />
        </button>
        <button className="nav-item nav-add" onClick={handleAddClick}>
          <FaPlus size={24} />
        </button>
        <button className="nav-item" onClick={handleAIClick}>
          <AiOutlineRobot size={26} />
        </button>
      </nav>
      
      {showChatPopup && (
        <div className="construction-popup">
          Under Construction
        </div>
      )}

      {showAIPopup && user && (
        <WeeklySummaryPopup
          userId={user.uid || user.id || user._id}
          onClose={() => setShowAIPopup(false)}
        />
      )}

      {showAddTask && (
        <AddTaskPopup 
          onClose={() => setShowAddTask(false)} 
          user={user}
          onAdd={() => {
            onTaskAdded && onTaskAdded();
            setShowAddTask(false);
          }}
        />
      )}
    </>
  );
}

export default NavBar;
