import React, { useState } from 'react';

const tempAttendanceData = [
  {
    empNo: 'EMP001',
    name: 'John Doe',
    fingerprintClock: 'FP001',
    time: '08:45 AM',
    date: '2025-06-15',
    entry: '1',
    inOut: 'IN',
    department: 'IT',
    status: 'Present',
  },
  {
    empNo: 'EMP001',
    name: 'John Doe',
    fingerprintClock: 'FP001',
    time: '05:30 PM',
    date: '2025-06-15',
    entry: '2',
    inOut: 'OUT',
    department: 'IT',
    status: 'Present',
  },
  {
    empNo: 'EMP002',
    name: 'Jane Smith',
    fingerprintClock: 'FP002',
    time: '09:00 AM',
    date: '2025-06-15',
    entry: '1',
    inOut: 'IN',
    department: 'HR',
    status: 'Present',
  },
  {
    empNo: 'EMP002',
    name: 'Jane Smith',
    fingerprintClock: 'FP002',
    time: '06:15 PM',
    date: '2025-06-15',
    entry: '2',
    inOut: 'OUT',
    department: 'HR',
    status: 'Present',
  },
  // Absent and Leave records
  {
    empNo: 'EMP003',
    name: 'Ali Khan',
    fingerprintClock: '',
    time: '',
    date: '2025-06-15',
    entry: '',
    inOut: '',
    department: 'Finance',
    status: 'Absent',
  },
  {
    empNo: 'EMP004',
    name: 'Sara Lee',
    fingerprintClock: '',
    time: '',
    date: '2025-06-15',
    entry: '',
    inOut: '',
    department: 'Sales',
    status: 'Leave',
  },
];

