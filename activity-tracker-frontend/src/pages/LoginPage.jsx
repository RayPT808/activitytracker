
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from "../context/UserContext";
import Layout from '../components/Layout';
import { login } from '../api/authApi';

const LoginPage = () => {
  const { setUser } = useUser();

  useEffect(() => {
    document.title = "Login";
  }, []);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
      general: ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = "Username is required.";
    if (!formData.password.trim()) newErrors.password = "Password is required.";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsLoading(true);
      const userData = await login(formData);
      localStorage.setItem("authToken", userData.access);
      localStorage.setItem("refreshToken", userData.refresh);
      setUser({ isAuthenticated: true });
      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
      if (err.response && err.response.status === 401) {
        setErrors({ general: "❌ Invalid username or password." });
      } else {
        setErrors({ general: "Something went wrong. Please try again." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container">
        <h2>Login</h2>
        {errors.general && <p style={{ color: 'red' }}>{errors.general}</p>}
        <form onSubmit={handleSubmit}>
          {/* Username */}
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

          {/* Password */}
          <div className="form-group mb-3 position-relative">
            <label htmlFor="password">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              className="form-control pe-5"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <i
              className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                top: '50%',
                right: '12px',
                transform: 'translateY(-50%)',
                cursor: 'pointer',
                color: '#6c757d',
              }}
            ></i>
          </div>

          {/* Submit */}
          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default LoginPage;