import React from 'react';
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import Register from "./components/Register";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage"; // ✅ Add this at the top
import DashboardPage from "./pages/DashboardPage"; // Import the DashboardPage component
import Layout from './components/Layout';
import NotFoundPage from "./pages/NotFoundPage"; // Optional 404 page

const App = () => {
    return (
        <Routes>
            {/* Wrap all main pages with Layout to include the Navbar */}
            <Route path="/" element={<Layout><HomePage /></Layout>} />
            <Route path="/about" element={<Layout><AboutPage /></Layout>} />
            <Route path="/register" element={<Layout><Register /></Layout>} />
            <Route path="/login" element={<Layout><LoginPage /></Layout>} />
            <Route path="/profile" element={<Layout><ProfilePage /></Layout>} />
            <Route path="/dashboard" element={<Layout><DashboardPage /></Layout>} />

            {/* Optional isolated 404 route */}
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
};

export default App;
