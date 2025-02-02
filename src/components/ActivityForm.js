import React, { useState } from 'react';
import './ActivityForm.css'; // Import the CSS file
import axiosInstance from '../api/axiosInstance'; // Import the centralized Axios instance

function ActivityForm() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Prepare the data for the API request
        const activityData = { title, description };

        // Make the POST request to the backend API using the centralized Axios instance
        axiosInstance
            .post('/activities/', activityData)
            .then(response => {
                console.log('Activity saved:', response.data);
                // Optionally, reset the form after submission
                setTitle('');
                setDescription('');
            })
            .catch(error => {
                console.error('Error saving activity:', error);
            });
    };

    return (
        <form className="activity-form" onSubmit={handleSubmit}>
            <h2>Add Activity</h2>
            <input
                type="text"
                placeholder="Activity Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
                placeholder="Activity Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <button type="submit">Save Activity</button>
        </form>
    );
}

export default ActivityForm;
