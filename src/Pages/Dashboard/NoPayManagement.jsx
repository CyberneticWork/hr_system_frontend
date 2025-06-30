import React, { useState, useEffect } from "react";
import {
  Calendar,
  Search,
  Download,
  Trash2,
  Filter,
  Printer,
  Building,
  Clock,
  User,
} from "lucide-react";

const NoPayManagement = () => {
  // State for filters
  const [month, setMonth] = useState("");
  const [location, setLocation] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Sample data for the table
  const [noPayRecords, setNoPayRecords] = useState([
    {
      id: 1,
      date: "2025-07-05",
      empNo: "EMP001",
      name: "John Smith",
      noPayCount: 1,
      description: "Absent without leave",
    },
    {
      id: 2,
      date: "2025-07-12",
      empNo: "EMP003",
      name: "Michael Johnson",
      noPayCount: 0.5,
      description: "Half-day absence",
    },
    {
      id: 3,
      date: "2025-07-15",
      empNo: "EMP007",
      name: "Sarah Williams",
      noPayCount: 1,
      description: "Unauthorized absence",
    },
  ]);

  // List of locations
  const locations = ["Head Office", "Branch Office", "Factory", "Warehouse"];

  // List of months
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Filter records based on search term and filters
  const filteredRecords = noPayRecords.filter((record) => {
    const matchesSearch =
      record.empNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesMonth =
      !month ||
      new Date(record.date).toLocaleString("default", { month: "long" }) ===
        month;
    const matchesLocation = !location || record.location === location;

    return matchesSearch && matchesMonth && matchesLocation;
  });

  // Handle record removal
  const handleRemoveRecord = (id) => {
    if (window.confirm("Are you sure you want to remove this record?")) {
      setNoPayRecords(noPayRecords.filter((record) => record.id !== id));
    }
  };

  // Handle generate NoPay report
  const handleGenerateNoPay = () => {
    alert("Generating No Pay report for selected criteria");
  };

  // Add this function to handle specialized printing of just the filtered table
  const handlePrint = () => {
    // Create a new window for printing
    const printWindow = window.open("", "_blank", "height=600,width=800");

    // Get the current date and time for the report header
    const currentDate = new Date().toLocaleString();

    // Create print content with only the filtered table
    printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Non Working Days Report</title>
        <style>
          body { 
            font-family: Arial, sans-serif;
            margin: 20px;
            color: #333;
          }
          .report-header {
            text-align: center;
            margin-bottom: 20px;
          }
          .report-header h1 {
            margin-bottom: 5px;
          }
          .report-meta {
            font-size: 14px;
            margin-bottom: 20px;
            color: #666;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #f2f2f2;
            font-weight: bold;
          }
          tr:nth-child(even) {
            background-color: #f9f9f9;
          }
          .report-footer {
            margin-top: 30px;
            font-size: 12px;
            text-align: center;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="report-header">
          <h1>Non Working Days Report</h1>
          <p>Generated on: ${currentDate}</p>
        </div>
        
        <div class="report-meta">
          ${month ? `<strong>Month:</strong> ${month} | ` : ""}
          ${location ? `<strong>Location:</strong> ${location} | ` : ""}
          <strong>Total Records:</strong> ${filteredRecords.length}
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Emp No</th>
              <th>Name</th>
              <th>Nopay Count</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            ${filteredRecords
              .map(
                (record) => `
              <tr>
                <td>${new Date(record.date).toLocaleDateString()}</td>
                <td>${record.empNo}</td>
                <td>${record.name}</td>
                <td>${record.noPayCount}</td>
                <td>${record.description}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
        
        <div class="report-footer">
          <p>HR System - Cybernetic Software Solutions</p>
        </div>
      </body>
    </html>
  `);

    // Add summary at the bottom if there are records
    if (filteredRecords.length > 0) {
      const totalNoPay = filteredRecords.reduce(
        (sum, record) => sum + record.noPayCount,
        0
      );
      const uniqueEmployees = new Set(
        filteredRecords.map((record) => record.empNo)
      ).size;

      printWindow.document.write(`
      <div style="margin-top: 20px; padding: 10px; border-top: 1px solid #ddd;">
        <p><strong>Summary:</strong> Total No Pay Days: ${totalNoPay} | Affected Employees: ${uniqueEmployees}</p>
      </div>
    `);
    }

    printWindow.document.close();
    printWindow.focus();

    // Print after content is loaded
    printWindow.onload = function () {
      printWindow.print();
      // printWindow.close(); // Uncomment if you want the print window to close after printing
    };
  };

  // Handle filter
  const handleFilter = () => {
    alert(`Filtering records for: ${month} ${location}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100 py-4 sm:py-8">
      <div className="container mx-auto px-3 sm:px-4 max-w-7xl">
        {/* Header Section */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-800 to-gray-900 px-4 sm:px-8 py-6 sm:py-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white text-center">
              Non Working Days
            </h1>
            <p className="text-slate-300 text-center mt-2 text-sm sm:text-base">
              Manage employee no pay records and absences
            </p>
          </div>

          <div className="p-4 sm:p-6 lg:p-8">
            {/* Filter Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Month
                </label>
                <select
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="w-full p-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white shadow-sm"
                >
                  <option value="">All Months</option>
                  {months.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Location
                </label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full p-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white shadow-sm"
                >
                  <option value="">All Locations</option>
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleFilter}
                  className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-colors flex items-center gap-2"
                >
                  <Filter className="w-5 h-5" />
                  Filter
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by employee number, name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-3 pl-10 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                />
                <Search className="absolute left-3 top-3.5 text-gray-400" />
              </div>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden mb-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Emp No
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nopay Count
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Remove
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredRecords.length > 0 ? (
                      filteredRecords.map((record) => (
                        <tr key={record.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {new Date(record.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {record.empNo}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {record.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {record.noPayCount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {record.description}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <button
                              onClick={() => handleRemoveRecord(record.id)}
                              className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-full transition-colors"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="6"
                          className="px-6 py-16 text-center text-gray-500"
                        >
                          No records found. Adjust your filters or add new
                          records.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-4">
              <button
                onClick={handlePrint}
                className="px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-700 text-white font-medium rounded-lg hover:from-teal-700 hover:to-teal-800 transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <Printer className="w-5 h-5" />
                Print
              </button>
              <button
                onClick={handleGenerateNoPay}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-medium rounded-lg hover:from-green-700 hover:to-green-800 transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Generate Nopay
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total No Pay Records
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {noPayRecords.length}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-xl">
                <Clock className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total No Pay Days
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {noPayRecords.reduce(
                    (sum, record) => sum + record.noPayCount,
                    0
                  )}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-xl">
                <Calendar className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Affected Employees
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(noPayRecords.map((record) => record.empNo)).size}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <User className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoPayManagement;
