import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './login.module.css';


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Handler to redirect to sign up page
    const handleSignUp = () => {
        window.location.href = './signup';
    };
    
    const handleLogin = async e => {
        e.preventDefault(); 

        setError('');
        try{
            const res=await fetch('http://localhost:1000/api/auth/login',{
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body: JSON.stringify({email,password})
            });
            const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Login failed');

        // save token and user
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({
            _id: data._id,
            name: data.name,
            email: data.email
        }));

        console.log('✅ Logged in successfully:', data); // success message
        navigate('/home');
    } catch (err) {
        console.log("Trying to login with:", email, password);
        console.log('❌ Could not log in:', err.message); // error message
    }
};

    return (
    <div className={styles.wrapper}>
        <div className={styles.loginContainer}>
        <h2>Welcome Back</h2>
      <p className={styles.subheading}>Please log in to your account</p>

      <form id="loginForm" onSubmit={handleLogin}>
        <label htmlFor="email">Email</label>
        <input
          type="text"
          id="email"
          name="email"
          placeholder="Enter your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Enter your Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />


        <button type="submit" className={styles.loginButton}>Login</button>
        {error && <p id="loginMessage" style={{ color: 'red' }}>{error}</p>}
      </form>

      <p className={styles.signupPrompt}>Don’t have an account?</p>
      <button onClick={() => navigate('/signup')} className={styles.signupButton}>Create Account</button>
    </div>
    </div>
  );
};

export default Login;