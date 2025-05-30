import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { Link } from "react-router-dom";

const DashboardPage = () => {
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [activityTypeFilter, setActivityTypeFilter] = useState("all");
  const [loading, setLoading] = useState(true);  
  const [error, setError] = useState(null);      

  useEffect(() => {
    axiosInstance.get("/api/activities/")
      .then(res => {
        setActivities(res.data);
        setFilteredActivities(res.data);
        setLoading(false);  
      })
      .catch(err => {
        console.error("Failed to load activities", err);
        setError("Failed to load activities.");
        setLoading(false);
      });
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

  
  if (loading) return <p>Loading activities...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Dashboard</h2>
      <label>Filter by type:</label>
      <select onChange={handleFilterChange} value={activityTypeFilter}>
        <option value="all">All</option>
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

      <ul>
        {filteredActivities.map((activity) => (
          <li key={activity.id}>
            {activity.activity_type} on {activity.date}
            <button onClick={() => handleDelete(activity.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DashboardPage;
