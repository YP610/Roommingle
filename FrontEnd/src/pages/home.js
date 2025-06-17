import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './home.css'; // ensure styles from home.html are ported here


const Home = () => {
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


   fetch(`http://localhost:1000/api/userRoutes/recs/${userId}`, {
     headers: {
       'Accept':        'application/json',
       'Authorization': `Bearer ${token}`
     }
   })
     .then(res => {
       if (!res.ok) throw new Error(res.statusText);
       return res.json();
     })
     .then(data => setRoommates(data))
     .catch(() => setError('Could not load roommates.'));
 }, [navigate]);


 const toggleMenu = () => setSidebarOpen(o => !o);


 return (
   <div className="home-wrapper">
     {/* Menu Button */}
     <button className="menu-button" onClick={toggleMenu}>☰</button>


     {/* Sidebar Overlay */}
     <div className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`} id="sidebar">
       <div className="sidebar-logo">ROOMMINGLE</div>
       <div className="sidebar-content">
         <img
           src={roommates[0]?.profilePic || 'https://via.placeholder.com/80'}
           alt="Profile Picture"
           className="profile-pic"
         />
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
           </div>
         </div>
       ))}
     </div>
   </div>
 );
}


export default Home;