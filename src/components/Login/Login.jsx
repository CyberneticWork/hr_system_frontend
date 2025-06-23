import React, { useState } from 'react';
import AuthForm from '../AuthForm/AuthForm';

// Mock API service
const api = {
  post: async (endpoint, data) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (endpoint === '/api/login') {
      if (data.email === 'admin@hrm.com' && data.password === 'admin123') {
        return { data: { token: 'mock-jwt-token', user: { name: 'Admin User', email: data.email } } };
      } else {
        throw new Error('Invalid credentials');
      }
    }

    if (endpoint === '/api/register') {
      if (data.email === 'existing@hrm.com') {
        throw new Error('Email already exists');
      }
      return { data: { token: 'mock-jwt-token', user: { name: data.name, email: data.email } } };
    }
  }
};



// Login Page Component
const Login = ({ onSuccess }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/api/login', formData);
      // Store JWT token in memory (not localStorage as per artifact instructions)
      window.authToken = response.data.token;
      onSuccess(response.data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthForm
      isLogin={true}
      formData={formData}
      onChange={handleChange}
      onSubmit={handleSubmit}
      loading={loading}
      error={error}
      showPassword={showPassword}
      togglePassword={() => setShowPassword(!showPassword)}
    />
  );
};

export default Login;