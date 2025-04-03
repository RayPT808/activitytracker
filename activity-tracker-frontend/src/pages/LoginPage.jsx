import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from "../context/UserContext"; 
import Layout from '../components/Layout';
import { login } from '../api/authApi';



const LoginPage = () => {
  const { setUser } = useUser();
  // Set document title as in Django's {% block title %}
  useEffect(() => {
    document.title = "Login";
  }, []);

  // State for form inputs and errors
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Handle changes for controlled inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '', 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = await login(formData); 
      localStorage.setItem("authToken", userData.access);
      localStorage.setItem("refreshToken", userData.refresh);
  
      setUser({ isAuthenticated: true }); 
      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
    }
  };


  return (
    <Layout>
      <div className="container">
        <h2>Login</h2>
        {errors.general && <p style={{ color: 'red' }}>{errors.general}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              className="form-control"
              id="username"
              name="username"
              required
              value={formData.username}
              onChange={handleChange}
            />
            {errors.username && <p style={{ color: 'red' }}>{errors.username}</p>}
          </div>
          <div className="form-group mb-3">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}
          </div>
          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </Layout>
  );
};




export default LoginPage;
