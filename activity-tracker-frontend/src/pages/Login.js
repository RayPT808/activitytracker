import React, { useState } from 'react';
import axiosInstance from '../api/axiosInstance'; // Ensure axiosInstance has correct base URL
import { useNavigate } from 'react-router-dom';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Get the CSRF token from the meta tag in your base template
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(''); // Reset any previous errors

        const loginData = { 
            username: username, 
            password: password 
        };

        try {
            // Send login request to the backend API
            const response = await axiosInstance.post(
                '/api/login/',  // Update this if the backend endpoint is different
                loginData,
                {
                    withCredentials: true,  // Ensures cookies like CSRF tokens are sent
                    headers: {
                        'Content-Type': 'application/json', // Ensure the correct content type
                        'X-CSRFToken': csrfToken,  // Include the CSRF token here
                    },
                }
            );

            // Extract tokens (if the backend is sending them)
            const { access, refresh } = response.data;

            // Store tokens in localStorage (for persistence)
            localStorage.setItem('authToken', access);
            localStorage.setItem('refreshToken', refresh);

            console.log('Login successful');
            navigate('/dashboard'); // Redirect to dashboard after successful login
        } catch (error) {
            console.error('Login error:', error);

            if (error.response) {
                if (error.response.status === 401) {
                    setError('Invalid username or password.');
                } else {
                    setError('An error occurred. Please try again later.');
                }
            } else {
                setError('Network error. Please check your connection.');
            }
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <h2>Login</h2>
            <input
                type="text"
                placeholder="Username"
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
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
    );
}

export default Login;
