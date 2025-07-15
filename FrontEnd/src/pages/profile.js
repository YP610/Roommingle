import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './profilecss.css'; // Ensure this CSS file exists and is imported
import { defaultAvatar } from "../config"; // adjust path if needed


const ProfilePage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleMenu = () => setSidebarOpen(open => !open);
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState('');
  //console.log("Default avatar from VITE:", import.meta.env.VITE_DEFAULT_AVATAR_URL);



  useEffect(() => {
    const token = localStorage.getItem('token');
    const stored = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = stored._id;
    if (!token || !userId) {
      navigate('/signup');
      return;
    }

    // Fetch user profile (includes accepted matches array)
    fetch(`http://localhost:1000/api/userRoutes/${userId}`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to load profile');
        return res.json();
      })
      .then(async data => {
        setProfile(data);
        const acceptedIds = data.matches || [];
        // Fetch each accepted match's details
        const matchPromises = acceptedIds.map(id =>
          fetch(`http://localhost:1000/api/userRoutes/${id}`, {
            headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          }).then(res => {
            if (!res.ok) throw new Error('Failed to load match');
            return res.json();
          })
        );
        const users = await Promise.all(matchPromises);
        setMatches(users);
      })
      .catch(err => setError(err.message));
  }, [navigate]);

  if (error) {
    return (
      <div className="profile-container">
        <p className="error-text">{error}</p>
      </div>
    );
  }
  if (!profile) {
    return (
      <div className="profile-container">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="home-wrapper">
      {/* Toggle Menu Button */}
      <button className="menu-button" onClick={toggleMenu}>☰</button>

      {/* Sidebar */}
      <div className={`sidebar-overlay${sidebarOpen ? ' open' : ''}`}>  
        <div className="sidebar-logo">ROOMMINGLE</div>
        <div className="sidebar-content">
          {profile && (
            <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
              <img
                src={profile.profilePic || defaultAvatar}
                alt={profile.name}
                className="profile-pic"
              />
            </div>
          )}
          <button className="sidebar-link" onClick={() => navigate('/home')}>Home</button>
          <button className="sidebar-link" onClick={() => navigate('/profile')}>Profile</button>
          <button className="sidebar-link" onClick={() => navigate('/notifications')}>Notifications</button>
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

      {/* Main Content */}
      <div className="feed-container">
        {error ? (
          <div className="profile-container">
            <p className="error-text">{error}</p>
          </div>
        ) : (
          profile && (
            <div className="profile-container">
              {/* Profile Header */}
              <div className="profile-header">
                <img
                  src={profile.profilePic || defaultAvatar}
                  alt="Profile"
                  className="profile-picture"
                />
                <h1 className="profile-name">{profile.name}</h1>
                <p className="profile-bio">{profile.bio || ''}</p>
                <button className="edit-button" onClick={() => navigate('/edit-profile')}>
                  Edit Profile
                </button>
              </div>

              {/* Stats */}
              <div className="profile-stats">
                <div>
                  <span className="stat-number">{matches.length}</span>
                  <span className="stat-label"> Matches</span>
                </div>
              </div>

              {/* Matches Grid */}
              <div className="profile-matches">
                <h2>Matches</h2>
                <div className="match-grid">
                  {matches.length > 0 ? (
                    matches.map(match => (
                      <div key={match._id} className="match">
                        <img
                          src={match.profilePic || defaultAvatar}
                          alt={match.name}
                        />
                        <p>{match.bio || match.name}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No matches yet.</p>
                  )}
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ProfilePage;