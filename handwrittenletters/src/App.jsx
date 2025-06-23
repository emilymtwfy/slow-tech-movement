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
        const existingTimestamp = localStorage.getItem('loginTimestamp');
        if (!existingTimestamp) {
          localStorage.setItem('loginTimestamp', Date.now().toString());
        }
      } else {
        localStorage.removeItem('loginTimestamp');
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const loginTimestamp = parseInt(localStorage.getItem('loginTimestamp'), 10);
      const now = Date.now();
      const maxSession = 30 * 60 * 1000; // 30 minutes

      if (loginTimestamp && now - loginTimestamp > maxSession) {
        signOut(auth)
          .then(() => {
            localStorage.removeItem('loginTimestamp');
            console.log('Auto-logged out after 2 hours');
          })
          .catch((error) => console.error('Auto logout error:', error));
      }
    }, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        localStorage.removeItem('loginTimestamp');
      });
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
