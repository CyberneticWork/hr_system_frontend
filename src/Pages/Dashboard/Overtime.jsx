import React, { useState, useEffect } from 'react';
import { 
  Filter, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  ChevronDown,
  Search,
  RotateCw,
  X,
  Clock,
  Users,
  Calendar,
  Building
} from 'lucide-react';

const Overtime = () => {
  // State management
  const [locations] = useState([
    "Jay Sea Foods Processing",
    "Colombo Branch",
    "Kandy Facility"
  ]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [timeData, setTimeData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [approvedRows, setApprovedRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 1: View, 2: Approval, 3: Processed
  const [searchTerm, setSearchTerm] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  // Mock data
  const generateMockData = () => [
    {
      id: 1,
      empNo: 101,
      name: "VINCO SAMEERVA",
      location: "Jay Sea Foods Processing",
      date: "2025-06-01",
      inTime: "8:24 AM",
      outTime: "5:15 PM",
      workingHour: "8.51",
      morningOT: "0.00",
      eveningOT: "0.00",
      specialOT: "1.25", // renamed
      totalOT: (0.00 + 0.00 + 1.25).toFixed(2),
      isApproved: false
    },
    {
      id: 2,
      empNo: 102,
      name: "MAQURA JUDE",
      location: "Colombo Branch",
      date: "2025-06-01",
      inTime: "8:30 AM",
      outTime: "5:45 PM",
      workingHour: "9.15",
      morningOT: "0.30",
      eveningOT: "0.45",
      specialOT: "1.50",
      totalOT: (0.30 + 0.45 + 1.50).toFixed(2),
      isApproved: false
    },
    {
      id: 3,
      empNo: 103,
      name: "JAINTHA PRASANIA",
      location: "Kandy Facility",
      date: "2025-06-02",
      inTime: "7:56 AM",
      outTime: "6:15 PM",
      workingHour: "10.19",
      morningOT: "0.00",
      eveningOT: "1.15",
      specialOT: "2.00",
      totalOT: (0.00 + 1.15 + 2.00).toFixed(2),
      isApproved: false
    },
    {
      id: 4,
      empNo: 104,
      name: "NIMAL PERERA",
      location: "Jay Sea Foods Processing",
      date: "2025-06-03",
      inTime: "8:00 AM",
      outTime: "5:00 PM",
      workingHour: "8.00",
      morningOT: "0.10",
      eveningOT: "0.20",
      specialOT: "0.50",
      totalOT: (0.10 + 0.20 + 0.50).toFixed(2),
      isApproved: false
    },
    {
      id: 5,
      empNo: 105,
      name: "SANDUNI FERNANDO",
      location: "Colombo Branch",
      date: "2025-06-03",
      inTime: "8:10 AM",
      outTime: "5:30 PM",
      workingHour: "8.33",
      morningOT: "0.00",
      eveningOT: "0.30",
      specialOT: "1.00",
      totalOT: (0.00 + 0.30 + 1.00).toFixed(2),
      isApproved: false
    }
  ];

  // Fetch data
  const fetchOvertimeData = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      const data = generateMockData();
      setTimeData(data);
      setFilteredData([]); // Clear filtered data when fetching new data
      setHasSearched(false); // Reset search state
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Month options
  const months = [
    { value: "2025-05", label: "May 2025" },
    { value: "2025-06", label: "June 2025" },
    { value: "2025-07", label: "July 2025" }
  ];

  // Apply filters
  const applyFilters = () => {
    if (!selectedMonth) return;
    
    let results = timeData;
    
    // Filter by location if selected
    if (selectedLocation) {
      results = results.filter(row => 
        row.location === selectedLocation // Assuming there's a location field in data
      );
    }
    
    // Filter by search term if entered
    if (searchTerm) {
      results = results.filter(row =>
        row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.empNo.toString().includes(searchTerm)
      );
    }
    
    setFilteredData(results);
    setHasSearched(true);
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedLocation("");
    setSelectedMonth("");
    setSearchTerm("");
    setFilteredData([]);
    setHasSearched(false);
  };

  // Toggle approval
  const toggleApproval = (id) => {
    const updatedData = timeData.map(row => 
      row.id === id ? { ...row, isApproved: !row.isApproved } : row
    );
    setTimeData(updatedData);
    
    const updatedFilteredData = filteredData.map(row => 
      row.id === id ? { ...row, isApproved: !row.isApproved } : row
    );
    setFilteredData(updatedFilteredData);
  };

  // Process approved OT
  const processApprovedOT = () => {
    const approved = hasSearched 
      ? filteredData.filter(row => row.isApproved)
      : timeData.filter(row => row.isApproved);
    setApprovedRows(approved);
    setCurrentStep(2);
  };

  // Confirm processing
  const confirmProcessing = () => {
    setCurrentStep(3);
    console.log("Processing confirmed for:", approvedRows);
  };

  // Calculate totals
  const calculateTotals = (data) => ({
    workingHour: data.reduce((sum, row) => sum + parseFloat(row.workingHour), 0).toFixed(2),
    morningOT: data.reduce((sum, row) => sum + parseFloat(row.morningOT), 0).toFixed(2),
    eveningOT: data.reduce((sum, row) => sum + parseFloat(row.eveningOT), 0).toFixed(2),
    totalOT: data.reduce((sum, row) => sum + parseFloat(row.totalOT), 0).toFixed(2),
    specialOT: data.reduce((sum, row) => sum + parseFloat(row.specialOT), 0).toFixed(2),
  });

  const totals = hasSearched 
    ? calculateTotals(filteredData)
    : calculateTotals(timeData);

  return (
    <div className="min-h-screen p-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-800 to-blue-600 bg-clip-text text-transparent">
              Overtime Management System
            </h1>
          </div>
          <p className="text-gray-600 ml-11">Manage and approve employee overtime hours efficiently</p>
        </div>
        
        {/* Filters */}
        {/* <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-800">Filter Options</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <Building className="h-4 w-4" />
                <span>Location</span>
              </label>
              <div className="relative">
                <select
                  className="w-full p-3 pl-4 pr-10 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white shadow-sm transition-all duration-200 hover:shadow-md"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                >
                  <option value="">All Locations</option>
                  {locations.map((loc, index) => (
                    <option key={index} value={loc}>{loc}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
            
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4" />
                <span>Month</span>
              </label>
              <div className="relative">
                <select
                  className="w-full p-3 pl-4 pr-10 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white shadow-sm transition-all duration-200 hover:shadow-md"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                >
                  <option value="">Select Month</option>
                  {months.map((month) => (
                    <option key={month.value} value={month.value}>{month.label}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
            
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <Users className="h-4 w-4" />
                <span>Search</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by name or EMP no"
                  className="w-full p-3 pl-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200 hover:shadow-md"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex items-end space-x-2">
              <button
                onClick={clearFilters}
                className="flex items-center px-4 py-3 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <X className="h-5 w-5 mr-2" /> Clear
              </button>
              <button
                onClick={applyFilters}
                disabled={!selectedMonth || isLoading}
                className={`flex items-center px-4 py-2.5 rounded-lg text-white font-medium transition-all duration-200 shadow-sm hover:shadow-md text-sm ${
                  !selectedMonth || isLoading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:scale-[1.02]'
                }`}
              >
                {isLoading ? (
                  <>
                    <RotateCw className="animate-spin h-4 w-4 mr-2" />
                    <span>Loading...</span>
                  </>
                ) : (
                  <>
                    <Filter className="h-4 w-4 mr-2" />
                    <span>Apply </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div> */}

        {/* Main Content - Always show table */}
        {currentStep === 1 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden mb-6">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">EMP No</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">IN Time</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">OUT Time</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Working Hour</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Morning OT</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Evening OT</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total OT</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Special OT</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Approve OT</th>
                  </tr>
                </thead>
                <tbody className="bg-white/50 backdrop-blur-sm divide-y divide-gray-100">
                  {hasSearched && filteredData.length === 0 ? (
                    <tr>
                      <td colSpan="10" className="px-6 py-8 text-center">
                        <div className="flex flex-col items-center space-y-2">
                          <Search className="h-8 w-8 text-gray-300" />
                          <span className="text-sm text-gray-500">No matching records found</span>
                        </div>
                      </td>
                    </tr>
                  ) : hasSearched ? (
                    filteredData.map((row) => (
                      <tr key={row.id} className={`transition-all duration-200 ${
                        row.isApproved 
                          ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-400' 
                          : 'hover:bg-gray-50/80'
                      }`}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{row.empNo}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{row.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{row.inTime}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{row.outTime}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">{row.workingHour}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-600 font-medium">{row.morningOT}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-600 font-medium">{row.eveningOT}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-indigo-600">{row.totalOT}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-600">{row.specialOT}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <label className="inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={row.isApproved}
                              onChange={() => toggleApproval(row.id)}
                              className="sr-only"
                            />
                            <div className={`relative w-5 h-5 rounded transition-all duration-200 ${
                              row.isApproved 
                                ? 'bg-gradient-to-r from-blue-500 to-indigo-500 ring-2 ring-blue-200' 
                                : 'bg-white border-2 border-gray-300 hover:border-blue-400'
                            }`}>
                              {row.isApproved && (
                                <CheckCircle2 className="h-3 w-3 text-white absolute top-0.5 left-0.5" />
                              )}
                            </div>
                          </label>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="10" className="px-6 py-8 text-center">
                        <div className="flex flex-col items-center space-y-2">
                          <Filter className="h-8 w-8 text-gray-300" />
                          <span className="text-sm text-gray-500">Apply filters to view data</span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
                {hasSearched && filteredData.length > 0 && (
                  <tfoot className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-sm font-bold text-gray-900 text-right">Totals:</td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-900">{totals.workingHour}</td>
                      <td className="px-6 py-4 text-sm font-bold text-orange-600">{totals.morningOT}</td>
                      <td className="px-6 py-4 text-sm font-bold text-orange-600">{totals.eveningOT}</td>
                      <td className="px-6 py-4 text-sm font-bold text-indigo-600">{totals.totalOT}</td>
                      <td className="px-6 py-4 text-sm font-bold text-blue-600">{totals.specialOT}</td>
                      <td className="px-6 py-4 text-sm font-bold text-green-600">
                        {filteredData.filter(row => row.isApproved).length} approved
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
            
            {hasSearched && filteredData.length > 0 && (
              <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 flex justify-between items-center border-t border-gray-200">
                <div className="text-sm text-gray-600 font-medium">
                  Showing {filteredData.length} records
                </div>
                <button
                  onClick={processApprovedOT}
                  disabled={!filteredData.some(row => row.isApproved)}
                  className={`flex items-center px-6 py-3 rounded-xl text-white font-medium transition-all duration-200 shadow-sm hover:shadow-md ${
                    !filteredData.some(row => row.isApproved) 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transform hover:scale-105'
                  }`}
                >
                  Process Approved OT <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Approval Confirmation Step */}
        {currentStep === 2 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden mb-6 p-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Confirm Approved Overtime</h2>
                <p className="text-gray-600">Review and confirm the selected overtime records</p>
              </div>
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                {approvedRows.length} records selected
              </span>
            </div>
            
            <div className="overflow-x-auto mb-6 rounded-xl border border-gray-200">
              <table className="min-w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">EMP No</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total OT</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Special OT</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {approvedRows.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{row.empNo}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{row.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-indigo-600">{row.totalOT}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-600">{row.specialOT}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gradient-to-r from-green-50 to-emerald-50">
                  <tr>
                    <td colSpan="3" className="px-6 py-4 text-sm font-bold text-gray-900 text-right">Total Special OT:</td>
                    <td className="px-6 py-4 text-sm font-bold text-green-600" colSpan="2">
                      {approvedRows.reduce((sum, row) => sum + parseFloat(row.specialOT), 0).toFixed(2)} hours
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
            
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setCurrentStep(1)}
                className="flex items-center px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <ArrowLeft className="mr-2 h-5 w-5" /> Back to Edit
              </button>
              <button
                onClick={confirmProcessing}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-sm hover:shadow-md font-medium transform hover:scale-105"
              >
                <CheckCircle2 className="mr-2 h-5 w-5" /> Confirm Processing
              </button>
            </div>
          </div>
        )}

        {/* Completion Step */}
        {currentStep === 3 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden mb-6 p-12 text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 mb-6">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Processing Complete!</h2>
            <p className="text-lg text-gray-600 mb-8">
              Successfully processed <span className="font-semibold text-green-600">{approvedRows.length} records</span> with a total of{' '}
              <span className="font-semibold text-blue-600">
                {approvedRows.reduce((sum, row) => sum + parseFloat(row.specialOT), 0).toFixed(2)} special OT hours
              </span>
            </p>
            <button
              onClick={() => {
                setCurrentStep(1);
                setApprovedRows([]);
                fetchOvertimeData();
              }}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md font-medium transform hover:scale-105"
            >
              Start New Process
            </button>
          </div>
        )}

        {/* Initial Load Button */}
        {timeData.length === 0 && !hasSearched && (
          <div className="text-center mt-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-12">
              <div className="mb-6">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Welcome to Overtime Management</h3>
                <p className="text-gray-600">Load sample data to get started with overtime management</p>
              </div>
              <button
                onClick={fetchOvertimeData}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md font-medium transform hover:scale-105"
              >
                Load Sample Data
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Overtime;