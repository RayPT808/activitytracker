import React, { useState } from 'react';
import './ActivityForm.css';
import axiosInstance from '../api/axiosInstance';

const ActivityForm = ({ onActivityAdded }) => {
  const [formData, setFormData] = useState({
    activity_type: '',
    activity_name: '',
    hours: '0',
    minutes: '0',
    seconds: '0',
    date: '',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const today = new Date().toISOString().split('T')[0];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage("");

    const { hours, minutes, seconds, ...rest } = formData;
    const duration =
      parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds);

    // Disallow future dates
    if (formData.date > today) {
      setError("You can't add activities in the future.");
      setLoading(false);
      return;
    }

    const payload = {
      ...rest,
      duration,
    };

    try {
      const response = await axiosInstance.post('/api/activities/', payload);
      console.log('Activity saved:', response.data);

      if (onActivityAdded) {
        onActivityAdded(response.data);
      }

      setSuccessMessage("✅ Activity saved successfully!");

      setFormData({
        activity_type: '',
        activity_name: '',
        hours: '0',
        minutes: '0',
        seconds: '0',
        date: '',
        notes: '',
      });
    } catch (err) {
      console.error('Error saving activity:', err);
      setError('There was an error saving the activity. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="activity-form" onSubmit={handleSubmit}>
      <h2>Add Activity</h2>
      {error && <div className="error-message text-danger mb-3">{error}</div>}
      {successMessage && <div className="alert alert-success mb-3">{successMessage}</div>}


      <div className="form-group mb-3">
        <label htmlFor="activity_type">Activity Type</label>
        <select
          className="form-select"
          id="activity_type"
          name="activity_type"
          value={formData.activity_type}
          onChange={handleChange}
          required
        >
          <option value="">-- Select Activity --</option>
          <option value="walking">Walking</option>
          <option value="running">Running</option>
          <option value="hiking">Hiking</option>
          <option value="cycling">Cycling</option>
          <option value="swimming">Swimming</option>
          <option value="gym">Gym</option>
          <option value="crossfit">CrossFit</option>
          <option value="yoga">Yoga</option>
          <option value="dancing">Dancing</option>
        </select>
      </div>

      <div className="form-group mb-3">
        <label htmlFor="activity_name">Activity Name</label>
        <input
          type="text"
          className="form-control"
          id="activity_name"
          name="activity_name"
          value={formData.activity_name}
          onChange={handleChange}
          required
        />
      </div>

      <label>Duration</label>
      <div className="row mb-3">
        <div className="col">
          <select
            className="form-select"
            name="hours"
            value={formData.hours}
            onChange={handleChange}
          >
            {Array.from({ length: 24 }, (_, i) => (
              <option key={i} value={i}>{i} hr</option>
            ))}
          </select>
        </div>
        <div className="col">
          <select
            className="form-select"
            name="minutes"
            value={formData.minutes}
            onChange={handleChange}
          >
            {Array.from({ length: 60 }, (_, i) => (
              <option key={i} value={i}>{i} min</option>
            ))}
          </select>
        </div>
        <div className="col">
          <select
            className="form-select"
            name="seconds"
            value={formData.seconds}
            onChange={handleChange}
          >
            {Array.from({ length: 60 }, (_, i) => (
              <option key={i} value={i}>{i} sec</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group mb-3">
        <label htmlFor="date">Date</label>
        <input
          type="date"
          className="form-control"
          id="date"
          name="date"
          max={today}
          value={formData.date}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group mb-3">
        <label htmlFor="notes">Notes</label>
        <textarea
          className="form-control"
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
        ></textarea>
      </div>

      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? 'Saving...' : 'Save Activity'}
      </button>
    </form>
  );
};

export default ActivityForm;
