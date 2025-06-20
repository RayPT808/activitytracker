import axiosInstance from "../api/axiosInstance";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { toast } from 'react-toastify';
import ConfirmModal from '../components/ConfirmModal';
import { useState, useEffect, useCallback } from 'react';

// Duration helpers
const parseDuration = (duration) => {
  if (typeof duration === "number") return duration;
  if (typeof duration === "string") {
    const parts = duration.split(":");
    if (parts.length === 3) {
      const [hours, minutes, seconds] = parts.map(Number);
      return hours * 3600 + minutes * 60 + seconds;
    }
    const parsed = parseInt(duration, 10);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

const formatTime = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
};

const DashboardPage = () => {
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [activityTypeFilter, setActivityTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const applyFilterAndSort = useCallback((activityList, filterType, sortField) => {
    let filtered = filterType === "all"
      ? [...activityList]
      : activityList.filter(act => act.activity_type === filterType);

    if (sortField === "duration") {
      filtered.sort((a, b) => parseDuration(a.duration) - parseDuration(b.duration));
    } else if (sortField === "date") {
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    setFilteredActivities(filtered);
  }, []);

  const fetchActivities = useCallback(async () => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem("authToken");
      const res = await axiosInstance.get("/api/activitytracker/activities/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setActivities(res.data);
      applyFilterAndSort(res.data, activityTypeFilter, sortBy);
    } catch (err) {
      console.error("Failed to load activities", err);
      setError("Failed to load activities.");
    } finally {
      setLoading(false);
    }
  }, [activityTypeFilter, sortBy, applyFilterAndSort]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const handleDelete = (id) => {
    setSelectedId(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      const accessToken = localStorage.getItem("access");
      await axiosInstance.delete(`/api/activitytracker/activities/${selectedId}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const updated = activities.filter(act => act.id !== selectedId);
      setActivities(updated);
      applyFilterAndSort(updated, activityTypeFilter, sortBy);

      toast.success("🗑️ Activity deleted successfully!");
    } catch (err) {
      console.error("Delete failed", err);
      toast.error("❌ Failed to delete activity. Please try again.");
    } finally {
      setShowConfirm(false);
      setSelectedId(null);
    }
  };

  const handleFilterChange = (e) => {
    const selectedType = e.target.value;
    setActivityTypeFilter(selectedType);
    applyFilterAndSort(activities, selectedType, sortBy);
  };

  const handleSortChange = (e) => {
    const sort = e.target.value;
    setSortBy(sort);
    applyFilterAndSort(activities, activityTypeFilter, sort);
  };

  const getTotalDuration = () => {
    const totalSeconds = filteredActivities.reduce(
      (acc, act) => acc + parseDuration(act.duration),
      0
    );
    return formatTime(totalSeconds);
  };

  return (
    <Layout>
      <div className="container mt-4">
        <div className="row">
          {/* Left Panel */}
          <div className="col-md-4">
            <h3>Your Activities</h3>
            <div className="mb-3">
              <label htmlFor="filter" className="form-label">Filter by Type:</label>
              <select
                id="filter"
                className="form-select"
                value={activityTypeFilter}
                onChange={handleFilterChange}
              >
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
            </div>

            <div className="mb-3">
              <label htmlFor="sort" className="form-label">Sort by:</label>
              <select
                id="sort"
                className="form-select"
                value={sortBy}
                onChange={handleSortChange}
              >
                <option value="date">Date (Newest First)</option>
                <option value="duration">Duration (Shortest First)</option>
              </select>
            </div>

            <Link to="/add-activity" className="btn btn-primary mb-3 w-100">
              + Add New Activity
            </Link>

            <div className="alert alert-info">
              <strong>Total Time Tracked:</strong><br />
              {getTotalDuration()}
              <hr className="my-2" />
              <strong>Total Activities:</strong> {filteredActivities.length}
            </div>
          </div>

          {/* Right Panel */}
          <div className="col-md-8">
            {loading && <p>Loading activities...</p>}
            {error && <p className="text-danger">{error}</p>}
            <div className="border rounded p-3" style={{ maxHeight: '500px', overflowY: 'auto' }}>
              {filteredActivities.length === 0 ? (
                <p>No activities found.</p>
              ) : (
                <ul className="list-group">
                  {filteredActivities.map(activity => (
                    <li key={activity.id} className="list-group-item mb-2">
                      <strong>{activity.date}</strong> — {activity.activity_type}
                      {activity.activity_name && (
                        <> — <strong>{activity.activity_name}</strong></>
                      )}
                      ({formatTime(parseDuration(activity.duration))})

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
                        <div className="mt-2 text-muted"><em>{activity.notes}</em></div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      {showConfirm && (
        <ConfirmModal
          message="Are you sure you want to delete this activity?"
          onConfirm={confirmDelete}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </Layout>
  );
};

export default DashboardPage;
