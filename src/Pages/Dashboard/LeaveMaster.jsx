import React, { useState, useEffect } from "react";
import {
  Calendar,
  User,
  Briefcase,
  Clock,
  CheckCircle,
  Search,
  Building,
  FileText,
  X,
} from "lucide-react";
import Swal from "sweetalert2";
import employeeService from "../../services/EmployeeDataService";
import {
  createLeave,
  getLeaveById,
  getLeaveCountsByEmployee,
} from "../../services/LeaveMaster";
import { fetchLeaveCalendar } from "../../services/LeaveCalendar";

const LeaveMaster = () => {
  // State for form fields
  const [formData, setFormData] = useState({
    attendanceNo: "",
    epfNo: "",
    employeeName: "",
    department: "",
    reportingDate: getCurrentDate(),
    leaveType: "",
    leaveDateType: "fullDay", // fullDay, halfDay, manual
    halfDayPeriod: "morning", // morning, afternoon
    leaveDate: {
      single: getCurrentDate(),
      from: getCurrentDate(),
      to: getCurrentDate(),
    },
    reason: "",
  });

  // Loading and notification states
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [isLoadingLeaves, setIsLoadingLeaves] = useState(false);
  const [leaveRecords, setLeaveRecords] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [leaveUsageData, setLeaveUsageData] = useState([]);
  const [isLoadingUsage, setIsLoadingUsage] = useState(false);
  const [disabledDates, setDisabledDates] = useState([]);

  // Define standard leave entitlements
  const leaveEntitlements = {
    "Annual Leave": 14,
    "Casual Leave": 7,
    "Medical Leave": 7,
    "Unpaid Leave": 0,
    "Special Leave": 3,
  };

  const leaveTypes = [
    "Annual Leave",
    "Casual Leave",
    "Medical Leave",
    "Unpaid Leave",
    "Special Leave",
  ];

  // Helper function to get current date in YYYY-MM-DD format
  function getCurrentDate() {
    const today = new Date();
    return today.toISOString().split("T")[0];
  }

  // Function to format date for display
  function formatDate(dateInput) {
    if (!dateInput) return "";
    const date =
      typeof dateInput === "string" ? new Date(dateInput) : dateInput;
    return date.toISOString().split("T")[0];
  }

  // Function to format leave record for display
  function formatLeaveRecord(leaveData) {
    return {
      id: leaveData.id,
      leaveDate: leaveData.leave_date
        ? formatDate(leaveData.leave_date)
        : `${formatDate(leaveData.leave_from)} to ${formatDate(
            leaveData.leave_to
          )}`,
      reportDate: formatDate(leaveData.reporting_date),
      fullHalfDay: leaveData.leave_date
        ? leaveData.period
          ? `Half Day (${leaveData.period})`
          : "Full Day"
        : "Multiple Days",
      leaveType: leaveData.leave_type,
      status: leaveData.status,
    };
  }

  // Function to get disabled dates from calendar data (from leave events)
  const getDisabledDates = (calendarData) => {
    const dates = [];
    calendarData.forEach((leave) => {
      if (leave.start_date) {
        const start = new Date(leave.start_date);
        const end = leave.end_date
          ? new Date(leave.end_date)
          : new Date(leave.start_date);
        for (
          let date = new Date(start);
          date <= end;
          date.setDate(date.getDate() + 1)
        ) {
          dates.push(formatDate(new Date(date)));
        }
      }
    });
    return dates;
  };

  // Handle input changes with SweetAlert2 notification for disabled dates
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // If the field relates to leave dates, check if the selected date is disabled
    if (name.includes("leaveDate") && disabledDates.includes(value)) {
      Swal.fire({
        icon: "error",
        title: "Date Not Available",
        text: "This date has been marked as an Event day and is not available for leave requests.",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Ok, I understand",
        customClass: {
          popup: "rounded-xl",
          confirmButton: "rounded-lg text-sm px-5 py-2.5",
        },
      });
      return; // Do not update the state if disabled date is selected
    }

    // Handle nested objects in state (like leaveDate.single, leaveDate.from, etc.)
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Function to fetch employee leaves and calendar data (to set disabled dates)
  const fetchEmployeeLeaves = async (employeeId) => {
    if (!employeeId) return;

    setIsLoadingLeaves(true);
    try {
      const [leaveData, calendarData] = await Promise.all([
        getLeaveById(employeeId),
        fetchLeaveCalendar(),
      ]);

      // Set disabled dates from the calendar data
      setDisabledDates(getDisabledDates(calendarData));

      if (leaveData && Array.isArray(leaveData)) {
        const formattedLeaves = leaveData.map(formatLeaveRecord);
        setLeaveRecords(formattedLeaves);
      } else {
        setLeaveRecords([]);
      }
    } catch (error) {
      console.error("Error fetching employee leaves:", error);
      setLeaveRecords([]);
    } finally {
      setIsLoadingLeaves(false);
    }
  };

  // Function to fetch employee leave counts
  const fetchLeaveUsage = async (employeeId) => {
    if (!employeeId) return;

    setIsLoadingUsage(true);
    try {
      const leaveCounts = await getLeaveCountsByEmployee(employeeId);

      if (leaveCounts && Array.isArray(leaveCounts)) {
        const formattedUsage = Object.keys(leaveEntitlements).map(
          (leaveType, index) => {
            const leaveData = leaveCounts.find(
              (item) => item.leave_type === leaveType
            ) || {
              count: 0,
            };
            const total = leaveEntitlements[leaveType];
            const usage = leaveData.count;
            const balance = total - usage;

            return {
              id: index + 1,
              leaveType: leaveType,
              total: total,
              usage: usage,
              balance: balance,
            };
          }
        );
        setLeaveUsageData(formattedUsage);
      } else {
        const defaultUsage = Object.keys(leaveEntitlements).map(
          (leaveType, index) => ({
            id: index + 1,
            leaveType: leaveType,
            total: leaveEntitlements[leaveType],
            usage: 0,
            balance: leaveEntitlements[leaveType],
          })
        );
        setLeaveUsageData(defaultUsage);
      }
    } catch (error) {
      console.error("Error fetching leave usage data:", error);
      const defaultUsage = Object.keys(leaveEntitlements).map(
        (leaveType, index) => ({
          id: index + 1,
          leaveType: leaveType,
          total: leaveEntitlements[leaveType],
          usage: 0,
          balance: leaveEntitlements[leaveType],
        })
      );
      setLeaveUsageData(defaultUsage);
    } finally {
      setIsLoadingUsage(false);
    }
  };

  // Function to fetch employee details using the API
  const fetchEmployeeDetails = async () => {
    if (!formData.attendanceNo) {
      setSearchError("Please enter an employee number");
      return;
    }

    setIsLoading(true);
    setSearchError("");

    try {
      const employeeData = await employeeService.fetchEmployeeById(
        formData.attendanceNo
      );

      if (employeeData) {
        setFormData({
          ...formData,
          epfNo: employeeData.epf || "",
          employeeName: employeeData.name_with_initials || "",
          department:
            employeeData.organization_assignment?.department?.name || "",
        });

        await Promise.all([
          fetchEmployeeLeaves(formData.attendanceNo),
          fetchLeaveUsage(formData.attendanceNo),
        ]);
      } else {
        setSearchError("Employee not found");
        setLeaveRecords([]);
        const defaultUsage = Object.keys(leaveEntitlements).map(
          (leaveType, index) => ({
            id: index + 1,
            leaveType: leaveType,
            total: leaveEntitlements[leaveType],
            usage: 0,
            balance: leaveEntitlements[leaveType],
          })
        );
        setLeaveUsageData(defaultUsage);
      }
    } catch (error) {
      console.error("Error fetching employee data:", error);
      setSearchError("Failed to retrieve employee data. Please try again.");
      setLeaveRecords([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form submission for leave requests
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitSuccess(false);
    setIsSubmitting(true);

    try {
      let leaveData = {
        employee_id: parseInt(formData.attendanceNo),
        reporting_date: formData.reportingDate,
        leave_type: formData.leaveType,
        reason: formData.reason,
        status: "Pending",
        leave_date: null,
        leave_from: null,
        leave_to: null,
        period: null,
      };

      if (formData.leaveDateType === "fullDay") {
        leaveData.leave_date = formData.leaveDate.single;
      } else if (formData.leaveDateType === "halfDay") {
        leaveData.leave_date = formData.leaveDate.single;
        leaveData.period =
          formData.halfDayPeriod === "morning" ? "Morning" : "Afternoon";
      } else if (formData.leaveDateType === "manual") {
        leaveData.leave_from = formData.leaveDate.from;
        leaveData.leave_to = formData.leaveDate.to;
      }

      console.group("Leave Request Data Debug");
      console.log("Form data being submitted:", { ...formData });
      console.log("Formatted API payload:", leaveData);
      console.log("Leave type selected:", formData.leaveDateType);
      if (formData.leaveDateType === "fullDay") {
        console.log("Full day date:", formData.leaveDate.single);
      } else if (formData.leaveDateType === "halfDay") {
        console.log("Half day date:", formData.leaveDate.single);
        console.log("Half day period:", formData.halfDayPeriod);
      } else {
        console.log("Date range - From:", formData.leaveDate.from);
        console.log("Date range - To:", formData.leaveDate.to);
      }
      console.groupEnd();

      const response = await createLeave(leaveData);
      console.log("API Response:", response);

      await Promise.all([
        fetchEmployeeLeaves(formData.attendanceNo),
        fetchLeaveUsage(formData.attendanceNo),
      ]);

      setSubmitSuccess(true);
      setFormData({
        attendanceNo: formData.attendanceNo,
        epfNo: formData.epfNo,
        employeeName: formData.employeeName,
        department: formData.department,
        reportingDate: getCurrentDate(),
        leaveType: "",
        leaveDateType: "fullDay",
        halfDayPeriod: "morning",
        leaveDate: {
          single: getCurrentDate(),
          from: getCurrentDate(),
          to: getCurrentDate(),
        },
        reason: "",
      });
    } catch (error) {
      console.group("Leave Request Error Debug");
      console.error("Error submitting leave request:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      console.groupEnd();
      setSubmitError("Failed to submit leave request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Initialize default leave usage data when component mounts
  useEffect(() => {
    const defaultUsage = Object.keys(leaveEntitlements).map(
      (leaveType, index) => ({
        id: index + 1,
        leaveType: leaveType,
        total: leaveEntitlements[leaveType],
        usage: 0,
        balance: leaveEntitlements[leaveType],
      })
    );
    setLeaveUsageData(defaultUsage);
  }, []);

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
            {submitSuccess && (
              <div className="mb-6 bg-green-100 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  <span>Leave request submitted successfully!</span>
                </div>
                <button
                  onClick={() => setSubmitSuccess(false)}
                  className="text-green-700 hover:text-green-900"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            {submitError && (
              <div className="mb-6 bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between">
                <div className="flex items-center">
                  <X className="w-5 h-5 mr-2" />
                  <span>{submitError}</span>
                </div>
                <button
                  onClick={() => setSubmitError("")}
                  className="text-red-700 hover:text-red-900"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column - Leave Form */}
                <div className="space-y-6">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Attendance No */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          EMP number <span className="text-red-500">*</span>
                        </label>
                        <div className="flex">
                          <input
                            type="text"
                            name="attendanceNo"
                            value={formData.attendanceNo}
                            onChange={handleInputChange}
                            required
                            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            placeholder="Enter employee number"
                          />
                          <button
                            type="button"
                            className="ml-2 p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                            onClick={fetchEmployeeDetails}
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <div className="w-5 h-5 border-t-2 border-b-2 border-blue-600 rounded-full animate-spin"></div>
                            ) : (
                              <Search className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                        {searchError && (
                          <p className="text-xs text-red-500 mt-1">
                            {searchError}
                          </p>
                        )}
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
                          disabled
                          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 bg-gray-50 text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
                          disabled
                          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 bg-gray-50 text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
                          disabled
                          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 bg-gray-50 text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
                          disabled
                          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 bg-gray-50 text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Leave Date Section */}
                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Leave Duration <span className="text-red-500">*</span>
                      </label>
                      <div className="flex flex-wrap gap-4 mb-4">
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="fullDay"
                            name="leaveDateType"
                            value="fullDay"
                            checked={formData.leaveDateType === "fullDay"}
                            onChange={handleInputChange}
                            className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500"
                          />
                          <label
                            htmlFor="fullDay"
                            className="text-sm text-gray-700"
                          >
                            Full Day
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="halfDay"
                            name="leaveDateType"
                            value="halfDay"
                            checked={formData.leaveDateType === "halfDay"}
                            onChange={handleInputChange}
                            className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500"
                          />
                          <label
                            htmlFor="halfDay"
                            className="text-sm text-gray-700"
                          >
                            Half Day
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="manual"
                            name="leaveDateType"
                            value="manual"
                            checked={formData.leaveDateType === "manual"}
                            onChange={handleInputChange}
                            className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500"
                          />
                          <label
                            htmlFor="manual"
                            className="text-sm text-gray-700"
                          >
                            Date Range
                          </label>
                        </div>
                      </div>

                      {formData.leaveDateType === "fullDay" && (
                        <div className="mb-4">
                          <label className="block text-xs text-gray-500 mb-1">
                            Date
                          </label>
                          <input
                            type="date"
                            name="leaveDate.single"
                            value={formData.leaveDate.single}
                            onChange={handleInputChange}
                            required
                            className="w-full sm:w-1/2 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          />
                        </div>
                      )}

                      {formData.leaveDateType === "halfDay" && (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">
                              Date
                            </label>
                            <input
                              type="date"
                              name="leaveDate.single"
                              value={formData.leaveDate.single}
                              onChange={handleInputChange}
                              required
                              className="w-full sm:w-1/2 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">
                              Period
                            </label>
                            <select
                              name="halfDayPeriod"
                              value={formData.halfDayPeriod}
                              onChange={handleInputChange}
                              required
                              className="w-full sm:w-1/2 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            >
                              <option value="morning">Morning</option>
                              <option value="afternoon">Afternoon</option>
                            </select>
                          </div>
                        </div>
                      )}

                      {formData.leaveDateType === "manual" && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">
                              From
                            </label>
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
                            <label className="block text-xs text-gray-500 mb-1">
                              To
                            </label>
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
                      )}
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

                    <div className="mt-4 text-xs text-gray-500">
                      <p>
                        Marked with <span className="text-red-500">*</span> are
                        required
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 flex justify-end space-x-4">
                    <button
                      type="button"
                      className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
                      onClick={() => {
                        setFormData({
                          attendanceNo: "",
                          epfNo: "",
                          employeeName: "",
                          department: "",
                          reportingDate: getCurrentDate(),
                          leaveType: "",
                          leaveDateType: "fullDay",
                          halfDayPeriod: "morning",
                          leaveDate: {
                            single: getCurrentDate(),
                            from: getCurrentDate(),
                            to: getCurrentDate(),
                          },
                          reason: "",
                        });
                        setSearchError("");
                        setSubmitError("");
                        setSubmitSuccess(false);
                        setLeaveRecords([]);
                      }}
                      disabled={isSubmitting}
                    >
                      Clear Form
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-colors shadow-md hover:shadow-lg flex items-center justify-center min-w-[150px]"
                      disabled={isSubmitting || !formData.attendanceNo}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                          <span>Submitting...</span>
                        </>
                      ) : (
                        "Submit Leave Request"
                      )}
                    </button>
                  </div>
                </div>

                {/* Right Column - Leave Records */}
                <div className="space-y-6">
                  {/* Leave Usage Summary Section */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium text-gray-800">
                        Leave Usage Summary
                      </h3>
                      {formData.employeeName && (
                        <span className="text-sm text-gray-600">
                          {formData.employeeName}
                        </span>
                      )}
                    </div>
                    <div className="overflow-x-auto">
                      {isLoadingUsage ? (
                        <div className="py-10 text-center">
                          <div className="inline-block w-6 h-6 border-t-2 border-b-2 border-blue-600 rounded-full animate-spin"></div>
                          <p className="mt-2 text-sm text-gray-600">
                            Loading leave usage data...
                          </p>
                        </div>
                      ) : (
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
                                <td className="px-4 py-3 border text-sm">
                                  {item.id}
                                </td>
                                <td className="px-4 py-3 border text-sm">
                                  {item.leaveType}
                                </td>
                                <td className="px-4 py-3 border text-sm">
                                  {item.total}
                                </td>
                                <td className="px-4 py-3 border text-sm">
                                  {item.usage}
                                </td>
                                <td className="px-4 py-3 border text-sm font-medium text-blue-600">
                                  {item.balance}
                                </td>
                              </tr>
                            ))}
                            {leaveUsageData.length === 0 && !isLoadingUsage && (
                              <tr>
                                <td
                                  colSpan="5"
                                  className="px-4 py-8 border text-center text-gray-500"
                                >
                                  {formData.employeeName
                                    ? "No leave usage data available for this employee"
                                    : "Search for an employee to view leave balances"}
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>

                  {/* Employee Leave Record */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium text-gray-800">
                        Employee Leave Record
                      </h3>
                      {formData.employeeName && (
                        <span className="text-sm text-gray-600">
                          {formData.employeeName}
                        </span>
                      )}
                    </div>
                    <div className="overflow-x-auto">
                      {isLoadingLeaves ? (
                        <div className="py-10 text-center">
                          <div className="inline-block w-6 h-6 border-t-2 border-b-2 border-blue-600 rounded-full animate-spin"></div>
                          <p className="mt-2 text-sm text-gray-600">
                            Loading leave records...
                          </p>
                        </div>
                      ) : (
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
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">
                                Status
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {leaveRecords.map((record) => (
                              <tr key={record.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 border text-sm">
                                  {record.id}
                                </td>
                                <td className="px-4 py-3 border text-sm">
                                  {record.leaveDate}
                                </td>
                                <td className="px-4 py-3 border text-sm">
                                  {record.reportDate}
                                </td>
                                <td className="px-4 py-3 border text-sm">
                                  {record.fullHalfDay}
                                </td>
                                <td className="px-4 py-3 border text-sm">
                                  {record.leaveType}
                                </td>
                                <td className="px-4 py-3 border text-sm">
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      record.status === "Approved"
                                        ? "bg-green-100 text-green-800"
                                        : record.status === "Rejected"
                                        ? "bg-red-100 text-red-800"
                                        : "bg-yellow-100 text-yellow-800"
                                    }`}
                                  >
                                    {record.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                            {leaveRecords.length === 0 && !isLoadingLeaves && (
                              <tr>
                                <td
                                  colSpan="6"
                                  className="px-4 py-8 border text-center text-gray-500"
                                >
                                  {formData.employeeName
                                    ? "No leave records found for this employee"
                                    : "Search for an employee to view their leave records"}
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      )}
                    </div>
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
