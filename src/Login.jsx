import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';
import './Login.css';

const Login = ({ onLogin }) => {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (mode === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      onLogin();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      className="login-background"
      style={{
        minHeight: '50vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <form onSubmit={handleSubmit} className="login-form">
        <h2 style={{color: '#006400'}}>
          {mode === 'login'
            ? 'Log in to send your handwritten letters'
            : 'Sign up to start sending your handwritten letters'}
        </h2>

        {/* Image + Inputs side by side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          {/*<img
            src="/heart-envelope.png"
            alt="Envelope sealed with a heart"
            style={{ width: '60px', height: 'auto' }}
          />*/}
          <div style={{ flexGrow: 1 }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ marginBottom: '0.5rem' }}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <button type="submit">{mode === 'login' ? 'Log In' : 'Create Account'}</button>

        <p className="toggle-mode" style={{ marginTop: '1rem' }}>
          {mode === 'login' ? (
            <>
              Don't have an account?{' '}
              <button type="button" onClick={() => setMode('signup')}>
                Sign Up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button type="button" onClick={() => setMode('login')}>
                Log In
              </button>
            </>
          )}
        </p>

        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
};

export default Login;
