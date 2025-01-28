import React, { useState } from 'react';
import axiosInstance from '../api/axiosInstance'; // Ensure this is configured correctly
import { useNavigate } from 'react-router-dom'; // Use useNavigate instead of useHistory

function Login() {
    const [username, setUsername] = useState(''); // Changed from email to username
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Initialize useNavigate for programmatic navigation

    const handleLogin = async (e) => {
        e.preventDefault();
        const loginData = { username, password }; // Send username instead of email

        try {
            const response = await axiosInstance.post('/auth/login/', loginData); // Adjust the endpoint
            const { token } = response.data; // Adjust according to your backend response

            // Store the token in localStorage
            localStorage.setItem('authToken', token);

            // Log success
            console.log('Login successful');

            // Redirect to dashboard or any other page using navigate
            navigate('/dashboard'); // Use navigate for redirection
        } catch (error) {
            console.error('Login error:', error);
            setError('Invalid credentials'); // Display error message
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <h2>Login</h2>
            <input 
                type="text"  // Changed input type to text for username
                placeholder="Username" // Placeholder updated
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required 
            />
            <input 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
            />
            <button type="submit">Login</button>
            {error && <p style={{ color: 'red' }}>{error}</p>} {/* Error message */}
        </form>
    );
}

export default Login;
