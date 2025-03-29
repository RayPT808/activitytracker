import { useUser } from "../context/UserContext"; // Import the useUser hook
import "../assets/css/navbar.css";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation in React Router v6

function Navbar() {
  const { user, setUser } = useUser(); // Access user data and setUser function
  const navigate = useNavigate(); // Initialize useNavigate hook for redirecting

  const handleLogout = () => {
    // Clear the auth token from localStorage
    localStorage.removeItem("authToken");
    setUser(null); // Clear user context

    // Redirect to login page using navigate
    navigate("/login");
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
            {user ? (
              <>
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
                <li className="nav-item">
                  <button
                    className="btn btn-link nav-link logout-button"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <a className="nav-link" href="/about">
                    About
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/register">
                    Register
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/login">
                    Login
                  </a>
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
