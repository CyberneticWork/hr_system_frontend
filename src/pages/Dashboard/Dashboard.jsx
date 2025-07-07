import React, { useState } from "react";
import { Building2, Users, UserCheck, Calendar } from "lucide-react";
import Sidebar from "./Sidebar";
import EmployeeMaster from "./EmployeeMaster";
import EmployeeAdd from "./EmployeeAdd";
import ShowEmployee from "./ShowEmployee";
import CreateNewDeduction from "./createnewdeduction";
import ShiftSchedule from "./ShiftSchedule";
import CreateNewAllowance from "./createnewallowance";
import EmployeeLoan from "./employeeloan";
import TimeCard from "./timecard";
import Overtime from "./overtime";
import Department from "./Department";
import Grouproster from "./Grouproster";
import LeaveMaster from "./LeaveMaster";
import NoPayManagement from "./nopaymanagement";
import LeaveCalendar from "./leavecalendar";
import SalaryProcessPage from "./salaryprocesspage";
import LeaveApproval from "./LeaveApproval";
import HRLeaveApproval from "./HRLeaveApproval";

const STORAGE_KEY = "employeeFormData";

const clearForm = () => {
  localStorage.removeItem(STORAGE_KEY);
};

const DashboardStats = () => {
  const stats = [
    {
      name: "Total Employees",
      value: "2,847",
      change: "+12%",
      icon: Users,
      color: "bg-blue-500",
    },
    {
      name: "Present Today",
      value: "2,234",
      change: "+2.3%",
      icon: UserCheck,
      color: "bg-green-500",
    },
    {
      name: "On Leave",
      value: "89",
      change: "-5.4%",
      icon: Calendar,
      color: "bg-yellow-500",
    },
    {
      name: "Departments",
      value: "24",
      change: "+1",
      icon: Building2,
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.name}</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stat.value}
              </p>
              <p
                className={`text-sm mt-2 ${
                  stat.change.startsWith("+")
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {stat.change} from last month
              </p>
            </div>
            <div className={`${stat.color} p-3 rounded-lg`}>
              <stat.icon className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Content Components (Placeholders)
const ContentPlaceholder = ({ title, description }) => (
  <div className="bg-white rounded-xl shadow-lg p-8">
    <div className="text-center">
      <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 mb-4">
        <Users className="h-8 w-8 text-indigo-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>
      <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200">
        Get Started
      </button>
    </div>
  </div>
);

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
                <span className="text-gray-700 flex items-center gap-2">
                  Welcome, {user.name}
                  <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-sm font-semibold px-2.5 py-0.5 rounded">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M10 2a4 4 0 00-4 4v1H4a2 2 0 00-2 2v2h16V9a2 2 0 00-2-2h-2V6a4 4 0 00-4-4zm-2 5V6a2 2 0 114 0v1H8zm-4 6v3a2 2 0 002 2h8a2 2 0 002-2v-3H4z" />
                    </svg>
                    {user.role}
                  </span>
                </span>
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
            ) : activeItem === "createNewDeduction" ? (
              <CreateNewDeduction />
            ) : activeItem === "shiftTime" ? (
              <ShiftSchedule />
            ) : activeItem === "createNewAllowance" ? (
              <CreateNewAllowance />
            ) : activeItem === "employeeLoan" ? (
              <EmployeeLoan />
            ) : activeItem === "noPayManagement" ? (
              <NoPayManagement />
            ) : activeItem === "hrLeaveApproval" ? (
              <HRLeaveApproval />
            ) : activeItem === "leaveApproval" ? (
              <LeaveApproval />
            ) : activeItem === "leaveMaster" ? (
              <LeaveMaster />
            ) : activeItem === "TimeCard" ? (
              <TimeCard />
            ) : activeItem === "Overtime" ? (
              <Overtime />
            ) : activeItem === "departmentMaster" ? (
              <Department />
            ) : activeItem === "grouproster" ? (
              <Grouproster />
            ) : activeItem === "leavecalendar" ? (
              <LeaveCalendar />
            ) : activeItem === "SalaryProcessPage" ? (
              <SalaryProcessPage />
            ) : (
              <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
                <div className="text-center">
                  <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Welcome to HRM Dashboard
                  </h3>
                  <p className="text-gray-500">
                    <DashboardStats />
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
