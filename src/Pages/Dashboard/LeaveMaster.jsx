import React, { useState } from "react";
import { 
  Calendar, 
  User, 
  Briefcase, 
  Clock, 
  CheckCircle, 
  Search, 
  Building, 
  FileText,
  X
} from "lucide-react";

const LeaveMaster = () => {
  // State for form fields
  const [formData, setFormData] = useState({
    location: "",
    attendanceNo: "",
    epfNo: "",
    employeeName: "",
    department: "",
    reportingDate: getCurrentDate(),
    leaveType: "",
    leaveDate: {
      from: getCurrentDate(),
      to: getCurrentDate()
    },
    leaveFormat: "fullDay", // fullDay, halfDay, hourLeave
    leaveCancel: {
      from: getCurrentDate(),
      to: getCurrentDate()
    },
    reason: ""
  });

  // Sample leave usage data
  const [leaveUsageData, setLeaveUsageData] = useState([
    { id: 1, leaveType: "Annual Leave", total: 14, usage: 5, balance: 9 },
    { id: 2, leaveType: "Casual Leave", total: 7, usage: 2, balance: 5 },
    { id: 3, leaveType: "Medical Leave", total: 7, usage: 0, balance: 7 },
  ]);

  // Sample locations
  const locations = ["Head Office", "Branch Office", "Factory", "Warehouse"];

  // Sample leave types
  const leaveTypes = ["Annual Leave", "Casual Leave", "Medical Leave", "Unpaid Leave", "Special Leave"];

  // Sample leave records
  const [leaveRecords, setLeaveRecords] = useState([
    { id: 1, leaveDate: "2025-06-15", reportDate: "2025-06-14", fullHalfDay: "Full Day", leaveType: "Annual Leave" },
    { id: 2, leaveDate: "2025-06-20", reportDate: "2025-06-18", fullHalfDay: "Half Day", leaveType: "Casual Leave" },
  ]);

  // Helper function to get current date in YYYY-MM-DD format
  function getCurrentDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested objects in state
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Process leave request submission
    console.log("Leave request submitted:", formData);
    
    // Add to leave records (in a real app, this would be an API call)
    const newRecord = {
      id: leaveRecords.length + 1,
      leaveDate: formData.leaveDate.from,
      reportDate: formData.reportingDate,
      fullHalfDay: formData.leaveFormat === "fullDay" ? "Full Day" : 
                  formData.leaveFormat === "halfDay" ? "Half Day" : "Hour Leave",
      leaveType: formData.leaveType
    };
    
    setLeaveRecords([...leaveRecords, newRecord]);
    
    // Reset form or show success message
    alert("Leave request submitted successfully!");
  };

  const handleCancelLeave = () => {
    // Process leave cancellation
    console.log("Leave cancellation requested:", formData.leaveCancel);
    alert("Leave cancellation request submitted!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100 py-4 sm:py-8">
      <div className="container mx-auto px-3 sm:px-4 max-w-7xl">
        {/* Header Section */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-800 to-gray-900 px-4 sm:px-8 py-6 sm:py-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white text-center">
              Leave Master
            </h1>
            <p className="text-slate-300 text-center mt-2 text-sm sm:text-base">
              Employee Leave Management System
            </p>
          </div>

          <div className="p-4 sm:p-6 lg:p-8">
            <form onSubmit={handleSubmit}>
              {/* Location Selector */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Location
                </label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full p-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white shadow-sm"
                >
                  <option value="">Select Location</option>
                  {locations.map((location) => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column - Leave Form */}
                <div className="space-y-6">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Attendance No */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Attendance No <span className="text-red-500">*</span>
                        </label>
                        <div className="flex">
                          <input
                            type="text"
                            name="attendanceNo"
                            value={formData.attendanceNo}
                            onChange={handleInputChange}
                            required
                            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            placeholder="Enter attendance no"
                          />
                          <button 
                            type="button"
                            className="ml-2 p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                          >
                            <Search className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      {/* Join Date */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Join Date
                        </label>
                        <input
                          type="date"
                          name="joinDate"
                          value={formData.joinDate || ""}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>

                      {/* EPF No */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          EPF No
                        </label>
                        <input
                          type="text"
                          name="epfNo"
                          value={formData.epfNo}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="EPF number"
                        />
                      </div>

                      {/* Employee Name */}
                      <div className="space-y-2 sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Employee Name
                        </label>
                        <input
                          type="text"
                          name="employeeName"
                          value={formData.employeeName}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="Employee name"
                        />
                      </div>

                      {/* Department */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Department
                        </label>
                        <input
                          type="text"
                          name="department"
                          value={formData.department}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="Department"
                        />
                      </div>

                      {/* Reporting Date */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Reporting Date
                        </label>
                        <input
                          type="date"
                          name="reportingDate"
                          value={formData.reportingDate}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>

                      {/* Leave Type */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Leave Type <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="leaveType"
                          value={formData.leaveType}
                          onChange={handleInputChange}
                          required
                          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                        >
                          <option value="">Select Leave Type</option>
                          {leaveTypes.map((type) => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Leave Date Section */}
                    <div className="mt-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Leave Date <span className="text-red-500">*</span>
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-xs text-gray-500">From</label>
                              <input
                                type="date"
                                name="leaveDate.from"
                                value={formData.leaveDate.from}
                                onChange={handleInputChange}
                                required
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                              />
                            </div>
                            <div>
                              <label className="text-xs text-gray-500">To</label>
                              <input
                                type="date"
                                name="leaveDate.to"
                                value={formData.leaveDate.to}
                                onChange={handleInputChange}
                                required
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Leave Format Radio Buttons */}
                        <div className="flex flex-col">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <span className="text-red-500">*</span>
                          </label>
                          <div className="space-y-2">
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name="leaveFormat"
                                value="fullDay"
                                checked={formData.leaveFormat === "fullDay"}
                                onChange={handleInputChange}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="ml-2 text-sm text-gray-700">Full Day</span>
                            </label>
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name="leaveFormat"
                                value="halfDay"
                                checked={formData.leaveFormat === "halfDay"}
                                onChange={handleInputChange}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="ml-2 text-sm text-gray-700">Half Day</span>
                            </label>
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name="leaveFormat"
                                value="hourLeave"
                                checked={formData.leaveFormat === "hourLeave"}
                                onChange={handleInputChange}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="ml-2 text-sm text-gray-700">Hour Leave</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Leave Cancel Section */}
                    <div className="mt-6 border-t pt-4">
                      <h3 className="font-medium text-gray-700 mb-3">Leave Cancel</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-gray-500">From</label>
                          <input
                            type="date"
                            name="leaveCancel.from"
                            value={formData.leaveCancel.from}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500">To</label>
                          <input
                            type="date"
                            name="leaveCancel.to"
                            value={formData.leaveCancel.to}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          />
                        </div>
                      </div>
                      <div className="mt-3 flex justify-end">
                        <button
                          type="button"
                          onClick={handleCancelLeave}
                          className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>

                    {/* Reason Textarea */}
                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Reason
                      </label>
                      <textarea
                        name="reason"
                        value={formData.reason}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Reason for leave"
                      ></textarea>
                    </div>
                  </div>

                  {/* Leave Usage Summary Section */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                    <h3 className="font-medium text-gray-800 mb-4">Leave Usage Summary</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-white border-collapse">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">
                              #
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">
                              Leave Type
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">
                              Total
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">
                              Usage
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">
                              Balance
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {leaveUsageData.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 border text-sm">{item.id}</td>
                              <td className="px-4 py-3 border text-sm">{item.leaveType}</td>
                              <td className="px-4 py-3 border text-sm">{item.total}</td>
                              <td className="px-4 py-3 border text-sm">{item.usage}</td>
                              <td className="px-4 py-3 border text-sm font-medium text-blue-600">
                                {item.balance}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="mt-4 text-xs text-gray-500">
                      <p>Marked with <span className="text-red-500">*</span> are required</p>
                    </div>
                  </div>
                </div>

                {/* Right Column - Leave Records */}
                <div>
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                    <h3 className="font-medium text-gray-800 mb-4">Employee Leave Record</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-white border-collapse">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">
                              #
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">
                              Leave Date
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">
                              Report Date
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">
                              Full/Half Day
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">
                              Leave Type
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {leaveRecords.map((record) => (
                            <tr key={record.id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 border text-sm">{record.id}</td>
                              <td className="px-4 py-3 border text-sm">{record.leaveDate}</td>
                              <td className="px-4 py-3 border text-sm">{record.reportDate}</td>
                              <td className="px-4 py-3 border text-sm">{record.fullHalfDay}</td>
                              <td className="px-4 py-3 border text-sm">{record.leaveType}</td>
                            </tr>
                          ))}
                          {leaveRecords.length === 0 && (
                            <tr>
                              <td colSpan="5" className="px-4 py-8 border text-center text-gray-500">
                                No leave records found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 flex justify-end space-x-4">
                    <button
                      type="button"
                      className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
                    >
                      Clear Form
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-colors shadow-md hover:shadow-lg"
                    >
                      Submit Leave Request
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveMaster;