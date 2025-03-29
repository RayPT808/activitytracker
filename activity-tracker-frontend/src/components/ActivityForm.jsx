import React, { useState } from 'react';
import './ActivityForm.css'; // Import the CSS file
import axiosInstance from '../api/axiosInstance'; // Import the centralized Axios instance

function ActivityForm() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Prepare the data for the API request
        const activityData = { title, description };

        // Make the POST request to the backend API
        axiosInstance
            .post('/activities/', activityData)
            .then(response => {
                console.log('Activity saved:', response.data);
                // Reset the form after submission
                setTitle('');
                setDescription('');
            })
            .catch(error => {
                console.error('Error saving activity:', error);
                setError("There was an error saving the activity. Please try again.");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <form className="activity-form" onSubmit={handleSubmit}>
            <h2>Add Activity</h2>
            {error && <div className="error-message">{error}</div>}
            <input
                type="text"
                placeholder="Activity Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
            />
            <textarea
                placeholder="Activity Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
            />
            <button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Activity'}
            </button>
        </form>
    );
}

export default ActivityForm;
