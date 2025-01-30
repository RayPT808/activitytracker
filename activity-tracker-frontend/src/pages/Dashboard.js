import { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../context/UserContext'; // Import the useUser hook

function Dashboard() {
    const [activities, setActivities] = useState([]);
    const { user } = useUser(); // Access the user data from context

    useEffect(() => {
        axios.get('https://8000-raypt808-activitytracke-f1ujeofz1qb.ws-eu117.gitpod.io/api/activities/')
            .then(response => {
                setActivities(response.data);
            })
            .catch(error => console.log(error));
    }, []);
    
    // If user data isn't available yet, show loading message
    if (!user) {
        return <p>Loading user data...</p>;
    }

    return (
        <div>
            <h1>Welcome, {user.name}!</h1> {/* Display user name */}
            <p>Email: {user.email}</p> {/* Display user email */}
            <h2>Your Activities</h2>
            <ul>
                {activities.map(activity => (
                    <li key={activity.id}>{activity.title} - {activity.date}</li>
                ))}
            </ul>
        </div>
    );
}

export default Dashboard;
