import React from 'react';
import { Building2, Users, Shield } from 'lucide-react';
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
export default Dashboard;