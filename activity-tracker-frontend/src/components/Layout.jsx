import React from 'react';
import Navbar from '../components/Navbar'; 

const Layout = ({ children }) => {
    return (
        <>
            <Navbar />
            <div className="container mt-5 pt-5">
                {children}
            </div>
        </>
    );
};

export default Layout;
