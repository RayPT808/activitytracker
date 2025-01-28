import React, { useState } from 'react';
import axiosInstance from '../api/axiosInstance'; // Ensure this is configured correctly
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
                '/accounts/login/', // Ensure this path matches your Django URL for login
                loginData,
                {
                    headers: {
                        'X-CSRFToken': csrfToken,
                    },
                }
            );

            // Assuming the backend sends back a JWT or session cookie
            const { token } = response.data; // Adjust based on your backend response structure

            // Store the token in localStorage
            localStorage.setItem('authToken', token);

            console.log('Login successful');
            navigate('/dashboard'); // Redirect to dashboard (or another page)
        } catch (error) {
            console.error('Login error:', error);

            // Display a more user-friendly error message
            if (error.response && error.response.status === 401) {
                setError('Invalid credentials. Please check your username and password.');
            } else {
                setError('An error occurred during login. Please try again later.');
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

