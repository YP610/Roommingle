export async function sendMatchRequest(targetUserId) {
   const token = localStorage.getItem('token');
   const res = await fetch(
       `http://localhost:1000/api/userRoutes/${targetUserId}/request`,
       {
           method: 'POST',
           headers: { Authorization: `Bearer ${token}` }
       }
   );
   if(!res.ok) {
       const err = await res.json();
       throw new Error(err.error || 'Request failed');
   }
   return res.json();
}


export async function respondMatchRequest(fromUserId, action) {
   const token = localStorage.getItem('token');
   const res = await fetch(
       `http://localhost:1000/api/userRoutes/${fromUserId}/respond`,
       {
           method: 'POST',
           headers: {
               'Content-Type': 'application/json',
               Authorization: `Bearer ${token}`
           },
           body: JSON.stringify({ action })
       }
   );
   if(!res.ok) {
       const err = await res.json();
       throw new Error(err.error || 'Response failed');
   }
   return res.json();
}
