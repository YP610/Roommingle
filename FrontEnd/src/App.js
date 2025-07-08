import { BrowserRouter, Routes, Route} from 'react-router-dom';
import Login from './pages/auth/login';
import SignUp from './pages/auth/signup';
import Survey from './pages/survey';
import Home from './pages/home';
import ProfilePage from './pages/profile';
import EditProfile from './pages/editprofile';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/survey" element={<Survey />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/edit-profile" element={<EditProfile />} />
      </Routes>
      
    </div>
    
  );
}

export default App;
