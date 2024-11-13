import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Components
import SignIn from './components/auth/signin';
import SignUp from './components/auth/signup';
import {Tasks} from './components/task';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleSignIn = () => {
    // Perform authentication logic here
    setIsAuthenticated(true);
  };

  const handleSignUp = () => {
    // Perform registration logic here
    setIsAuthenticated(true);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/tasks" /> : <SignIn onSignIn={handleSignIn} />} />
        <Route path="/signup" element={isAuthenticated ? <Navigate to="/tasks" /> : <SignUp onSignUp={handleSignUp} />} />
        <Route path="/tasks" element={isAuthenticated ? <Tasks /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;