import { useNavigate } from 'react-router-dom';
import { defaultAvatar } from '../config';

const SidebarMenu = ({ profile, sidebarOpen, onToggle }) => {
  const navigate = useNavigate();
  
  return (
    <>
      <button className="menu-button" onClick={onToggle}>☰</button>
      
      {/* Sidebar */}
      <div className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">ROOMMINGLE</div>
        <div className="sidebar-content">
          <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
            <img
              src={profile?.profilePic || defaultAvatar}
              alt="Profile"
              className="profile-pic"
            />
          </div>
          <button className="sidebar-link" onClick={() => navigate('/home')}>Home</button>
          <button className="sidebar-link" onClick={() => navigate('/profile')}>Profile</button>
          <button className="sidebar-link" onClick={() => navigate('/notifications')}>Notifications</button>
          <button
            className="sidebar-link"
            onClick={() => {
              localStorage.clear();
              navigate('/');
            }}
          >
            Log Out
          </button>
        </div>
      </div>
    </>
  );
}

export default SidebarMenu;