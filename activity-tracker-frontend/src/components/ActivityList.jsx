import React, { useState } from 'react';
import './ActivityList.css'; // Import any CSS specific to the ActivityList component

function ActivityList({ activities, onUpdateActivity, onDeleteActivity }) {
  // State for the current filter option; default is "All"
  const [filter, setFilter] = useState('All');
  // State to hold the currently selected activity for editing
  const [selectedActivity, setSelectedActivity] = useState(null);
  // State for deletion confirmation modal (holds the activity selected for deletion)
  const [activityToDelete, setActivityToDelete] = useState(null);

  // Filter and then sort the activities with newest at the top.
  const filteredActivities = (activities || [])
    .filter(activity =>
      filter === 'All' ? true : activity.activity_type === filter
    )
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  // Handle change in the filter selection.
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  // When a user clicks on an activity (outside of the delete button),
  // set it as the selected activity to edit.
  const handleActivityClick = (activity) => {
    setSelectedActivity(activity);
  };

  // Close the edit modal.
  const handleCloseEditModal = () => {
    setSelectedActivity(null);
  };

  // Handle changes in the edit form fields.
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setSelectedActivity((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle submission of the edit form.
  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (onUpdateActivity && typeof onUpdateActivity === 'function') {
      onUpdateActivity(selectedActivity);
    }
    handleCloseEditModal();
  };

  // Delete logic:
  // When user clicks delete on an activity, store it in state so the confirmation modal pops up.
  const handleDeleteClick = (e, activity) => {
    // Prevent the click from also triggering the edit modal
    e.stopPropagation();
    setActivityToDelete(activity);
  };

  // Confirm deletion: call the passed-in onDeleteActivity callback.
  const handleConfirmDelete = () => {
    if (onDeleteActivity && typeof onDeleteActivity === 'function') {
      onDeleteActivity(activityToDelete.id);
    } else {
      console.log('Delete activity:', activityToDelete);
    }
    setActivityToDelete(null);
  };

  // Cancel deletion by closing the modal.
  const handleCancelDelete = () => {
    setActivityToDelete(null);
  };

  return (
    <div className="activity-list-container">
      {/* Filter Section */}
      <div className="filter-section mb-3">
        <label htmlFor="filterSelect">Filter by Activity Type: </label>
        <select id="filterSelect" value={filter} onChange={handleFilterChange}>
          <option value="All">All</option>
          <option value="Running">Running</option>
          <option value="Walking">Walking</option>
          <option value="Cycling">Cycling</option>
          {/* Add more options as necessary */}
        </select>
      </div>

      {/* Activity List */}
      <div
        className="activity-list overflow-auto"
        style={{ maxHeight: '400px', border: '1px solid #ccc', borderRadius: '4px' }}
      >
        <ul className="list-group">
          {filteredActivities.map((activity) => (
            <li
              key={activity.id}
              className="list-group-item d-flex justify-content-between align-items-start"
              onClick={() => handleActivityClick(activity)}
              style={{ cursor: 'pointer' }}
            >
              <div>
                <strong>{activity.date}</strong> - {activity.activity_type} for {activity.duration} minutes
                <p>{activity.notes}</p>
              </div>
              <button
                className="btn btn-danger btn-sm"
                onClick={(e) => handleDeleteClick(e, activity)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Edit Activity Modal */}
      {selectedActivity && (
        <div className="modal-overlay">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Activity</h5>
                <button type="button" className="btn-close" onClick={handleCloseEditModal}></button>
              </div>
              <form onSubmit={handleEditSubmit}>
                <div className="modal-body">
                  {/* Example fields: title and notes */}
                  <div className="mb-3">
                    <label htmlFor="editTitle" className="form-label">Title</label>
                    <input
                      type="text"
                      id="editTitle"
                      name="title"
                      className="form-control"
                      value={selectedActivity.title || ''}
                      onChange={handleEditChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="editNotes" className="form-label">Notes</label>
                    <textarea
                      id="editNotes"
                      name="notes"
                      className="form-control"
                      value={selectedActivity.notes || ''}
                      onChange={handleEditChange}
                    ></textarea>
                  </div>
                  {/* Additional fields can be added here as needed */}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseEditModal}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {activityToDelete && (
        <div className="modal-overlay">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Delete Confirmation</h5>
                <button type="button" className="btn-close" onClick={handleCancelDelete}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this activity?</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCancelDelete}>
                  Cancel
                </button>
                <button type="button" className="btn btn-danger" onClick={handleConfirmDelete}>
                  Delete
                </button>
              </div>
            </div>
          </div>
          {/* Inline modal styling for demonstration */}
          <style jsx>{`
            .modal-overlay {
              position: fixed;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: rgba(0, 0, 0, 0.5);
              display: flex;
              align-items: center;
              justify-content: center;
              z-index: 1000;
            }
            .modal-dialog {
              background: #fff;
              border-radius: 4px;
              width: 90%;
              max-width: 400px;
            }
          `}</style>
        </div>
      )}
    </div>
  );
}

export default ActivityList;
