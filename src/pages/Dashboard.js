// Dashboard.js (React component)
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard() {
    const [activities, setActivities] = useState([]);
    const [error, setError] = useState('');
    const [newActivity, setNewActivity] = useState({ title: '', description: '' });
    
    useEffect(() => {
        // Fetch activities from API
        axios.get('https://8000-raypt808-activitytracke-f1ujeofz1qb.ws-eu117.gitpod.io/api/activities/', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,  // Ensure to pass the token
            }
        })
        .then(response => {
            setActivities(response.data); // Update state with the activities fetched
        })
        .catch(error => {
            setError('Failed to load activities.');
            console.log(error);
        });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Create a new activity using the API
        axios.post('https://8000-raypt808-activitytracke-f1ujeofz1qb.ws-eu117.gitpod.io/api/activities/', newActivity, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`, // Send token for authentication
                'Content-Type': 'application/json',
            }
        })
        .then(response => {
            setActivities([...activities, response.data]);  // Add new activity to the list
            setNewActivity({ title: '', description: '' });  // Reset form fields
        })
        .catch(error => {
            setError('Failed to create activity.');
            console.log(error);
        });
    };

    return (
        <div>
            <h2>Your Activities</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <ul>
                {activities.length > 0 ? (
                    activities.map((activity) => (
                        <li key={activity.id}>
                            <h3>{activity.title}</h3>
                            <p>{activity.description}</p>
                        </li>
                    ))
                ) : (
                    <p>No activities found. Add some below!</p>
                )}
            </ul>
            
            <h3>Add New Activity</h3>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Title"
                    value={newActivity.title}
                    onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
                    required
                />
                <textarea
                    placeholder="Description"
                    value={newActivity.description}
                    onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                    required
                />
                <button type="submit">Add Activity</button>
            </form>
        </div>
    );
}

export default Dashboard;
