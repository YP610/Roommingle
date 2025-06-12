import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();



    const handleSignUp = async () => {
        setError('');

        if (password !== confirmPassword) {
            setError("Passwords don't match.");

            return;
        }
        navigate('/survey', { state: { email, password } });
    };


    return (
    <div className="login-container">
      <h2>Create Account</h2>
      <p className="subheading">Sign up to get started</p>

      <form onSubmit={handleSignUp}>
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
          placeholder="Create a Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />

        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          placeholder="Confirm your Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <br />

        <button type="submit" className="login-button">Sign Up</button>
        {error && <p id="loginMessage" style={{ color: 'red' }}>{error}</p>}
      </form>

      <p className="signup-prompt">Already have an account?</p>
      <button onClick={() => navigate('/login')} className="signup-button">Log In</button>
    </div>
  );
};


export default SignUp;