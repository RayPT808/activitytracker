import { useUser } from "../context/UserContext"; // Import the useUser hook
import "../assets/css/navbar.css";
import axios from "axios";
import { useHistory } from "react-router-dom"; // For redirecting after logout

function Navbar() {
  const { user, setUser } = useUser(); // Access user data and setUser function
  const history = useHistory(); // Initialize useHistory hook for redirecting

  const handleLogout = () => {
    // Clear the auth token from localStorage
    localStorage.removeItem("authToken");
    setUser(null); // Clear user context

    // Redirect to login page
    history.push("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark fixed-top">
      <div className="container">
        <a className="navbar-brand" href="/">
          <img src="/assets/images/trackerlogo.jpg" alt="Logo" />
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
              <a className="nav-link" href="/dashboard">
                Dashboard
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/profile">
                Profile
              </a>
            </li>

            {/* Conditionally render Logout button if user is logged in */}
            {user ? (
              <li className="nav-item">
                <button
                  className="btn btn-link nav-link logout-button"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            ) : (
              // Optionally, show a login button if the user is not logged in
              <li className="nav-item">
                <a className="nav-link" href="/login">
                  Login
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
