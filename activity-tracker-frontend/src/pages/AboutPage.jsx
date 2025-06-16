import React, { useEffect } from 'react';
import Layout from '../components/Layout';

const AboutPage = () => {
  useEffect(() => {
    document.title = "About Us - Activity Tracker";
  }, []);


  return (
    <Layout>
      <div className="about-overlay">
        <h1>About Us</h1>
        <p>
          Welcome to our activity tracker application. Here, you can record and track your daily activities.
        </p>
        <p>
          Whether you're a Weekend Warrior or an experienced runner, our platform lets you log workouts without distraction.
          Stay organized, stay motivated, and stay on top of your progress.
        </p>
      </div>
    </Layout>
  );
};

export default AboutPage;
