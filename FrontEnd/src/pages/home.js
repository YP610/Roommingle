import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './home.css'; // ensure styles from home.html are ported here
import { sendMatchRequest } from '../api/users';
import { defaultAvatar } from "../config"; // adjust path if needed

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
      <div className="container-fluid">

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
          }}
        >
          Log Out
        </button>
        </div>
      </div>

          {/* Feed Container */}
          {/* 
          <div className="container-fluid" id="feedContainer">
              {error && <p className="error-text">{error}</p>}
              {roommates.map(rm => (
                  <div className="row">
                      <div className="col-1 col-sm-2 col-xl-3">
                      </div>
                      <div className="col-10 col-sm-8 col-xl-6">
                          <div className="tile" key={rm._id}>
                              <div className="tile-content">
                                  <p className="username">{rm.name}</p>
                                  <img
                                      src={rm.profilePic || defaultAvatar}
                                      alt="Content"
                                      className="content-pic"
                                  />
                                  {rm.bio && <p className="caption">{rm.bio}</p>}
                                  <button onClick={() => handleSendRequest(rm._id)} className="px-4 py-2 bg-blue-600 text-white rounded">Send Match Request</button>
                              </div>
                          </div>
                      </div>
                      <div className="col-1 col-sm-2 col-xl-3">
                      </div>
                  </div>
              ))}
          </div>
          */}

      <div className="container-fluid" id="feedContainer">
        {error && <p className="error-text">{error}</p>}
            {roommates.map(rm => (
                <div className="row mt-1 mt-sm-3">
                    <div className="col-sm-1 col-md-2 col-lg-3">
                    </div>
                    <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-6">
                        <div className="container-fluid">
                            <div className="row mb-1">
                                <div className="col-1">
                                </div>
                                <div className="col-5">
                                    <button className="btn center w-100 btn-danger">
                                        X
                                    </button>
                                </div>
                                <div className="col-5">
                                    <button onClick={() => handleSendRequest(rm._id)} className="btn center w-100 btn-success">
                                        ✓
                                    </button>
                                </div>
                                <div className="col-1">
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-1">
                                    <button className="carousel-control-prev ms-sm-5" type="button" data-bs-target="#recommended" data-bs-slide="prev">
                                        <span className="carousel-control-prev-icon p-md-5 bg-dark rounded-5" aria-hidden="true"></span>
                                        <span className="visually-hidden">Previous</span>
                                    </button>
                                </div>
                                <div className="col-10">
                                    <div id="recommended" className="carousel slide" key={rm._id}>
                                        <div className="carousel-inner">
                                            <div className="carousel-item active rounded-5">
                                                <div className="container bg-light rounded-5" style={{ height: "800px" }}>
                                                    <div className="row">
                                                        <img
                                                            src={rm.profilePic || defaultAvatar}
                                                            alt="Content"
                                                            className="img-fluid rounded-5 mt-2 h-50"
                                                        />
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-12">
                                                            <h1 className="text-left ms-3 mt-1 fw-bolder text-dark">
                                                                {rm.name}, {rm.livingConditions.major}
                                                            </h1>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-12">
                                                            {rm.bio && <p className="text-left ms-1 mt-1 text-dark">{rm.bio}</p>}
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>
                                            <div className="carousel-item rounded-5">
                                                <div className="container bg-light rounded-5" style={{ height: "800px" }}>
                                                    <div className="row">
                                                        <h1 className="fw-bolder text-center">
                                                            About {rm.name}, This slide probably needs redoing.
                                                        </h1>
                                                    </div>
                                                    <div className="row">
                                                        <h3 className="fw-bolder text-center">
                                                            Sleep Attitude IMG : {rm.livingConditions.sleep_attitude}
                                                        </h3>
                                                    </div>
                                                    <div className="row">
                                                        <h3 className="fw-bolder text-center">
                                                            Major : {rm.livingConditions.major}
                                                        </h3>
                                                    </div>
                                                    <div className="row">
                                                        <div className="accordion mt-2" id="ProfQuestions">
                                                            <div className="accordion-item">
                                                                <h2 className="accordion-header">
                                                                    <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                                                        Prof Question#1
                                                                    </button>
                                                                </h2>
                                                                <div id="collapseOne" className="accordion-collapse collapse show" data-bs-parent="#ProfQuestions">
                                                                    <div className="accordion-body">
                                                                        Response to Q1
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="accordion-item">
                                                                <h2 className="accordion-header">
                                                                    <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                                                        Prof Question#2
                                                                    </button>
                                                                </h2>
                                                                <div id="collapseTwo" className="accordion-collapse collapse show" data-bs-parent="#ProfQuestions">
                                                                    <div className="accordion-body">
                                                                        Response to Q2
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="accordion-item">
                                                                <h2 className="accordion-header">
                                                                    <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                                                        Prof Question#3
                                                                    </button>
                                                                </h2>
                                                                <div id="collapseThree" className="accordion-collapse collapse show" data-bs-parent="#ProfQuestions">
                                                                    <div className="accordion-body">
                                                                        Response to Q3
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="accordion-item">
                                                                <h2 className="accordion-header">
                                                                    <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                                                                        Prof Question#4
                                                                    </button>
                                                                </h2>
                                                                <div id="collapseFour" className="accordion-collapse collapse show" data-bs-parent="#ProfQuestions">
                                                                    <div className="accordion-body">
                                                                        Response to Q4
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="accordion-item">
                                                                <h2 className="accordion-header">
                                                                    <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFive" aria-expanded="false" aria-controls="collapseFive">
                                                                        Prof Question#5
                                                                    </button>
                                                                </h2>
                                                                <div id="collapseFive" className="accordion-collapse collapse show" data-bs-parent="#ProfQuestions">
                                                                    <div className="accordion-body">
                                                                        Response to Q5
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-1">
                                    <button className="carousel-control-next me-sm-5" type="button" data-bs-target="#recommended" data-bs-slide="next">
                                        <span className="carousel-control-next-icon p-md-5 bg-dark rounded-5" aria-hidden="true"></span>
                                        <span className="visually-hidden">Next</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
      </div>
   </div>
  );
}

export default Home;