import React from 'react';

const Layout = ({ children }) => {
    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark fixed-top">
                <div className="container">
                    <a className="navbar-brand" href="/">
                    <img src="/images/trackerlogo.jpg" alt="Logo" />

                    </a>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <a className="nav-link" href="/dashboard">Dashboard</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/profile">Profile</a>
                            </li>
                            <li className="nav-item">
                                <form method="post" action="/logout" className="logout-form">
                                    <button
                                        type="submit"
                                        className="btn btn-link nav-link logout-button"
                                    >
                                        Logout
                                    </button>
                                </form>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/home">Home</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/about">About</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/login">Login</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/register">Register</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <div className="container mt-5 pt-5">
                {children}
            </div>
        </>
    );
};

export default Layout;
