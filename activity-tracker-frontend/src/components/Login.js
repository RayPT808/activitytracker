import React, { useState } from 'react';
import axiosInstance from '../api/axiosInstance';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        const loginData = { email, password };

        axiosInstance.post('/auth/login/', loginData) // Replace with your login endpoint
            .then((response) => {
                const { token } = response.data; // Adjust based on your backend response
                // Store the token in localStorage
                localStorage.setItem('authToken', token);
                console.log('Login successful');
                // Redirect to the dashboard or any other page
                window.location.href = '/dashboard';
            })
            .catch((error) => {
                console.error('Login error:', error);
                setError('Invalid credentials'); // Customize the error message
            });
    };

    return (
        <form onSubmit={handleLogin}>
            <h2>Login</h2>
            <input 
                type="email" 
                placeholder="Email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
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
