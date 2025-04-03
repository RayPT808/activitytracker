import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import ActivityForm from '../components/ActivityForm';

const DashboardPage = () => {
  useEffect(() => {
    document.title = 'Dashboard - Activity Tracker';
  }, []);

  const [activities, setActivities] = useState([]);

  // Simulate loading past activities
  useEffect(() => {
    const sampleActivities = [
      { id: 1, date: '2025-03-01', activity_type: 'Running', duration: 1800, notes: 'Morning run' },
      { id: 2, date: '2025-03-02', activity_type: 'Cycling', duration: 2700, notes: 'Evening cycle' },
    ];
    setActivities(sampleActivities);
  }, []);

  useEffect(() => {
    const activityLog = document.getElementById("activity-log");
    if (activityLog) {
      activityLog.scrollTop = activityLog.scrollHeight;
    }
  }, [activities]);

  return (
    <Layout>
      <div className="container mt-5">
        <h2 className="text-center title-adjust">Dashboard</h2>
        <div className="row">
          {/* Activity Log */}
          <div className="col-md-6">
            <h3>Past Activities</h3>
            <div id="activity-log" className="overflow-auto border rounded" style={{ maxHeight: '400px' }}>
              <ul className="list-group">
                {activities.map((activity) => (
                  <li key={activity.id} className="list-group-item">
                    <strong>{activity.date}</strong> - {activity.activity_type} for {Math.floor(activity.duration / 60)} min
                    <p>{activity.notes}</p>
                    <button className="btn btn-primary btn-sm">Edit</button>
                    <button className="btn btn-danger btn-sm ms-2">Delete</button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Activity Form */}
          <div className="col-md-6">
            <h3>Add New Activity</h3>
            <ActivityForm onActivityAdded={(newActivity) => {
              setActivities(prev => [newActivity, ...prev]);
            }} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;
