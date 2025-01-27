import React, { useState } from 'react';
import './ActivityForm.css';  // Import the CSS file

function ActivityForm() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({ title, description });
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
