import React, { useEffect } from 'react';
import Layout from '../components/Layout';


const HomePage = () => {
  useEffect(() => {
    document.title = "Activity Tracker";
  }, []);

  return (
    <Layout>
      <div className="page-overlay">

        <h1>Welcome to Activity Tracker</h1>
        <p>Track your activities efficiently.</p>

      </div>
    
    </Layout>
  );
};

export default HomePage;
