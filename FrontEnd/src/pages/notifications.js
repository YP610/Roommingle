import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { respondMatchRequest } from '../api/users';

export default function NotificationsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleMenu = () => setSidebarOpen(open => !open);
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch incoming requests
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/signup');

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user._id) return navigate('/signup');

    fetch(`http://localhost:1000/api/userRoutes/${user._id}`, {
      headers: { Accept: 'application/json', Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to load requests');
        return res.json();
      })
      .then(profile => {
        const incoming = profile.requestsReceived || [];
        return Promise.all(
          incoming.map(req =>
            fetch(`http://localhost:1000/api/userRoutes/${req.from}`, {
              headers: { Accept: 'application/json', Authorization: `Bearer ${token}` }
            }).then(r => {
              if (!r.ok) throw new Error('Failed to load user');
              return r.json();
            })
          )
        );
      })
      .then(users => setRequests(users))
      .catch(err => setError(err.message));
  }, [navigate]);

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
      {/* Toggle Menu Button */}
      <button className="menu-button" onClick={toggleMenu}>☰</button>

      {/* Sidebar */}
      <div className={`sidebar-overlay${sidebarOpen ? ' open' : ''}`}>  
        <div className="sidebar-logo">ROOMMINGLE</div>
        <div className="sidebar-content">
          {/* Optionally display small user photo */}
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
        <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
          <h1 className="text-3xl font-bold mb-6">Match Requests</h1>
          {error && <p className="text-red-600 mb-4">{error}</p>}
          {requests.length === 0 ? (
            <p className="text-gray-500">No incoming requests.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-4xl">
              {requests.map(user => (
                <div key={user._id} className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
                    <img
                      src={user.profilePic || 'https://via.placeholder.com/150'}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h2 className="text-xl font-semibold mb-2">{user.name}</h2>
                  {user.bio && <p className="text-gray-600 text-center mb-4">{user.bio}</p>}
                  <div className="flex space-x-3">
                    <button
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                      onClick={() => handleRespond(user._id, 'accept')}
                    >
                      Accept
                    </button>
                    <button
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                      onClick={() => handleRespond(user._id, 'decline')}
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
