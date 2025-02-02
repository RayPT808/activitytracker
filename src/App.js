import React, { useEffect } from 'react'; // Import useEffect along with React
import { Routes, Route, useNavigate } from "react-router-dom";
import { useUser } from "./context/UserContext"; // Import the useUser hook
import Home from "./pages/Home";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";

function App() {
  const { user } = useUser(); // Access the current user
  const navigate = useNavigate(); // For programmatic navigation

  // Redirect to login page if user is not logged in and tries to access the dashboard
  useEffect(() => {
    if (!user) {
      navigate("/login"); // Redirect to login if no user is found
    }
  }, [user, navigate]);

  return (
    <>
      <Navbar />
      <Routes>
        {/* Define routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}

export default App;
