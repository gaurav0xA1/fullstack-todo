import './Sidebar.css';
import { FaHome, FaUser, FaInfoCircle } from 'react-icons/fa';

function Sidebar({ user, onClose, onSignOut }) {
  return (
    <div className="sidebar-overlay" onClick={onClose}>
      <div className="sidebar" onClick={e => e.stopPropagation()}>
        <div className="sidebar-header improv-profile">
          <div className="sidebar-avatar-wrap">
            <img src={user.photoURL} alt={user.displayName} className="sidebar-avatar" />
          </div>
          <div className="sidebar-profile-details">
            <div className="sidebar-profile-name">{user.displayName}</div>
            <div className="sidebar-profile-email">{user.email}</div>
          </div>
        </div>
        <nav className="sidebar-nav">
          <a href="#" className="sidebar-link"><FaHome /> Home</a>
          <a href="https://anupbhattarai2.com.np" className="sidebar-link" target="_blank" rel="noopener noreferrer"><FaInfoCircle /> About Developer</a>
        </nav>
        <button className="sidebar-signout" onClick={onSignOut}>Sign Out</button>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>
    </div>
  );
}

export default Sidebar;
