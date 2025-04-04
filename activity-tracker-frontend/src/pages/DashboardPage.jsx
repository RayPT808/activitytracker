import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";

const DashboardPage = () => {
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [activityTypeFilter, setActivityTypeFilter] = useState("all");

  useEffect(() => {
    axiosInstance.get("/api/activities/")
      .then(res => {
        setActivities(res.data);
        setFilteredActivities(res.data); // Initialize with all
      })
      .catch(err => console.error("Failed to load activities", err));
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this activity?")) {
      axiosInstance.delete(`/api/activities/${id}/`)
        .then(() => {
          const updated = activities.filter(act => act.id !== id);
          setActivities(updated);
          applyFilter(updated, activityTypeFilter);
        })
        .catch(err => console.error("Delete failed", err));
    }
  };

  const handleFilterChange = (e) => {
    const selectedType = e.target.value;
    setActivityTypeFilter(selectedType);
    applyFilter(activities, selectedType);
  };

  const applyFilter = (activityList, type) => {
    if (type === "all") {
      setFilteredActivities(activityList);
    } else {
      const filtered = activityList.filter(act => act.activity_type === type);
      setFilteredActivities(filtered);
    }
  };

  return (
    <Layout>
      <div className="container mt-4">
        <h2>Your Activities</h2>

        {/* Filter Dropdown */}
        <div className="mb-3">
          <label htmlFor="filter" className="form-label">Filter by Activity Type:</label>
          <select
            id="filter"
            className="form-select"
            value={activityTypeFilter}
            onChange={handleFilterChange}
          >
            <option value="all">All Activities</option>
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

        <Link to="/add-activity" className="btn btn-primary mb-3">+ Add New Activity</Link>

        <div
          className="scrollable-activity-log border rounded mb-3"
          style={{ maxHeight: '400px', overflowY: 'auto' }}
        >
          <ul className="list-group">
            {[...filteredActivities].reverse().map(activity => (
              <li key={activity.id} className="list-group-item">
                <strong>{activity.date}</strong> - {activity.activity_type} ({activity.duration})
                <div className="mt-2">
                  <Link to={`/edit-activity/${activity.id}`} className="btn btn-sm btn-outline-primary me-2">
                    Edit
                  </Link>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(activity.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;
