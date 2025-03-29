import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import '../css/register.css'; // Ensure your CSS is imported

const RegisterPage = () => {
  // Set the document title similar to Django's {% block title %}
  useEffect(() => {
    document.title = "Register - Activity Tracker";
  }, []);

  // State to handle form data
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password1: '',
    password2: ''
  });

  // State to handle potential form errors (if needed)
  const [errors, setErrors] = useState({});

  // State to manage password visibility toggles
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  // Handle input value changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Toggle visibility for the first password field
  const togglePassword1 = () => {
    setShowPassword1(prev => !prev);
  };

  // Toggle visibility for the confirm password field
  const togglePassword2 = () => {
    setShowPassword2(prev => !prev);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic client-side validation: Check if passwords match
    if (formData.password1 !== formData.password2) {
      alert('Passwords do not match!');
      return;
    }

    // Here you would typically send formData to your backend API 
    // for registration (via fetch, axios, etc.).
    console.log("Submitting registration:", formData);

    // Optionally clear the form or show a success message
  };

  return (
    <Layout>
      <div className="container mt-4">
        <h2 className="mb-4 text-center">Create an Account</h2>
        <form onSubmit={handleSubmit} className="needs-validation register-form" noValidate>
          <div className="form-group mb-3">
            <label htmlFor="id_username" className="form-label">Username</label>
            <input
              type="text"
              className="form-control"
              id="id_username"
              name="username"
              required
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
            />
            {errors.username && <div className="text-danger">{errors.username}</div>}
          </div>

          <div className="form-group mb-3">
            <label htmlFor="id_email" className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              id="id_email"
              name="email"
              required
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <div className="text-danger">{errors.email}</div>}
          </div>

          <div className="form-group mb-3">
            <label htmlFor="id_password1" className="form-label">Password</label>
            <div className="input-group">
              <input
                type={showPassword1 ? "text" : "password"}
                className="form-control"
                id="id_password1"
                name="password1"
                required
                placeholder="Enter a password"
                value={formData.password1}
                onChange={handleChange}
              />
              <span
                className="input-group-text"
                id="togglePassword1"
                style={{ cursor: "pointer" }}
                onClick={togglePassword1}
              >
                <i className={`fas ${showPassword1 ? "fa-eye-slash" : "fa-eye"}`}></i>
              </span>
            </div>
            {errors.password1 && <div className="text-danger">{errors.password1}</div>}
          </div>

          <div className="form-group mb-3">
            <label htmlFor="id_password2" className="form-label">Confirm Password</label>
            <div className="input-group">
              <input
                type={showPassword2 ? "text" : "password"}
                className="form-control"
                id="id_password2"
                name="password2"
                required
                placeholder="Confirm your password"
                value={formData.password2}
                onChange={handleChange}
              />
              <span
                className="input-group-text"
                id="togglePassword2"
                style={{ cursor: "pointer" }}
                onClick={togglePassword2}
              >
                <i className={`fas ${showPassword2 ? "fa-eye-slash" : "fa-eye"}`}></i>
              </span>
            </div>
            {errors.password2 && <div className="text-danger">{errors.password2}</div>}
          </div>

          <button type="submit" className="btn btn-primary w-100 mt-3">Register</button>
        </form>
      </div>

      {/* Optionally, if needed, you could load the Font Awesome script in index.html.
          It is shown here as per your original template. */}
      <script src="https://kit.fontawesome.com/a076d05399.js"></script>
    </Layout>
  );
};

export default RegisterPage;
