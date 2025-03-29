import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

const UpdateActivity = () => {
  // Set document title on mount
  useEffect(() => {
    document.title = "Update Activity - Activity Tracker";
  }, []);

  const navigate = useNavigate();

  // State for the form fields; you might load these from an API in a real app.
  const [formData, setFormData] = useState({
    activity_type: '',
    activity_name: '',
    duration: '',
    date: '',
    notes: '',
  });

  // Update form values on change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission – replace with your actual API call
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data submitted:', formData);
    // TODO: Perform update activity API call here
    // After success, navigate back to the activity list
    navigate('/activity_list');
  };

  // Handle the cancel action by navigating back to the activity list
  const handleCancel = (e) => {
    e.preventDefault();
    navigate('/activity_list');
  };

  return (
    <Layout>
      <div className="container mt-4">
        <h2>Update Activity</h2>
        <form onSubmit={handleSubmit}>
          {/* Each form field is wrapped in a <p> tag to mimic Django's form.as_p */}
          <p>
            <label htmlFor="activity_type">Activity Type</label><br />
            <input
              type="text"
              id="activity_type"
              name="activity_type"
              className="form-control"
              value={formData.activity_type}
              onChange={handleChange}
              required
            />
          </p>
          <p>
            <label htmlFor="activity_name">Activity Name</label><br />
            <input
              type="text"
              id="activity_name"
              name="activity_name"
              className="form-control"
              value={formData.activity_name}
              onChange={handleChange}
              required
            />
          </p>
          <p>
            <label htmlFor="duration">Duration</label><br />
            <input
              type="number"
              id="duration"
              name="duration"
              className="form-control"
              value={formData.duration}
              onChange={handleChange}
              required
            />
          </p>
          <p>
            <label htmlFor="date">Date</label><br />
            <input
              type="date"
              id="date"
              name="date"
              className="form-control"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </p>
          <p>
            <label htmlFor="notes">Notes</label><br />
            <textarea
              id="notes"
              name="notes"
              className="form-control"
              value={formData.notes}
              onChange={handleChange}
            />
          </p>
          <button type="submit" className="btn btn-primary">
            Save Changes
          </button>
        </form>
        <a href="/activity_list" onClick={handleCancel} className="btn btn-link mt-2">
          Cancel
        </a>
      </div>
    </Layout>
  );
};

export default UpdateActivity;
