import React, { useState, useMemo } from 'react';
import { Calendar, Search, Plus, Edit, Trash2, Save, X, ChevronRight } from 'lucide-react';

const RosterManagementSystem = () => {
  const [selectedGroup, setSelectedGroup] = useState('001');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [dateFrom, setDateFrom] = useState('2025-06-01');
  const [dateTo, setDateTo] = useState('2025-12-30');
  const [rosterDate, setRosterDate] = useState('2025-06-30');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddShift, setShowAddShift] = useState(false);
  const [editingShift, setEditingShift] = useState(null);

  // Groups/Departments data
  const groups = [
    { code: '001', name: 'Maintenance Department', selected: true },
    { code: '002', name: 'Office', selected: true },
    { code: '003', name: 'Production Department', selected: false },
    { code: '007', name: 'Quality Department', selected: false },
    { code: '008', name: 'Sanitary & Welfare', selected: false }
  ];

  // Employee data with more realistic structure
  const employees = [
    { empCode: '001', name: 'SAMANTHA KUMARA', group: '001' },
    { empCode: '672', name: 'Jayantha Kumara', group: '001' },
    { empCode: '84', name: 'RAMAIAH PULENDRAN', group: '002' },
    { empCode: '327', name: 'PRAGEETH PANASINGHA WELLAPPILI', group: '002' },
    { empCode: '436', name: 'NALIN BUDDHIKA', group: '003' },
    { empCode: '445', name: 'SUNIL FERNANDO', group: '003' },
    { empCode: '512', name: 'KAMAL PERERA', group: '007' },
    { empCode: '623', name: 'NIMAL SILVA', group: '007' },
    { empCode: '734', name: 'ROHAN WICKRAMA', group: '008' },
    { empCode: '845', name: 'AJITH BANDARA', group: '008' }
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

  const selectedGroupData = groups.find(g => g.code === selectedGroup);
  
  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const matchesGroup = emp.group === selectedGroup;
      const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           emp.empCode.includes(searchTerm);
      return matchesGroup && matchesSearch;
    });
  }, [selectedGroup, searchTerm]);

  const getEmployeeShift = (empCode) => {
    return shifts.find(shift => shift.empCode === empCode);
  };

  const addOrUpdateShift = (shiftData) => {
    if (editingShift) {
      setShifts(prev => prev.map(shift => 
        shift.scode === editingShift.scode ? { ...shift, ...shiftData } : shift
      ));
    } else {
      const newShift = {
        scode: String(Math.max(...shifts.map(s => parseInt(s.scode))) + 1).padStart(3, '0'),
        ...shiftData
      };
      setShifts(prev => [...prev, newShift]);
    }
    setEditingShift(null);
    setShowAddShift(false);
  };

  const deleteShift = (scode) => {
    setShifts(prev => prev.filter(shift => shift.scode !== scode));
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
        {/* Left Panel - Groups and Filters */}
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

          {/* Groups Section */}
          <div className="flex-1 p-4 overflow-y-auto">
            <h3 className="font-semibold text-sm mb-3 text-gray-800">Departments</h3>
            <div className="space-y-2">
              {groups.map(group => (
                <div 
                  key={group.code}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedGroup === group.code 
                      ? 'bg-gradient-to-r from-blue-100 to-blue-50 border-2 border-blue-300 shadow-md' 
                      : 'hover:bg-gray-50 border border-gray-200'
                  }`}
                  onClick={() => setSelectedGroup(group.code)}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={group.selected}
                      onChange={() => {}}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded font-bold text-blue-700">{group.code}</span>
                    <span className="text-sm font-medium text-gray-700">{group.name}</span>
                  </div>
                  {selectedGroup === group.code && (
                    <ChevronRight className="w-5 h-5 text-blue-600" />
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex space-x-2">
                <button className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2 px-3 rounded-md text-xs font-semibold shadow-md transition-all duration-200">
                  Select Date Range
                </button>
                <button className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-3 rounded-md text-xs font-semibold transition-all duration-200">
                  Saturday
                </button>
              </div>
              <div className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <input type="radio" name="wise" id="employee" className="w-3 h-3 text-blue-600" />
                  <label htmlFor="employee" className="text-xs font-medium text-gray-700">Employee Wise</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="radio" name="wise" id="designation" className="w-3 h-3 text-blue-600" defaultChecked />
                  <label htmlFor="designation" className="text-xs font-medium text-gray-700">Designation Wise</label>
                </div>
              </div>
              <div className="text-center text-xs text-gray-600 bg-gray-50 py-2 rounded-md">All Employees</div>
              <button className="w-full bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white py-2 px-4 rounded-md text-sm font-semibold shadow-md transition-all duration-200 transform hover:scale-105">
                Add to Roster
              </button>
            </div>
          </div>
        </div>

        {/* Center Panel - Employee Search and List */}
        <div className="w-96 bg-white border-r border-gray-300 flex flex-col shadow-sm">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h3 className="font-semibold text-sm mb-3 text-gray-800">Search Employees</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="bg-gradient-to-r from-gray-100 to-gray-50 sticky top-0 shadow-sm">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 border-r border-gray-200">Emp Code</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Employee Name</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((employee, index) => (
                  <tr 
                    key={employee.empCode}
                    className={`hover:bg-blue-50 cursor-pointer border-b border-gray-100 transition-colors duration-150 ${
                      selectedEmployee?.empCode === employee.empCode ? 'bg-blue-100 border-blue-200' : ''
                    } ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}
                    onClick={() => setSelectedEmployee(employee)}
                  >
                    <td className="px-4 py-3 border-r border-gray-200">
                      <span className="font-mono text-blue-600 font-semibold bg-blue-50 px-2 py-1 rounded">{employee.empCode}</span>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-700">{employee.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Panel - Shift Details */}
        <div className="flex-1 bg-white flex flex-col">
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-orange-25">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-lg text-gray-800">Roster Management</h3>
              <div className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full shadow-sm">
                Production Mgr - WE
              </div>
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-semibold">{rosterDate}</span> | Selected Department: 
              <span className="font-semibold text-blue-600 ml-1">{selectedGroupData?.name}</span>
            </div>
          </div>

          <div className="p-4 flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <button 
                onClick={() => setShowAddShift(true)}
                className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white py-2 px-4 rounded-lg text-sm flex items-center space-x-2 font-semibold shadow-md transition-all duration-200 transform hover:scale-105"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Shift</span>
              </button>
              <button className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg text-sm font-semibold shadow-md transition-all duration-200">
                Export & Print
              </button>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Shift Code</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Emp. Code</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Employee Name</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Department</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto border border-gray-300 rounded-lg shadow-sm">
              <table className="w-full text-sm">
                <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold border-r border-blue-500">S.Code</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold border-r border-blue-500">Shift Name</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold border-r border-blue-500">Start Time</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold border-r border-blue-500">End Time</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {shifts.map((shift, index) => (
                    <tr key={shift.scode} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors duration-150 border-b border-gray-200`}>
                      <td className="px-4 py-3 border-r border-gray-200">
                        <span className="font-mono text-blue-600 font-semibold bg-blue-50 px-2 py-1 rounded">{shift.scode}</span>
                      </td>
                      <td className="px-4 py-3 border-r border-gray-200">
                        <span className={`${shift.shiftName.includes('Production Mgr - WE') ? 'bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-semibold' : 'font-medium text-gray-700'}`}>
                          {shift.shiftName}
                        </span>
                      </td>
                      <td className="px-4 py-3 border-r border-gray-200 font-mono text-green-600 font-semibold">{shift.shiftStart}</td>
                      <td className="px-4 py-3 border-r border-gray-200 font-mono text-red-600 font-semibold">{shift.shiftEnd}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setEditingShift(shift)}
                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-1 rounded transition-all duration-150"
                            title="Edit Shift"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteShift(shift.scode)}
                            className="text-red-600 hover:text-red-800 hover:bg-red-50 p-1 rounded transition-all duration-150"
                            title="Delete Shift"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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