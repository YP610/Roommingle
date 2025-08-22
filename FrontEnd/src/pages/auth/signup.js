import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './login.module.css'

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isChecking, setIsChecking] = useState(false);
    const navigate = useNavigate();


    const checkEmailAvailability = async () => {
      setIsChecking(true);
      try {
        const response = await fetch('http://localhost:1000/api/userRoutes/check-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email })
        });

        const data = await response.json();
         if (data.exists) {
          setError('Email already exists. Please use a different email.');
          return false;
         }
         return true
      } catch (err) {
        setError('Error checking email availability. Please try again.')
        return false;
      } finally {
        setIsChecking(false);
      }
    };


    const handleSignUp = async (e) => {
      e.preventDefault();
        setError('');

        if (!email || !password || !confirmPassword) {
          setError('Please fill in all fields');
          return;
        }

        if (password !== confirmPassword) {
            setError("Passwords don't match.");
            return;
        }

        const isEmailAvailable = await checkEmailAvailability();
        if (!isEmailAvailable) return;
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