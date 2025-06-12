import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './login.module.css'

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
    <div className={styles.wrapper}>
      <div className={styles.loginContainer}>
      <h2>Create Account</h2>
      <p className={styles.subheading}>Sign up to get started</p>

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

        <button type="submit" className={styles.loginButton}>Sign Up</button>
        {error && <p id="loginMessage" style={{ color: 'red' }}>{error}</p>}
      </form>

      <p className={styles.signupPrompt}>Already have an account?</p>
      <button onClick={() => navigate('/')} className={styles.signupButton}>Log In</button>
    </div>
    </div>
  );
};


export default SignUp;