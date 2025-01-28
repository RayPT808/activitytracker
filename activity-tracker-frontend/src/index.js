import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './assets/css/style.css';
import './components/ActivityForm.css';
import { UserProvider } from './context/UserContext'; // Import the UserProvider

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <UserProvider> {/* Wrap your App component with UserProvider */}
      <App />
    </UserProvider>
  </React.StrictMode>
);
