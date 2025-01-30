import React, { useState } from 'react';
import axiosInstance from '../api/axiosInstance'; // Ensure axiosInstance has correct base URL
import { useNavigate } from 'react-router-dom';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(''); // Reset any previous errors

        const loginData = { 
            username: username, 
            password: password 
        };

        try {
            const response = await axiosInstance.post(
                'https://8000-raypt808-activitytracke-f1ujeofz1qb.ws-eu117.gitpod.io/api/token/',  // Ensure this matches your backend URL
                loginData,
                {
                    withCredentials: true,  // Ensures cookies like CSRF tokens are sent
                    headers: {
                        'Content-Type': 'application/json', // Make sure the content type is correct
                    },
                }
            );

            // Extract tokens from the response
            const { access, refresh } = response.data;

            // Store tokens in localStorage
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
