import React, { useState } from "react";
import { Building2, Users, Shield } from "lucide-react";
import Dashboard from "../components/Dashboard/Dashboard";
import LoginPage from "./LoginPage";

// Home Page (Landing + Auth)
function Home() {
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
                Streamline your human resources management with our
                comprehensive platform.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Employee Management</h3>
                  <p className="text-indigo-100 text-sm">
                    Manage your workforce efficiently
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                  <Shield className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Secure & Reliable</h3>
                  <p className="text-indigo-100 text-sm">
                    Enterprise-grade security
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Authentication Section (now LoginPage) */}
        <LoginPage onSuccess={handleAuthSuccess} />
      </div>
    </div>
  );
}

export default Home;
