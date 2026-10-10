import React, { useState } from 'react';
import LoginAnimation from './LoginAnimation';
import StudentDashboard from './StudentDashboard';
// Agar aapke paas AdminDashboard ya aur bhi components hain, toh unhe yahan import karein
// import AdminDashboard from './AdminDashboard'; 

function App() {
  // User state: Agar null hai toh login page dikhega, agar user hai toh dashboard
  const [user, setUser] = useState(null);

  // Login hone par yeh function chalega
  const handleLogin = (userData) => {
    setUser(userData);
    console.log("User logged in:", userData);
  };

  // Logout hone par yeh function chalega
  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div className="font-sans">
      {user ? (
        // Agar user logged in hai, toh Dashboard dikhao
        <StudentDashboard user={user} onLogout={handleLogout} />
      ) : (
        // Agar user logged in nahi hai, toh Login page dikhao
        <LoginAnimation onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;