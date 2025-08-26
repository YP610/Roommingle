import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './editprofile.css';
import SidebarMenu from '../components/sidebarMenu';
import { defaultAvatar } from '../config';

const EditProfile = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleMenu = () => setSidebarOpen(!sidebarOpen);
  const navigate = useNavigate();
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [user] = useState(JSON.parse(localStorage.getItem('user') || '{}'));

  const DEFAULT_AVATAR = defaultAvatar;

  useEffect(() => {
    if (!user || !user._id) {
      navigate('/signup');
    } else {
      setPreview(user.profilePic || DEFAULT_AVATAR);
    }
  }, [user, navigate]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!profilePic) return;
    setUploading(true);

    const formData = new FormData();
    formData.append('profilePic', profilePic);

    try {
      const res = await fetch(`http://localhost:1000/api/userRoutes/upload-profile-pic`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('user', JSON.stringify({ ...user, profilePic: data.profilePic }));
        alert('Profile picture updated!');
        navigate('/profile');
      } else {
        alert(data.message || 'Upload failed.');
      }
    } catch (err) {
      alert('Error uploading image.');
    } finally {
      setUploading(false);
    }
  };

  const handleResetToDefault = async () => {
    setUploading(true);

    try {
      const res = await fetch('http://localhost:1000/api/userRoutes/upload-profile-pic', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ profilePic: DEFAULT_AVATAR }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('user', JSON.stringify({ ...user, profilePic: DEFAULT_AVATAR }));
        alert('Profile picture reset to default.');
        navigate('/profile');
      } else {
        alert(data.message || 'Reset failed.');
      }
    } catch (err) {
      alert('Error resetting image.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="edit-profile-container">
      <SidebarMenu 
        profile={user}
        sidebarOpen={sidebarOpen}
        onToggle={toggleMenu}
      />
      <div className="edit-profile-card">
        <h1 className="edit-profile-title">Edit Profile Picture</h1>

        <img
          src={preview}
          alt="Preview"
          className="profile-pic-preview"
        />

        <label htmlFor="fileUpload" className="file-label">Choose New Picture</label>
        <input
          type="file"
          id="fileUpload"
          accept="image/*"
          onChange={handleFileChange}
          className="file-input"
        />

        <button
          onClick={handleUpload}
          disabled={uploading}
          className="upload-button"
        >
          {uploading ? 'Uploading...' : 'Save'}
        </button>

        <button
          onClick={handleResetToDefault}
          className='reset-button'
        >
          Reset to Default
        </button>

        <button
          onClick={() => navigate('/profile')}
          className='cancel-button'
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditProfile;
