import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';

const LoginPage = () => {
  // Set document title as in Django's {% block title %}
  useEffect(() => {
    document.title = "Login";
  }, []);

  // State for form inputs
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  // Handle changes for controlled inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Place your API login logic here.
    console.log("Logging in with:", formData);
    // After a successful login, you might redirect or update global authentication state.
  };

  return (
    <Layout>
      <div className="container">
        <h2>Login</h2>
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
          </div>
          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default LoginPage;
