import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../assets/css/register.css';


const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Validate the form fields
  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
    } else {
      // Basic email regex for validation.
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
    // Update form data.
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
    // Optionally clear errors for this field.
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: '',
    }));
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
      const response = await axios.post(
        'https://8000-raypt808-activitytracke-f1ujeofz1qb.ws-eu117.gitpod.io/api/register/',
        formData
      );
      // On successful registration, redirect to login.
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ general: 'Registration failed. Please try again.' });
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      {errors.general && <p style={{ color: 'red' }}>{errors.general}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          {errors.username && <p style={{ color: 'red' }}>{errors.username}</p>}
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}
        </div>
        <div>
          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          {errors.confirmPassword && <p style={{ color: 'red' }}>{errors.confirmPassword}</p>}
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default Register;

