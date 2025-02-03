import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import SignUp from "./components/Register";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { auth } from "./components/Firebase";
import StockDropdown from './components/Dropdown.jsx';
import DurationSelector from './components/DurationSelector';
import StockGraph from './components/StockGraph';
import { Container, Box, Paper, Typography, Button } from '@mui/material';
import { signOut } from 'firebase/auth';

function AuthenticatedApp() {
  const [duration, setDuration] = useState('1y');

  // Function to handle user logout
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        // Redirect to login page or home page after logout
        window.location.href = '/login';  // You can also use navigate() from react-router-dom
      })
      .catch((error) => {
        console.error("Error during logout:", error.message);
      });
  };

  return (
    <Container maxWidth="lg">
      <Paper
        elevation={3}
        sx={{
          p: 3,
          mt: 4,
          borderRadius: 3,
          background: '#f8f9fa',
          textAlign: 'center',
        }}
      >
        <Typography variant="h4" gutterBottom>
          📈 Stock Data Viewer
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" mb={3}>
          Select a stock and duration to visualize its performance
        </Typography>

        {/* Stock Selection Dropdown */}
        <Box mb={3}>
          <StockDropdown />
        </Box>

        {/* Duration Selector */}
        <Box mb={3}>
          <DurationSelector duration={duration} onDurationChange={setDuration} />
        </Box>

        {/* Stock Graph */}
        <Box>
          <StockGraph duration={duration} />
        </Box>

        {/* Logout Button */}
        <Box mt={3}>
          <Button 
            variant="contained" 
            color="secondary" 
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

function App() {
  const [user, setUser] = useState(null); // Initialize user state

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <div className="App">
        <div className="auth-wrapper">
          <div className="auth-inner">
            <Routes>
              <Route
                path="/"
                element={user ? <Navigate to="/dashboard" /> : <Login />}
              />
              <Route
                path="/login"
                element={user ? <Navigate to="/dashboard" /> : <Login />}
              />
              <Route
                path="/register"
                element={user ? <Navigate to="/dashboard" /> : <SignUp />}
              />
              <Route
                path="/dashboard"
                element={user ? <AuthenticatedApp /> : <Navigate to="/login" />}
              />
            </Routes>
            <ToastContainer />
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