const TimeCard = () => {
  // Form state
  const [location, setLocation] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [importMethod, setImportMethod] = useState('fingerprint');
  const [filterOption, setFilterOption] = useState('all');
  const [employeeName, setEmployeeName] = useState('');
  const [department, setDepartment] = useState('');

  // Table data state
  const [attendanceData, setAttendanceData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [editInTime, setEditInTime] = useState('');
  const [editOutTime, setEditOutTime] = useState('');
  const [editDate, setEditDate] = useState('');

  // Sample data for dropdowns
  const locations = ['Main Office', 'Warehouse', 'Branch 1', 'Branch 2'];
  const months = [
    'January', 'February', 'March', 'April', 
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ];
  const departments = ['HR', 'Finance', 'IT', 'Operations', 'Sales', 'Marketing'];

  // Filter helpers
  const filterAttendance = (statusFilter = null) => {
    let filtered = tempAttendanceData;

    if (filterOption === 'employee' && employeeName) {
      filtered = filtered.filter(
        (rec) => rec.name.toLowerCase().includes(employeeName.toLowerCase())
      );
    }
    if (filterOption === 'department' && department) {
      filtered = filtered.filter((rec) => rec.department === department);
    }
    if (dateFrom) {
      filtered = filtered.filter((rec) => rec.date >= dateFrom);
    }
    if (dateTo) {
      filtered = filtered.filter((rec) => rec.date <= dateTo);
    }
    if (statusFilter) {
      filtered = filtered.filter((rec) => rec.status === statusFilter);
    }
    return filtered;
  };

  const handleProcess = () => {
    setIsLoading(true);
    setTimeout(() => {
      setAttendanceData(filterAttendance());
      setIsLoading(false);
    }, 500);
  };

  const handleAbsent = () => {
    setAttendanceData(filterAttendance('Absent'));
  };

  const handleLeave = () => {
    setAttendanceData(filterAttendance('Leave'));
  };

  const handleCancel = () => {
    // Reset form
    setLocation('');
    setDateFrom('');
    setDateTo('');
    setSelectedMonth('');
    setEmployeeName('');
    setDepartment('');
    setAttendanceData([]);
  };

  // Handle delete
  const handleDelete = (index) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      setAttendanceData((prev) => prev.filter((_, i) => i !== index));
    }
  };

  // Handle edit open
  const handleEdit = (record, index) => {
    setEditRecord({ ...record, index });
    setEditDate(record.date);
    // Allow editing time for all types (IN, OUT, Absent, Leave)
    setEditInTime(record.inOut === 'IN' ? record.time : '');
    setEditOutTime(record.inOut === 'OUT' ? record.time : '');
    setShowEditModal(true);
  };

  // Handle edit save
  const handleEditSave = () => {
    setAttendanceData((prev) =>
      prev.map((rec, idx) => {
        if (idx !== editRecord.index) return rec;
        if (editRecord.status === 'Absent' || editRecord.status === 'Leave') {
          return {
            ...rec,
            date: editDate,
            inOut: '', // keep as is or allow user to set if you want
            time: '',  // not used for Absent/Leave, but you could store editInTime/editOutTime if needed
            editInTime,
            editOutTime,
          };
        }
        return {
          ...rec,
          date: editDate,
          time: editRecord.inOut === 'IN' ? editInTime : editOutTime,
        };
      })
    );
    setShowEditModal(false);
    setEditRecord(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100 py-4 sm:py-8">
      <div className="container mx-auto px-3 sm:px-4 max-w-7xl">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-800 to-gray-900 px-4 sm:px-8 py-6 sm:py-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white text-center">
              Time Card Management
            </h1>
            <p className="text-slate-300 text-center mt-2 text-sm sm:text-base">
              Employee Attendance & Time Tracking System
            </p>
          </div>
          
          <div className="p-4 sm:p-6 lg:p-8">
            {/* Import Section */}
            <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-xl shadow-sm">
              <div className="flex items-center mb-4 sm:mb-6">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3 shadow-md">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                  </svg>
                </div>
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-800">Import Data</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">Location</label>
                  <select
                    className="w-full p-3 sm:p-4 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white shadow-sm hover:shadow-md text-sm sm:text-base"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  >
                    <option value="">Select Location</option>
                    {locations.map((loc) => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">Month</label>
                  <select
                    className="w-full p-3 sm:p-4 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white shadow-sm hover:shadow-md text-sm sm:text-base"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                  >
                    <option value="">Select Month</option>
                    {months.map((month) => (
                      <option key={month} value={month}>{month}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">Date From</label>
                  <input
                    type="date"
                    className="w-full p-3 sm:p-4 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white shadow-sm hover:shadow-md text-sm sm:text-base"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">Date To</label>
                  <input
                    type="date"
                    className="w-full p-3 sm:p-4 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white shadow-sm hover:shadow-md text-sm sm:text-base"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-semibold text-slate-700 mb-4">Import Method</label>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
                  <label className="inline-flex items-center cursor-pointer p-3 rounded-lg hover:bg-blue-100 transition-colors duration-200">
                    <input
                      type="radio"
                      className="form-radio h-5 w-5 text-blue-600 focus:ring-blue-500 focus:ring-2"
                      checked={importMethod === 'fingerprint'}
                      onChange={() => setImportMethod('fingerprint')}
                    />
                    <span className="ml-3 text-slate-700 font-medium text-sm sm:text-base">Import from Fingerprint</span>
                  </label>
                  <label className="inline-flex items-center cursor-pointer p-3 rounded-lg hover:bg-blue-100 transition-colors duration-200">
                    <input
                      type="radio"
                      className="form-radio h-5 w-5 text-blue-600 focus:ring-blue-500 focus:ring-2"
                      checked={importMethod === 'excel'}
                      onChange={() => setImportMethod('excel')}
                    />
                    <span className="ml-3 text-slate-700 font-medium text-sm sm:text-base">Import from Excel Sheet</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Filter Section */}
            <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-gradient-to-br from-emerald-50 to-green-50 border-l-4 border-emerald-500 rounded-xl shadow-sm">
              <div className="flex items-center mb-4 sm:mb-6">
                <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center mr-3 shadow-md">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                </div>
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-800">Filter Options</h2>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-4">Filter By</label>
                <div className="flex flex-col sm:flex-row lg:flex-row gap-3">
                  <label className="inline-flex items-center cursor-pointer p-3 rounded-lg hover:bg-emerald-100 transition-colors duration-200">
                    <input
                      type="radio"
                      className="form-radio h-5 w-5 text-emerald-600 focus:ring-emerald-500 focus:ring-2"
                      checked={filterOption === 'all'}
                      onChange={() => setFilterOption('all')}
                    />
                    <span className="ml-3 text-slate-700 font-medium text-sm sm:text-base">All Fingerprints</span>
                  </label>
                  <label className="inline-flex items-center cursor-pointer p-3 rounded-lg hover:bg-emerald-100 transition-colors duration-200">
                    <input
                      type="radio"
                      className="form-radio h-5 w-5 text-emerald-600 focus:ring-emerald-500 focus:ring-2"
                      checked={filterOption === 'employee'}
                      onChange={() => setFilterOption('employee')}
                    />
                    <span className="ml-3 text-slate-700 font-medium text-sm sm:text-base">Filter by Employee</span>
                  </label>
                  <label className="inline-flex items-center cursor-pointer p-3 rounded-lg hover:bg-emerald-100 transition-colors duration-200">
                    <input
                      type="radio"
                      className="form-radio h-5 w-5 text-emerald-600 focus:ring-emerald-500 focus:ring-2"
                      checked={filterOption === 'department'}
                      onChange={() => setFilterOption('department')}
                    />
                    <span className="ml-3 text-slate-700 font-medium text-sm sm:text-base">Filter by Department</span>
                  </label>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {filterOption === 'employee' && (
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">Employee Name</label>
                    <input
                      type="text"
                      className="w-full p-3 sm:p-4 border-2 border-gray-300 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200 bg-white shadow-sm hover:shadow-md text-sm sm:text-base"
                      value={employeeName}
                      onChange={(e) => setEmployeeName(e.target.value)}
                      placeholder="Enter employee name"
                    />
                  </div>
                )}
                
                {filterOption === 'department' && (
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">Department</label>
                    <select
                      className="w-full p-3 sm:p-4 border-2 border-gray-300 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200 bg-white shadow-sm hover:shadow-md text-sm sm:text-base"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                    >
                      <option value="">Select Department</option>
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-end gap-3 sm:gap-4 mb-6 sm:mb-8">
              <button
                className="px-4 sm:px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm sm:text-base"
                onClick={handleProcess}
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Process'}
              </button>
              <button
                className="px-4 sm:px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-semibold rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm sm:text-base"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                className="px-4 sm:px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm sm:text-base"
                disabled={attendanceData.length === 0}
              >
                Download Fingerprint
              </button>
              <button
                className="px-4 sm:px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm sm:text-base"
                onClick={handleAbsent}
              >
                Absent
              </button>
              <button
                className="px-4 sm:px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold rounded-xl hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm sm:text-base"
                onClick={handleLeave}
              >
                Leave
              </button>
            </div>

            {/* Attendance Table */}
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
              <div className="bg-gradient-to-r from-slate-800 to-gray-900 px-4 sm:px-6 py-4 sm:py-5">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white">Attendance Records</h3>
                </div>
              </div>
              
              {isLoading ? (
                <div className="p-8 sm:p-12 text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto"></div>
                  <p className="mt-6 text-slate-600 font-medium text-sm sm:text-base">Loading attendance data...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white">
                    <thead>
                      <tr className="bg-gradient-to-r from-gray-50 to-slate-100 border-b-2 border-gray-200">
                        <th className="py-4 px-3 sm:px-6 text-left font-bold text-slate-800 text-xs sm:text-sm lg:text-base">EMP NO</th>
                        <th className="py-4 px-3 sm:px-6 text-left font-bold text-slate-800 text-xs sm:text-sm lg:text-base">Name</th>
                        <th className="py-4 px-3 sm:px-6 text-left font-bold text-slate-800 text-xs sm:text-sm lg:text-base">Fingerprint Clock</th>
                        <th className="py-4 px-3 sm:px-6 text-left font-bold text-slate-800 text-xs sm:text-sm lg:text-base">Time</th>
                        <th className="py-4 px-3 sm:px-6 text-left font-bold text-slate-800 text-xs sm:text-sm lg:text-base">Date</th>
                        <th className="py-4 px-3 sm:px-6 text-left font-bold text-slate-800 text-xs sm:text-sm lg:text-base">Entry</th>
                        <th className="py-4 px-3 sm:px-6 text-left font-bold text-slate-800 text-xs sm:text-sm lg:text-base">Status</th>
                        <th className="py-4 px-3 sm:px-6 text-left font-bold text-slate-800 text-xs sm:text-sm lg:text-base">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceData.length > 0 ? (
                        attendanceData.map((record, index) => (
                          <tr key={index} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} hover:bg-blue-50/50 transition-colors duration-200 border-b border-gray-100`}>
                            <td className="py-4 px-3 sm:px-6 font-semibold text-slate-700 text-xs sm:text-sm lg:text-base">{record.empNo}</td>
                            <td className="py-4 px-3 sm:px-6 font-medium text-slate-800 text-xs sm:text-sm lg:text-base">{record.name}</td>
                            <td className="py-4 px-3 sm:px-6 text-slate-600 text-xs sm:text-sm lg:text-base">{record.fingerprintClock}</td>
                            <td className="py-4 px-3 sm:px-6 text-slate-600 font-mono text-xs sm:text-sm lg:text-base">{record.time}</td>
                            <td className="py-4 px-3 sm:px-6 text-slate-600 text-xs sm:text-sm lg:text-base">{record.date}</td>
                            <td className="py-4 px-3 sm:px-6 text-slate-700 font-bold text-xs sm:text-sm lg:text-base">{record.entry}</td>
                            <td className="py-4 px-3 sm:px-6">
                              <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs sm:text-sm font-bold shadow-sm border ${
                                record.status === 'Absent'
                                  ? 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border-red-200'
                                  : record.status === 'Leave'
                                  ? 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border-yellow-200'
                                  : record.inOut === 'IN'
                                  ? 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border-emerald-200'
                                  : 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border-red-200'
                              }`}>
                                {record.status === 'Present' ? record.inOut : record.status}
                              </span>
                            </td>
                            <td className="py-4 px-3 sm:px-6 flex gap-2">
                              <button
                                className="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-150 text-xs sm:text-sm font-semibold shadow-sm"
                                onClick={() => handleEdit(record, index)}
                                title="Edit"
                              >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6-6m2 2l-6 6m-2 2h6v2a2 2 0 01-2 2H7a2 2 0 01-2-2v-6a2 2 0 012-2h2v6z" />
                                </svg>
                                Edit
                              </button>
                              <button
                                className="inline-flex items-center px-3 py-1.5 bg-red-100 text-red-700 border border-red-200 rounded-lg hover:bg-red-600 hover:text-white transition-all duration-150 text-xs sm:text-sm font-semibold shadow-sm"
                                onClick={() => handleDelete(index)}
                                title="Delete"
                              >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="8" className="py-16 text-center text-slate-500">
                            <div className="flex flex-col items-center space-y-3">
                              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                              </svg>
                              <div>
                                <p className="text-sm sm:text-base font-medium">No attendance records found</p>
                                <p className="text-xs sm:text-sm text-gray-400 mt-1">Please set your filters and click Process</p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && editRecord && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative animate-fade-in">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition"
              onClick={() => setShowEditModal(false)}
              title="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-xl font-bold mb-6 text-slate-800 flex items-center gap-2">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Edit Attendance Record
            </h2>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-slate-700 mb-1">Employee EPF Number</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100"
                value={editRecord.empNo}
                readOnly
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-slate-700 mb-1">Date</label>
              <input
                type="date"
                className="w-full border border-blue-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                value={editDate}
                onChange={e => setEditDate(e.target.value)}
              />
            </div>
            {(editRecord.inOut === 'IN' || editRecord.status === 'Absent' || editRecord.status === 'Leave') && (
              <div className="mb-4">
                <label className="block text-sm font-semibold text-slate-700 mb-1">IN Time</label>
                <input
                  type="text"
                  className="w-full border border-blue-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  value={editInTime}
                  onChange={e => setEditInTime(e.target.value)}
                  placeholder="e.g. 08:45 AM"
                />
              </div>
            )}
            {(editRecord.inOut === 'OUT' || editRecord.status === 'Absent' || editRecord.status === 'Leave') && (
              <div className="mb-4">
                <label className="block text-sm font-semibold text-slate-700 mb-1">OUT Time</label>
                <input
                  type="text"
                  className="w-full border border-blue-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  value={editOutTime}
                  onChange={e => setEditOutTime(e.target.value)}
                  placeholder="e.g. 05:30 PM"
                />
              </div>
            )}
            <div className="flex justify-end gap-3 mt-8">
              <button
                className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition font-semibold shadow"
                onClick={handleEditSave}
                disabled={
                  (editRecord.inOut === 'IN' && !editInTime) ||
                  (editRecord.inOut === 'OUT' && !editOutTime) ||
                  !editDate
                }
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeCard;