import React, { useEffect, useState } from 'react';
import LetterForm from './components/LetterForm.jsx';
import Login from './Login.jsx';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        localStorage.setItem('lastLoginTime', Date.now().toString());
        startAutoLogoutTimer();
      }
    });
    return () => unsubscribe();
  }, []);

  const startAutoLogoutTimer = () => {
    setTimeout(() => {
      const lastLogin = parseInt(localStorage.getItem('lastLoginTime'), 10);
      const now = Date.now();
      if (now - lastLogin >= 30 * 60 * 1000) {
        signOut(auth);
      }
    }, 30 * 60 * 1000);
  };

  const handleLogout = () => {
    signOut(auth);
  };

  if (!user) {
    return (
      <div className="unauth-bg">
        <Login onLogin={() => setUser(auth.currentUser)} />
      </div>
    );
  }

  return (
    <div className="auth-bg">
      {/*<h1>Send a Handwritten Letter</h1>*/}

      <button
        onClick={handleLogout}
        style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          padding: '0.5rem 1rem',
          backgroundColor: 'black',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Log Out
      </button>

      <LetterForm />
    </div>
  );
}

export default App;
