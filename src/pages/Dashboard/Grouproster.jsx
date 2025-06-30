import React, { useState, useMemo } from 'react';
import { Calendar, Clock, Users, Search, Filter, Plus, Edit, Trash2, Save, X, ChevronDown, Building2 } from 'lucide-react';

const GroupRosterSystem = () => {
  const [selectedDate, setSelectedDate] = useState('2025-06-30');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [editingShift, setEditingShift] = useState(null);

  // Dummy data
  const departments = [
    { id: 'maintenance', name: 'Maintenance Department', color: 'bg-blue-500' },
    { id: 'office', name: 'Office', color: 'bg-green-500' },
    { id: 'production', name: 'Production Department', color: 'bg-purple-500' },
    { id: 'quality', name: 'Quality Department', color: 'bg-orange-500' },
    { id: 'security', name: 'Security & Welfare', color: 'bg-red-500' }
  ];

  const employees = [
    { id: 1, empCode: '001', name: 'Alice Johnson', department: 'maintenance' },
    { id: 2, empCode: '002', name: 'Bob Smith', department: 'office' },
    { id: 3, empCode: '003', name: 'Carol Davis', department: 'production' },
    { id: 4, empCode: '004', name: 'David Wilson', department: 'quality' },
    { id: 5, empCode: '005', name: 'Emma Brown', department: 'security' },
    { id: 6, empCode: '006', name: 'Frank Miller', department: 'maintenance' },
    { id: 7, empCode: '007', name: 'Grace Lee', department: 'office' },
    { id: 8, empCode: '008', name: 'Henry Taylor', department: 'production' },
    { id: 9, empCode: '009', name: 'Ivy Chen', department: 'quality' },
    { id: 10, empCode: '010', name: 'Jack Martinez', department: 'security' }
  ];

  const [shifts, setShifts] = useState([
    { id: 1, empId: 1, shiftName: 'Morning Shift', startTime: '08:00', endTime: '17:00', date: '2025-06-30' },
    { id: 2, empId: 2, shiftName: 'Day Shift', startTime: '09:00', endTime: '18:00', date: '2025-06-30' },
    { id: 3, empId: 3, shiftName: 'Production Morning', startTime: '07:45', endTime: '16:45', date: '2025-06-30' },
    { id: 4, empId: 4, shiftName: 'Quality Control', startTime: '08:00', endTime: '17:00', date: '2025-06-30' },
    { id: 5, empId: 5, shiftName: 'Security Morning', startTime: '07:00', endTime: '15:00', date: '2025-06-30' },
    { id: 6, empId: 6, shiftName: 'Maintenance Evening', startTime: '15:00', endTime: '23:00', date: '2025-06-30' },
    { id: 7, empId: 7, shiftName: 'Office Late', startTime: '12:00', endTime: '21:00', date: '2025-06-30' },
    { id: 8, empId: 8, shiftName: 'Production Night', startTime: '22:00', endTime: '06:00', date: '2025-06-30' },
    { id: 9, empId: 9, shiftName: 'Quality Evening', startTime: '16:00', endTime: '00:00', date: '2025-06-30' },
    { id: 10, empId: 10, shiftName: 'Security Night', startTime: '23:00', endTime: '07:00', date: '2025-06-30' }
  ]);

  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const matchesDept = selectedDepartment === 'all' || emp.department === selectedDepartment;
      const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           emp.empCode.includes(searchTerm);
      return matchesDept && matchesSearch;
    });
  }, [selectedDepartment, searchTerm]);

  const getEmployeeShift = (empId) => {
    return shifts.find(shift => shift.empId === empId && shift.date === selectedDate);
  };

  const getDepartmentInfo = (deptId) => {
    return departments.find(dept => dept.id === deptId);
  };

  const updateShift = (shiftData) => {
    if (editingShift) {
      setShifts(prev => prev.map(shift => 
        shift.id === editingShift.id ? { ...shift, ...shiftData } : shift
      ));
    } else {
      const newShift = {
        id: Date.now(),
        empId: shiftData.empId,
        shiftName: shiftData.shiftName,
        startTime: shiftData.startTime,
        endTime: shiftData.endTime,
        date: selectedDate
      };
      setShifts(prev => [...prev, newShift]);
    }
    setEditingShift(null);
  };

  const deleteShift = (shiftId) => {
    setShifts(prev => prev.filter(shift => shift.id !== shiftId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-500 p-3 rounded-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Group Roster Management</h1>
                <p className="text-slate-500">Manage employee schedules and shifts</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setShowAddEmployee(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Employee</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Filters and Controls */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                <Filter className="w-5 h-5 mr-2" />
                Filters
              </h3>
              
              {/* Date Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Department Filter */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">Department</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="w-full pl-10 pr-8 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                  >
                    <option value="all">All Departments</option>
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.id}>{dept.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                </div>
              </div>

              {/* Search */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">Search Employee</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by name or code..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Department Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Department Overview</h3>
              <div className="space-y-3">
                {departments.map(dept => {
                  const deptEmployees = employees.filter(emp => emp.department === dept.id);
                  const activeShifts = deptEmployees.filter(emp => getEmployeeShift(emp.id)).length;
                  return (
                    <div key={dept.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${dept.color}`}></div>
                        <span className="text-sm font-medium text-slate-700">{dept.name}</span>
                      </div>
                      <div className="text-sm text-slate-500">
                        {activeShifts}/{deptEmployees.length}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Employee Roster */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-200">
                <h3 className="text-lg font-semibold text-slate-800">Employee Roster - {selectedDate}</h3>
                <p className="text-slate-500 text-sm mt-1">{filteredEmployees.length} employees found</p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Employee</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Department</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Shift</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {filteredEmployees.map(employee => {
                      const shift = getEmployeeShift(employee.id);
                      const deptInfo = getDepartmentInfo(employee.department);
                      
                      return (
                        <tr key={employee.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                                  <span className="text-white font-medium text-sm">
                                    {employee.name.split(' ').map(n => n[0]).join('')}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-slate-900">{employee.name}</div>
                                <div className="text-sm text-slate-500">#{employee.empCode}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className={`w-2 h-2 rounded-full ${deptInfo.color} mr-2`}></div>
                              <span className="text-sm text-slate-600">{deptInfo.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {shift ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                {shift.shiftName}
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                No Shift
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                            {shift ? (
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {shift.startTime} - {shift.endTime}
                              </div>
                            ) : (
                              <span className="text-slate-400">-</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              {shift ? (
                                <>
                                  <button
                                    onClick={() => setEditingShift(shift)}
                                    className="text-blue-600 hover:text-blue-900 transition-colors"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => deleteShift(shift.id)}
                                    className="text-red-600 hover:text-red-900 transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </>
                              ) : (
                                <button
                                  onClick={() => setEditingShift({ empId: employee.id, shiftName: '', startTime: '', endTime: '' })}
                                  className="text-green-600 hover:text-green-900 transition-colors"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Shift Modal */}
        {editingShift && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-800">
                  {editingShift.id ? 'Edit Shift' : 'Add Shift'}
                </h3>
                <button
                  onClick={() => setEditingShift(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                updateShift({
                  empId: editingShift.empId,
                  shiftName: formData.get('shiftName'),
                  startTime: formData.get('startTime'),
                  endTime: formData.get('endTime')
                });
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Shift Name</label>
                    <input
                      type="text"
                      name="shiftName"
                      defaultValue={editingShift.shiftName}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Start Time</label>
                    <input
                      type="time"
                      name="startTime"
                      defaultValue={editingShift.startTime}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">End Time</label>
                    <input
                      type="time"
                      name="endTime"
                      defaultValue={editingShift.endTime}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setEditingShift(null)}
                    className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupRosterSystem;