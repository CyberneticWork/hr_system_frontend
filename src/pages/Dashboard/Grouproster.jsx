import React, { useState, useMemo } from 'react';
import { Calendar, Search, Plus, Edit, Trash2, Save, X, ChevronRight, Eye } from 'lucide-react';

const RosterManagementSystem = () => {
  const [selectedGroup, setSelectedGroup] = useState('001');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [dateFrom, setDateFrom] = useState('2025-06-01');
  const [dateTo, setDateTo] = useState('2025-12-30');
  const [rosterDate, setRosterDate] = useState('2025-06-30');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddShift, setShowAddShift] = useState(false);
  const [editingShift, setEditingShift] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedSubDepartment, setSelectedSubDepartment] = useState('');
  const [assignMode, setAssignMode] = useState('designation'); // 'designation' or 'employee'
  const [selectedShift, setSelectedShift] = useState(null);
  const [rosterAssignments, setRosterAssignments] = useState([]); // {company, department, subDepartment, employees, shift, dateFrom, dateTo}
  const [selectedEmployees, setSelectedEmployees] = useState(new Set()); // For employee-wise selection
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);

  // Groups/Departments data
  const groups = [
    { code: '001', name: 'Maintenance Department', selected: true },
    { code: '002', name: 'Office', selected: true },
    { code: '003', name: 'Production Department', selected: false },
    { code: '007', name: 'Quality Department', selected: false },
    { code: '008', name: 'Sanitary & Welfare', selected: false }
  ];

  // Employee data with subDepartment property
  const employees = [
    { empCode: '001', name: 'SAMANTHA KUMARA', group: '001', subDepartment: '001A' },
    { empCode: '672', name: 'Jayantha Kumara', group: '001', subDepartment: '001B' },
    { empCode: '84', name: 'RAMAIAH PULENDRAN', group: '002', subDepartment: '002A' },
    { empCode: '327', name: 'PRAGEETH PANASINGHA WELLAPPILI', group: '002', subDepartment: '002A' },
    { empCode: '436', name: 'NALIN BUDDHIKA', group: '003', subDepartment: '003A' },
    { empCode: '445', name: 'SUNIL FERNANDO', group: '003', subDepartment: '003A' },
    { empCode: '512', name: 'KAMAL PERERA', group: '007', subDepartment: null },
    { empCode: '623', name: 'NIMAL SILVA', group: '007', subDepartment: null },
    { empCode: '734', name: 'ROHAN WICKRAMA', group: '008', subDepartment: null },
    { empCode: '845', name: 'AJITH BANDARA', group: '008', subDepartment: null }
  ];

  // Shift schedules
  const [shifts, setShifts] = useState([
    { scode: '004', shiftName: 'Office Executive - WD', shiftStart: '08:00', shiftEnd: '17:00', empCode: '001' },
    { scode: '005', shiftName: 'Office Executive - WE', shiftStart: '08:00', shiftEnd: '15:00', empCode: '672' },
    { scode: '006', shiftName: 'Production Mgr - WD', shiftStart: '08:00', shiftEnd: '17:00', empCode: '84' },
    { scode: '007', shiftName: 'Production Mgr - WE', shiftStart: '08:00', shiftEnd: '13:00', empCode: '327' },
    { scode: '008', shiftName: 'QC - WE', shiftStart: '08:00', shiftEnd: '13:00', empCode: '436' },
    { scode: '009', shiftName: 'No OT with Late - WD', shiftStart: '08:00', shiftEnd: '17:00', empCode: '445' }
  ]);

  // Example data for companies, departments, sub departments
  const companies = [
    { code: 'C01', name: 'ABC Holdings' },
    { code: 'C02', name: 'XYZ Industries' }
  ];

  const departments = [
    { code: '001', name: 'Maintenance Department', company: 'C01' },
    { code: '002', name: 'Office', company: 'C01' },
    { code: '003', name: 'Production Department', company: 'C02' },
    { code: '007', name: 'Quality Department', company: 'C02' },
    { code: '008', name: 'Sanitary & Welfare', company: 'C02' }
  ];

  const subDepartments = [
    { code: '001A', name: 'Electrical', department: '001' },
    { code: '001B', name: 'Mechanical', department: '001' },
    { code: '002A', name: 'Admin', department: '002' },
    { code: '003A', name: 'Assembly', department: '003' }
  ];

  const filteredDepartments = useMemo(() => {
    return departments.filter(dep => dep.company === selectedCompany);
  }, [selectedCompany]);

  const filteredSubDepartments = useMemo(() => {
    return subDepartments.filter(sub => sub.department === selectedDepartment);
  }, [selectedDepartment]);

  const filteredEmployees = useMemo(() => {
    let filtered = employees;
    if (selectedCompany) {
      const deptCodes = departments.filter(dep => dep.company === selectedCompany).map(dep => dep.code);
      filtered = filtered.filter(emp => deptCodes.includes(emp.group));
    }
    if (selectedDepartment) {
      filtered = filtered.filter(emp => emp.group === selectedDepartment);
    }
    if (selectedSubDepartment) {
      filtered = filtered.filter(emp => emp.subDepartment === selectedSubDepartment);
    }
    if (searchTerm) {
      filtered = filtered.filter(emp =>
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.empCode.includes(searchTerm)
      );
    }
    return filtered;
  }, [selectedCompany, selectedDepartment, selectedSubDepartment, searchTerm, employees]);

  // Helper to get display name for company/department/subDepartment
  const getCompanyName = code => companies.find(c => c.code === code)?.name || '';
  const getDepartmentName = code => departments.find(d => d.code === code)?.name || '';
  const getSubDepartmentName = code => subDepartments.find(s => s.code === code)?.name || '';

  // Add shift assignment for current selection
  const handleAddShift = () => {
    if (!selectedShift) return;
    let employeesToAssign = [];
    if (assignMode === 'designation') {
      employeesToAssign = filteredEmployees.map(e => e.empCode);
    } else if (assignMode === 'employee') {
      employeesToAssign = Array.from(selectedEmployees);
    }
    if (employeesToAssign.length === 0) return;
    setRosterAssignments(prev => [
      ...prev,
      {
        company: selectedCompany,
        department: selectedDepartment,
        subDepartment: selectedSubDepartment,
        employees: employeesToAssign,
        shift: selectedShift,
        dateFrom,
        dateTo
      }
    ]);
    setSelectedShift(null);
    setSelectedEmployees(new Set());
    setSelectedEmployee(null);
  };

  // Remove assignment
  const handleRemoveAssignment = idx => {
    setRosterAssignments(prev => prev.filter((_, i) => i !== idx));
  };

  // Handle employee selection for employee-wise assignment
  const handleEmployeeSelect = empCode => {
    if (assignMode !== 'employee') return;
    setSelectedEmployees(prev => {
      const newSet = new Set(prev);
      if (newSet.has(empCode)) {
        newSet.delete(empCode);
      } else {
        newSet.add(empCode);
      }
      return newSet;
    });
  };

  // Save roster (just log to console)
  const handleSaveRoster = () => {
    console.log('Roster assignments:', rosterAssignments);
    alert('Roster assignments logged to console!');
  };

  // Add or update shift (for modal)
  const addOrUpdateShift = (shift) => {
    if (editingShift) {
      setShifts(prev =>
        prev.map(s =>
          s.scode === editingShift.scode
            ? { ...s, ...shift }
            : s
        )
      );
    } else {
      setShifts(prev => [
        ...prev,
        {
          ...shift,
          scode: (Math.max(...prev.map(s => parseInt(s.scode, 10)), 0) + 1).toString().padStart(3, '0')
        }
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
          <span className="text-sm bg-blue-700 px-3 py-1 rounded-full">Filtering Options</span>
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
                <label className="block text-xs font-semibold text-gray-700 mb-1">Date From</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Date To</label>
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

          {/* Calendar Legend Section */}
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-sm mb-3 text-gray-800">Calendar Legend</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-blue-500 rounded-full shadow-sm"></div>
                <span className="text-sm text-gray-700">Saturday</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-red-500 rounded-full shadow-sm"></div>
                <span className="text-sm text-gray-700">Sunday</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-green-500 rounded-full shadow-sm"></div>
                <span className="text-sm text-gray-700">Public Holiday</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-yellow-500 rounded-full shadow-sm"></div>
                <span className="text-sm text-gray-700">Special Holiday</span>
              </div>
            </div>
            <button className="w-full mt-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-2 px-4 rounded-md text-sm font-semibold shadow-md transition-all duration-200">
              Save Calendar
            </button>
          </div>

          {/* Company/Department/SubDepartment Dropdowns */}
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-sm mb-3 text-gray-800">Select Company / Department / Sub Department</h3>
            <div className="space-y-3">
              {/* Company Dropdown */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Company</label>
                <select
                  value={selectedCompany}
                  onChange={e => {
                    setSelectedCompany(e.target.value);
                    setSelectedDepartment('');
                    setSelectedSubDepartment('');
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Company</option>
                  {companies.map(company => (
                    <option key={company.code} value={company.code}>{company.name}</option>
                  ))}
                </select>
              </div>
              {/* Department Dropdown */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Department</label>
                <select
                  value={selectedDepartment}
                  onChange={e => {
                    setSelectedDepartment(e.target.value);
                    setSelectedSubDepartment('');
                  }}
                  disabled={!selectedCompany}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Department</option>
                  {filteredDepartments.map(dep => (
                    <option key={dep.code} value={dep.code}>{dep.name}</option>
                  ))}
                </select>
              </div>
              {/* Sub Department Dropdown */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Sub Department</label>
                <select
                  value={selectedSubDepartment}
                  onChange={e => setSelectedSubDepartment(e.target.value)}
                  disabled={!selectedDepartment}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Sub Department</option>
                  {filteredSubDepartments.map(sub => (
                    <option key={sub.code} value={sub.code}>{sub.name}</option>
                  ))}
                </select>
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
                  checked={assignMode === 'employee'}
                  onChange={() => setAssignMode('employee')}
                  className="w-3 h-3 text-blue-600"
                />
                <label htmlFor="employee" className="text-xs font-medium text-gray-700">Employee Wise</label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="wise"
                  id="designation"
                  checked={assignMode === 'designation'}
                  onChange={() => setAssignMode('designation')}
                  className="w-3 h-3 text-blue-600"
                />
                <label htmlFor="designation" className="text-xs font-medium text-gray-700">Designation Wise</label>
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
                  {selectedDepartment && ` > ${getDepartmentName(selectedDepartment)}`}
                  {selectedSubDepartment && ` > ${getSubDepartmentName(selectedSubDepartment)}`}
                </span>
              </div>
              {(selectedDepartment && selectedSubDepartment && filteredEmployees.length > 0) && (
                <button
                  className="flex items-center text-blue-600 hover:underline text-xs"
                  onClick={() => setShowEmployeeModal(true)}
                >
                  <Eye className="w-4 h-4 mr-1" /> View All ({filteredEmployees.length})
                </button>
              )}
            </div>
            <h3 className="font-semibold text-sm mb-3 text-gray-800">
              {selectedCompany && !selectedDepartment && 'Departments'}
              {selectedCompany && selectedDepartment && !selectedSubDepartment && 'Sub Departments'}
              {selectedCompany && selectedDepartment && selectedSubDepartment && 'Employees'}
            </h3>
            {/* Show departments */}
            {!selectedDepartment && (
              <div className="space-y-2">
                {filteredDepartments.map(dep => (
                  <div
                    key={dep.code}
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedDepartment === dep.code
                        ? 'bg-gradient-to-r from-blue-100 to-blue-50 border-2 border-blue-300 shadow-md'
                        : 'hover:bg-gray-50 border border-gray-200'
                    }`}
                    onClick={() => setSelectedDepartment(dep.code)}
                  >
                    <span className="text-sm font-medium text-gray-700">{dep.name}</span>
                  </div>
                ))}
              </div>
            )}
            {/* Show sub departments */}
            {selectedDepartment && !selectedSubDepartment && (
              <div className="space-y-2">
                {filteredSubDepartments.map(sub => (
                  <div
                    key={sub.code}
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedSubDepartment === sub.code
                        ? 'bg-gradient-to-r from-blue-100 to-blue-50 border-2 border-blue-300 shadow-md'
                        : 'hover:bg-gray-50 border border-gray-200'
                    }`}
                    onClick={() => setSelectedSubDepartment(sub.code)}
                  >
                    <span className="text-sm font-medium text-gray-700">{sub.name}</span>
                  </div>
                ))}
              </div>
            )}
            {/* Show employees (preview only 3, rest in modal) */}
            {selectedDepartment && selectedSubDepartment && (
              <div>
                <div className="space-y-2">
                  {filteredEmployees.slice(0, 3).map(emp => (
                    <div
                      key={emp.empCode}
                      className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                        selectedEmployees.has(emp.empCode)
                          ? 'bg-gradient-to-r from-blue-100 to-blue-50 border-2 border-blue-300 shadow-md'
                          : 'hover:bg-gray-50 border border-gray-200'
                      }`}
                      onClick={() => assignMode === 'employee' && handleEmployeeSelect(emp.empCode)}
                    >
                      <span className="text-sm font-medium text-gray-700">{emp.name}</span>
                      {assignMode === 'employee' && (
                        <input
                          type="checkbox"
                          checked={selectedEmployees.has(emp.empCode)}
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
                      <Eye className="w-4 h-4 mr-1" /> View All ({filteredEmployees.length})
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
          {/* Show assigned shifts for this selection */}
          <div className="p-4">
            <h4 className="font-semibold text-xs mb-2 text-gray-700">Assigned Shifts</h4>
            <div className="space-y-2">
              {rosterAssignments
                .filter(a =>
                  a.company === selectedCompany &&
                  (!selectedDepartment || a.department === selectedDepartment) &&
                  (!selectedSubDepartment || a.subDepartment === selectedSubDepartment)
                )
                .map((a, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-blue-50 px-3 py-2 rounded shadow">
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
              <div className="overflow-x-auto max-h-[60vh]">
                <table className="min-w-full text-sm border">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-3 py-2 border">#</th>
                      <th className="px-3 py-2 border">Emp Code</th>
                      <th className="px-3 py-2 border">Name</th>
                      <th className="px-3 py-2 border">Select</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEmployees.map((emp, idx) => (
                      <tr key={emp.empCode} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-3 py-2 border">{idx + 1}</td>
                        <td className="px-3 py-2 border">{emp.empCode}</td>
                        <td className="px-3 py-2 border">{emp.name}</td>
                        <td className="px-3 py-2 border text-center">
                          <input
                            type="checkbox"
                            checked={selectedEmployees.has(emp.empCode)}
                            onChange={() => handleEmployeeSelect(emp.empCode)}
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
              <h3 className="font-bold text-lg text-gray-800">Shift Selection</h3>
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-semibold">{dateFrom} - {dateTo}</span>
              <span className="font-semibold text-blue-600 ml-1">
                {selectedCompany && ` | ${getCompanyName(selectedCompany)}`}
                {selectedDepartment && ` > ${getDepartmentName(selectedDepartment)}`}
                {selectedSubDepartment && ` > ${getSubDepartmentName(selectedSubDepartment)}`}
              </span>
            </div>
          </div>
          <div className="p-4 flex-1 flex flex-col">
            {/* Shift Table */}
            <div className="flex-1 overflow-y-auto border border-gray-300 rounded-lg shadow mb-4">
              <table className="w-full text-sm">
                <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold border-r border-blue-500">S.Code</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold border-r border-blue-500">Shift Name</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold border-r border-blue-500">Start Time</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold border-r border-blue-500">End Time</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold border-blue-500">Select</th>
                  </tr>
                </thead>
                <tbody>
                  {shifts.map((shift, index) => (
                    <tr key={shift.scode} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors duration-150 border-b border-gray-200`}>
                      <td className="px-4 py-3 border-r border-gray-200">
                        <span className="font-mono text-blue-600 font-semibold bg-blue-50 px-2 py-1 rounded">{shift.scode}</span>
                      </td>
                      <td className="px-4 py-3 border-r border-gray-200">
                        <span className="font-medium text-gray-700">{shift.shiftName}</span>
                      </td>
                      <td className="px-4 py-3 border-r border-gray-200 font-mono text-green-600 font-semibold">{shift.shiftStart}</td>
                      <td className="px-4 py-3 border-r border-gray-200 font-mono text-red-600 font-semibold">{shift.shiftEnd}</td>
                      <td className="px-4 py-3 border-gray-200">
                        <button
                          className={`px-3 py-1 rounded ${selectedShift?.scode === shift.scode ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                          onClick={() => setSelectedShift(shift)}
                        >
                          {selectedShift?.scode === shift.scode ? 'Selected' : 'Select'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Add to Roster Button */}
            <button
              className="w-full bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white py-2 px-4 rounded-md text-sm font-semibold shadow-md transition-all duration-200 transform hover:scale-105"
              onClick={handleAddShift}
              disabled={!selectedShift || filteredEmployees.length === 0 || (assignMode === 'employee' && selectedEmployees.size === 0)}
            >
              Add to Roster
            </button>
            {/* Save Roster Button */}
            <div className="flex space-x-2 mt-2">
              <button
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-2 px-4 rounded-md text-sm font-semibold shadow-md transition-all duration-200"
                onClick={handleSaveRoster}
                disabled={rosterAssignments.length === 0}
              >
                Save Roster
              </button>
              <button
                className="flex-1 bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white py-2 px-4 rounded-md text-sm font-semibold shadow-md transition-all duration-200"
                onClick={() => {
                  setRosterAssignments([]);
                  setSelectedCompany('');
                  setSelectedDepartment('');
                  setSelectedSubDepartment('');
                  setSelectedShift(null);
                  setSelectedEmployees(new Set());
                  setSelectedEmployee(null);
                  setDateFrom('2025-06-01');
                  setDateTo('2025-12-30');
                  setRosterDate('2025-06-30');
                  setAssignMode('designation');
                  setSearchTerm('');
                }}
                disabled={rosterAssignments.length === 0}
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Shift Modal */}
      {(showAddShift || editingShift) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 transform transition-all duration-300 scale-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">
                {editingShift ? 'Edit Shift' : 'Add New Shift'}
              </h3>
              <button
                onClick={() => {
                  setShowAddShift(false);
                  setEditingShift(null);
                }}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-all duration-150"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Employee Code</label>
                <input
                  type="text"
                  id="empCode"
                  defaultValue={editingShift?.empCode || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                  placeholder="Enter employee code"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Shift Name</label>
                <input
                  type="text"
                  id="shiftName"
                  defaultValue={editingShift?.shiftName || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                  placeholder="Enter shift name"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Start Time</label>
                  <input
                    type="time"
                    id="shiftStart"
                    defaultValue={editingShift?.shiftStart || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">End Time</label>
                  <input
                    type="time"
                    id="shiftEnd"
                    defaultValue={editingShift?.shiftEnd || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-3 mt-8">
              <button
                onClick={() => {
                  setShowAddShift(false);
                  setEditingShift(null);
                }}
                className="px-6 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg font-semibold transition-all duration-150"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const empCode = document.getElementById('empCode').value;
                  const shiftName = document.getElementById('shiftName').value;
                  const shiftStart = document.getElementById('shiftStart').value;
                  const shiftEnd = document.getElementById('shiftEnd').value;
                  
                  if (empCode && shiftName && shiftStart && shiftEnd) {
                    addOrUpdateShift({
                      empCode,
                      shiftName,
                      shiftStart,
                      shiftEnd
                    });
                  }
                }}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2 font-semibold shadow-md transition-all duration-200 transform hover:scale-105"
              >
                <Save className="w-4 h-4" />
                <span>Save Shift</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RosterManagementSystem;