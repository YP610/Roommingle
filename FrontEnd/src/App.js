import { BrowserRouter, Routes, Route} from 'react-router-dom';
import Login from './pages/auth/login';
import SignUp from './pages/auth/signup';
import Survey from './pages/survey';
import Home from './pages/home';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/survey" element={<Survey />} />
        <Route path="/home" element={<Home />} />
      </Routes>
      
    </div>
    
  );
}

export default App;
