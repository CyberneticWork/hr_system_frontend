import React from "react";
import {
  Building2,
  Users,
  Home,
  UserCheck,
  DollarSign,
  Calendar,
  BarChart3,
  FileText,
  ChevronDown,
  Settings,
  LogOut,
  X,
} from "lucide-react";

const Sidebar = ({
  user,
  onLogout,
  activeItem,
  setActiveItem,
  isOpen,
  setIsOpen,
}) => {
  const menuItems = [
    { id: "dashboard", name: "Dashboard", icon: Home, badge: null },
    { id: "employees", name: "Employees", icon: Users, badge: "24" },
    { id: "attendance", name: "Attendance", icon: UserCheck, badge: null },
    { id: "payroll", name: "Payroll", icon: DollarSign, badge: "3" },
    { id: "calendar", name: "Calendar", icon: Calendar, badge: null },
    { id: "reports", name: "Reports", icon: BarChart3, badge: null },
    { id: "documents", name: "Documents", icon: FileText, badge: "12" },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        h-full bg-white border-r border-gray-200 shadow-lg z-50
        transform transition-transform duration-300 ease-in-out
        w-64
        fixed left-0 top-0
        lg:static lg:z-0 lg:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900">HRM System</h2>
                <p className="text-xs text-gray-500">v2.1.0</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* User Profile Section */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">{user.name}</p>
              <p className="text-sm text-gray-500 truncate">HR Manager</p>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveItem(item.id)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                    transition-all duration-200 group
                    ${
                      activeItem === item.id
                        ? "bg-indigo-50 text-indigo-700 border-r-2 border-indigo-600"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }
                  `}
                >
                  <item.icon
                    className={`h-5 w-5 ${
                      activeItem === item.id
                        ? "text-indigo-600"
                        : "text-gray-400 group-hover:text-gray-600"
                    }`}
                  />
                  <span className="flex-1 text-left">{item.name}</span>
                  {item.badge && (
                    <span
                      className={`
                      px-2 py-0.5 text-xs rounded-full font-medium
                      ${
                        activeItem === item.id
                          ? "bg-indigo-100 text-indigo-700"
                          : "bg-gray-100 text-gray-600"
                      }
                    `}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-gray-100 space-y-2">
          <button
            onClick={() => setActiveItem("settings")}
            className={`
              w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
              transition-all duration-200 group
              ${
                activeItem === "settings"
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }
            `}
          >
            <Settings
              className={`h-5 w-5 ${
                activeItem === "settings"
                  ? "text-indigo-600"
                  : "text-gray-400 group-hover:text-gray-600"
              }`}
            />
            <span>Settings</span>
          </button>

          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200 group"
          >
            <LogOut className="h-5 w-5 text-red-500 group-hover:text-red-600" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
