import React from 'react';
import Layout from '../components/Layout';

const NotFoundPage = () => {
  return (
    <Layout>
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <h2>404: Page Not Found</h2>
        <p>Sorry, the page you are looking for does not exist.</p>
      </div>
    </Layout>
  );
};

export default NotFoundPage;
