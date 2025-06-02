import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [roommates, setRoommates] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // If there's no toke in localStorage, redirect back to signup/login
    useEffect(() => {
        const token = localStorage.getItem('token');
        if(!token) {
            navigate('/signup');
        }
    }, [navigate]);

    // Fetch 'potential roommates" once, on mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        if(!token) return;
        fetch('http://localhost:1000/api/userRoutes/Algorithm/recs', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        })
        .then(res => {
            if (!res.ok) throw new Error('Failed to load roommates');
            return res.json();
        })
        .then(data => {
            // data should be an array of user objects
            setRoommates(data);
        })
        .catch(err => {
            console.error(err);
            setError('Could not load roommates. Try again later.');
        })
    }, []);

    return (
    <div className="min-h-screen bg-gray-100 py-8">
      <h2 className="text-3xl font-bold text-center mb-6">Your Potential Roommates</h2>

      {error && (
        <p className="text-red-600 text-center mb-4">{error}</p>
      )}

      {/* horizontally scrollable container */}
      <div className="overflow-x-auto px-4">
        <div className="flex space-x-6">
          {roommates.map(rm => (
            <div
              key={rm._id}
              className="min-w-[300px] bg-white rounded-lg shadow-md p-6 flex-shrink-0"
            >
              <h3 className="text-xl font-semibold mb-2">{rm.name}</h3>
              {rm.bio && (
                <p className="text-gray-600 mb-2">{rm.bio}</p>
              )}
              <ul className="text-sm text-gray-700 space-y-1 mb-3">
                <li><strong>Gender:</strong> {rm.gender}</li>
                <li>
                  <strong>Freshman:</strong> {rm.is_freshman === 'Freshman' ? 'Yes' : 'No'}
                </li>
                <li>
                  <strong>Cleanliness Score:</strong> {rm.livingConditions?.cleanliness_score ?? 'N/A'}
                </li>
                {/* add more fields as desired */}
              </ul>

              {/* Example “Contact” button (could be expanded) */}
              {rm.contact?.number && (
                <a
                  href={`tel:${rm.contact.number}`}
                  className="inline-block bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                >
                  Call
                </a>
              )}
            </div>
          ))}

          {/* Show a placeholder if no roommates are returned */}
          {roommates.length === 0 && !error && (
            <p className="text-gray-500">No matches found yet.</p>
          )}
        </div>
      </div>

      {/* Optional: a footer or “logout” button */}
      <div className="text-center mt-8">
        <button
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/signup');
          }}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Log Out
        </button>
      </div>
    </div>
  );
}

export default Home;