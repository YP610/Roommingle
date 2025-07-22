import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './home.css';
import { sendMatchRequest } from '../api/users';
import { defaultAvatar } from "../config";

const Home = () => {
  const [profile, setProfile] = useState(null);
  const [roommates, setRoommates] = useState([]);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/signup');

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user?._id;
    if (!userId) return navigate('/signup');

    const headers = {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    };

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

  const handleRemoveRec = async (targetUserId) => {
    try {
      setRoommates(prev => prev.filter(rm => rm._id !== targetUserId));
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  const toggleMenu = () => setSidebarOpen(o => !o);

  if (!profile) return <p>Loading profile...</p>;

  return (
  <div className="container-fluid home-container">
    {/* Menu Button */}
    <button className="menu-button" onClick={toggleMenu}>☰</button>

    {/* Sidebar Overlay */}
    <div className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`} id="sidebar">
      <div className="sidebar-logo">ROOMMINGLE</div>
      <div className="sidebar-content">
        <img
          src={profile.profilePic || defaultAvatar}
          alt="Profile"
          className="profile-pic"
        />
        <button className="sidebar-link" onClick={() => navigate('/home')}>Home</button>
        <button className="sidebar-link" onClick={() => navigate('/profile')}>Profile</button>
        <button className="sidebar-link" onClick={() => navigate('/notifications')}>Notifications</button>
        <button className="sidebar-link" onClick={() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/');
        }}>
          Log Out
        </button>
      </div>
    </div>

    {/* Feed Container */}
    <div className="feed-container">
      {error && <p className="error-text">{error}</p>}
      {roommates.map(rm => (
        <div className="roommate-card" key={rm._id}>
          <div id={`recommended-${rm._id}`} className="carousel slide">
            <div className="carousel-inner">
              {/* Profile View */}
              <div className="carousel-item active">
                <div className="profile-view">
                  <div className="profile-header">
                    <img
                      src={rm.profilePic || defaultAvatar}
                      alt="Profile"
                      className="profile-image"
                    />
                    <div className="profile-info">
                      <h2 className="profile-name">{rm.name}</h2>
                      {rm.feed.year && <p className="profile-year">Year: {rm.feed.year}</p>}
                      {rm.livingConditions.major && <p className="profile-major">Major: {rm.livingConditions.major}</p>}
                      {rm.bio && <p className="profile-bio">{rm.bio}</p>}
                    </div>
                  </div>
                  
                </div>
              </div>
              
              {/* Details View */}
              <div className="carousel-item">
                <div className="details-view">
                  <h3 className="detail-title">Living Preferences</h3>
                  <div className="detail-item">
                    <span className="detail-label">Sleep Schedule:</span>
                    <span className="detail-value">{rm.livingConditions.sleep_attitude || 'Not specified'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Year:</span>
                    <span className="detail-value">{rm.feed.year || 'Not specified'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Major:</span>
                    <span className="detail-value">{rm.livingConditions.major || 'Not specified'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Hobbies:</span>
                    <span className="detail-value">{rm.hobbies || 'Not specified'}</span>
                  </div>
                  
                 
                </div>
              </div>
            </div>
            
            {/* Carousel Controls */}
            <button className="carousel-control-prev" type="button" 
              data-bs-target={`#recommended-${rm._id}`} data-bs-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" 
              data-bs-target={`#recommended-${rm._id}`} data-bs-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
          
          {/* Action Buttons */}
          <div className="action-buttons">
            <button onClick={() => handleRemoveRec(rm._id)} className="btn btn-reject">
              Not Interested
            </button>
            <button onClick={() => handleSendRequest(rm._id)} className="btn btn-request">
              Request Match
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);
}

export default Home;