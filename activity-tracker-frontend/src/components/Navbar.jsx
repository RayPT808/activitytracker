import React from 'react';
import { useUser } from "../context/UserContext";
import { useNavigate, Link } from "react-router-dom";
import "../assets/css/navbar.css";

function Navbar() {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark fixed-top">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <img src="/assets/images/trackerlogo.jpg" alt="Logo" />
        </Link>
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
            {/* Always show About */}
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/about"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNav"
              >
                About
              </Link>
            </li>

            {/* Show based on auth state */}
            {user?.isAuthenticated ? (
              <>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/dashboard"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                  >
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/profile"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                  >
                    Profile
                  </Link>
                </li>
                <li className="nav-item">
                  <button
                    className="btn btn-link nav-link logout-button"
                    onClick={handleLogout}
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/register"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                  >
                    Register
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/login"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                  >
                    Login
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
