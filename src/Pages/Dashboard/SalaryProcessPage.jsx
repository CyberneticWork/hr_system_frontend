import { useState } from 'react';
import { Download, Users, Wallet, Clock, FileText, Printer, ChevronDown, Filter, CheckCircle, AlertCircle } from 'lucide-react';
import jsPDF from "jspdf";

const STORAGE_KEY = "processedSalaryData";

const SalaryProcessPage = () => {
  // State for filters
  const [location, setLocation] = useState('All Locations');
  const [month, setMonth] = useState('');
  const [status, setStatus] = useState('Unprocessed');
  const [filteredData, setFilteredData] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');

  // Status information
  const statusInfo = {
    processUser: 'Admin',
    lastProcessDate: '2025-05-30'
  };

  // Generate structured temporary data with EPF status
  const generateTempData = () => {
    const employees = [];
    const locations = ['company 1', 'company 2', 'company 3', 'company 4'];
    const departments = ['Finance', 'HR', 'IT', 'Operations', 'Marketing'];
    const designations = ['Manager', 'Executive', 'Developer', 'Analyst', 'Officer'];
    
    for (let i = 1; i <= 15; i++) {
      const hasEPF = i % 2 === 0;
      employees.push({
        EMPNo: `EMP${i.toString().padStart(3, '0')}`,
        Name: `Employee ${i}`,
        Basic: 30000 + (i * 2000),
        Budgetary1: 5000 + (i * 500),
        Budgetary2: 3000 + (i * 300),
        Basic_Salary: 38000 + (i * 2800),
        NoPayMinutes: i % 3 === 0 ? 30 : 0,
        NoPay: i % 3 === 0 ? 1000 : 0,
        Epf_Purposes: 38000 + (i * 2800),
        OTMinutes: i % 2 === 0 ? 60 : 0,
        OverTime: i % 2 === 0 ? 3000 : 0,
        DoubleOTtime: i % 5 === 0 ? 30 : 0,
        TravellingAllowance: 2000 + (i * 100),
        SpecialAllowance: 1000 + (i * 50),
        AttendanceAllowance: 500,
        ProductionIncentive: i % 4 === 0 ? 1500 : 0,
        MedicalReimbursement: i % 6 === 0 ? 2000 : 0,
        GrossAmount: 45000 + (i * 3000),
        SalaryAdvance: i % 7 === 0 ? 5000 : 0,
        StampDuty: 50,
        MealDeduction: i % 3 === 0 ? 500 : 0,
        OtherDeduction: i % 5 === 0 ? 1000 : 0,
        BondDeduction: 0,
        Deduct_epf8: hasEPF ? 3040 + (i * 224) : 0,
        PayeeTax: i > 5 ? 2000 + (i * 100) : 0,
        Loan: i % 4 === 0 ? 2000 : 0,
        TotalDeduction: 4000 + (i * 300),
        NetSalary: 41000 + (i * 2700),
        ETF3: hasEPF ? 1140 + (i * 84) : 0,
        EPF12: hasEPF ? 4560 + (i * 336) : 0,
        Department: departments[i % 5],
        Designation: designations[i % 5],
        Location: locations[i % 4],
        HasEPF: hasEPF
      });
    }
    return employees;
  };

  const allEmployeeData = generateTempData();
  const [employeeData, setEmployeeData] = useState(allEmployeeData);
  const totalSalary = employeeData.reduce((sum, emp) => sum + emp.GrossAmount, 0);
  const employeeCount = employeeData.length;

  // Locations and months for dropdowns
  const locations = ['All Locations', 'company 1', 'company 2', 'company 3', 'company 4'];
  const months = [
    'January 2025', 'February 2025', 'March 2025', 
    'April 2025', 'May 2025', 'June 2025',
    'July 2025', 'August 2025', 'September 2025',
    'October 2025', 'November 2025', 'December 2025'
  ];

  // Handle salary process
  const handleSalaryProcess = () => {
    setStatus('Processed');
    statusInfo.lastProcessDate = new Date().toISOString().split('T')[0];
    // Save processed data to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(employeeData));
  };

  const handlePrintPayslips = () => {
    // Get processed data from localStorage
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    if (!data.length) {
      alert("No processed salary data found.");
      return;
    }
    const doc = new jsPDF();
    data.forEach((emp, idx) => {
      if (idx > 0) doc.addPage();
      doc.setFontSize(16);
      doc.text(`Payslip for ${emp.Name} (${emp.EMPNo})`, 10, 20);
      doc.setFontSize(12);
      let y = 35;
      Object.entries(emp).forEach(([key, value]) => {
        if (
          [
            "EMPNo", "Name", "Department", "Designation", "Location",
            "Basic", "Budgetary1", "Budgetary2", "Basic_Salary", "NoPayMinutes", "NoPay",
            "Epf_Purposes", "OTMinutes", "OverTime", "DoubleOTtime", "TravellingAllowance",
            "SpecialAllowance", "AttendanceAllowance", "ProductionIncentive", "MedicalReimbursement",
            "GrossAmount", "SalaryAdvance", "StampDuty", "MealDeduction", "OtherDeduction",
            "BondDeduction", "Deduct_epf8", "PayeeTax", "Loan", "TotalDeduction", "NetSalary",
            "ETF3", "EPF12"
          ].includes(key)
        ) {
          doc.text(`${key}: ${value}`, 10, y);
          y += 8;
          if (y > 270) {
            doc.addPage();
            y = 20;
          }
        }
      });
    });
    doc.save("payslips.pdf");
  };

  // Handle EPF filter
  const handleEPFFilter = () => {
    setActiveFilter('EPF');
    const epfEmployees = allEmployeeData.filter(emp => emp.HasEPF);
    setEmployeeData(epfEmployees);
  };

  // Handle Non EPF filter
  const handleNonEPFFilter = () => {
    setActiveFilter('NonEPF');
    const nonEPFEmployees = allEmployeeData.filter(emp => !emp.HasEPF);
    setEmployeeData(nonEPFEmployees);
  };

  // Handle reset filter
  const resetFilter = () => {
    setActiveFilter('All');
    setEmployeeData(allEmployeeData);
    setLocation('All Locations');
    setMonth('');
  };

  // Apply filters
  const applyFilters = () => {
    let filtered = allEmployeeData;
    
    if (activeFilter === 'EPF') {
      filtered = filtered.filter(emp => emp.HasEPF);
    } else if (activeFilter === 'NonEPF') {
      filtered = filtered.filter(emp => !emp.HasEPF);
    }
    
    if (location !== 'All Locations') {
      filtered = filtered.filter(emp => emp.Location === location);
    }
    
    if (month) {
      filtered = filtered.filter((_, index) => index % 2 === 0);
    }
    
    setEmployeeData(filtered);
    setFilteredData(filtered);
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-br from-blue-50 via-white to-green-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Salary Processing</h1>
        <div className="flex items-center space-x-2">
          <span className={`
            px-4 py-1.5 rounded-full text-xs font-semibold shadow-sm border
            ${status === 'Processed'
              ? 'bg-green-100 text-green-800 border-green-200'
              : 'bg-yellow-100 text-yellow-800 border-yellow-200'
            }
          `}>
            {status === 'Processed' ? (
              <CheckCircle className="inline mr-1 h-4 w-4" />
            ) : (
              <AlertCircle className="inline mr-1 h-4 w-4" />
            )}
            {status}
          </span>
        </div>
      </div>
      
      {/* Summary Cards and Status Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Left Side - Summary Cards */}
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl border border-blue-200 p-6 shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700 mb-1">Total Salary Cost</p>
                  <p className="text-3xl font-bold text-blue-900">LKR {totalSalary.toLocaleString()}</p>
                </div>
                <div className="p-4 rounded-xl bg-blue-200 text-blue-700 shadow">
                  <Wallet size={24} strokeWidth={2} />
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-100 to-green-50 rounded-2xl border border-green-200 p-6 shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700 mb-1">Employee Count</p>
                  <p className="text-3xl font-bold text-green-900">{employeeCount}</p>
                </div>
                <div className="p-4 rounded-xl bg-green-200 text-green-700 shadow">
                  <Users size={24} strokeWidth={2} />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow flex flex-wrap gap-4">
            <button 
              className={`
                flex items-center gap-2 px-5 py-2.5 rounded-lg text-base font-semibold transition-colors
                ${activeFilter === 'All'
                  ? 'bg-blue-600 text-white shadow'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-blue-50'
                }
              `}
              onClick={resetFilter}
            >
              All Employees
            </button>
            <button 
              className={`
                flex items-center gap-2 px-5 py-2.5 rounded-lg text-base font-semibold transition-colors
                ${activeFilter === 'EPF'
                  ? 'bg-blue-600 text-white shadow'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-blue-50'
                }
              `}
              onClick={handleEPFFilter}
            >
              <Users size={18} strokeWidth={2} />
              EPF Employee
            </button>
            <button 
              className={`
                flex items-center gap-2 px-5 py-2.5 rounded-lg text-base font-semibold transition-colors
                ${activeFilter === 'NonEPF'
                  ? 'bg-blue-600 text-white shadow'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-blue-50'
                }
              `}
              onClick={handleNonEPFFilter}
            >
              <Users size={18} strokeWidth={2} />
              Non EPF Employee
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 rounded-lg text-base font-semibold text-gray-700 hover:bg-blue-50 transition-colors shadow">
              <Download size={18} strokeWidth={2} />
              Export
            </button>
          </div>

          {/* Filter Section */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow">
            <h3 className="text-base font-semibold text-gray-700 mb-4">Filter Employees</h3>
            <div className="flex flex-col md:flex-row gap-5">
              <div className="relative flex-1">
                <label htmlFor="location" className="block text-xs font-semibold text-gray-500 mb-1">Location</label>
                <select
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="appearance-none w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                >
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-9 h-5 w-5 text-blue-400" />
              </div>
              <div className="relative flex-1">
                <label htmlFor="month" className="block text-xs font-semibold text-gray-500 mb-1">Month</label>
                <select
                  id="month"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="appearance-none w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                >
                  <option value="">Select Month</option>
                  {months.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-9 h-5 w-5 text-blue-400" />
              </div>
              <div className="flex items-end">
                <button 
                  className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-base font-semibold hover:bg-blue-700 transition-colors shadow"
                  onClick={applyFilters}
                >
                  <Filter size={18} strokeWidth={2} />
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Status Card */}
        <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl border border-blue-100 p-6 shadow h-fit">
          <h3 className="text-base font-semibold text-blue-700 mb-4">Process Status</h3>
          <div className="space-y-6">
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-1">Status</p>
              <div className="flex items-center">
                {status === 'Processed' ? (
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
                )}
                <p className={`font-semibold text-lg ${
                  status === 'Processed' ? 'text-green-700' : 'text-yellow-700'
                }`}>
                  {status}
                </p>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-1">Processed By</p>
              <p className="font-semibold text-gray-800">{statusInfo.processUser}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-1">Last Process Date</p>
              <p className="font-semibold text-gray-800">{statusInfo.lastProcessDate}</p>
            </div>
            <div className="pt-2 space-y-3">
              <button 
                className={`
                  w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-base font-semibold transition-colors
                  ${status === 'Processed'
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700 shadow'
                  }
                `}
                onClick={handleSalaryProcess}
                disabled={status === 'Processed'}
              >
                <FileText size={18} strokeWidth={2} />
                Process Salary
              </button>
              <button 
                className={`
                  w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-base font-semibold transition-colors
                  ${status !== 'Processed'
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow'
                  }
                `}
                disabled={status !== 'Processed'}
                onClick={handlePrintPayslips}
              >
                <Printer size={18} strokeWidth={2} />
                Print Payslips
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Employee Salary Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow mb-8">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">EMP No</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Basic</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Budgetary1</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Budgetary2</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Basic Salary</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">NoPay Minutes</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">NoPay</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">EPF Purposes</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">OT Minutes</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Over Time</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Double OT</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Travelling Allowance</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Special Allowance</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Attendance Allowance</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Production Incentive</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Medical Reimbursement</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Gross Amount</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Salary Advance</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Stamp Duty</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Meal Deduction</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Other Deduction</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Bond Deduction</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Deduct EPF8%</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Payee Tax</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Loan</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Total Deduction</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Net Salary</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">ETF 3%</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">EPF 12%</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {employeeData.map((employee) => (
                <tr key={employee.EMPNo} className="hover:bg-blue-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{employee.EMPNo}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.Name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.Basic.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.Budgetary1.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.Budgetary2.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.Basic_Salary.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.NoPayMinutes}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.NoPay.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.Epf_Purposes.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.OTMinutes}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.OverTime.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.DoubleOTtime}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.TravellingAllowance.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.SpecialAllowance.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.AttendanceAllowance.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.ProductionIncentive.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.MedicalReimbursement.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-700">{employee.GrossAmount.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.SalaryAdvance?.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.StampDuty.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.MealDeduction?.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.OtherDeduction?.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.BondDeduction?.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.Deduct_epf8.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.PayeeTax.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.Loan.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-red-600">{employee.TotalDeduction.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-700">{employee.NetSalary.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.ETF3.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.EPF12.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between bg-white px-8 py-4 rounded-2xl border border-gray-200 shadow">
        <div className="flex-1 flex justify-between sm:hidden">
          <button className="relative inline-flex items-center px-5 py-2 border border-gray-300 text-base font-semibold rounded-lg text-gray-700 bg-white hover:bg-blue-50">
            Previous
          </button>
          <button className="ml-3 relative inline-flex items-center px-5 py-2 border border-gray-300 text-base font-semibold rounded-lg text-gray-700 bg-white hover:bg-blue-50">
            Next
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-base text-gray-700">
              Showing <span className="font-bold">1</span> to <span className="font-bold">{Math.min(10, employeeCount)}</span> of{' '}
              <span className="font-bold">{employeeCount}</span> results
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-lg shadow-sm -space-x-px" aria-label="Pagination">
              <button className="relative inline-flex items-center px-3 py-2 rounded-l-lg border border-gray-300 bg-white text-base font-semibold text-gray-500 hover:bg-blue-50">
                <span className="sr-only">Previous</span>
                &larr;
              </button>
              <button aria-current="page" className="z-10 bg-blue-100 border-blue-500 text-blue-700 relative inline-flex items-center px-5 py-2 border text-base font-bold">
                1
              </button>
              <button className="bg-white border-gray-300 text-gray-500 hover:bg-blue-50 relative inline-flex items-center px-5 py-2 border text-base font-semibold">
                2
              </button>
              <button className="bg-white border-gray-300 text-gray-500 hover:bg-blue-50 relative inline-flex items-center px-5 py-2 border text-base font-semibold">
                3
              </button>
              <button className="relative inline-flex items-center px-3 py-2 rounded-r-lg border border-gray-300 bg-white text-base font-semibold text-gray-500 hover:bg-blue-50">
                <span className="sr-only">Next</span>
                &rarr;
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalaryProcessPage;