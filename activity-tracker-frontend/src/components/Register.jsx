import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../assets/css/register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = 'Username is required.';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Invalid email address.';
      }
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long.';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match!';
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    try {
      const BASE_URL = 'https://psychic-lamp-pj7rjp4jvgg7f7jxr-8000.app.github.dev';
      const payload = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      };

      const response = await axios.post(`${BASE_URL}/api/register/`, payload);
      alert('✅ Registration successful! Redirecting to login...');
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      if (error.response?.data) {
        setErrors(error.response.data.errors || { general: 'Registration failed.' });
      } else {
        setErrors({ general: 'Registration failed. Please try again.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      {errors.general && <p style={{ color: 'red' }}>{errors.general}</p>}

      <form onSubmit={handleSubmit} className="register-form">
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            name="username"
            className="form-control"
            value={formData.username}
            onChange={handleChange}
            required
          />
          {errors.username && <small className="text-danger">{errors.username}</small>}
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && <small className="text-danger">{errors.email}</small>}
        </div>

        <div className="form-group position-relative mb-3">
          <label htmlFor="password">Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            className="form-control pe-5"
            name="password"
            id="password"
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

        <div className="form-group position-relative mb-3">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type={showConfirm ? 'text' : 'password'}
            className="form-control pe-5"
            name="confirmPassword"
            id="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <i
            className={`bi ${showConfirm ? 'bi-eye-slash' : 'bi-eye'}`}
            onClick={() => setShowConfirm(!showConfirm)}
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


        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default Register;
