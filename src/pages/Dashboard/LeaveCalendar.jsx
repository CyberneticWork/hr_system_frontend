import React, { useState, useEffect } from 'react';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Clock,
  CheckCircle,
  Users,
  FileText,
  Trash2,
  Edit3,
  Search
} from 'lucide-react';

const LeaveCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDates, setSelectedDates] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [pendingDates, setPendingDates] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [description, setDescription] = useState('');
  const [leaveType, setLeaveType] = useState('Annual');
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const leaveTypes = [
    { value: 'Annual', color: 'bg-blue-500', lightColor: 'bg-blue-100', textColor: 'text-blue-800' },
    { value: 'Sick', color: 'bg-red-500', lightColor: 'bg-red-100', textColor: 'text-red-800' },
    { value: 'Personal', color: 'bg-green-500', lightColor: 'bg-green-100', textColor: 'text-green-800' },
    { value: 'Emergency', color: 'bg-orange-500', lightColor: 'bg-orange-100', textColor: 'text-orange-800' },
    { value: 'Maternity', color: 'bg-purple-500', lightColor: 'bg-purple-100', textColor: 'text-purple-800' }
  ];

  // Get number of days in month
  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  // Check if a date is selected
  const getSelectedLeave = (day) => {
    if (!day) return null;
    const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return leaveRequests.find(req => req.dates && req.dates.includes(dateString));
  };

  // Generate date range
  const generateDateRange = (start, end) => {
    const dates = [];
    const startDate = new Date(start + 'T00:00:00');
    const endDate = new Date(end + 'T00:00:00');
    
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
      dates.push(dateString);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };

  // Handle day click
  const handleDayClick = (day) => {
    if (!day) return;
    
    const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const existingLeave = leaveRequests.find(req => req.dates && req.dates.includes(dateString));
    
    if (existingLeave) {
      // Show confirmation before removing
      if (window.confirm('Do you want to remove this leave request?')) {
        // Remove all dates from this leave request
        setSelectedDates(prev => prev.filter(date => !existingLeave.dates.includes(date)));
        setLeaveRequests(prev => prev.filter(req => req.id !== existingLeave.id));
      }
    } else {
      // Show modal to add new leave request
      const today = new Date();
      const selectedDate = new Date(dateString + 'T00:00:00');
      
      // Set default start and end dates
      setStartDate(dateString);
      setEndDate(dateString);
      setDescription('');
      setLeaveType('Annual');
      setShowDescriptionModal(true);
    }
  };

  // Handle month change
  const handleMonthChange = (e) => {
    setCurrentMonth(parseInt(e.target.value));
  };

  // Handle year change
  const handleYearChange = (direction) => {
    setCurrentYear(prev => prev + direction);
  };

  // Add leave request
  const addLeaveRequest = () => {
    if (startDate && endDate && description.trim()) {
      // Validate date range
      if (new Date(startDate) > new Date(endDate)) {
        alert('End date cannot be before start date!');
        return;
      }
      
      const dateRange = generateDateRange(startDate, endDate);
      
      // Check for overlapping dates
      const hasOverlap = dateRange.some(date => 
        leaveRequests.some(req => req.dates && req.dates.includes(date))
      );
      
      if (hasOverlap) {
        alert('Some dates in this range already have leave requests!');
        return;
      }
      
      const newRequest = {
        dates: dateRange,
        startDate,
        endDate,
        description: description.trim(),
        type: leaveType,
        id: Date.now(),
        status: 'Pending',
        duration: dateRange.length
      };
      
      setSelectedDates(prev => [...prev, ...dateRange]);
      setLeaveRequests(prev => [...prev, newRequest]);
      setDescription('');
      setLeaveType('Annual');
      setStartDate('');
      setEndDate('');
      setShowDescriptionModal(false);
      
      // Show success message
      console.log('Leave request added:', newRequest);
    }
  };

  // Cancel leave request
  const cancelLeaveRequest = () => {
    setDescription('');
    setLeaveType('Annual');
    setStartDate('');
    setEndDate('');
    setShowDescriptionModal(false);
  };

  // Process leave requests
  const processLeaveRequests = () => {
    if (leaveRequests.length === 0) {
      alert('No leave requests to process!');
      return;
    }
    
    const pendingRequests = leaveRequests.filter(req => req.status === 'Pending');
    if (pendingRequests.length === 0) {
      alert('No pending leave requests to process!');
      return;
    }
    
    const confirmation = window.confirm(`Process ${pendingRequests.length} pending leave request(s)?`);
    if (confirmation) {
      setLeaveRequests(prev => prev.map(req => 
        req.status === 'Pending' ? { ...req, status: 'Approved' } : req
      ));
      alert(`${pendingRequests.length} leave request(s) approved successfully!`);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Format date range for display
  const formatDateRange = (startDate, endDate) => {
    if (startDate === endDate) {
      return formatDate(startDate);
    }
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  };

  // Get leave type config
  const getLeaveTypeConfig = (type) => {
    return leaveTypes.find(lt => lt.value === type) || leaveTypes[0];
  };

  // Filter leave requests based on search
  const filteredLeaveRequests = leaveRequests.filter(req => 
    req.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    formatDateRange(req.startDate, req.endDate).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const calendarDays = generateCalendarDays();

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                Leave Calendar
              </h1>
              <p className="text-gray-600 mt-2">
                Manage and track employee leave requests
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => handleYearChange(-1)}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="text-lg font-semibold text-gray-900 min-w-[80px] text-center">{currentYear}</span>
              <button 
                onClick={() => handleYearChange(1)}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="flex items-start gap-3">
            <div className="p-1 bg-blue-100 rounded-full">
              <Calendar className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">How to use:</h3>
              <p className="text-blue-800 text-sm">
                Click on any calendar day to add a leave request. You can specify date ranges for multi-day leave. Click on existing leave days to remove them.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Requests</p>
                <p className="text-2xl font-bold text-gray-900">{leaveRequests.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">
                  {leaveRequests.filter(req => req.status === 'Approved').length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-orange-600">
                  {leaveRequests.filter(req => req.status === 'Pending').length}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-xl">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-purple-600">
                  {leaveRequests.filter(req => {
                    return req.dates && req.dates.some(date => {
                      const reqDate = new Date(date + 'T00:00:00');
                      return reqDate.getMonth() === currentMonth && reqDate.getFullYear() === currentYear;
                    });
                  }).length}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              {/* Month Selector */}
              <div className="mb-6">
                <label className="block text-lg font-semibold text-gray-700 mb-2">
                  Month
                </label>
                <select 
                  value={currentMonth} 
                  onChange={handleMonthChange}
                  className="px-4 py-3 border border-gray-200 rounded-xl bg-white text-lg min-w-[200px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  {months.map((month, index) => (
                    <option key={index} value={index}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2">
                {/* Day headers */}
                {daysOfWeek.map(day => (
                  <div key={day} className="p-3 text-center font-semibold text-gray-600 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                    {day}
                  </div>
                ))}
                
                {/* Calendar days */}
                {calendarDays.map((day, index) => {
                  const selectedLeave = getSelectedLeave(day);
                  const leaveConfig = selectedLeave ? getLeaveTypeConfig(selectedLeave.type) : null;
                  
                  return (
                    <div
                      key={index}
                      onClick={() => handleDayClick(day)}
                      className={`
                        h-20 p-3 border border-gray-200 rounded-xl cursor-pointer transition-all duration-200 relative
                        ${day ? 'hover:bg-blue-50 hover:border-blue-200 active:scale-95' : 'cursor-default'}
                        ${selectedLeave ? `${leaveConfig.color} text-white hover:opacity-90 hover:shadow-lg` : 'bg-white'}
                        ${!day ? 'bg-gray-50 border-gray-100' : ''}
                      `}
                    >
                      {day && (
                        <div className="flex flex-col h-full">
                          <span className="text-lg font-semibold">{day}</span>
                          {selectedLeave && (
                            <div className="mt-1">
                              <span className="text-xs opacity-90 block truncate">
                                {selectedLeave.type}
                              </span>
                              <span className="text-xs opacity-75 block truncate">
                                {selectedLeave.duration}d • {selectedLeave.status}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Leave Details Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Leave Requests</h2>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {leaveRequests.length}
                </span>
              </div>

              {/* Search */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search requests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              
              {/* Leave Requests List */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredLeaveRequests.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <Calendar className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium">No leave requests</p>
                    <p className="text-gray-400 text-sm mt-1">
                      Click on calendar days to add requests
                    </p>
                  </div>
                ) : (
                  filteredLeaveRequests.map((request) => {
                    const leaveConfig = getLeaveTypeConfig(request.type);
                    return (
                      <div key={request.id} className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${leaveConfig.lightColor} ${leaveConfig.textColor}`}>
                              {request.type}
                            </span>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              request.status === 'Approved' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-orange-100 text-orange-800'
                            }`}>
                              {request.status}
                            </span>
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {request.duration} day{request.duration > 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                        <div className="text-sm font-medium text-gray-900 mb-1">
                          {formatDateRange(request.startDate, request.endDate)}
                        </div>
                        <div className="text-sm text-gray-600">
                          {request.description}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Process Button */}
              <button
                onClick={processLeaveRequests}
                disabled={leaveRequests.filter(req => req.status === 'Pending').length === 0}
                className={`
                  w-full mt-6 py-3 px-4 rounded-xl font-semibold text-white transition-all duration-200 shadow-lg
                  ${leaveRequests.filter(req => req.status === 'Pending').length > 0 
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl transform hover:-translate-y-0.5' 
                    : 'bg-gray-300 cursor-not-allowed shadow-none'
                  }
                `}
              >
                Process Pending ({leaveRequests.filter(req => req.status === 'Pending').length})
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Description Modal */}
      {showDescriptionModal && (
        <div className="fixed inset-0  bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Add Leave Request</h3>
                <p className="text-gray-600 text-sm mt-1">
                  Select date range for your leave
                </p>
              </div>
              <button
                onClick={cancelLeaveRequest}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {startDate && endDate && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
                  <p className="text-blue-800 text-sm">
                    <strong>Duration:</strong> {generateDateRange(startDate, endDate).length} day{generateDateRange(startDate, endDate).length > 1 ? 's' : ''}
                  </p>
                  <p className="text-blue-600 text-xs mt-1">
                    {formatDateRange(startDate, endDate)}
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Leave Type
                </label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  {leaveTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.value}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Reason for Leave *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter reason for leave..."
                  className="w-full p-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  rows="4"
                  autoFocus
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-gray-100 bg-gray-50">
              <button
                onClick={cancelLeaveRequest}
                className="px-6 py-3 text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all font-medium"
              >
                Cancel
              </button>
              <button
                onClick={addLeaveRequest}
                disabled={!startDate || !endDate || !description.trim()}
                className={`
                  px-6 py-3 rounded-xl font-medium transition-all shadow-lg
                  ${startDate && endDate && description.trim() 
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transform hover:-translate-y-0.5' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                  }
                `}
              >
                Add Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveCalendar;