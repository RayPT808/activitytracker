import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import axiosInstance from '../api/axiosInstance';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProfilePage = () => {
  const [user, setUser] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
  });

  const [loading, setLoading] = useState(true); // 👈 new loading state

  useEffect(() => {
    document.title = "User Profile - Activity Tracker";

    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get('/api/profile/');
        setUser(response.data);
      } catch (error) {
        console.error("Failed to load profile:", error.response?.data || error.message);
      } finally {
        setLoading(false); // ✅ stop loading after fetch
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUser(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.put('/api/profile/', user);
      console.log("Profile updated successfully:", response.data);
      toast.success("✅ Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile:", error.response?.data || error.message);
      alert("Update failed. Check console for details.");
    }
  };

  return (
    <Layout>
      <div className="container mt-4">
        <h2 className="mb-4 text-center">User Profile</h2>

        {loading ? (
          // ✅ Spinner or loading message
          <div className="text-center mt-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading profile...</p>
          </div>
        ) : (
          <form onSubmit={handleUpdateProfile} className="profile-form">
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
        )}
      </div>
    </Layout>
  );
};

export default ProfilePage;
