import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [csrfToken, setCsrfToken] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Fetch the CSRF token when the component mounts
    useEffect(() => {
        const getCsrfToken = async () => {
            try {
                const response = await axiosInstance.get('/api/get_csrf_token/');
                setCsrfToken(response.data.csrfToken);
            } catch (error) {
                console.error('Error fetching CSRF token:', error);
            }
        };

        getCsrfToken();
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(''); // Reset any previous errors

        const loginData = { 
            username, 
            password 
        };

        try {
            // Send login request to the backend API
            const response = await axiosInstance.post(
                '/api/login/', 
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
