//Not used, just keep this code
import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Login.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function handleLogin(e) {
        e.preventDefault();
        try {
            // Call the login interface, and the backend returns the UserDetailDto object
            const res = await axios.post('/api/users/login', { email, password });
            // Store the returned user information in localStorage
            localStorage.setItem('currentUser', JSON.stringify(res.data));
            // Jump to the user list page after successful login
            window.location.href = '/UserListPage';
        } catch (err) {
            alert('Invalid email or password');
            console.error(err);
        }
    }

    return (
        <div className="login-wrapper">
            <div className="login-card">
                <h1 className="login-title">Login</h1>
                <form onSubmit={handleLogin} className="login-form">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="login-input"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="login-input"
                        required
                    />
                    <button type="submit" className="login-button">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;
