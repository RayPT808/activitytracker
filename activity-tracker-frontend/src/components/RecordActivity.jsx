import React, { useState } from 'react';
import { recordActivity } from '../utils/api';
import '../assets/css/recordActivity.css';


const RecordActivity = () => {
  const [activityType, setActivityType] = useState('Running'); // Default selection
  const [activityName, setActivityName] = useState('');
  const [duration, setDuration] = useState('');
  const [activityDate, setActivityDate] = useState('');
  const [comments, setComments] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate that the selected date is not in the future.
    const today = new Date();
    const selectedDate = new Date(activityDate);
    
    // Remove the time component for a fair date-only comparison.
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);
    
    if (selectedDate > today) {
      setError('Activity date must be in the past.');
      return;
    }
    
    setError('');
    
    // Prepare the data for the API request.
    const activityData = {
      type: activityType,
      name: activityName,
      duration,
      date: activityDate,
      comments,
    };

    try {
      const response = await recordActivity(activityData);
      console.log('Activity recorded:', response.data);
      setSuccessMessage('Activity recorded successfully.');
      // Reset the form fields after a successful submission.
      setActivityName('');
      setDuration('');
      setActivityDate('');
      setComments('');
    } catch (err) {
      console.error('Error recording activity:', err);
      setError('Failed to record activity.');
    }
  };

  return (
    <div>
      <h2>Record Activity</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="activityType">Activity Type:</label>
          <select
            id="activityType"
            value={activityType}
            onChange={(e) => setActivityType(e.target.value)}
          >
            <option value="Running">Running</option>
            <option value="Walking">Walking</option>
            <option value="Cycling">Cycling</option>
            <option value="Swimming">Swimming</option>
            {/* Add more options if needed */}
          </select>
        </div>
        <div>
          <label htmlFor="activityName">Activity Name:</label>
          <input
            id="activityName"
            type="text"
            placeholder="Enter activity name"
            value={activityName}
            onChange={(e) => setActivityName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="duration">Duration (minutes):</label>
          <input
            id="duration"
            type="number"
            placeholder="Enter duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="activityDate">Date:</label>
          <input
            id="activityDate"
            type="date"
            value={activityDate}
            onChange={(e) => setActivityDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="comments">Comments (optional):</label>
          <textarea
            id="comments"
            placeholder="Additional comments"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
          ></textarea>
        </div>
        <button type="submit">Record</button>
      </form>
    </div>
  );
};

export default RecordActivity;
