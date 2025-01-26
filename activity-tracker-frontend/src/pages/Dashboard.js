import { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard() {
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/activities/')
            .then(response => {
                setActivities(response.data);
            })
            .catch(error => console.log(error));
    }, []);

    return (
        <div>
            <h1>Your Activities</h1>
            <ul>
                {activities.map(activity => (
                    <li key={activity.id}>{activity.title} - {activity.date}</li>
                ))}
            </ul>
        </div>
    );
}

export default Dashboard;
