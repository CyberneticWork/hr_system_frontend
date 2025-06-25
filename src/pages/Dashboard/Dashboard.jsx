import React, { useState } from "react";
import { Building2, Users } from "lucide-react";
import Sidebar from "./Sidebar";
import EmployeeMaster from "./EmployeeMaster";
import EmployeeAdd from "./EmployeeAdd";
import ShowEmployee from "./ShowEmployee";

const STORAGE_KEY = "employeeFormData";

const clearForm = () => {
      localStorage.removeItem(STORAGE_KEY);
};

const Dashboard = ({ user, onLogout }) => {
  // Sidebar state
  const [activeItem, setActiveItem] = useState("dashboard");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar
        user={user}
        onLogout={onLogout}
        activeItem={activeItem}
        setActiveItem={setActiveItem}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <nav className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center lg:hidden">
                <button
                  onClick={() => setIsOpen(true)}
                  className="text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
              </div>
              <div className="hidden lg:flex items-center">
                {/* <Building2 className="h-8 w-8 text-indigo-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">HRM System</span> */}
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
        <div className="py-6 sm:px-6 lg:px-8 flex-1">
          <div className="px-4 py-6 sm:px-0 h-full">
            {activeItem === "employeeMaster" ? (
              <EmployeeMaster />
            ) : activeItem === "employeeAdd" ? (
              <EmployeeAdd />
            ) : activeItem === "show" ? (
              <ShowEmployee />
            ) : (
              <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
                <div className="text-center">
                  <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Welcome to HRM Dashboard
                  </h3>
                  <p className="text-gray-500">
                    Your dashboard content will go here.
                    <button
                      onClick={clearForm}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                    >
                      Clear Form
                    </button>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
