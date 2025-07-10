import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './home.css'; // ensure styles from home.html are ported here
import { sendMatchRequest } from '../api/users';

const Home = () => {
  const [profile, setProfile] = useState(null);
  const [roommates, setRoommates] = useState([]);
  const [error, setError]       = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/signup');

    const user    = JSON.parse(localStorage.getItem('user') || '{}');
    const userId  = user?._id;
    if (!userId) return navigate('/signup');

    const headers = {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    };
    // Fetch profile and recommendations concurrently
    Promise.all([
      fetch(`http://localhost:1000/api/userRoutes/${userId}`, { headers }),
      fetch(`http://localhost:1000/api/userRoutes/recs/${userId}`, { headers })
    ])
      .then(async([profileRes, recsRes]) => {
        if (!profileRes.ok) throw new Error('Failed to load profile');
        if (!recsRes.ok) throw new Error('Failed to load recommendations');
        const profileData = await profileRes.json();
        setProfile(profileData);
        const recsData = await recsRes.json();

        //Exclude users already requested or matched
        const requestedIds = (profileData.requestsSent || []).map(r => r.from);
        const acceptedIds = profileData.matches || [];
        const excludeSet = new Set([...requestedIds, ...acceptedIds, userId]);

        const filtered = recsData.filter(rm => !excludeSet.has(rm._id));
        setRoommates(filtered);
      })
      .catch(err => setError(err.message));
  }, [navigate]);


  const handleSendRequest = async (targetUserId) => {
  try {
    await sendMatchRequest(targetUserId);
    setRoommates(prev => prev.filter(rm => rm._id !== targetUserId));
  } catch (err) {
    console.error(err);
    setError(err.message);
  }
  };

  const toggleMenu = () => setSidebarOpen(o => !o);

  if(!profile) return <p>Loading profile...</p>;

  return (
    <div className="home-wrapper">
      {/* Menu Button */}
      <button className="menu-button" onClick={toggleMenu}>☰</button>

      {/* Sidebar Overlay */}
      <div className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`} id="sidebar">
        <div className="sidebar-logo">ROOMMINGLE</div>
        <div className="sidebar-content">
          <img
            src={profile.profilePic || 'https://via.placeholder.com/80'}
            alt="Profile Picture"
            className="profile-pic"
          />
          <button className="sidebar-link" onClick={() => navigate('/home')}>Home</button>
          <button className="sidebar-link" onClick={() => navigate('/profile')}>Profile</button>
          <button className="sidebar-link" onClick={() => navigate('/requests')}>Requests</button>
          <button className="sidebar-link" onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/');
          }}
        >
          Log Out
        </button>
        </div>
      </div>

      {/* Feed Container */}
      <div className="feed-container" id="feedContainer">
        {error && <p className="error-text">{error}</p>}
        {roommates.map(rm => (
          <div className="tile" key={rm._id}>
            <div className="tile-content">
              <p className="username">{rm.name}</p>
              <img
                src={rm.profilePic || 'https://via.placeholder.com/400x300'}
                alt="Content"
                className="content-pic"
              />
              {rm.bio && <p className="caption">{rm.bio}</p>}
              <button onClick={() => handleSendRequest(rm._id)} className="px-4 py-2 bg-blue-600 text-white rounded">Send Match Request</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;