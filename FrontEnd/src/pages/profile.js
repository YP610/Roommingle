import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './profilecss.css'; // import your CSS or Tailwind styles


const ProfilePage = () => {
 const navigate = useNavigate();
 const [roommates, setRoommates] = useState([]);
 const [error, setError] = useState('');


 useEffect(() => {
   const token = localStorage.getItem('token');
   const stored = JSON.parse(localStorage.getItem('user') || '{}');
   const userId = stored._id;
   if (!token || !userId) {
     navigate('/signup');
     return;
   }


   fetch(`http://localhost:1000/api/userRoutes/recs/${userId}`, {
     headers: {
       'Accept': 'application/json',
       'Authorization': `Bearer ${token}`
     }
   })
     .then(res => {
       if (!res.ok) throw new Error(res.statusText);
       return res.json();
     })
     .then(data => setRoommates(data))
     .catch(() => setError('Could not load matches.'));
 }, [navigate]);


 // Placeholder navigate to edit profile
 const handleEdit = () => navigate('/edit-profile');


 return (
   <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
     {/* Container */}
     <div className="w-full max-w-3xl bg-white rounded-lg shadow-md p-8">
       {/* Header Section */}
       <div className="flex flex-col items-center mb-12">
         {/* Profile Photo */}
         <div className="w-32 h-32 rounded-full bg-gray-300 overflow-hidden mb-6 flex items-center justify-center">
           {/* <img src={profile.photoUrl} alt="Profile" className="w-full h-full object-cover" /> */}
         </div>


         {/* Name & Bio Space */}
         <h1 className="text-4xl font-bold mb-4 text-center">Username</h1>
         <div className="h-32 w-full max-w-md mb-6 flex items-center justify-center">
           {/* blank space for bio, year, contacts */}
         </div>


         {/* Edit Button */}
         <button
           className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
           onClick={handleEdit}
         >
           Edit Profile
         </button>
       </div>


       {/* Divider */}
       <hr className="mb-8" />


       {/* Matches Grid */}
       <section>
         <h2 className="text-2xl font-semibold mb-6 text-center">Matches</h2>
         {error ? (
           <p className="text-red-600 text-center">{error}</p>
         ) : (
           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-items-center">
             {roommates.map(rm => (
               <div
                 key={rm._id}
                 className="bg-white rounded-lg shadow p-6 text-center w-full max-w-xs flex flex-col items-center"
               >
                 <div>
                  <div className="w-24 h-24 mb-2 flex items-center justify-center">
  {rm.profilePic ? (
    <img
      src={rm.profilePic}
      alt={rm.name}
      className="match-profile-pic"
    />
  ) : (
    <div className="match-fallback-pic">
      <span className="initials">{rm.name?.toUpperCase()}</span>
    </div>
  )}
</div>

                 </div>
                 <p className="font-medium text-lg mb-2">{rm.name}</p>
                 {/* optional bio snippet */}
               </div>
             ))}
             {roommates.length === 0 && (
               <p className="text-gray-500 col-span-full text-center">No matches yet.</p>
             )}
           </div>
         )}
       </section>
     </div>
   </div>
 );
}


export default ProfilePage;