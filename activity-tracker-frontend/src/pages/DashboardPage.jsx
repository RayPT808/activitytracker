import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";

const DashboardPage = () => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    axiosInstance.get("/api/activities/")
      .then(res => setActivities(res.data))
      .catch(err => console.error("Failed to load activities", err));
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this activity?")) {
      axiosInstance.delete(`/api/activities/${id}/`)
        .then(() => setActivities(prev => prev.filter(act => act.id !== id)))
        .catch(err => console.error("Delete failed", err));
    }
  };

  return (
    <Layout>
      <div className="container mt-4">
        <h2>Your Activities</h2>
        <Link to="/add-activity" className="btn btn-primary mb-3">+ Add New Activity</Link>
        <ul className="list-group">
          {activities.map(activity => (
            <li key={activity.id} className="list-group-item">
              <strong>{activity.date}</strong> - {activity.activity_type} ({activity.duration})
              <div className="mt-2">
                <Link to={`/edit-activity/${activity.id}`} className="btn btn-sm btn-outline-primary me-2">Edit</Link>
                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(activity.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
};

export default DashboardPage;
