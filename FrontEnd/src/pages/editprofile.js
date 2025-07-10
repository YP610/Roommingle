import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './editprofile.css'; // ✅ make sure this CSS file exists

const EditProfile = () => {
  const navigate = useNavigate();
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [user] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
  const DEFAULT_AVATAR = 'https://res.cloudinary.com/<YOUR_CLOUD_NAME>/image/upload/v1234567890/roommingle_profiles/default_avatar.png';

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

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg text-center">
        <h1 className="text-2xl font-semibold mb-4">Edit Profile Picture</h1>
        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="profile-pic-preview"
          />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mb-4"
        />
        <div>
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
