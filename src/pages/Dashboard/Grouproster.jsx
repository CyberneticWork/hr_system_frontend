import React, { useState, useMemo, useEffect } from "react";
import {
  Calendar,
  Search,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  ChevronRight,
  Eye,
} from "lucide-react";
import ShiftScheduleService from "@services/ShiftScheduleService";
import RosterService from "@services/RosterService";
import employeeService from "@services/EmployeeDataService";
import {
  fetchCompanies,
  fetchDepartments,
  fetchSubDepartmentsById,
  fetchSubDepartments,
} from "@services/ApiDataService";

const RosterManagementSystem = () => {
  // State for form inputs
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [rosterDate, setRosterDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddShift, setShowAddShift] = useState(false);
  const [editingShift, setEditingShift] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedSubDepartment, setSelectedSubDepartment] = useState("");
  const [assignMode, setAssignMode] = useState("designation");
  const [rosterAssignments, setRosterAssignments] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState(new Set());
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);

  // Data states
  const [companies, setCompanies] = useState([]);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(false);
  const [companiesError, setCompaniesError] = useState(null);

  const [departments, setDepartments] = useState([]);
  const [isLoadingDepartments, setIsLoadingDepartments] = useState(false);
  const [departmentsError, setDepartmentsError] = useState(null);

  const [subDepartments, setSubDepartments] = useState([]);
  const [isLoadingSubDepartments, setIsLoadingSubDepartments] = useState(false);
  const [subDepartmentsError, setSubDepartmentsError] = useState(null);

  const [employees, setEmployees] = useState([]);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(false);
  const [employeesError, setEmployeesError] = useState(null);

  const [shifts, setShifts] = useState([]);
  const [isLoadingShifts, setIsLoadingShifts] = useState(false);
  const [shiftsError, setShiftsError] = useState(null);

  const [selectedShifts, setSelectedShifts] = useState(new Set());
  const [isSaving, setIsSaving] = useState(false);

  // Set default dates on component mount
  useEffect(() => {
    const today = new Date();
    const defaultDateFrom = today.toISOString().split('T')[0];
    const defaultDateTo = new Date(today.setDate(today.getDate() + 30)).toISOString().split('T')[0];
    
    setDateFrom(defaultDateFrom);
    setDateTo(defaultDateTo);
    setRosterDate(defaultDateFrom);
  }, []);

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      await fetchCompaniesData();
      await fetchShiftsData();
    };

    fetchInitialData();
  }, []);

  // Data fetching functions
  const fetchCompaniesData = async () => {
    try {
      setIsLoadingCompanies(true);
      const data = await fetchCompanies();
      setCompanies(data);
    } catch (err) {
      console.error("Failed to fetch companies:", err);
      setCompaniesError("Failed to load companies");
    } finally {
      setIsLoadingCompanies(false);
    }
  };

  const fetchDepartmentsData = async () => {
    try {
      setIsLoadingDepartments(true);
      const data = await fetchDepartments();
      setDepartments(data);
    } catch (err) {
      console.error("Failed to fetch departments:", err);
      setDepartmentsError("Failed to load departments");
    } finally {
      setIsLoadingDepartments(false);
    }
  };

  const fetchSubDepartmentsData = async () => {
    try {
      setIsLoadingSubDepartments(true);
      const data = await fetchSubDepartments();
      setSubDepartments(data);
    } catch (err) {
      console.error("Failed to fetch sub-departments:", err);
      setSubDepartmentsError("Failed to load sub-departments");
    } finally {
      setIsLoadingSubDepartments(false);
    }
  };

  const fetchEmployeesData = async () => {
    try {
      setIsLoadingEmployees(true);
      const filters = {};
      if (selectedCompany) filters.company_id = selectedCompany;
      if (selectedDepartment) filters.department_id = selectedDepartment;
      if (selectedSubDepartment) filters.sub_department_id = selectedSubDepartment;
      
      const data = await RosterService.getEmployeesForRoster(filters);
      setEmployees(data.map(emp => ({
        id: emp.id,
        empCode: emp.employee_code,
        name: `${emp.first_name} ${emp.last_name}`,
        department_id: emp.department_id?.toString(),
        sub_department_id: emp.sub_department_id?.toString()
      })));
    } catch (err) {
      console.error("Failed to fetch employees:", err);
      setEmployeesError("Failed to load employees");
    } finally {
      setIsLoadingEmployees(false);
    }
  };

  const fetchShiftsData = async () => {
    try {
      setIsLoadingShifts(true);
      const data = await ShiftScheduleService.getAllShifts();
      setShifts(data.map(shift => ({
        id: shift.id,
        scode: shift.shift_code,
        shiftName: shift.shift_name || shift.shift_description,
        shiftStart: shift.start_time.substring(0, 5),
        shiftEnd: shift.end_time.substring(0, 5)
      })));
    } catch (err) {
      console.error("Failed to fetch shifts:", err);
      setShiftsError("Failed to load shifts");
    } finally {
      setIsLoadingShifts(false);
    }
  };

  // Fetch departments when company changes
  useEffect(() => {
    if (selectedCompany) {
      fetchDepartmentsData();
    } else {
      setSelectedDepartment("");
    }
  }, [selectedCompany]);

  // Fetch sub-departments when department changes
  useEffect(() => {
    if (selectedDepartment) {
      fetchSubDepartmentsData();
    } else {
      setSelectedSubDepartment("");
    }
  }, [selectedDepartment]);

  // Fetch employees when organizational selection changes
  useEffect(() => {
    if (selectedCompany || selectedDepartment || selectedSubDepartment) {
      fetchEmployeesData();
    }
  }, [selectedCompany, selectedDepartment, selectedSubDepartment]);

  // Filter departments by company
  const filteredDepartments = useMemo(() => {
    return departments.filter((dep) => 
      selectedCompany ? dep.company_id?.toString() === selectedCompany : true
    );
  }, [selectedCompany, departments]);

  // Filter sub-departments by department
  const filteredSubDepartments = useMemo(() => {
    return subDepartments.filter((sub) => 
      selectedDepartment ? sub.department_id?.toString() === selectedDepartment : true
    );
  }, [selectedDepartment, subDepartments]);

  // Filter employees based on selections
  const filteredEmployees = useMemo(() => {
    let filtered = employees;
    
    if (searchTerm) {
      filtered = filtered.filter(emp =>
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.empCode.includes(searchTerm)
      );
    }
    
    return filtered;
  }, [employees, searchTerm]);

  // Helper functions to get names
  const getCompanyName = (id) => 
    companies.find((c) => c.id.toString() === id)?.name || "";
    
  const getDepartmentName = (id) => 
    departments.find((d) => d.id.toString() === id)?.name || "";
    
  const getSubDepartmentName = (id) => 
    subDepartments.find((s) => s.id.toString() === id)?.name || "";

  // Shift selection handler
  const toggleShiftSelection = (shift) => {
    setSelectedShifts((prev) => {
      const newSelected = new Set(prev);
      if (newSelected.has(shift.id)) {
        newSelected.delete(shift.id);
      } else {
        newSelected.add(shift.id);
      }
      return newSelected;
    });
  };

  // Add selected shifts to roster
  const handleAddShift = () => {
    if (selectedShifts.size === 0) return;

    let employeesToAssign = [];
    if (assignMode === "designation") {
      employeesToAssign = filteredEmployees.map((e) => e.id);
    } else if (assignMode === "employee") {
      employeesToAssign = Array.from(selectedEmployees);
    }

    if (employeesToAssign.length === 0) return;

    const shiftsToAssign = shifts.filter((shift) =>
      selectedShifts.has(shift.id)
    );

    const newAssignments = shiftsToAssign.map((shift) => ({
      company: selectedCompany,
      department: selectedDepartment,
      subDepartment: selectedSubDepartment,
      employees: employeesToAssign,
      shift: shift,
      dateFrom,
      dateTo,
    }));

    setRosterAssignments((prev) => [...prev, ...newAssignments]);
    setSelectedShifts(new Set());
    setSelectedEmployees(new Set());
  };

  // Remove assignment
  const handleRemoveAssignment = (idx) => {
    setRosterAssignments((prev) => prev.filter((_, i) => i !== idx));
  };

  // Handle employee selection
  const handleEmployeeSelect = (empId) => {
    if (assignMode !== "employee") return;
    setSelectedEmployees((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(empId)) {
        newSet.delete(empId);
      } else {
        newSet.add(empId);
      }
      return newSet;
    });
  };

  // Save roster to backend
  const handleSaveRoster = async () => {
    if (rosterAssignments.length === 0) return;

    try {
      setIsSaving(true);
      
      const assignments = rosterAssignments.flatMap(assignment => {
        return assignment.employees.map(employeeId => ({
          shift_code: assignment.shift.id,
          company_id: assignment.company || null,
          department_id: assignment.department || null,
          sub_department_id: assignment.subDepartment || null,
          employee_id: employeeId || null,
          date_from: assignment.dateFrom,
          date_to: assignment.dateTo
        }));
      });

      await RosterService.createBatchRosters(assignments);
      
      // Reset form after successful save
      setRosterAssignments([]);
      setSelectedCompany("");
      setSelectedDepartment("");
      setSelectedSubDepartment("");
      setSelectedShifts(new Set());
      setSelectedEmployees(new Set());
      
      alert('Roster assignments saved successfully!');
    } catch (error) {
      console.error('Error saving roster:', error);
      alert(`Failed to save roster: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Add or update shift (for modal)
  const addOrUpdateShift = (shift) => {
    if (editingShift) {
      setShifts((prev) =>
        prev.map((s) =>
          s.id === editingShift.id ? { ...s, ...shift } : s
        )
      );
    } else {
      setShifts((prev) => [
        ...prev,
        {
          ...shift,
          id: Math.max(...prev.map(s => s.id), 0) + 1,
          scode: `S${Math.max(...prev.map(s => parseInt(s.scode.replace('S', '')), 0) + 1)}`,
        },
      ]);
    }
    setShowAddShift(false);
    setEditingShift(null);
  };

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      {/* Top Header */}
      <div className="bg-blue-600 text-white px-4 py-3 flex items-center justify-between shadow-md">
        <h1 className="text-xl font-bold">Roster Management System</h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm bg-blue-700 px-3 py-1 rounded-full">
            Filtering Options
          </span>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Filters */}
        <div className="w-80 bg-white border-r border-gray-300 flex flex-col shadow-sm">
          {/* Date Range Section */}
          <div className="p-4 border-b border-gray-200">
            <div className="bg-gradient-to-r from-orange-100 to-orange-50 border border-orange-300 rounded-lg p-4 mb-4 shadow-sm">
              <h3 className="font-semibold text-sm mb-3 text-orange-800 flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Roster Date
              </h3>
              <input
                type="date"
                value={rosterDate}
                onChange={(e) => setRosterDate(e.target.value)}
                className="w-full px-3 py-2 border border-orange-300 rounded-md text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Date From
                </label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Date To
                </label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <button className="w-full mt-4 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white py-2 px-4 rounded-md text-sm font-semibold shadow-md transition-all duration-200 transform hover:scale-105">
              Show Details
            </button>
          </div>

          {/* Company/Department/SubDepartment Dropdowns */}
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-sm mb-3 text-gray-800">
              Select Company / Department / Sub Department
            </h3>
            <div className="space-y-3">
              {/* Company Dropdown */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Company
                </label>
                {isLoadingCompanies ? (
                  <div className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50 flex items-center justify-center">
                    <div className="h-4 w-4 mr-2 rounded-full border-2 border-t-blue-500 animate-spin"></div>
                    Loading...
                  </div>
                ) : companiesError ? (
                  <div className="w-full px-3 py-2 border border-red-300 bg-red-50 rounded-md text-sm text-red-600">
                    Error loading companies
                  </div>
                ) : (
                  <select
                    value={selectedCompany}
                    onChange={(e) => {
                      setSelectedCompany(e.target.value);
                      setSelectedDepartment("");
                      setSelectedSubDepartment("");
                      setSelectedShifts(new Set());
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Company</option>
                    {companies.map((company) => (
                      <option key={company.id} value={company.id}>
                        {company.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              {/* Department Dropdown */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Department
                </label>
                {isLoadingDepartments ? (
                  <div className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50 flex items-center justify-center">
                    <div className="h-4 w-4 mr-2 rounded-full border-2 border-t-blue-500 animate-spin"></div>
                    Loading...
                  </div>
                ) : departmentsError ? (
                  <div className="w-full px-3 py-2 border border-red-300 bg-red-50 rounded-md text-sm text-red-600">
                    Error loading departments
                  </div>
                ) : (
                  <select
                    value={selectedDepartment}
                    onChange={(e) => {
                      setSelectedDepartment(e.target.value);
                      setSelectedSubDepartment("");
                    }}
                    disabled={!selectedCompany}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Department</option>
                    {filteredDepartments.map((dep) => (
                      <option key={dep.id} value={dep.id}>
                        {dep.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              {/* Sub Department Dropdown */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Sub Department
                </label>
                {isLoadingSubDepartments ? (
                  <div className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50 flex items-center justify-center">
                    <div className="h-4 w-4 mr-2 rounded-full border-2 border-t-blue-500 animate-spin"></div>
                    Loading...
                  </div>
                ) : subDepartmentsError ? (
                  <div className="w-full px-3 py-2 border border-red-300 bg-red-50 rounded-md text-sm text-red-600">
                    Error loading sub-departments
                  </div>
                ) : (
                  <select
                    value={selectedSubDepartment}
                    onChange={(e) => setSelectedSubDepartment(e.target.value)}
                    disabled={!selectedDepartment}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Sub Department</option>
                    {filteredSubDepartments.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          </div>

          {/* Assign Mode */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="wise"
                  id="employee"
                  checked={assignMode === "employee"}
                  onChange={() => setAssignMode("employee")}
                  className="w-3 h-3 text-blue-600"
                />
                <label
                  htmlFor="employee"
                  className="text-xs font-medium text-gray-700"
                >
                  Employee Wise
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="wise"
                  id="designation"
                  checked={assignMode === "designation"}
                  onChange={() => setAssignMode("designation")}
                  className="w-3 h-3 text-blue-600"
                />
                <label
                  htmlFor="designation"
                  className="text-xs font-medium text-gray-700"
                >
                  Designation Wise
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Panel - Departments/SubDepartments/Employees */}
        <div className="w-96 bg-white border-r border-gray-300 flex flex-col shadow-sm">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            {/* Top: Show current selection as a summary */}
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-xs text-gray-500">Selected: </span>
                <span className="font-semibold text-blue-700">
                  {selectedCompany && getCompanyName(selectedCompany)}
                  {selectedDepartment &&
                    ` > ${getDepartmentName(selectedDepartment)}`}
                  {selectedSubDepartment &&
                    ` > ${getSubDepartmentName(selectedSubDepartment)}`}
                </span>
              </div>
              {selectedDepartment &&
                selectedSubDepartment &&
                filteredEmployees.length > 0 && (
                  <button
                    className="flex items-center text-blue-600 hover:underline text-xs"
                    onClick={() => setShowEmployeeModal(true)}
                  >
                    <Eye className="w-4 h-4 mr-1" /> View All (
                    {filteredEmployees.length})
                  </button>
                )}
            </div>
            <h3 className="font-semibold text-sm mb-3 text-gray-800">
              {selectedCompany && !selectedDepartment && "Departments"}
              {selectedCompany &&
                selectedDepartment &&
                !selectedSubDepartment &&
                "Sub Departments"}
              {selectedCompany &&
                selectedDepartment &&
                selectedSubDepartment &&
                "Employees"}
            </h3>
            {/* Show departments */}
            {!selectedDepartment && (
              <div className="space-y-2">
                {isLoadingDepartments ? (
                  <div className="flex items-center justify-center p-4">
                    <div className="h-6 w-6 mr-2 rounded-full border-2 border-t-blue-500 animate-spin"></div>
                    <span>Loading departments...</span>
                  </div>
                ) : departmentsError ? (
                  <div className="p-4 text-center text-red-600">
                    {departmentsError}
                  </div>
                ) : filteredDepartments.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    No departments found for this company
                  </div>
                ) : (
                  filteredDepartments.map((dep) => (
                    <div
                      key={dep.id}
                      className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                        selectedDepartment === dep.id.toString()
                          ? "bg-gradient-to-r from-blue-100 to-blue-50 border-2 border-blue-300 shadow-md"
                          : "hover:bg-gray-50 border border-gray-200"
                      }`}
                      onClick={() => setSelectedDepartment(dep.id.toString())}
                    >
                      <span className="text-sm font-medium text-gray-700">
                        {dep.name}
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}
            {/* Show sub departments */}
            {selectedDepartment && !selectedSubDepartment && (
              <div className="space-y-2">
                {isLoadingSubDepartments ? (
                  <div className="flex items-center justify-center p-4">
                    <div className="h-6 w-6 mr-2 rounded-full border-2 border-t-blue-500 animate-spin"></div>
                    <span>Loading sub-departments...</span>
                  </div>
                ) : subDepartmentsError ? (
                  <div className="p-4 text-center text-red-600">
                    {subDepartmentsError}
                  </div>
                ) : filteredSubDepartments.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    No sub-departments found for this department
                  </div>
                ) : (
                  filteredSubDepartments.map((sub) => (
                    <div
                      key={sub.id}
                      className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                        selectedSubDepartment === sub.id.toString()
                          ? "bg-gradient-to-r from-blue-100 to-blue-50 border-2 border-blue-300 shadow-md"
                          : "hover:bg-gray-50 border border-gray-200"
                      }`}
                      onClick={() => setSelectedSubDepartment(sub.id.toString())}
                    >
                      <span className="text-sm font-medium text-gray-700">
                        {sub.name}
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}
            {/* Show employees (preview only 3, rest in modal) */}
            {selectedDepartment && selectedSubDepartment && (
              <div>
                <div className="space-y-2">
                  {filteredEmployees.slice(0, 3).map((emp) => (
                    <div
                      key={emp.id}
                      className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                        selectedEmployees.has(emp.id.toString())
                          ? "bg-gradient-to-r from-blue-100 to-blue-50 border-2 border-blue-300 shadow-md"
                          : "hover:bg-gray-50 border border-gray-200"
                      }`}
                      onClick={() =>
                        assignMode === "employee" &&
                        handleEmployeeSelect(emp.id.toString())
                      }
                    >
                      <span className="text-sm font-medium text-gray-700">
                        {emp.name} ({emp.empCode})
                      </span>
                      {assignMode === "employee" && (
                        <input
                          type="checkbox"
                          checked={selectedEmployees.has(emp.id.toString())}
                          readOnly
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                          tabIndex={-1}
                        />
                      )}
                    </div>
                  ))}
                  {filteredEmployees.length > 3 && (
                    <button
                      className="flex items-center mt-2 text-blue-600 hover:underline text-xs"
                      onClick={() => setShowEmployeeModal(true)}
                    >
                      <Eye className="w-4 h-4 mr-1" /> View All (
                      {filteredEmployees.length})
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
          {/* Show assigned shifts for this selection */}
          <div className="p-4">
            <h4 className="font-semibold text-xs mb-2 text-gray-700">
              Assigned Shifts
            </h4>
            <div className="space-y-2">
              {rosterAssignments
                .filter(
                  (a) =>
                    a.company === selectedCompany &&
                    (!selectedDepartment ||
                      a.department === selectedDepartment) &&
                    (!selectedSubDepartment ||
                      a.subDepartment === selectedSubDepartment)
                )
                .map((a, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-blue-50 px-3 py-2 rounded shadow"
                  >
                    <span className="text-xs font-semibold text-blue-800">
                      {a.shift.shiftName} ({a.shift.shiftStart}-{a.shift.shiftEnd})
                    </span>
                    <button
                      className="ml-2 text-red-500 hover:text-red-700"
                      onClick={() => handleRemoveAssignment(idx)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Employee Modal */}
        {showEmployeeModal && (
          <div className="fixed inset-0 backdrop-blur-sm bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 relative">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
                onClick={() => setShowEmployeeModal(false)}
              >
                <X className="w-6 h-6" />
              </button>
              <h2 className="text-lg font-bold mb-4">All Employees</h2>
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search employees..."
                    className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="overflow-x-auto max-h-[60vh]">
                <table className="min-w-full text-sm border">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-3 py-2 border">#</th>
                      <th className="px-3 py-2 border">Employee Code</th>
                      <th className="px-3 py-2 border">Full Name</th>
                      <th className="px-3 py-2 border">Select</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEmployees.map((emp, idx) => (
                      <tr
                        key={emp.id}
                        className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <td className="px-3 py-2 border">{idx + 1}</td>
                        <td className="px-3 py-2 border">{emp.empCode}</td>
                        <td className="px-3 py-2 border">{emp.name}</td>
                        <td className="px-3 py-2 border text-center">
                          <input
                            type="checkbox"
                            checked={selectedEmployees.has(emp.id.toString())}
                            onChange={() => handleEmployeeSelect(emp.id.toString())}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700"
                  onClick={() => setShowEmployeeModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Right Panel - Shift Table and Add to Roster */}
        <div className="flex-1 bg-white flex flex-col">
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-orange-25">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-lg text-gray-800">
                Shift Selection
              </h3>
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-semibold">
                {dateFrom} - {dateTo}
              </span>
              <span className="font-semibold text-blue-600 ml-1">
                {selectedCompany && ` | ${getCompanyName(selectedCompany)}`}
                {selectedDepartment &&
                  ` > ${getDepartmentName(selectedDepartment)}`}
                {selectedSubDepartment &&
                  ` > ${getSubDepartmentName(selectedSubDepartment)}`}
              </span>
            </div>
          </div>
          <div className="p-4 flex-1 flex flex-col">
            {/* Shift Table */}
            <div className="flex-1 overflow-y-auto border border-gray-300 rounded-lg shadow mb-4">
              {isLoadingShifts ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading shifts...</p>
                </div>
              ) : shiftsError ? (
                <div className="p-8 text-center text-red-500">
                  <p>{shiftsError}</p>
                  <button
                    onClick={fetchShiftsData}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold border-r border-blue-500">
                        S.Code
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold border-r border-blue-500">
                        Shift Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold border-r border-blue-500">
                        Start Time
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold border-r border-blue-500">
                        End Time
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold border-blue-500">
                        Select
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {shifts.map((shift, index) => (
                      <tr
                        key={shift.id}
                        className={`${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50"
                        } 
                        hover:bg-blue-50 transition-colors duration-150 border-b border-gray-200 
                        ${
                          selectedShifts.has(shift.id)
                            ? "bg-blue-50 border-l-4 border-blue-500"
                            : ""
                        }`}
                      >
                        <td className="px-4 py-3 border-r border-gray-200">
                          <span className="font-mono text-blue-600 font-semibold bg-blue-50 px-2 py-1 rounded">
                            {shift.scode}
                          </span>
                        </td>
                        <td className="px-4 py-3 border-r border-gray-200">
                          <span className="font-medium text-gray-700">
                            {shift.shiftName}
                          </span>
                        </td>
                        <td className="px-4 py-3 border-r border-gray-200 font-mono text-green-600 font-semibold">
                          {shift.shiftStart}
                        </td>
                        <td className="px-4 py-3 border-r border-gray-200 font-mono text-red-600 font-semibold">
                          {shift.shiftEnd}
                        </td>
                        <td className="px-4 py-3 border-gray-200">
                          <button
                            className={`px-3 py-1 rounded ${
                              selectedShifts.has(shift.id)
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200 text-gray-700"
                            }`}
                            onClick={() => toggleShiftSelection(shift)}
                          >
                            {selectedShifts.has(shift.id)
                              ? "Selected"
                              : "Select"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            {/* Add to Roster Button */}
            <button
              className="w-full bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white py-2 px-4 rounded-md text-sm font-semibold shadow-md transition-all duration-200 transform hover:scale-105"
              onClick={handleAddShift}
              disabled={
                selectedShifts.size === 0 ||
                filteredEmployees.length === 0 ||
                (assignMode === "employee" && selectedEmployees.size === 0)
              }
            >
              Add to Roster{" "}
              {selectedShifts.size > 0 && `(${selectedShifts.size} shifts)`}
            </button>
            {/* Save Roster Button */}
            <div className="flex space-x-2 mt-2">
              <button
                className={`flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-2 px-4 rounded-md text-sm font-semibold shadow-md transition-all duration-200 ${
                  isSaving ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={handleSaveRoster}
                disabled={rosterAssignments.length === 0 || isSaving}
              >
                {isSaving ? (
                  <>
                    <div className="inline-block h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  "Save Roster"
                )}
              </button>
              <button
                className="flex-1 bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white py-2 px-4 rounded-md text-sm font-semibold shadow-md transition-all duration-200"
                onClick={() => {
                  setRosterAssignments([]);
                  setSelectedCompany("");
                  setSelectedDepartment("");
                  setSelectedSubDepartment("");
                  setSelectedShifts(new Set());
                  setSelectedEmployees(new Set());
                  setSelectedEmployee(null);
                  const today = new Date();
                  setDateFrom(today.toISOString().split('T')[0]);
                  setDateTo(new Date(today.setDate(today.getDate() + 30)).toISOString().split('T')[0]);
                  setRosterDate(today.toISOString().split('T')[0]);
                  setAssignMode("designation");
                  setSearchTerm("");
                }}
                disabled={rosterAssignments.length === 0}
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RosterManagementSystem;