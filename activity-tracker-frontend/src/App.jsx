import React from 'react';
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import Register from "./components/Register";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage"; 
import DashboardPage from "./pages/DashboardPage";
import ActivityForm from "./components/ActivityForm";
import Layout from './components/Layout';
import NotFoundPage from "./pages/NotFoundPage"; 

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
            <Route path="/add-activity" element={<Layout><ActivityForm isEdit={false} /></Layout>}/>
            <Route path="/edit-activity/:id" element={<Layout><ActivityForm isEdit={true} /></Layout>}/>
            {/* Optional isolated 404 route */}
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
};

export default App;
