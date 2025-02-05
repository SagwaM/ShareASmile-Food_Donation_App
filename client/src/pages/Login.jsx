import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', credentials);
      const { token, user } = response.data;
      localStorage.setItem('token', token);

      if (user.role === 'donor') {
        navigate('/dashboard/donor');
      } else if (user.role === 'recipient') {
        navigate('/dashboard/recipient');
      } else if (user.role === 'admin') {
        navigate('/dashboard/admin');
      }
    } catch (error) {
      setError('Invalid email or password. Please try again.');
      console.error('Login error:', error);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Welcome Back!</h2>
      <p style={styles.subtitle}>Log in to continue sharing smiles.</p>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={credentials.email}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={credentials.password}
          onChange={handleChange}
          required
          style={styles.input}
        />
        {error && <p style={styles.error}>{error}</p>}
        <button type="submit" style={styles.button}>
          Login
        </button>
      </form>
      <p style={styles.footerText}>Don't have an account? <a href="/register" style={styles.link}>Sign Up</a></p>
    </div>
  );
};

const styles = {
  container: {
    width: '350px',
    margin: '4rem auto',
    padding: '2rem',
    backgroundColor: '#f9f9f9',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    borderRadius: '12px',
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '0.5rem',
    color: '#333',
  },
  subtitle: {
    fontSize: '1rem',
    marginBottom: '1.5rem',
    color: '#555',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  input: {
    padding: '0.75rem',
    fontSize: '1rem',
    border: '1px solid #ddd',
    borderRadius: '8px',
    outline: 'none',
  },
  button: {
    padding: '0.75rem',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'background-color 0.3s ease',
  },
  error: {
    color: 'red',
    fontSize: '0.9rem',
  },
  footerText: {
    marginTop: '1.5rem',
    fontSize: '0.9rem',
    color: '#555',
  },
  link: {
    color: '#007bff',
    textDecoration: 'none',
  },
};

export default Login;
