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
  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
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
      headers: { Accept: 'application/json', Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to load profile');
        return res.json();
      })
      .then(async profile => {
        setProfile(profile);

        // Fetch each accepted match's details
        const acceptedIds = profile.matches || [];
        
        const matchPromises = acceptedIds.map(id =>
          fetch(`http://localhost:1000/api/userRoutes/${id}`, {
            headers: { Accept: 'application/json', Authorization: `Bearer ${token}` }
          })
            .then(res => {
              if (!res.ok) throw new Error('Failed to load match');
              return res.json();
            })
        );
        const matchUsers = await Promise.all(matchPromises);
        setMatches(matchUsers);

        // Fetch requests
        const requestedIds = (profile.requestsReceived || []).map(r => r.from);

        const requestPromises = requestedIds.map(id =>
          fetch(`http://localhost:1000/api/userRoutes/${id}`, {
            headers: { Accept: 'application/json', Authorization: `Bearer ${token}` }
          })
            .then(res => {
              if(!res.ok) throw new Error('Failed to load requests');
              return res.json()
            })
         );
        const requestUsers = await Promise.all(requestPromises);
        setRequests(requestUsers);
  
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
          <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
            <img
              src={profile.profilePic || defaultAvatar}
              alt={profile.name}
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

      {/* Main Content */}
      <div className="feed-container">
        <div className="profile-container">
          
          {/* Profile Header */}
          <div className="profile-header">
            <img
              src={profile.profilePic || defaultAvatar}
              alt={profile.name}
              className="profile-picture"
            />
            <h1 className="profile-name">{profile.name}</h1>
            <p className="profile-bio">{profile.bio || ''}</p>
            <button
              className="edit-button"
              onClick={() => navigate('/edit-profile')}
            >
              Edit Profile
            </button>
          </div>

          {/* Tabs */}
          <div className="profile-tabs">
            <button
              className={`tab-button ${activeTab === 'matches' ? 'active' : ''}`}
              onClick={() => setActiveTab('matches')}
            >
              Matches
            </button>
            <button
              className={`tab-button ${activeTab === 'requests' ? 'active' : ''}`}
              onClick={() => setActiveTab('requests')}
            >
              Requests
            </button>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === 'matches' ? (
              <div className="match-grid">
                {matches.length > 0 ? (
                  matches.map(user => (
                    <div key={user._id} className="match">
                      <img
                        src={user.profilePic || defaultAvatar}
                        alt={user.name}
                      />
                      <p>{user.bio || user.name}</p>
                    </div>
                  ))
                ) : (
                  <p className="no-results">No matches yet.</p>
                )}
              </div>
            ) : (
              <div className="match-grid requests-grid">
                {requests.length > 0 ? (
                  requests.map(user => (
                    <div key={user._id} className="match">
                      <img
                        src={user.profilePic || defaultAvatar}
                        alt={user.name}
                      />
                      <p>{user.bio || user.name}</p>
                    </div>
                  ))
                ) : (
                  <p className="no-results">No requests yet.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

};

export default ProfilePage;