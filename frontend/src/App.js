import React, { useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { logout } from './components/services/authService';

const App = () => {
  const [user, setUser] = useState(null);

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {user ? (
        <Dashboard user={user} onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;