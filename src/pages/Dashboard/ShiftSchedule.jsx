import React, { useState } from "react";
import {
  Search,
  Filter,
  Clock,
  Users,
  Calendar,
  CheckCircle2,
  Circle,
  MapPin,
  AlertCircle,
  Timer,
  Coffee,
} from "lucide-react";

const ShiftSchedule = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedShifts, setSelectedShifts] = useState(new Set());
  const [filterType, setFilterType] = useState("all");

  const shifts = [
    {
      code: "001",
      description: "No OT - WD",
      startTime: "08:00:00",
      endTime: "17:00:00",
      morningOTStart: "08:00",
      specialOTStart: "17:00:00",
      lateDeduction: "00:00",
      midnightRoster: false,
      nightlyHours: 4.5,
      department: "General",
      location: "Main Office",
      breakTime: "12:00-13:00",
    },
    {
      code: "002",
      description: "Sril Mgt - FM",
      startTime: "08:15:00",
      endTime: "17:15:00",
      morningOTStart: "08:15",
      specialOTStart: "17:15:00",
      lateDeduction: "00:00",
      midnightRoster: false,
      nightlyHours: 4.5,
      department: "Management",
      location: "Floor 2",
      breakTime: "12:15-13:15",
    },
    {
      code: "003",
      description: "Sril Mgt - Purchasing",
      startTime: "07:45:00",
      endTime: "16:45:00",
      morningOTStart: "07:45",
      specialOTStart: "16:45:00",
      lateDeduction: "00:00",
      midnightRoster: false,
      nightlyHours: 4.5,
      department: "Procurement",
      location: "Building A",
      breakTime: "12:00-13:00",
    },
    {
      code: "004",
      description: "Office Executive - WD",
      startTime: "08:00:00",
      endTime: "17:00:00",
      morningOTStart: "08:00",
      specialOTStart: "17:00:00",
      lateDeduction: "00:00",
      midnightRoster: false,
      nightlyHours: 4.5,
      department: "Administration",
      location: "Main Office",
      breakTime: "12:00-13:00",
    },
    {
      code: "005",
      description: "Office Executive - WE",
      startTime: "08:00:00",
      endTime: "13:00:00",
      morningOTStart: "08:00",
      specialOTStart: "13:00:00",
      lateDeduction: "00:00",
      midnightRoster: false,
      nightlyHours: 5.0,
      department: "Administration",
      location: "Main Office",
      breakTime: "10:30-11:00",
    },
    {
      code: "006",
      description: "Production Mgr - WD",
      startTime: "08:00:00",
      endTime: "17:00:00",
      morningOTStart: "07:30",
      specialOTStart: "17:15:00",
      lateDeduction: "00:00",
      midnightRoster: false,
      nightlyHours: 4.5,
      department: "Production",
      location: "Factory Floor",
      breakTime: "12:00-13:00",
    },
    {
      code: "007",
      description: "Production Mgr - WE",
      startTime: "08:00:00",
      endTime: "13:00:00",
      morningOTStart: "07:30",
      specialOTStart: "17:15:00",
      lateDeduction: "00:00",
      midnightRoster: false,
      nightlyHours: 5.0,
      department: "Production",
      location: "Factory Floor",
      breakTime: "10:30-11:00",
    },
    {
      code: "008",
      description: "QC - WE",
      startTime: "08:00:00",
      endTime: "13:00:00",
      morningOTStart: "08:00",
      specialOTStart: "17:00:00",
      lateDeduction: "00:00",
      midnightRoster: false,
      nightlyHours: 5.0,
      department: "Quality Control",
      location: "Lab",
      breakTime: "10:30-11:00",
    },
    {
      code: "009",
      description: "No OT with Late - WD",
      startTime: "08:00:00",
      endTime: "17:00:00",
      morningOTStart: "08:00",
      specialOTStart: "17:00:00",
      lateDeduction: "00:00",
      midnightRoster: false,
      nightlyHours: 4.5,
      department: "General",
      location: "Main Office",
      breakTime: "12:00-13:00",
    },
    {
      code: "010",
      description: "Production - WD",
      startTime: "08:00:00",
      endTime: "17:00:00",
      morningOTStart: "07:30",
      specialOTStart: "17:00:00",
      lateDeduction: "00:00",
      midnightRoster: false,
      nightlyHours: 4.5,
      department: "Production",
      location: "Factory Floor",
      breakTime: "12:00-13:00",
    },
    {
      code: "011",
      description: "Production - WE",
      startTime: "08:00:00",
      endTime: "13:00:00",
      morningOTStart: "07:30",
      specialOTStart: "17:00:00",
      lateDeduction: "00:00",
      midnightRoster: false,
      nightlyHours: 2.0,
      department: "Production",
      location: "Factory Floor",
      breakTime: "10:30-11:00",
    },
    {
      code: "012",
      description: "Production - Night",
      startTime: "20:00:00",
      endTime: "07:00:00",
      morningOTStart: "08:00",
      specialOTStart: "17:00:00",
      lateDeduction: "00:00",
      midnightRoster: false,
      nightlyHours: 4.5,
      department: "Production",
      location: "Factory Floor",
      breakTime: "02:00-02:30",
    },
    {
      code: "013",
      description: "No OT with Late - WE",
      startTime: "12:00:00",
      endTime: "17:00:00",
      morningOTStart: "12:00",
      specialOTStart: "17:00:00",
      lateDeduction: "13:00",
      midnightRoster: false,
      nightlyHours: 5.0,
      department: "General",
      location: "Main Office",
      breakTime: "14:30-15:00",
    },
    {
      code: "014",
      description: "OT with Late - WE",
      startTime: "12:00:00",
      endTime: "17:00:00",
      morningOTStart: "11:30",
      specialOTStart: "17:00:00",
      lateDeduction: "12:00",
      midnightRoster: false,
      nightlyHours: 5.0,
      department: "General",
      location: "Main Office",
      breakTime: "14:30-15:00",
    },
    {
      code: "015",
      description: "Security - WD Morning",
      startTime: "07:00:00",
      endTime: "15:00:00",
      morningOTStart: "07:00",
      specialOTStart: "18:00:00",
      lateDeduction: "07:00",
      midnightRoster: false,
      nightlyHours: 4.0,
      department: "Security",
      location: "Gate 1",
      breakTime: "11:00-11:30",
    },
    {
      code: "016",
      description: "Security - WD Night",
      startTime: "19:00:00",
      endTime: "03:00:00",
      morningOTStart: "07:00",
      specialOTStart: "07:00:00",
      lateDeduction: "07:00",
      midnightRoster: true,
      nightlyHours: 4.0,
      department: "Security",
      location: "Perimeter",
      breakTime: "23:00-23:30",
    },
    {
      code: "017",
      description: "Security - WE Morning",
      startTime: "07:00:00",
      endTime: "12:00:00",
      morningOTStart: "07:00",
      specialOTStart: "19:00:00",
      lateDeduction: "07:00",
      midnightRoster: false,
      nightlyHours: 5.0,
      department: "Security",
      location: "Gate 2",
      breakTime: "09:30-10:00",
    },
    {
      code: "018",
      description: "Security - WE Night",
      startTime: "19:00:00",
      endTime: "00:00:00",
      morningOTStart: "07:00",
      specialOTStart: "07:00:00",
      lateDeduction: "07:00",
      midnightRoster: true,
      nightlyHours: 5.0,
      department: "Security",
      location: "Perimeter",
      breakTime: "21:30-22:00",
    },
    {
      code: "019",
      description: "Driver - WD",
      startTime: "08:00:00",
      endTime: "17:00:00",
      morningOTStart: "07:30",
      specialOTStart: "18:30:00",
      lateDeduction: "00:00",
      midnightRoster: false,
      nightlyHours: 4.5,
      department: "Transport",
      location: "Garage",
      breakTime: "12:00-13:00",
    },
  ];

  const filteredShifts = shifts.filter((shift) => {
    const matchesSearch =
      shift.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shift.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shift.department.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterType === "all") return matchesSearch;
    if (filterType === "weekday")
      return matchesSearch && shift.description.includes("WD");
    if (filterType === "weekend")
      return matchesSearch && shift.description.includes("WE");
    if (filterType === "night")
      return (
        matchesSearch &&
        (shift.description.includes("Night") || shift.midnightRoster)
      );
    if (filterType === "security")
      return matchesSearch && shift.department === "Security";
    if (filterType === "production")
      return matchesSearch && shift.department === "Production";

    return matchesSearch;
  });

  const toggleShiftSelection = (code) => {
    const newSelected = new Set(selectedShifts);
    if (newSelected.has(code)) {
      newSelected.delete(code);
    } else {
      newSelected.add(code);
    }
    setSelectedShifts(newSelected);
  };

  const formatTime = (time) => {
    return time.slice(0, 5);
  };

  const getShiftTypeColor = (description) => {
    if (description.includes("Night") || description.includes("night"))
      return "bg-indigo-100 text-indigo-800 border-indigo-200";
    if (description.includes("WE"))
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    if (description.includes("Security"))
      return "bg-red-100 text-red-800 border-red-200";
    if (description.includes("Production"))
      return "bg-blue-100 text-blue-800 border-blue-200";
    if (description.includes("QC"))
      return "bg-purple-100 text-purple-800 border-purple-200";
    if (description.includes("Driver"))
      return "bg-orange-100 text-orange-800 border-orange-200";
    return "bg-slate-100 text-slate-800 border-slate-200";
  };

  const getDepartmentColor = (department) => {
    const colors = {
      Security: "bg-red-50 text-red-700",
      Production: "bg-blue-50 text-blue-700",
      Management: "bg-purple-50 text-purple-700",
      Administration: "bg-green-50 text-green-700",
      "Quality Control": "bg-yellow-50 text-yellow-700",
      Transport: "bg-orange-50 text-orange-700",
      Procurement: "bg-teal-50 text-teal-700",
      General: "bg-gray-50 text-gray-700",
    };
    return colors[department] || "bg-gray-50 text-gray-700";
  };

  const calculateShiftDuration = (start, end) => {
    const startTime = new Date(`2000-01-01 ${start}`);
    let endTime = new Date(`2000-01-01 ${end}`);

    // Handle overnight shifts
    if (endTime <= startTime) {
      endTime.setDate(endTime.getDate() + 1);
    }

    const diff = endTime - startTime;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes > 0 ? minutes + "m" : ""}`.trim();
  };

  const stats = {
    total: shifts.length,
    weekday: shifts.filter((s) => s.description.includes("WD")).length,
    weekend: shifts.filter((s) => s.description.includes("WE")).length,
    night: shifts.filter(
      (s) => s.description.includes("Night") || s.midnightRoster
    ).length,
  };

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
            <Calendar className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Shift Schedule Manager
            </h1>
            <p className="text-gray-600 mt-1">
              Manage and optimize employee work schedules
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Shifts</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border-l-4 border-green-500 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Weekday</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.weekday}
                </p>
              </div>
              <Clock className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border-l-4 border-emerald-500 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Weekend</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.weekend}
                </p>
              </div>
              <Coffee className="w-8 h-8 text-emerald-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border-l-4 border-indigo-500 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Night Shifts</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.night}
                </p>
              </div>
              <Timer className="w-8 h-8 text-indigo-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Controls - Inline Filter Row */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search shifts, codes, or departments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
            />
          </div>

          {/* Inline Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <div className="flex flex-wrap gap-2">
              {[
                {
                  value: "all",
                  label: "All",
                  color: "bg-gray-100 text-gray-700 hover:bg-gray-200",
                },
                {
                  value: "weekday",
                  label: "Weekday",
                  color: "bg-green-100 text-green-700 hover:bg-green-200",
                },
                {
                  value: "weekend",
                  label: "Weekend",
                  color: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200",
                },
                {
                  value: "night",
                  label: "Night",
                  color: "bg-indigo-100 text-indigo-700 hover:bg-indigo-200",
                },
                {
                  value: "security",
                  label: "Security",
                  color: "bg-red-100 text-red-700 hover:bg-red-200",
                },
                {
                  value: "production",
                  label: "Production",
                  color: "bg-blue-100 text-blue-700 hover:bg-blue-200",
                },
              ].map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setFilterType(filter.value)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-200 ${
                    filterType === filter.value
                      ? "ring-2 ring-blue-500 ring-offset-1 " + filter.color
                      : filter.color
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Selected Count */}
          {selectedShifts.size > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg border border-blue-200">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">
                {selectedShifts.size} selected
              </span>
              <button
                onClick={() => setSelectedShifts(new Set())}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium ml-2"
              >
                Clear
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-4 py-4 text-left">
                  <input
                    type="checkbox"
                    checked={
                      selectedShifts.size === filteredShifts.length &&
                      filteredShifts.length > 0
                    }
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedShifts(
                          new Set(filteredShifts.map((s) => s.code))
                        );
                      } else {
                        setSelectedShifts(new Set());
                      }
                    }}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Shift Details
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Schedule
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Overtime
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Details
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredShifts.map((shift, index) => (
                <tr
                  key={shift.code}
                  className={`hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 ${
                    selectedShifts.has(shift.code)
                      ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500"
                      : index % 2 === 0
                      ? "bg-white"
                      : "bg-gray-50/30"
                  }`}
                >
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedShifts.has(shift.code)}
                      onChange={() => toggleShiftSelection(shift.code)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <div className="font-mono text-sm font-bold text-white bg-gradient-to-r from-gray-700 to-gray-800 px-3 py-2 rounded-lg shadow-sm">
                      {shift.code}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-900">
                          {shift.description}
                        </span>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full border ${getShiftTypeColor(
                            shift.description
                          )}`}
                        >
                          {shift.description.includes("WD")
                            ? "Weekday"
                            : shift.description.includes("WE")
                            ? "Weekend"
                            : shift.description.includes("Night")
                            ? "Night"
                            : "Regular"}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-600">
                        <div className="flex items-center gap-1">
                          <div
                            className={`w-2 h-2 rounded-full ${getDepartmentColor(
                              shift.department
                            )
                              .replace("text-", "bg-")
                              .replace("-700", "-500")}`}
                          ></div>
                          <span className="font-medium">
                            {shift.department}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>{shift.location}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-mono font-semibold text-gray-900">
                            {formatTime(shift.startTime)}
                          </span>
                        </div>
                        <span className="text-gray-400">→</span>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-red-600" />
                          <span className="text-sm font-mono font-semibold text-gray-900">
                            {formatTime(shift.endTime)}
                          </span>
                        </div>
                      </div>
                      <div className="text-xs text-gray-600">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                          {calculateShiftDuration(
                            shift.startTime,
                            shift.endTime
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Coffee className="w-3 h-3" />
                        <span>Break: {shift.breakTime}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-1">
                        <span className="text-gray-600">Morning:</span>
                        <span className="font-mono font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                          {shift.morningOTStart}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-gray-600">Special:</span>
                        <span className="font-mono font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                          {formatTime(shift.specialOTStart)}
                        </span>
                      </div>
                      {shift.lateDeduction !== "00:00" && (
                        <div className="flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 text-red-500" />
                          <span className="text-red-600 font-medium">
                            Late: {shift.lateDeduction}
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="text-gray-600">Night Hours: </span>
                        <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-1 rounded">
                          {shift.nightlyHours.toFixed(2)}h
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col items-center gap-2">
                      {shift.midnightRoster ? (
                        <div className="flex items-center gap-1">
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                          <span className="text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded-full">
                            Midnight
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <Circle className="w-5 h-5 text-gray-300" />
                          <span className="text-xs text-gray-500">Regular</span>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enhanced Footer */}
      <div className="mt-6 bg-white rounded-lg p-4 shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>
              Showing{" "}
              <span className="font-semibold text-gray-900">
                {filteredShifts.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-900">
                {shifts.length}
              </span>{" "}
              shifts
            </span>
            {filterType !== "all" && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                Filtered by: {filterType}
              </span>
            )}
          </div>
          {selectedShifts.size > 0 && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">
                <span className="font-semibold text-blue-600">
                  {selectedShifts.size}
                </span>{" "}
                shifts selected
              </span>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                  Export Selected
                </button>
                <button
                  onClick={() => setSelectedShifts(new Set())}
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ShiftSchedule;
