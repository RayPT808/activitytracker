import React, { useState } from 'react';
import axiosInstance from '../api/axiosInstance'; // Ensure axiosInstance has the correct base URL
import { useNavigate } from 'react-router-dom';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Helper to get CSRF token from cookies
    const getCsrfToken = () => {
        const csrfCookie = document.cookie
            .split('; ')
            .find((row) => row.startsWith('csrftoken='));
        return csrfCookie ? csrfCookie.split('=')[1] : null;
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(''); // Reset any previous errors

        const loginData = { username, password };

        try {
            // Get CSRF token from cookies
            const csrfToken = getCsrfToken();
            if (!csrfToken) {
                throw new Error('CSRF token missing. Please try refreshing the page.');
            }

            // Send login request to the Django API, passing the CSRF token in headers
            const response = await axiosInstance.post(
                'http://localhost:8000/api/token/', // Adjust your API endpoint as necessary
                loginData,
                {
                    headers: {
                        'X-CSRFToken': csrfToken, // Pass the CSRF token here
                    },
                }
            );

            // Extract tokens from response
            const { access, refresh } = response.data;

            // Store tokens in localStorage
            localStorage.setItem('authToken', access);
            localStorage.setItem('refreshToken', refresh);

            console.log('Login successful');
            navigate('/dashboard'); // Redirect to dashboard or another page
        } catch (error) {
            console.error('Login error:', error);

            // Handle error responses from the backend
            if (error.response) {
                if (error.response.status === 401) {
                    setError('Invalid credentials. Please check your username and password.');
                } else {
                    setError('An error occurred. Please try again later.');
                }
            } else {
                setError('Network error. Check your connection and try again.');
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
            {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}
        </form>
    );
}

export default Login;
