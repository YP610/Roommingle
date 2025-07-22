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
      <div className="profile-page-container">
        <p className="error-text">{error}</p>
      </div>
    );
  }
  if (!profile) {
    return (
      <div className="profile-page-container">
        <p>Loading profile...</p>
      </div>
    );
  }

  // Accept or decline handler
  const handleRespond = async (userId, action) => {
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:1000/api/userRoutes/${userId}/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ action })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Request failed');
      }
      // Remove from UI list
      setRequests(prev => prev.filter(u => u._id !== userId));
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

return (
  <div className="home-wrapper">
    {/* Menu Button */}
    <button className="menu-button" onClick={toggleMenu}>☰</button>

    {/* Sidebar */}
    <div className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`}>
      <div className="sidebar-logo">ROOMMINGLE</div>
      <div className="sidebar-content">
        <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
          <img
            src={profile.profilePic || defaultAvatar}
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

    {/* Main Content */}
    <div className="feed-container">
      <div className="profile-page-container">
        {/* Profile Header */}
        <div className="profile-header">
          <img
            src={profile.profilePic || defaultAvatar}
            alt={profile.name}
            className="profile-picture"
          />
          <div className="profile-info">
            <h1 className="profile-name">{profile.name}</h1>
            <p className="profile-bio">{profile.bio || ''}</p>
            <button
              className="edit-button"
              onClick={() => navigate('/edit-profile')}
            >
              Edit Profile
            </button>
          </div>
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
            <div className="matches-container">
              {matches.length > 0 ? (
                <div className="matches-grid">
                  {matches.map(user => (
                    <div className="match-card" key={user._id}>
                      <div id={`match-carousel-${user._id}`} className="carousel slide">
                        <div className="carousel-inner">
                          {/* Profile View */}
                          <div className="carousel-item active">
                            <div className="profile-view">
                              <div className="profile-header">
                                <img
                                  src={user.profilePic || defaultAvatar}
                                  alt="Profile"
                                  className="profile-image"
                                />
                                <div className="profile-info">
                                  <h2 className="profile-name">{user.name}</h2>
                                  {user.feed?.year && <p className="profile-year">Year: {user.feed.year}</p>}
                                  {user.livingConditions?.major && (
                                    <p className="profile-major">Major: {user.livingConditions.major}</p>
                                  )}
                                  {user.bio && <p className="profile-bio">{user.bio}</p>}
                                </div>
                              </div>
                              {user.number ? <p>Phone: {user.number}</p> : ''}
                              {user.contact.insta ? <p>Instagram: {user.contact.insta}</p> : ''}
                              {user.contact.snap ? <p>Snapchat: {user.contact.snap}</p> : ''}
                            </div>
                          </div>
                          
                          {/* Details View */}
                          <div className="carousel-item">
                            <div className="details-view">
                              <h3 className="detail-title">Living Preferences</h3>
                              <div className="detail-item">
                                <span className="detail-label">Sleep Schedule:</span>
                                <span className="detail-value">{user.livingConditions?.sleep_attitude || 'Not specified'}</span>
                              </div>
                              <div className="detail-item">
                                <span className="detail-label">Year:</span>
                                <span className="detail-value">{user.feed?.year || 'Not specified'}</span>
                              </div>
                              <div className="detail-item">
                                <span className="detail-label">Major:</span>
                                <span className="detail-value">{user.livingConditions?.major || 'Not specified'}</span>
                              </div>
                              <div className="detail-item">
                                <span className="detail-label">Hobbies:</span>
                                <span className="detail-value">{user.hobbies || 'Not specified'}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Carousel Controls */}
                        <button className="carousel-control-prev" type="button" 
                          data-bs-target={`#match-carousel-${user._id}`} data-bs-slide="prev">
                          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                          <span className="visually-hidden">Previous</span>
                        </button>
                        <button className="carousel-control-next" type="button" 
                          data-bs-target={`#match-carousel-${user._id}`} data-bs-slide="next">
                          <span className="carousel-control-next-icon" aria-hidden="true"></span>
                          <span className="visually-hidden">Next</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-results">No matches yet.</p>
              )}
            </div>
          ) : (
            <div className="requests-container">
              {requests.length > 0 ? (
                <div className="requests-grid">
                  {requests.map(user => (
                    <div className="request-card" key={user._id}>
                      <div id={`request-carousel-${user._id}`} className="carousel slide">
                        <div className="carousel-inner">
                          {/* Profile View */}
                          <div className="carousel-item active">
                            <div className="profile-view">
                              <div className="profile-header">
                                <img
                                  src={user.profilePic || defaultAvatar}
                                  alt="Profile"
                                  className="profile-image"
                                />
                                <div className="profile-info">
                                  <h2 className="profile-name">{user.name}</h2>
                                  {user.feed?.year && <p className="profile-year">Year: {user.feed.year}</p>}
                                  {user.livingConditions?.major && (
                                    <p className="profile-major">Major: {user.livingConditions.major}</p>
                                  )}
                                  {user.bio && <p className="profile-bio">{user.bio}</p>}
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
                                <span className="detail-value">{user.livingConditions?.sleep_attitude || 'Not specified'}</span>
                              </div>
                              <div className="detail-item">
                                <span className="detail-label">Year:</span>
                                <span className="detail-value">{user.feed?.year || 'Not specified'}</span>
                              </div>
                              <div className="detail-item">
                                <span className="detail-label">Major:</span>
                                <span className="detail-value">{user.livingConditions?.major || 'Not specified'}</span>
                              </div>
                              <div className="detail-item">
                                <span className="detail-label">Hobbies:</span>
                                <span className="detail-value">{user.hobbies || 'Not specified'}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Carousel Controls */}
                        <button className="carousel-control-prev" type="button" 
                          data-bs-target={`#request-carousel-${user._id}`} data-bs-slide="prev">
                          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                          <span className="visually-hidden">Previous</span>
                        </button>
                        <button className="carousel-control-next" type="button" 
                          data-bs-target={`#request-carousel-${user._id}`} data-bs-slide="next">
                          <span className="carousel-control-next-icon" aria-hidden="true"></span>
                          <span className="visually-hidden">Next</span>
                        </button>
                      </div>
                      <div className="action-buttons">
                        <button
                          className="btn btn-reject"
                          onClick={() => handleRespond(user._id, 'decline')}
                        >
                          Decline
                        </button>
                        <button
                          className="btn btn-request"
                          onClick={() => handleRespond(user._id, 'accept')}
                        >
                          Accept
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-results">No incoming requests.</p>
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