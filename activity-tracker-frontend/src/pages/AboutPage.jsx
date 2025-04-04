import React, { useEffect } from 'react';
import Layout from '../components/Layout';

const AboutPage = () => {
  useEffect(() => {
    document.title = "About Us - Activity Tracker";
  }, []);

  return (
    <Layout>
      <div className="container text-center">
        <h1>About Us</h1>
        <p>
          Welcome to our activity tracker application. Here, you can record and track your daily activities.
        </p>
        <p>
          Our goal is to help you stay organized and motivated while you track your personal progress.
        </p>
      </div>
    </Layout>
  );
};

export default AboutPage;

