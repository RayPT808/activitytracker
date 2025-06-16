import React from 'react';
import Navbar from '../components/Navbar'; 
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Layout = ({ children }) => {
    return (
        <>
            <Navbar />
            <div className="container mt-5 pt-5">
                {children}
            </div>
            <ToastContainer position="top-right" autoClose={3000} />
        </>
    );
};

export default Layout;
