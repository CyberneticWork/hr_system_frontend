import { useState, useEffect } from "react";
import {
  Download,
  Users,
  Wallet,
  Clock,
  FileText,
  Printer,
  ChevronDown,
  Filter,
  CheckCircle,
  AlertCircle,
  Search,
  Building2,
  Layers,
} from "lucide-react";
import jsPDF from "jspdf";
import { fetchCompanies, fetchDepartmentsById } from "@services/ApiDataService";
import {
  getSalaryData,
  UpdateAllowances,
} from "@services/SalaryProcessService";
import AllowancesService from "@services/AllowancesService";
import * as DeductionService from "@services/DeductionService";

const STORAGE_KEY = "processedSalaryData";

const SalaryProcessPage = () => {
  // State for filters
  const [location, setLocation] = useState("All Locations");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [status, setStatus] = useState("Unprocessed");
  const [filteredData, setFilteredData] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [employeeHistoryData, setEmployeeHistoryData] = useState([]);
  const [showingHistory, setShowingHistory] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // New state for companies and departments
  const [companies, setCompanies] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(false);
  const [isLoadingDepartments, setIsLoadingDepartments] = useState(false);
  const [availableAllowances, setAvailableAllowances] = useState([]);
  const [availableDeductions, setAvailableDeductions] = useState([]);
  const [isLoadingAllowances, setIsLoadingAllowances] = useState(false);

  // New state for selected employees
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [bulkActionType, setBulkActionType] = useState("allowance");
  const [bulkActionAmount, setBulkActionAmount] = useState("");
  const [bulkActionName, setBulkActionName] = useState("");
  const [bulkActionId, setBulkActionId] = useState("");

  // Status information
  const statusInfo = {
    processUser: "Admin",
    lastProcessDate: "2025-05-30",
  };

  const [employeeData, setEmployeeData] = useState([]);
  const [displayedData, setDisplayedData] = useState([]);
  const totalSalary = (displayedData || []).reduce(
    (sum, emp) => sum + (parseFloat(emp?.basic_salary) || 0),
    0
  );
  const employeeCount = displayedData.length;

  // Months for dropdowns
  const months = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  // Handle salary process
  const handleSalaryProcess = () => {
    setStatus("Processed");
    statusInfo.lastProcessDate = new Date().toISOString().split("T")[0];
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

      // Header
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("Company Name (Official Payslip)", 105, 18, { align: "center" });

      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(`Payslip for the Month: ${month} ${year}`, 105, 28, {
        align: "center",
      });

      // Employee Info
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("Employee Details", 14, 40);
      doc.setFont("helvetica", "normal");
      doc.text(`Employee No: ${emp.emp_no}`, 14, 48);
      doc.text(`Name: ${emp.full_name}`, 14, 54);
      doc.text(`Department: ${emp.department_name}`, 14, 60);
      doc.text(`Company: ${emp.company_name}`, 14, 66);

      // Salary Table
      let y = 82;
      doc.setFont("helvetica", "bold");
      doc.text("Earnings", 14, y);
      doc.text("Amount (LKR)", 70, y);
      doc.text("Deductions", 120, y);
      doc.text("Amount (LKR)", 180, y);
      y += 8;
      doc.setFont("helvetica", "normal");

      // Earnings
      const earnings = [["Basic Salary", emp.basic_salary]];

      // Deductions
      const deductions = [["Loan", emp.total_loan_amount]];

      // Print earnings and deductions side by side
      const maxRows = Math.max(earnings.length, deductions.length);
      for (let i = 0; i < maxRows; i++) {
        if (earnings[i]) {
          doc.text(earnings[i][0], 14, y);
          doc.text(
            earnings[i][1] ? parseFloat(earnings[i][1]).toLocaleString() : "-",
            70,
            y,
            { align: "right" }
          );
        }
        if (deductions[i]) {
          doc.text(deductions[i][0], 120, y);
          doc.text(
            deductions[i][1]
              ? parseFloat(deductions[i][1]).toLocaleString()
              : "-",
            180,
            y,
            { align: "right" }
          );
        }
        y += 8;
        if (y > 260) {
          doc.addPage();
          y = 20;
        }
      }

      // Gross, Deductions, Net
      y += 4;
      doc.setFont("helvetica", "bold");
      doc.text("Gross Amount", 14, y);
      doc.text(
        emp.basic_salary ? parseFloat(emp.basic_salary).toLocaleString() : "-",
        70,
        y,
        { align: "right" }
      );
      doc.text("Total Deduction", 120, y);
      doc.text(
        emp.total_loan_amount
          ? parseFloat(emp.total_loan_amount).toLocaleString()
          : "-",
        180,
        y,
        { align: "right" }
      );

      y += 10;
      doc.setFontSize(13);
      doc.setTextColor(34, 197, 94); // green
      const netSalary =
        (parseFloat(emp.basic_salary) || 0) -
        (parseFloat(emp.total_loan_amount) || 0);
      doc.text("Net Salary", 14, y);
      doc.text(netSalary.toLocaleString(), 70, y, {
        align: "right",
      });
      doc.setTextColor(0, 0, 0);

      // Statutory
      if (emp.enable_epf_etf) {
        y += 10;
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text("Statutory Contributions", 14, y);
        doc.setFont("helvetica", "normal");
        y += 7;
        const epf8 = (parseFloat(emp.basic_salary) || 0) * 0.08;
        doc.text(`EPF (8% Employee): ${epf8.toLocaleString()}`, 14, y);
        y += 6;
        const epf12 = (parseFloat(emp.basic_salary) || 0) * 0.12;
        doc.text(`EPF (12% Employer): ${epf12.toLocaleString()}`, 14, y);
        y += 6;
        const etf3 = (parseFloat(emp.basic_salary) || 0) * 0.03;
        doc.text(`ETF (3% Employer): ${etf3.toLocaleString()}`, 14, y);
      }

      // Footer
      y = 275;
      doc.setFontSize(10);
      doc.setFont("helvetica", "italic");
      doc.text(
        "This is a system generated payslip and does not require a signature.",
        105,
        y,
        { align: "center" }
      );
    });

    doc.save("payslips.pdf");
  };

  // Handle EPF filter
  const handleEPFFilter = () => {
    setActiveFilter("EPF");
    const epfEmployees = employeeData.filter((emp) => emp.enable_epf_etf);
    setDisplayedData(epfEmployees);
  };

  // Handle Non EPF filter
  const handleNonEPFFilter = () => {
    setActiveFilter("NonEPF");
    const nonEPFEmployees = employeeData.filter((emp) => !emp.enable_epf_etf);
    setDisplayedData(nonEPFEmployees);
  };

  // Fetch companies on component mount
  useEffect(() => {
    const loadCompanies = async () => {
      setIsLoadingCompanies(true);
      try {
        const companiesData = await fetchCompanies();
        setCompanies(companiesData);
      } catch (error) {
        console.error("Error loading companies:", error);
      } finally {
        setIsLoadingCompanies(false);
      }
    };

    loadCompanies();
  }, []);

  // Fetch departments when company is selected
  useEffect(() => {
    const loadDepartments = async () => {
      if (selectedCompany) {
        setIsLoadingDepartments(true);
        try {
          const departmentsData = await fetchDepartmentsById(selectedCompany);
          setDepartments(departmentsData);
        } catch (error) {
          console.error("Error loading departments:", error);
        } finally {
          setIsLoadingDepartments(false);
        }
      } else {
        setDepartments([]);
        setSelectedDepartment("");
      }
    };

    loadDepartments();
  }, [selectedCompany]);

  // Fetch salary data when Apply Filters is clicked
  const fetchSalaryData = async () => {
    if (!month || !year || !selectedCompany) {
      alert("Please select company, month, and year before applying filters");
      return;
    }

    setIsLoading(true);
    try {
      const data = await getSalaryData(
        month,
        year,
        selectedCompany,
        selectedDepartment || ""
      );
      setEmployeeData(data.data);
      setDisplayedData(data.data);
      setFilteredData(data.data);
    } catch (error) {
      console.error("Error fetching salary data:", error);
      alert("Error fetching salary data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Apply filters
  const applyFilters = async () => {
    await fetchSalaryData();

    let filtered = employeeData;

    if (activeFilter === "EPF") {
      filtered = filtered.filter((emp) => emp.enable_epf_etf);
    } else if (activeFilter === "NonEPF") {
      filtered = filtered.filter((emp) => !emp.enable_epf_etf);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (emp) =>
          emp.emp_no.toString().includes(term) ||
          emp.full_name.toLowerCase().includes(term)
      );
    }

    setDisplayedData(filtered);
    setFilteredData(filtered);
  };

  // Reset filter function
  const resetFilter = () => {
    setActiveFilter("All");
    setEmployeeData([]);
    setDisplayedData([]);
    setFilteredData([]);
    setSelectedCompany("");
    setSelectedDepartment("");
    setMonth("");
    setSearchTerm("");
    setFromDate("");
    setToDate("");
    setShowHistory(false);
    setEmployeeHistoryData([]);
    setShowingHistory(false);
  };

  // Add this function to load allowances by company
  const loadAllowancesByCompany = async (companyId) => {
    setIsLoadingAllowances(true);
    try {
      const allowances =
        await AllowancesService.getAllowancesByCompanyOrDepartment(
          companyId,
          null
        );
      setAvailableAllowances(allowances || []);
    } catch (error) {
      console.error("Error loading allowances by company:", error);
    } finally {
      setIsLoadingAllowances(false);
    }
  };

  // Add this useEffect to load allowances and deductions when the component mounts
  useEffect(() => {
    const loadAllowancesAndDeductions = async () => {
      setIsLoadingAllowances(true);
      try {
        // Get all allowances
        const allowances = await AllowancesService.getAllAllowances();
        setAvailableAllowances(allowances || []);

        // Get all deductions
        const deductions =
          await DeductionService.fetchDeductionsByCompanyOrDepartment();
        setAvailableDeductions(deductions || []);
      } catch (error) {
        console.error("Error loading allowances and deductions:", error);
      } finally {
        setIsLoadingAllowances(false);
      }
    };

    loadAllowancesAndDeductions();
  }, []);

  // Add this function to your SalaryProcessPage component
  const handleCompanyChange = (e) => {
    const companyId = e.target.value;
    setSelectedCompany(companyId);
    setSelectedDepartment("");

    // If a company is selected, fetch its allowances
    if (companyId) {
      loadAllowancesByCompany(companyId);
    } else {
      // If no company is selected, load all allowances
      loadAllowancesAndDeductions();
    }
  };

  // Handle selection of allowance or deduction and auto-fill amount
  const handleAllowanceDeductionChange = (id) => {
    // Set the selected action ID
    setBulkActionId(id);

    // Find the selected allowance or deduction to get its amount
    if (bulkActionType === "allowance") {
      const selectedAllowance = availableAllowances.find(
        (allowance) => allowance.id === id
      );
      if (selectedAllowance && selectedAllowance.amount) {
        // Convert to number and format to 2 decimal places if needed
        const amount = parseFloat(selectedAllowance.amount).toFixed(2);
        setBulkActionAmount(amount);
      }
    } else {
      const selectedDeduction = availableDeductions.find(
        (deduction) => deduction.id === id
      );
      if (selectedDeduction && selectedDeduction.amount) {
        // Convert to number and format to 2 decimal places if needed
        const amount = parseFloat(selectedDeduction.amount).toFixed(2);
        setBulkActionAmount(amount);
      }
    }
  };

  // Handle checkbox selection
  const handleSelectEmployee = (employee) => {
    const empId = `${employee.id}`;
    if (selectedEmployees.includes(empId)) {
      setSelectedEmployees(selectedEmployees.filter((id) => id !== empId));
    } else {
      setSelectedEmployees([...selectedEmployees, empId]);
    }
  };

  // Handle select all checkbox
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedEmployees([]);
    } else {
      const allEmployeeIds = displayedData.map((employee) => `${employee.id}`);
      setSelectedEmployees(allEmployeeIds);
    }
    setSelectAll(!selectAll);
  };

  // Apply bulk action to selected employees
  const applyBulkAction = async () => {
    if (!bulkActionId || selectedEmployees.length === 0) {
      alert("Please fill all fields and select at least one employee");
      return;
    }

    const payload = {
      selectedEmployees: selectedEmployees,
      bulkActionId: bulkActionId,
      bulkActionType: bulkActionType,
      bulkActionAmount: bulkActionAmount || null,
    };

    try {
      const res = await UpdateAllowances(payload);
      console.log(JSON.stringify(res));
      alert(
        `Successfully applied ${bulkActionType} to ${selectedEmployees.length} employee(s)`
      );
      // Refresh data after bulk action
      await fetchSalaryData();

      // Clear selection after applying
      setSelectedEmployees([]);
      setSelectAll(false);
      setShowBulkActions(false);
      setBulkActionAmount("");
      setBulkActionName("");
    } catch (error) {
      console.log(error);
      alert(`Error - ${error.response?.data?.message || error.message}`);
    }
  };

  // Effect to check if we should show the select all as checked
  useEffect(() => {
    const allSelected =
      displayedData.length > 0 &&
      selectedEmployees.length === displayedData.length;
    setSelectAll(allSelected);
  }, [selectedEmployees, displayedData]);

  // Reset selected employees when filters change
  useEffect(() => {
    setSelectedEmployees([]);
    setSelectAll(false);
  }, [searchTerm, location, month, activeFilter, showHistory]);

  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-br from-blue-50 via-white to-green-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Salary Processing
        </h1>
        <div className="flex items-center space-x-2">
          <span
            className={`
            px-4 py-1.5 rounded-full text-xs font-semibold shadow-sm border
            ${
              status === "Processed"
                ? "bg-green-100 text-green-800 border-green-200"
                : "bg-yellow-100 text-yellow-800 border-yellow-200"
            }
          `}
          >
            {status === "Processed" ? (
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
                  <p className="text-sm font-medium text-blue-700 mb-1">
                    Total Salary Cost
                  </p>
                  <p className="text-3xl font-bold text-blue-900">
                    LKR {totalSalary.toLocaleString()}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-blue-200 text-blue-700 shadow">
                  <Wallet size={24} strokeWidth={2} />
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-100 to-green-50 rounded-2xl border border-green-200 p-6 shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700 mb-1">
                    Employee Count
                  </p>
                  <p className="text-3xl font-bold text-green-900">
                    {employeeCount}
                  </p>
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
                ${
                  activeFilter === "All"
                    ? "bg-blue-600 text-white shadow"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-blue-50"
                }
              `}
              onClick={resetFilter}
            >
              All Employees
            </button>
            <button
              className={`
                flex items-center gap-2 px-5 py-2.5 rounded-lg text-base font-semibold transition-colors
                ${
                  activeFilter === "EPF"
                    ? "bg-blue-600 text-white shadow"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-blue-50"
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
                ${
                  activeFilter === "NonEPF"
                    ? "bg-blue-600 text-white shadow"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-blue-50"
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
            <h3 className="text-base font-semibold text-gray-700 mb-4">
              Filter Employees
            </h3>

            {/* Search by ID or Name */}
            <div className="relative mb-4">
              <label
                htmlFor="search"
                className="block text-xs font-semibold text-gray-500 mb-1"
              >
                Search by ID or Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="search"
                  placeholder="Enter employee ID or name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                />
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-5 mb-4">
              <div className="relative flex-1">
                <label
                  htmlFor="company"
                  className="block text-xs font-semibold text-gray-500 mb-1"
                >
                  Company
                </label>
                <div className="relative">
                  <Building2
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  {isLoadingCompanies ? (
                    <div className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500"></div>
                      <span className="ml-2 text-gray-500">Loading...</span>
                    </div>
                  ) : (
                    <select
                      id="company"
                      value={selectedCompany}
                      onChange={handleCompanyChange}
                      className="appearance-none w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                    >
                      <option value="">All Companies</option>
                      {companies.map((company) => (
                        <option key={company.id} value={company.id}>
                          {company.name}
                        </option>
                      ))}
                    </select>
                  )}
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-400" />
                </div>
              </div>

              <div className="relative flex-1">
                <label
                  htmlFor="department"
                  className="block text-xs font-semibold text-gray-500 mb-1"
                >
                  Department
                </label>
                <div className="relative">
                  <Layers
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  {isLoadingDepartments ? (
                    <div className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500"></div>
                      <span className="ml-2 text-gray-500">Loading...</span>
                    </div>
                  ) : (
                    <select
                      id="department"
                      value={selectedDepartment}
                      onChange={(e) => setSelectedDepartment(e.target.value)}
                      disabled={!selectedCompany}
                      className={`appearance-none w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm ${
                        !selectedCompany ? "bg-gray-100 cursor-not-allowed" : ""
                      }`}
                    >
                      <option value="">All Departments</option>
                      {departments.map((department) => (
                        <option key={department.id} value={department.id}>
                          {department.name}
                        </option>
                      ))}
                    </select>
                  )}
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-400" />
                </div>
              </div>

              <div className="relative flex-1">
                <label
                  htmlFor="month"
                  className="block text-xs font-semibold text-gray-500 mb-1"
                >
                  Month
                </label>
                <select
                  id="month"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="appearance-none w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                >
                  <option value="">Select Month</option>
                  {months.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-400" />
              </div>

              <div className="relative flex-1">
                <label
                  htmlFor="year"
                  className="block text-xs font-semibold text-gray-500 mb-1"
                >
                  Year
                </label>
                <input
                  type="number"
                  id="year"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full pl-3 pr-3 py-2 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                  placeholder="Enter year"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-base font-semibold hover:bg-blue-700 transition-colors shadow"
                onClick={applyFilters}
                type="button"
              >
                <Filter size={18} strokeWidth={2} />
                Apply Filters
              </button>
              <button
                className="flex items-center gap-2 px-5 py-2.5 bg-gray-200 text-gray-700 rounded-lg text-base font-semibold hover:bg-gray-300 transition-colors shadow"
                onClick={resetFilter}
                type="button"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Right Side - Status Card */}
        <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl border border-blue-100 p-6 shadow h-fit">
          <h3 className="text-base font-semibold text-blue-700 mb-4">
            Process Status
          </h3>
          <div className="space-y-6">
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-1">Status</p>
              <div className="flex items-center">
                {status === "Processed" ? (
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
                )}
                <p
                  className={`font-semibold text-lg ${
                    status === "Processed"
                      ? "text-green-700"
                      : "text-yellow-700"
                  }`}
                >
                  {status}
                </p>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-1">
                Processed By
              </p>
              <p className="font-semibold text-gray-800">
                {statusInfo.processUser}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-1">
                Last Process Date
              </p>
              <p className="font-semibold text-gray-800">
                {statusInfo.lastProcessDate}
              </p>
            </div>
            <div className="pt-2 space-y-3">
              <button
                className={`
                  w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-base font-semibold transition-colors
                  ${
                    status === "Processed"
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-green-600 text-white hover:bg-green-700 shadow"
                  }
                `}
                onClick={handleSalaryProcess}
                disabled={status === "Processed"}
              >
                <FileText size={18} strokeWidth={2} />
                Process Salary
              </button>
              <button
                className={`
                  w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-base font-semibold transition-colors
                  ${
                    status !== "Processed"
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700 shadow"
                  }
                `}
                disabled={status !== "Processed"}
                onClick={handlePrintPayslips}
              >
                <Printer size={18} strokeWidth={2} />
                Print Payslips
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Actions Panel - Show when employees are selected */}
      {selectedEmployees.length > 0 && (
        <div className="bg-white rounded-2xl border border-blue-200 p-6 shadow-md mb-8 animate-fadeIn">
          <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
            <Users className="mr-2" size={20} />
            Bulk Actions ({selectedEmployees.length} employees selected)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Action Type
              </label>
              <select
                value={bulkActionType}
                onChange={(e) => {
                  setBulkActionType(e.target.value);
                  setBulkActionName("");
                  setBulkActionAmount("");
                }}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="allowance">Add Allowance</option>
                <option value="deduction">Add Deduction</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                {bulkActionType === "allowance"
                  ? "Allowance Type"
                  : "Deduction Type"}
              </label>
              <select
                value={bulkActionId}
                onChange={(e) => handleAllowanceDeductionChange(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Type</option>
                {bulkActionType === "allowance"
                  ? availableAllowances.map((allowance) => (
                      <option key={allowance.id} value={allowance.id}>
                        {allowance.allowance_name}
                      </option>
                    ))
                  : availableDeductions.map((deduction) => (
                      <option key={deduction.id} value={deduction.id}>
                        {deduction.deduction_name}
                      </option>
                    ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Amount
              </label>
              <input
                type="number"
                value={bulkActionAmount}
                onChange={(e) => setBulkActionAmount(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter amount"
              />
            </div>

            <div className="flex items-end">
              <button
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200"
                onClick={applyBulkAction}
              >
                Apply to Selected
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              className="text-gray-600 hover:text-gray-800 font-medium"
              onClick={() => {
                setSelectedEmployees([]);
                setSelectAll(false);
              }}
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Employee Salary Table */}
      {!isLoading && displayedData.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow mb-8">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-50">
                <tr>
                  <th className="px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">
                    EMP No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">
                    Company/Dept
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">
                    Salary Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">
                    EPF/ETF
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">
                    Allowances
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">
                    Deductions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">
                    Salary Breakdown
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">
                    Net Salary
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {displayedData.map((employee) => {
                  const empId = `${employee.id}`;

                  // Calculate totals
                  const totalAllowances =
                    employee.allowances?.reduce(
                      (sum, allowance) =>
                        sum + (parseFloat(allowance.amount) || 0),
                      0
                    ) || 0;

                  const totalDeductions =
                    employee.deductions?.reduce(
                      (sum, deduction) =>
                        sum + (parseFloat(deduction.amount) || 0),
                      0
                    ) || 0;

                  const netSalary =
                    employee.salary_breakdown?.net_salary ||
                    (parseFloat(employee.basic_salary) || 0) +
                      totalAllowances -
                      totalDeductions;

                  return (
                    <tr
                      key={employee.id}
                      className="hover:bg-blue-50 transition-colors"
                    >
                      <td className="px-4 py-4 whitespace-nowrap text-center">
                        <input
                          type="checkbox"
                          checked={selectedEmployees.includes(empId)}
                          onChange={() => handleSelectEmployee(employee)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {employee.emp_no}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="font-medium">{employee.full_name}</div>
                        <div className="text-xs text-gray-500">
                          ID: {employee.id} | BR: {employee.br_status}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="font-medium">
                          {employee.company_name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {employee.department_name}
                          {employee.sub_department_name &&
                            ` (${employee.sub_department_name})`}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          Basic:{" "}
                          {parseFloat(
                            employee.basic_salary || 0
                          ).toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {employee.increment_active ? (
                            <>
                              Incr: {employee.increment_value} (eff.{" "}
                              {employee.increment_effected_date})
                            </>
                          ) : (
                            "No active increment"
                          )}
                        </div>
                        <div className="text-xs text-gray-500">
                          OT: {employee.ot_morning ? "Morning" : ""}{" "}
                          {employee.ot_evening ? "Evening" : ""}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>{employee.enable_epf_etf ? "Yes" : "No"}</div>
                        {employee.enable_epf_etf && (
                          <div className="text-xs text-gray-500">
                            EPF:{" "}
                            {employee.salary_breakdown?.epf_deduction?.toLocaleString() ||
                              "0"}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="flex flex-col space-y-1">
                          {employee.allowances?.map((allowance) => (
                            <div
                              key={allowance.id}
                              className="flex justify-between"
                            >
                              <span className="text-xs">
                                {allowance.name} ({allowance.code})
                              </span>
                              <span className="font-medium">
                                {parseFloat(
                                  allowance.amount || 0
                                ).toLocaleString()}
                              </span>
                            </div>
                          ))}
                          <div className="font-semibold border-t mt-1 pt-1">
                            Total: {totalAllowances.toLocaleString()}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="flex flex-col space-y-1">
                          {employee.deductions?.map((deduction) => (
                            <div
                              key={deduction.id}
                              className="flex justify-between"
                            >
                              <span className="text-xs">
                                {deduction.name} ({deduction.code})
                              </span>
                              <span className="font-medium">
                                {parseFloat(
                                  deduction.amount || 0
                                ).toLocaleString()}
                              </span>
                            </div>
                          ))}
                          <div className="font-semibold border-t mt-1 pt-1">
                            Total: {totalDeductions.toLocaleString()}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {employee.salary_breakdown && (
                          <div className="flex flex-col space-y-1">
                            <div className="flex justify-between">
                              <span className="text-xs">Gross:</span>
                              <span>
                                {employee.salary_breakdown.gross_salary?.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-xs">Adj. Basic:</span>
                              <span>
                                {employee.salary_breakdown.adjusted_basic?.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-xs">Per Day:</span>
                              <span>
                                {employee.salary_breakdown.per_day_salary?.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-xs">Loan:</span>
                              <span>
                                {employee.salary_breakdown.loan_installment?.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-xs">No Pay Days:</span>
                              <span>
                                {employee.salary_breakdown.no_pay_deduction ||
                                  "0"}
                              </span>
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-700">
                        <div>{netSalary.toLocaleString()}</div>
                        {employee.salary_breakdown && (
                          <div className="text-xs font-normal text-gray-500">
                            Deductions:{" "}
                            {employee.salary_breakdown.total_deductions?.toLocaleString()}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && displayedData.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow text-center">
          <div className="mx-auto max-w-md">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              No employees found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter criteria
            </p>
            <div className="mt-6">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={resetFilter}
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      {displayedData.length > 0 && (
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
                Showing <span className="font-bold">1</span> to{" "}
                <span className="font-bold">{Math.min(10, employeeCount)}</span>{" "}
                of <span className="font-bold">{employeeCount}</span> results
              </p>
            </div>
            <div>
              <nav
                className="relative z-0 inline-flex rounded-lg shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <button className="relative inline-flex items-center px-3 py-2 rounded-l-lg border border-gray-300 bg-white text-base font-semibold text-gray-500 hover:bg-blue-50">
                  <span className="sr-only">Previous</span>
                  &larr;
                </button>
                <button
                  aria-current="page"
                  className="z-10 bg-blue-100 border-blue-500 text-blue-700 relative inline-flex items-center px-5 py-2 border text-base font-bold"
                >
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
      )}
    </div>
  );
};

export default SalaryProcessPage;
