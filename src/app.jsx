import React, { useState } from 'react';
import { Building2, Users, Shield } from 'lucide-react';
import Login from './components/Login/Login';
import Dashboard from './components/Dashboard/Dashboard';



// Main App Component
function App() {
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

            {/* Only Login Form */}
            <div className="bg-white py-8 px-6 shadow-xl rounded-xl border border-gray-100">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Welcome back
                </h2>
                <p className="text-gray-600 mt-2">
                  Please sign in to your account
                </p>
              </div>
              <Login onSuccess={handleAuthSuccess} />
            </div>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-purple-800 font-medium mb-2">Demo Credentials:</p>
              <p className="text-sm text-blue-700">
                <span className="font-mono">admin@hrm.com</span> / <span className="font-mono">admin123</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;