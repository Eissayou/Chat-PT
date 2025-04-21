'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from "../../page.module.css";

export default function Login() {
    const [isLoggingInOrRegistering, setIsLoggingInOrRegistering] = useState('isLoggingIn');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const userRegister = () => {
        setIsLoggingInOrRegistering("isRegistering");
        setIsLoggedIn(false);
    };

    const userLogin = () => {
        setIsLoggingInOrRegistering("isLoggingIn");
        setIsLoggedIn(false);
    };

    const userLoggedIn = () => {
        setError(null);
        setIsLoggingInOrRegistering("isLoggedIn");
        setIsLoggedIn(true);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        if (isLoggingInOrRegistering === "isLoggedIn") {
            setIsLoading(false);
            router.push('/');
            router.refresh();
            return;
        }

        if (isLoggingInOrRegistering === "isLoggingIn" || isLoggingInOrRegistering === "isRegistering") {
            try {
                const response = await fetch('/api/UpdateUserProfile/SendLoginToMongo', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password, isLoggingInOrRegistering }),
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('Success:', data);
                    userLoggedIn();
                    setIsLoading(false);
                    router.push('/');
                    router.refresh();
                } else {
                    const errorData = await response.json();
                    console.error('Error:', errorData);
                    setError(errorData.error);
                    setIsLoading(false);
                }
            } catch (error) {
                console.error('Error:', error);
                setError('Something went wrong.');
                setIsLoading(false);
            }
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <form onSubmit={handleSubmit} className={styles.loginForm}>
                <h2 style={{ textAlign: 'center' }}>
                    {isLoggingInOrRegistering === 'isLoggingIn' ? 'Login' :
                        isLoggingInOrRegistering === 'isRegistering' ? 'Register' : 'Logging in'}
                </h2>

                {isLoggingInOrRegistering !== "isLoggedIn" && (
                    <>
                        <div>
                            <label htmlFor="username">Username:</label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password">Password:</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <button type="submit" disabled={isLoading}>
                            {isLoading
                                ? (isLoggingInOrRegistering === 'isLoggingIn' ? 'Logging in...' : 'Registering...')
                                : (isLoggingInOrRegistering === 'isLoggingIn' ? 'Login' : 'Register')}
                        </button>
                    </>
                )}

                {isLoggingInOrRegistering === "isLoggedIn" && (
                    <div className={styles.progressContainer}>
                        <div className={styles.spinner}></div>
                        <p>You have logged in! Redirecting now...</p>
                    </div>
                )}

                {isLoggingInOrRegistering !== "isLoggedIn" && (
                    <p style={{ textAlign: 'center' }}>
                        {isLoggingInOrRegistering === 'isLoggingIn'
                            ? "Don't have an account?"
                            : 'Already have an account?'}
                        <button
                            type="button"
                            onClick={isLoggingInOrRegistering === 'isLoggingIn' ? userRegister : userLogin}
                            disabled={isLoading}
                            style={{ marginLeft: '0.5rem', background: 'none', border: 'none', color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
                        >
                            {isLoggingInOrRegistering === 'isLoggingIn' ? 'Register' : 'Login'}
                        </button>
                    </p>
                )}

                {error && (
                    <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>
                )}
            </form>
        </div>
    );
}
