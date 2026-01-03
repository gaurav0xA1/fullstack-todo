import './NavBar.css';
import { FaPlus, FaClipboardList } from 'react-icons/fa';
import { AiOutlineRobot } from 'react-icons/ai';
import { useState } from 'react';
import AddTaskPopup from '../AddTaskPopup/AddTaskPopup';

function NavBar({ user, onTaskAdded }) {
  const [showChatPopup, setShowChatPopup] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [showAIPopup, setShowAIPopup] = useState(false);

  const handleChatClick = () => {
    setShowChatPopup(true);
    setTimeout(() => setShowChatPopup(false), 2000);
  };

  const handleAIClick = () => {
    setShowAIPopup(true);
    setTimeout(() => setShowAIPopup(false), 2000);
  };

  const handleAddClick = () => {
    setShowAddTask(true);
    fetch('http://localhost:5000/api/click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'button clicked' })
    }).catch(() => {});
  };

  

  return (
    <>
      <nav className="bottom-navbar">
        <button className="nav-item" onClick={handleChatClick}>
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

      {showAIPopup && (
        <div className="construction-popup">
          Under Construction
        </div>
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
