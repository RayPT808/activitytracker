import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';

const DashboardPage = () => {
  // Set the document title similar to Django's {% block title %}
  useEffect(() => {
    document.title = 'Dashboard - Activity Tracker';
  }, []);

  // Local state for activities; in a real app, you'd fetch these from your backend
  const [activities, setActivities] = useState([]);

  // Local state for the form data
  const [formData, setFormData] = useState({
    activity_type: '',
    activity_name: '',
    duration: '',
    date: '',
    notes: '',
    file: null,
  });

  // Example: fetching activities (simulate API call)
  useEffect(() => {
    // Replace with your real data fetching logic
    const sampleActivities = [
      { id: 1, date: '2025-03-01', activity_type: 'Running', duration: 30, notes: 'Morning run' },
      { id: 2, date: '2025-03-02', activity_type: 'Cycling', duration: 45, notes: 'Evening cycle' },
    ];
    setActivities(sampleActivities);
  }, []);

  // Effect to scroll the activity log to the bottom when activities change
  useEffect(() => {
    const activityLog = document.getElementById("activity-log");
    if (activityLog) {
      activityLog.scrollTop = activityLog.scrollHeight;
    }
  }, [activities]);

  // Handle changes for form fields (text inputs and file input)
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prevData) => ({
        ...prevData,
        [name]: files[0],
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement submission logic (e.g., via API call)
    console.log('Submitting form with data:', formData);
    // Optionally, clear the form or update the activities list
  };

  return (
    <Layout>
      <div className="container mt-5">
        <h2 className="text-center title-adjust">Dashboard</h2>
        <div className="row">
          {/* Activity Log Section */}
          <div className="col-md-6">
            <h3>Past Activities</h3>
            <div id="activity-log" className="overflow-auto border rounded" style={{ maxHeight: '400px' }}>
              <ul className="list-group">
                {activities.map((activity) => (
                  <li key={activity.id} className="list-group-item">
                    <strong>{activity.date}</strong> - {activity.activity_type} for {activity.duration} minutes
                    <p>{activity.notes}</p>
                    <button className="btn btn-primary btn-sm" onClick={() => {/* Edit logic here */}}>
                      Edit
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => {/* Delete logic here */}}>
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Activity Form Section */}
          <div className="col-md-6">
            <h3>Add New Activity</h3>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="form-group">
                <label htmlFor="activity_type">Activity Type</label>
                <input
                  type="text"
                  className="form-control"
                  id="activity_type"
                  name="activity_type"
                  value={formData.activity_type}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="activity_name">Activity Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="activity_name"
                  name="activity_name"
                  value={formData.activity_name}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="duration">Duration</label>
                <input
                  type="number"
                  className="form-control"
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="date">Date</label>
                <input
                  type="date"
                  className="form-control"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="notes">Notes</label>
                <textarea
                  className="form-control"
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                ></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="file">File</label>
                <input
                  type="file"
                  className="form-control"
                  id="file"
                  name="file"
                  onChange={handleInputChange}
                />
              </div>

              {/* You can add display for validation errors here if needed */}

              <button type="submit" className="btn btn-primary mt-3">
                Add Activity
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;
