import React, { useEffect } from 'react';

const HomePage = () => {
  useEffect(() => {
    const socket = new WebSocket('ws://localhost:3000/ws');

    socket.onopen = () => {
      console.log('WebSocket connection established.');
    };

    socket.onmessage = (event) => {
      console.log('Received message:', event.data);
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    socket.onclose = (event) => {
      console.log('WebSocket connection closed:', event);
    };

    // Cleanup on unmount
    return () => {
      socket.close();
    };
  }, []);

  return (
    <div>
      <h1>Home Page</h1>
      {/* Your content goes here */}
    </div>
  );
};

export default HomePage;
