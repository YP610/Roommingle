import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { defaultAvatar } from '../config';
import socket from '../api/socket';
import SidebarMenu from '../components/sidebarMenu';

export default function NotificationsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState('');
  const [newRequests, setNewRequests] = useState([]);
  const navigate = useNavigate();

  // Toggle sidebar
  const toggleMenu = () => setSidebarOpen(open => !open);

  // Initialize socket and fetch data
  // Update your socket initialization and event handlers
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!token || !user._id) {
        navigate('/signup');
        return;
    }

    // Initialize socket with auth
    socket.auth = { token };
    socket.connect();

    // Join user room immediately
    socket.emit('joinUserRoom', user._id);

    // Socket event handlers
    const handleNewRequest = (data) => {
        setRequests(prev => {
            // Check if request already exists
            const exists = prev.some(req => req._id === data.sender._id);
            return exists ? prev : [data.sender, ...prev];
        });
        setNewRequests(prev => [...prev, data.sender._id]);
    };

    const handleRequestUpdate = (data) => {
        setRequests(prev => prev.filter(req => req._id !== data.userId));
        setNewRequests(prev => prev.filter(id => id !== data.userId));
    };

    socket.on('newMatchRequest', handleNewRequest);
    socket.on('matchRequestUpdate', handleRequestUpdate);

    // Error handling
    socket.on('connect_error', (err) => {
        console.error('Socket connection error:', err);
        setError('Connection error. Please refresh the page.');
    });

    // Fetch initial requests
    const fetchRequests = async () => {
        try {
            const profileRes = await fetch(`http://localhost:1000/api/userRoutes/${user._id}`, {
                headers: { 
                    Authorization: `Bearer ${token}` 
                }
            });
            
            const profileData = await profileRes.json();
            setProfile(profileData);

            const incoming = profileData?.requestsReceived || [];
            if (incoming.length > 0) {
                const users = await Promise.all(
                    incoming.map(req => 
                        fetch(`http://localhost:1000/api/userRoutes/${req.from}`, {
                            headers: { Authorization: `Bearer ${token}` }
                        }).then(res => res.json())
                    )
                );
                setRequests(users);
            }
        } catch (err) {
            console.error('Fetch error:', err);
            setError(err.message);
        }
    };

    fetchRequests();

    return () => {
        socket.off('newMatchRequest', handleNewRequest);
        socket.off('matchRequestUpdate', handleRequestUpdate);
        socket.off('connect_error');
        socket.disconnect();
    };
}, [navigate]);

  // Handle accept/decline
  const handleRespond = async (userId, action) => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(
            `http://localhost:1000/api/userRoutes/${userId}/respond`,
            {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}` 
                },
                body: JSON.stringify({ action })
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to process request');
        }

        // Update UI immediately
        setRequests(prev => prev.filter(user => user._id !== userId));
        setNewRequests(prev => prev.filter(id => id !== userId));

        // Emit socket event
        socket.emit('matchResponse', {
            receiverId: userId,
            senderId: JSON.parse(localStorage.getItem('user'))._id,
            action
        });
    } catch (err) {
        console.error('Response error:', err);
        setError(err.message);
    }
};

  return (
    <div className="home-wrapper">
      <SidebarMenu 
        profile={profile}
        sidebarOpen={sidebarOpen}
        onToggle={toggleMenu}
      />

      {/* Main Content */}
      <div className="feed-container">
        <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
          <h1 className="text-3xl font-bold mb-6">Match Requests</h1>
          
          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* New Requests Notification */}
          {newRequests.length > 0 && (
            <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
              You have {newRequests.length} new request(s)!
            </div>
          )}

          {/* Requests List */}
          {requests.length === 0 ? (
            <p className="text-gray-500">No incoming requests.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-4xl">
              {requests.map(user => (
                <div 
                  key={user._id} 
                  className="bg-white rounded-lg shadow p-4 flex flex-col items-center relative"
                >
                  {/* New Request Badge */}
                  {newRequests.includes(user._id) && (
                    <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      New
                    </span>
                  )}
                  
                  {/* User Avatar */}
                  <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
                    <img
                      src={user.profilePic || defaultAvatar}
                      alt={user.name}
                      className="profile-pic"
                    />
                  </div>
                  
                  {/* User Info */}
                  <h2 className="text-xl font-semibold mb-2">{user.name}</h2>
                  
                  {user.bio && (
                    <p className="text-gray-600 text-center mb-4 line-clamp-3">
                      {user.bio}
                    </p>
                  )}
                  
                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <button
                      className="btn btn-request"
                      onClick={() => handleRespond(user._id, 'accept')}
                    >
                      Accept
                    </button>
                    <button
                      className="btn btn-reject"
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