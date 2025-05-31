
import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";

const DashboardPage = () => {
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [activityTypeFilter, setActivityTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axiosInstance.get("/api/activities/")
      .then(res => {
        setActivities(res.data);
        applyFilter(res.data, activityTypeFilter);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load activities", err);
        setError("Failed to load activities.");
        setLoading(false);
      });
  }, []);

  const convertDurationToSeconds = (durationStr) => {
    const [h, m, s] = durationStr.split(":").map(Number);
    return h * 3600 + m * 60 + s;
  };

  const formatTotalTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const applySorting = (activitiesToSort) => {
    const sorted = [...activitiesToSort].sort((a, b) => {
      if (sortBy === "duration") {
        const aSec = convertDurationToSeconds(a.duration || "00:00:00");
        const bSec = convertDurationToSeconds(b.duration || "00:00:00");
        return sortOrder === "asc" ? aSec - bSec : bSec - aSec;
      } else {
        const aDate = new Date(a.date);
        const bDate = new Date(b.date);
        return sortOrder === "asc" ? aDate - bDate : bDate - aDate;
      }
    });
    setFilteredActivities(sorted);
  };

  const applyFilter = (activityList, type) => {
    const filtered = type === "all"
      ? activityList
      : activityList.filter(act => act.activity_type === type);
    applySorting(filtered);
  };

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

        {/* Sort Controls */}
        <div className="mb-3 d-flex gap-3">
          <div>
            <label className="form-label">Sort by:</label>
            <select
              className="form-select"
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                applySorting(filteredActivities);
              }}
            >
              <option value="date">Date</option>
              <option value="duration">Duration</option>
            </select>
          </div>
          <div>
            <label className="form-label">Order:</label>
            <select
              className="form-select"
              value={sortOrder}
              onChange={(e) => {
                setSortOrder(e.target.value);
                applySorting(filteredActivities);
              }}
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </div>

        {/* Add Button */}
        <Link to="/add-activity" className="btn btn-primary mb-3">+ Add New Activity</Link>

        {/* Total Time Tracked */}
        <div className="mb-3">
          <strong>Total Time Tracked:</strong> {
            formatTotalTime(
              filteredActivities.reduce((sum, act) => sum + convertDurationToSeconds(act.duration || "00:00:00"), 0)
            )
          }
        </div>

        {/* Feedback States */}
        {loading && <p>Loading activities...</p>}
        {error && <p className="text-danger">{error}</p>}

        {/* Activity List */}
        {!loading && !error && (
          <div
            className="scrollable-activity-log border rounded mb-3"
            style={{ maxHeight: '400px', overflowY: 'auto' }}
          >
            {filteredActivities.length === 0 ? (
              <p className="text-center m-3">No activities found.</p>
            ) : (
              <ul className="list-group">
                {filteredActivities.map(activity => (
                  <li key={activity.id} className="list-group-item">
                    <strong>{activity.date}</strong> - {activity.activity_type} ({activity.duration})
                    <div className="mt-2">
                      <Link to={`/edit-activity/${activity.id}`} className="btn btn-sm btn-outline-primary me-2">
                        ✏️ Edit
                      </Link>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(activity.id)}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                    {activity.notes && (
                      <div className="mt-2"><em>Note: {activity.notes}</em></div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default DashboardPage;