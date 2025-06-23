import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, Building2, Users, Shield, ArrowRight } from 'lucide-react';

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

// Error Message Component
const ErrorMessage = ({ message }) => {
  if (!message) return null;
  
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm animate-in slide-in-from-top-1 duration-300">
      {message}
    </div>
  );
};

// Auth Form Component
const AuthForm = ({ 
  isLogin, 
  formData, 
  onChange, 
  onSubmit, 
  loading, 
  error,
  showPassword,
  togglePassword,
  showConfirmPassword,
  toggleConfirmPassword 
}) => {
  return (
    <div className="space-y-6">
      {error && <ErrorMessage message={error} />}
      
      {!isLogin && (
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              id="name"
              name="name"
              type="text"
              required={!isLogin}
              value={formData.name || ''}
              onChange={onChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
              placeholder="Enter your full name"
            />
          </div>
        </div>
      )}
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email || ''}
            onChange={onChange}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
            placeholder="Enter your email"
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            required
            value={formData.password || ''}
            onChange={onChange}
            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
            placeholder="Enter your password"
          />
          <button
            type="button"
            onClick={togglePassword}
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
      </div>
      
      {!isLogin && (
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              required={!isLogin}
              value={formData.confirmPassword || ''}
              onChange={onChange}
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
              placeholder="Confirm your password"
            />
            <button
              type="button"
              onClick={toggleConfirmPassword}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>
      )}
      
      <button
        type="button"
        onClick={onSubmit}
        disabled={loading}
        className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 font-medium"
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            {isLogin ? 'Signing In...' : 'Creating Account...'}
          </>
        ) : (
          <>
            {isLogin ? 'Sign In' : 'Create Account'}
            <ArrowRight className="h-5 w-5" />
          </>
        )}
      </button>
    </div>
  );
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

// Register Page Component
const Register = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/api/register', formData);
      // Store JWT token in memory
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
      isLogin={false}
      formData={formData}
      onChange={handleChange}
      onSubmit={handleSubmit}
      loading={loading}
      error={error}
      showPassword={showPassword}
      togglePassword={() => setShowPassword(!showPassword)}
      showConfirmPassword={showConfirmPassword}
      toggleConfirmPassword={() => setShowConfirmPassword(!showConfirmPassword)}
    />
  );
};

// Dashboard Component (Dummy)
const Dashboard = ({ user, onLogout }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">HRM System</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-700">Welcome, {user.name}</span>
              <button
                onClick={onLogout}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
            <div className="text-center">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Welcome to HRM Dashboard</h3>
              <p className="text-gray-500">Your dashboard content will go here.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [user, setUser] = useState(null);

  const handleAuthSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    window.authToken = null;
  };

  if (user) {
    return <Dashboard user={user} onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-slate-100">
      <div className="flex min-h-screen">
        {/* Left Branding Section */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 to-indigo-800 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative z-10 flex flex-col justify-center px-12">
            <div className="mb-8">
              <Building2 className="h-16 w-16 mb-6" />
              <h1 className="text-4xl font-bold mb-4">HRM System</h1>
              <p className="text-xl text-indigo-100 leading-relaxed">
                Streamline your human resources management with our comprehensive platform.
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Employee Management</h3>
                  <p className="text-indigo-100 text-sm">Manage your workforce efficiently</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                  <Shield className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Secure & Reliable</h3>
                  <p className="text-indigo-100 text-sm">Enterprise-grade security</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Authentication Section */}
        <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <Building2 className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900">HRM System</h1>
            </div>

            {/* Auth Toggle */}
            <div className="bg-gray-100 p-1 rounded-lg flex mb-8">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                  isLogin
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                  !isLogin
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Register
              </button>
            </div>

            {/* Form Card */}
            <div className="bg-white py-8 px-6 shadow-xl rounded-xl border border-gray-100">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {isLogin ? 'Welcome back' : 'Create your account'}
                </h2>
                <p className="text-gray-600 mt-2">
                  {isLogin 
                    ? 'Please sign in to your account' 
                    : 'Fill in your information to get started'
                  }
                </p>
              </div>

              {isLogin ? (
                <Login onSuccess={handleAuthSuccess} />
              ) : (
                <Register onSuccess={handleAuthSuccess} />
              )}
            </div>

            {/* Demo Credentials */}
            {isLogin && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-purple-800 font-medium mb-2">Demo Credentials:</p>
                <p className="text-sm text-blue-700">
                  <span className="font-mono">admin@hrm.com</span> / <span className="font-mono">admin123</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;