import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout'; // Adjust the path as needed

const DeleteActivity = () => {
  const navigate = useNavigate();

  // Set the document title to mimic the Django {% block title %}
  useEffect(() => {
    document.title = "Delete Activity - Activity Tracker";
  }, []);

  // Handle form submission for deleting the activity
  const handleDelete = (e) => {
    e.preventDefault();
    // Add your deletion logic here (e.g., an API call to delete the activity)
    console.log("Activity deleted");
    // After deletion, navigate to the activity list page
    navigate("/activity_list");
  };

  // Handle cancel action by navigating back to the activity list
  const handleCancel = () => {
    navigate("/activity_list");
  };

  return (
    <Layout>
      <div className="container mt-5">
        <h2 className="text-center">Delete Activity</h2>
        <p>Are you sure you want to delete this activity?</p>
        <form onSubmit={handleDelete}>
          {/* Delete button */}
          <button type="submit" className="btn btn-danger">
            Delete
          </button>
          {/* Cancel button; using onClick to go back */}
          <button type="button" className="btn btn-secondary" onClick={handleCancel}>
            Cancel
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default DeleteActivity;
