import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Components
import SignIn from './components/auth/signin';
import SignUp from './components/auth/signup';
import {Tasks} from './components/task';
import { Alert } from '@mui/material';
const rootUrl = process.env.REACT_APP_SERVER_URL;

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [userId, setUserId] = useState(null)

  const handleSignIn = async (signInFormData: {username: string, password: string}) => {
    // Perform authentication logic here
    fetch(`${rootUrl}/user/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(signInFormData)
    })
    .then(response => response.json())
    .then(() => setIsAuthenticated(true))
    .catch(() => {
      setErrorMessage('Error signing in, please try again or use different credentials')
    });
  };

  const handleSignUp = (signUpFormData: {
    username: string,
    password: string,
    confirmPassword: string
  }) => {
    // Perform authentication logic here
    fetch(`${rootUrl}/user/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(signUpFormData)
    })
    .then(response => response.json())
    .then(data => {
      setUserId(data.id)
      setIsAuthenticated(true);
      setErrorMessage("");
    })
    .catch(() => {
      setErrorMessage('Error signing up, please try again later or use different credentials')
    });
  };

  return (
    <>
      {errorMessage && <Alert severity='error'>{errorMessage}</Alert>}
      <Router>
        <Routes>
          <Route path="/" element={isAuthenticated ? <Navigate to="/tasks" /> : <SignIn onSignIn={handleSignIn} />} />
          <Route path="/signup" element={isAuthenticated ? <Navigate to="/tasks" /> : <SignUp onSignUp={handleSignUp} />} />
          <Route path="/tasks" element={isAuthenticated ? <Tasks userId={userId || ""} /> : <Navigate to="/" />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;