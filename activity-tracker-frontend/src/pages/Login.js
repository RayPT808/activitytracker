import React, { useState } from 'react';
import axiosInstance from '../api/axiosInstance'; // Ensure this is correctly set up
import { useNavigate } from 'react-router-dom'; // For navigation

function Login() {
    const [username, setUsername] = useState(''); // Use username for login
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Navigation hook

    // Helper to get CSRF token from cookies
    const getCsrfToken = () => {
        const csrfCookie = document.cookie
            .split('; ')
            .find((row) => row.startsWith('csrftoken='));
        return csrfCookie ? csrfCookie.split('=')[1] : null;
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors

        const loginData = { username, password };

        try {
            const csrfToken = getCsrfToken();
            if (!csrfToken) {
                throw new Error('CSRF token missing. Please try refreshing the page.');
            }

            // Attach CSRF token to the headers and send login request
            const response = await axiosInstance.post(
                '/api/token/', // Make sure this matches your Django JWT login URL
                loginData,
                {
                    headers: {
                        'X-CSRFToken': csrfToken,
                    },
                }
            );

            // Get access and refresh tokens from the response
            const { access, refresh } = response.data;

            // Store tokens in localStorage
            localStorage.setItem('authToken', access);
            localStorage.setItem('refreshToken', refresh);

            console.log('Login successful');
            navigate('/dashboard'); // Redirect to dashboard or another page
        } catch (error) {
            console.error('Login error:', error);

            // Display a more user-friendly error message
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
            {error && <p style={{ color: 'red' }}>{error}</p>} {/* Error message */}
        </form>
    );
}

export default Login;
