import React, { useState, useEffect } from "react";
import {
  Check,
  X,
  Search,
  Filter,
  Calendar,
  UserCheck,
  Clock,
  AlertCircle,
  ChevronDown,
  FileText,
  Eye,
  CheckCircle,
  XCircle,
  Shield,
} from "lucide-react";

const HRLeaveApproval = () => {
  // State for filtering and search
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterLeaveType, setFilterLeaveType] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [showDetails, setShowDetails] = useState(null);

  // New state variables for rejection reason modal
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectingRequestId, setRejectingRequestId] = useState(null);

  // Sample leave requests data - starting with Manager Approved status
  const [leaveRequests, setLeaveRequests] = useState([
    {
      id: 1,
      employeeNo: "EMP001",
      employeeName: "John Smith",
      department: "IT",
      leaveType: "Annual Leave",
      startDate: "2025-07-15",
      endDate: "2025-07-18",
      duration: 4,
      reason: "Family vacation",
      status: "Manager Approved",
      submittedDate: "2025-07-01",
      approvedBy: "James Wilson",
      approvedDate: "2025-07-02",
    },
    {
      id: 2,
      employeeNo: "EMP007",
      employeeName: "Sarah Williams",
      department: "HR",
      leaveType: "Medical Leave",
      startDate: "2025-07-10",
      endDate: "2025-07-11",
      duration: 2,
      reason: "Doctor appointment",
      status: "Manager Approved",
      submittedDate: "2025-06-28",
      approvedBy: "Michael Thompson",
      approvedDate: "2025-06-29",
    },
    {
      id: 3,
      employeeNo: "EMP014",
      employeeName: "Robert Johnson",
      department: "Finance",
      leaveType: "Casual Leave",
      startDate: "2025-07-21",
      endDate: "2025-07-21",
      duration: 1,
      reason: "Personal matters",
      status: "Approved", // Already approved by HR
      submittedDate: "2025-07-05",
      approvedBy: "David Martinez",
      approvedDate: "2025-07-06",
      hrApprovedBy: "HR Director",
      hrApprovedDate: "2025-07-07",
    },
    {
      id: 4,
      employeeNo: "EMP023",
      employeeName: "Amanda Chen",
      department: "Marketing",
      leaveType: "Annual Leave",
      startDate: "2025-07-25",
      endDate: "2025-07-31",
      duration: 5,
      reason: "Family event",
      status: "Rejected",
      submittedDate: "2025-06-20",
      rejectedBy: "HR Manager",
      rejectedDate: "2025-06-22",
      rejectionReason: "Insufficient leave balance for this period",
    },
  ]);

  // Sample departments
  const departments = ["IT", "HR", "Finance", "Marketing", "Operations"];

  // Sample leave types
  const leaveTypes = [
    "Annual Leave",
    "Medical Leave",
    "Casual Leave",
    "Special Leave",
  ];

  // Filter leave requests based on search and filter criteria
  const filteredRequests = leaveRequests.filter((request) => {
    // Search term filter
    const matchesSearch =
      request.employeeNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.reason.toLowerCase().includes(searchTerm.toLowerCase());

    // Department filter
    const matchesDepartment =
      !filterDepartment || request.department === filterDepartment;

    // Leave type filter
    const matchesLeaveType =
      !filterLeaveType || request.leaveType === filterLeaveType;

    // Date range filter
    let matchesDateRange = true;
    if (dateFrom) {
      matchesDateRange = request.startDate >= dateFrom;
    }
    if (dateTo) {
      matchesDateRange = matchesDateRange && request.endDate <= dateTo;
    }

    return (
      matchesSearch && matchesDepartment && matchesLeaveType && matchesDateRange
    );
  });

  // Count statistics
  const pendingHRApprovalCount = leaveRequests.filter(
    (req) => req.status === "Manager Approved"
  ).length;
  const approvedCount = leaveRequests.filter(
    (req) => req.status === "Approved"
  ).length;
  const rejectedCount = leaveRequests.filter(
    (req) => req.status === "Rejected"
  ).length;

  // Handle HR approval
  const handleHRApprove = (id) => {
    if (
      window.confirm("Are you sure you want to approve this leave request?")
    ) {
      setLeaveRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.id === id
            ? {
                ...request,
                status: "Approved",
                hrApprovedBy: "HR Director",
                hrApprovedDate: new Date().toISOString().split("T")[0],
              }
            : request
        )
      );
    }
  };

  // Handle rejection
  const handleReject = (id) => {
    setRejectingRequestId(id);
    setRejectionReason("");
    setShowRejectionModal(true);
  };

  // Process the rejection once the reason is provided
  const confirmReject = () => {
    if (rejectionReason.trim() && rejectingRequestId) {
      setLeaveRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.id === rejectingRequestId
            ? {
                ...request,
                status: "Rejected",
                rejectedBy: "HR Director",
                rejectedDate: new Date().toISOString().split("T")[0],
                rejectionReason: rejectionReason,
              }
            : request
        )
      );
      // Close the modal after processing
      setShowRejectionModal(false);
      setRejectingRequestId(null);
      setRejectionReason("");
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const options = {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status badge style
  const getStatusBadge = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Manager Approved":
        return "bg-blue-100 text-blue-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case "Approved":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "Manager Approved":
        return <UserCheck className="w-4 h-4 text-blue-600" />;
      case "Rejected":
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-600" />;
    }
  };

  // Reset filters
  const resetFilters = () => {
    setFilterDepartment("");
    setFilterLeaveType("");
    setDateFrom("");
    setDateTo("");
    setSearchTerm("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100 py-4 sm:py-8">
      <div className="container mx-auto px-3 sm:px-4 max-w-7xl">
        {/* Header Section */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-800 to-indigo-900 px-4 sm:px-8 py-6 sm:py-8">
            <div className="flex items-center justify-center mb-2">
              <Shield className="h-10 w-10 text-white opacity-80 mr-3" />
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white text-center">
                HR Leave Approval
              </h1>
            </div>
            <p className="text-purple-200 text-center mt-2 text-sm sm:text-base">
              Final approval stage for employee leave requests
            </p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 sm:p-6 lg:p-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Pending HR Approval
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {pendingHRApprovalCount}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-xl">
                  <UserCheck className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-green-600">
                    {approvedCount}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-xl">
                  <Check className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rejected</p>
                  <p className="text-2xl font-bold text-red-600">
                    {rejectedCount}
                  </p>
                </div>
                <div className="p-3 bg-red-100 rounded-xl">
                  <X className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Filter Section */}
          <div className="px-4 sm:px-6 lg:px-8 pb-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Filter className="h-5 w-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Filter Requests
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department
                  </label>
                  <select
                    value={filterDepartment}
                    onChange={(e) => setFilterDepartment(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 bg-white shadow-sm"
                  >
                    <option value="">All Departments</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Leave Type
                  </label>
                  <select
                    value={filterLeaveType}
                    onChange={(e) => setFilterLeaveType(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 bg-white shadow-sm"
                  >
                    <option value="">All Leave Types</option>
                    {leaveTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    From Date
                  </label>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 bg-white shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    To Date
                  </label>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 bg-white shadow-sm"
                  />
                </div>
              </div>

              {/* Search and Reset */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by employee name, number or reason..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <button
                  onClick={resetFilters}
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Reset Filters
                </button>
              </div>
            </div>
          </div>

          {/* Leave Requests Table */}
          <div className="px-4 sm:px-6 lg:px-8 pb-8">
            <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Employee
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Department
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Leave Type
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Manager
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredRequests.length > 0 ? (
                      filteredRequests.map((request) => (
                        <tr key={request.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 font-medium">
                                  {request.employeeName
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {request.employeeName}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {request.employeeNo}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {request.department}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {request.leaveType}
                            </div>
                            <div className="text-xs text-gray-500">
                              {formatDate(request.startDate)} -{" "}
                              {formatDate(request.endDate)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {request.approvedBy ? (
                              <div className="flex items-center">
                                <div className="text-sm text-gray-900">
                                  {request.approvedBy}
                                </div>
                                <div className="ml-1.5 bg-blue-100 rounded-full p-0.5">
                                  <UserCheck className="h-3 w-3 text-blue-600" />
                                </div>
                              </div>
                            ) : (
                              <span className="text-sm text-gray-500">-</span>
                            )}
                            {request.approvedDate && (
                              <div className="text-xs text-gray-500">
                                {formatDate(request.approvedDate)}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(
                                request.status
                              )}`}
                            >
                              {getStatusIcon(request.status)}
                              <span className="ml-1.5">{request.status}</span>
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                            <div className="flex justify-center space-x-2">
                              <button
                                onClick={() =>
                                  setShowDetails(
                                    showDetails === request.id
                                      ? null
                                      : request.id
                                  )
                                }
                                className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                                title="View Details"
                              >
                                <Eye size={18} />
                              </button>

                              {request.status === "Manager Approved" && (
                                <>
                                  <button
                                    onClick={() => handleHRApprove(request.id)}
                                    className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                                    title="Approve"
                                  >
                                    <Check size={18} />
                                  </button>

                                  <button
                                    onClick={() => handleReject(request.id)}
                                    className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                                    title="Reject"
                                  >
                                    <X size={18} />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="6"
                          className="px-6 py-10 text-center text-gray-500"
                        >
                          <div className="flex flex-col items-center">
                            <Calendar className="h-12 w-12 text-gray-400 mb-4" />
                            <p className="text-lg font-medium mb-1">
                              No leave requests found
                            </p>
                            <p className="text-sm">
                              Adjust your filters or try a different search term
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Details Modal */}
          {showDetails !== null && (
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4">
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900">
                    Leave Request Details
                  </h3>
                  <button
                    onClick={() => setShowDetails(null)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>

                {leaveRequests.find((req) => req.id === showDetails) && (
                  <div className="p-6">
                    {(() => {
                      const request = leaveRequests.find(
                        (req) => req.id === showDetails
                      );
                      return (
                        <div className="space-y-6">
                          <div className="flex items-center">
                            <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 font-medium text-xl">
                                {request.employeeName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </span>
                            </div>
                            <div className="ml-4">
                              <h4 className="text-xl font-bold text-gray-900">
                                {request.employeeName}
                              </h4>
                              <p className="text-gray-500">
                                {request.employeeNo} • {request.department}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h5 className="text-sm font-medium text-gray-500 mb-1">
                                Leave Type
                              </h5>
                              <p className="text-lg font-medium text-gray-900">
                                {request.leaveType}
                              </p>
                            </div>

                            <div>
                              <h5 className="text-sm font-medium text-gray-500 mb-1">
                                Status
                              </h5>
                              <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(
                                  request.status
                                )}`}
                              >
                                {getStatusIcon(request.status)}
                                <span className="ml-1.5">{request.status}</span>
                              </span>
                            </div>

                            <div>
                              <h5 className="text-sm font-medium text-gray-500 mb-1">
                                Duration
                              </h5>
                              <p className="text-lg font-medium text-gray-900">
                                {request.duration} day
                                {request.duration !== 1 ? "s" : ""}
                              </p>
                            </div>

                            <div>
                              <h5 className="text-sm font-medium text-gray-500 mb-1">
                                Date Range
                              </h5>
                              <p className="text-lg font-medium text-gray-900">
                                {formatDate(request.startDate)} -{" "}
                                {formatDate(request.endDate)}
                              </p>
                            </div>

                            <div className="md:col-span-2">
                              <h5 className="text-sm font-medium text-gray-500 mb-1">
                                Reason
                              </h5>
                              <p className="text-gray-900 bg-gray-50 p-4 rounded-lg">
                                {request.reason}
                              </p>
                            </div>

                            <div>
                              <h5 className="text-sm font-medium text-gray-500 mb-1">
                                Manager Approval
                              </h5>
                              <div className="flex items-center gap-2">
                                <UserCheck className="w-4 h-4 text-blue-600" />
                                <p className="text-gray-900 font-medium">
                                  {request.approvedBy}
                                </p>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                {formatDate(request.approvedDate)}
                              </p>
                            </div>

                            {request.status === "Approved" && (
                              <div>
                                <h5 className="text-sm font-medium text-gray-500 mb-1">
                                  HR Approval
                                </h5>
                                <div className="flex items-center gap-2">
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                  <p className="text-gray-900 font-medium">
                                    {request.hrApprovedBy}
                                  </p>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                  {formatDate(request.hrApprovedDate)}
                                </p>
                              </div>
                            )}

                            {request.status === "Rejected" && (
                              <>
                                <div>
                                  <h5 className="text-sm font-medium text-gray-500 mb-1">
                                    Rejected By
                                  </h5>
                                  <div className="flex items-center gap-2">
                                    <XCircle className="w-4 h-4 text-red-600" />
                                    <p className="text-gray-900 font-medium">
                                      {request.rejectedBy}
                                    </p>
                                  </div>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {formatDate(request.rejectedDate)}
                                  </p>
                                </div>

                                <div className="md:col-span-2">
                                  <h5 className="text-sm font-medium text-gray-500 mb-1">
                                    Rejection Reason
                                  </h5>
                                  <p className="text-red-700 bg-red-50 p-4 rounded-lg">
                                    {request.rejectionReason}
                                  </p>
                                </div>
                              </>
                            )}
                          </div>

                          {request.status === "Manager Approved" && (
                            <div className="flex justify-end space-x-3 pt-4 border-t">
                              <button
                                onClick={() => {
                                  handleReject(request.id);
                                  setShowDetails(null);
                                }}
                                className="px-5 py-2 bg-white border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                              >
                                Reject Request
                              </button>

                              <button
                                onClick={() => {
                                  handleHRApprove(request.id);
                                  setShowDetails(null);
                                }}
                                className="px-5 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-colors shadow"
                              >
                                Approve Request
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Rejection Modal */}
          {showRejectionModal && (
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4">
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900">
                    Reject Leave Request
                  </h3>
                  <button
                    onClick={() => setShowRejectionModal(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="p-6">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reason for Rejection{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                      placeholder="Please provide a reason for rejecting this leave request..."
                    ></textarea>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      onClick={() => setShowRejectionModal(false)}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>

                    <button
                      onClick={confirmReject}
                      disabled={!rejectionReason.trim()}
                      className={`px-4 py-2 ${
                        rejectionReason.trim()
                          ? "bg-red-600 hover:bg-red-700"
                          : "bg-red-300 cursor-not-allowed"
                      } text-white rounded-lg transition-colors`}
                    >
                      Confirm Rejection
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HRLeaveApproval;
