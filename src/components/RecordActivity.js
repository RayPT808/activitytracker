import React, { useState } from 'react';
import { recordActivity } from '../utils/api';

const RecordActivity = () => {
  const [activityName, setActivityName] = useState('');
  const [duration, setDuration] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const activityData = { name: activityName, duration };

    try {
      const response = await recordActivity(activityData);
      // Handle success, maybe update state or show success message
      console.log(response.data);
    } catch (error) {
      setError('Failed to record activity.');
    }
  };

  return (
    <div>
      <h2>Record Activity</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Activity Name"
          value={activityName}
          onChange={(e) => setActivityName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Duration"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />
        <button type="submit">Record</button>
      </form>
    </div>
  );
};

export default RecordActivity;
