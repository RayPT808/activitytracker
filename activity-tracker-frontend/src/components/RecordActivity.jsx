import React, { useState } from 'react';
import { recordActivity } from '../utils/api';
import '../assets/css/recordActivity.css';

const RecordActivity = () => {
  const [activityType, setActivityType] = useState('Running');
  const [activityName, setActivityName] = useState('');
  const [duration, setDuration] = useState('');
  const [activityDate, setActivityDate] = useState('');
  const [comments, setComments] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const today = new Date();
    const selectedDate = new Date(activityDate);
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate > today) {
      setError('Activity date must be in the past.');
      return;
    }

    setError('');

    const totalMinutes = parseInt(duration, 10);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const formattedDuration = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;

    const activityData = {
      activity_type: activityType,
      activity_name: activityName,
      duration: formattedDuration,
      date: activityDate,
      notes: comments,
    };

    try {
      const response = await recordActivity(activityData);
      console.log('Activity recorded:', response.data);
      setSuccessMessage('✅ Activity recorded successfully.');
      setActivityName('');
      setDuration('');
      setActivityDate('');
      setComments('');
    } catch (err) {
      console.error('Error recording activity:', err);
      setError('❌ Failed to record activity.');
    }
  };

  return (
    <div className="record-activity-form">
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
            <option value="Hiking">Hiking</option>
            <option value="Gym">Gym</option>
            <option value="Yoga">Yoga</option>
            <option value="CrossFit">CrossFit</option>
            <option value="Dancing">Dancing</option>
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
          <label htmlFor="duration">Duration (in minutes):</label>
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
          <label htmlFor="comments">Notes (optional):</label>
          <textarea
            id="comments"
            placeholder="Additional notes"
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
