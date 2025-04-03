import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';

const ProfilePage = () => {
  // Set the document title similar to Django's block title
  useEffect(() => {
    document.title = "User Profile - Activity Tracker";
  }, []);

  // Replace this with your actual user data, for example from a context or API
  const initialUser = {
    username: "john_doe",
    email: "john@example.com",
    first_name: "John",
    last_name: "Doe",
  };

  const [user, setUser] = useState(initialUser);

  // Handle input changes in the form
  const handleChange = (event) => {
    const { name, value } = event.target;
    setUser(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Submit handler for updating the profile
  const handleSubmit = (event) => {
    event.preventDefault();
    // Implement your update logic here (e.g., call an API to update the user profile)
    console.log("Profile updated:", user);
    // Optionally show a success message or redirect
  };

  return (
    <Layout>
      <div className="container mt-4">
        <h2 className="mb-4 text-center">User Profile</h2>
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group mb-3">
            <label htmlFor="id_username" className="form-label">Username</label>
            <input
              type="text"
              className="form-control"
              id="id_username"
              name="username"
              value={user.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group mb-3">
            <label htmlFor="id_email" className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              id="id_email"
              name="email"
              value={user.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group mb-3">
            <label htmlFor="id_first_name" className="form-label">First Name</label>
            <input
              type="text"
              className="form-control"
              id="id_first_name"
              name="first_name"
              value={user.first_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group mb-3">
            <label htmlFor="id_last_name" className="form-label">Last Name</label>
            <input
              type="text"
              className="form-control"
              id="id_last_name"
              name="last_name"
              value={user.last_name}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 mt-3">
            Update
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default ProfilePage;
