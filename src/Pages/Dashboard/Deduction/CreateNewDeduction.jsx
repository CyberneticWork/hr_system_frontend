import React, { useState } from "react";
import { Save, X, DollarSign, Plus, Search } from "lucide-react";

const CreateNewDeduction = () => {
  const [deductions, setDeductions] = useState([
    {
      id: "001",
      deductionCode: "EPF",
      deductionDescription: "Employee Provident Fund",
      amount: "8%",
      applicableFor: "All Employees",
      deductionType: "Fixed",
      active: true,
    },
    {
      id: "002",
      deductionCode: "ETF",
      deductionDescription: "Employee Trust Fund",
      amount: "3%",
      applicableFor: "All Employees",
      deductionType: "Fixed",
      active: true,
    },
    {
      id: "003",
      deductionCode: "ADVR",
      deductionDescription: "Advance Recovery",
      amount: "Variable",
      applicableFor: "Selected Employees",
      deductionType: "Variable",
      active: true,
    },
    {
      id: "004",
      deductionCode: "LOAN",
      deductionDescription: "Loan Recovery",
      amount: "Variable",
      applicableFor: "Loan Holders",
      deductionType: "Variable",
      active: true,
    },
  ]);

  const [formData, setFormData] = useState({
    deductionCode: "",
    deductionDescription: "",
    amount: "",
    applicableFor: "All Employees",
    deductionType: "Fixed", // Added deduction type field
    active: true,
  });

  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFilter, setSearchFilter] = useState("all");

  // Filter deductions based on search term and selected filter
  const filteredDeductions = deductions.filter((deduction) => {
    const searchLower = searchTerm.toLowerCase();

    if (searchTerm === "") return true;

    switch (searchFilter) {
      case "deductionCode":
        return deduction.deductionCode.toLowerCase().includes(searchLower);
      case "deductionType":
        return deduction.deductionType.toLowerCase().includes(searchLower);
      case "applicableFor":
        return deduction.applicableFor.toLowerCase().includes(searchLower);
      default:
        // Search in all fields
        return (
          deduction.deductionCode.toLowerCase().includes(searchLower) ||
          deduction.deductionType.toLowerCase().includes(searchLower) ||
          deduction.applicableFor.toLowerCase().includes(searchLower) ||
          deduction.deductionDescription.toLowerCase().includes(searchLower)
        );
    }
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleToggleChange = (name) => {
    setFormData((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newDeduction = {
      id: `00${deductions.length + 1}`,
      ...formData,
    };

    setDeductions([...deductions, newDeduction]);
    setFormData({
      deductionCode: "",
      deductionDescription: "",
      amount: "",
      applicableFor: "All Employees",
      deductionType: "Fixed", // Reset deductionType field
      active: true,
    });
    setShowModal(false);
  };

  const handleToggleDeductionStatus = (id) => {
    setDeductions((prevDeductions) =>
      prevDeductions.map((deduction) =>
        deduction.id === id
          ? { ...deduction, active: !deduction.active }
          : deduction
      )
    );
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-xl">
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-red-500 to-orange-500 p-3 rounded-xl">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            Deductions Management
          </h2>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 flex items-center gap-2 shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Deduction</span>
        </button>
      </div>

      {/* Search Section */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search deductions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="bg-white border border-gray-300 text-gray-700 rounded-lg px-4 py-2.5 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Fields</option>
            <option value="deductionCode">Deduction Code</option>
            <option value="deductionType">Deduction Type</option>
            <option value="applicableFor">Applicable For</option>
          </select>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <div className="text-lg font-semibold text-gray-800 mb-4">
          Existing Deductions
        </div>
        <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                Deduction Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                Amount/Percentage
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                Applicable For
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                Deduction Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                Status
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredDeductions.map((deduction) => (
              <tr key={deduction.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {deduction.deductionCode}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {deduction.deductionDescription}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {deduction.amount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {deduction.applicableFor}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      deduction.deductionType === "Fixed"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-purple-100 text-purple-800"
                    }`}
                  >
                    {deduction.deductionType}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div
                      className="relative inline-flex h-5 w-9 cursor-pointer items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      style={{
                        backgroundColor: deduction.active
                          ? "#3b82f6"
                          : "#e5e7eb",
                      }}
                      onClick={() => handleToggleDeductionStatus(deduction.id)}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          deduction.active ? "translate-x-5" : "translate-x-1"
                        }`}
                      />
                    </div>
                    <span
                      className={`ml-2 text-xs font-medium ${
                        deduction.active ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {deduction.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">
                    Edit
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-orange-500" />
                Create New Deduction
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Form Section */}
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Deduction Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="deductionCode"
                    value={formData.deductionCode}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="e.g., EPF, LOAN"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="deductionDescription"
                    value={formData.deductionDescription}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter deduction description"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Amount/Percentage <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="e.g., 500, 8%, Variable"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Deduction Type <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-4">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="fixed"
                        name="deductionType"
                        value="Fixed"
                        checked={formData.deductionType === "Fixed"}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                      />
                      <label
                        htmlFor="fixed"
                        className="ml-2 text-sm font-medium text-gray-700"
                      >
                        Fixed
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="variable"
                        name="deductionType"
                        value="Variable"
                        checked={formData.deductionType === "Variable"}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                      />
                      <label
                        htmlFor="variable"
                        className="ml-2 text-sm font-medium text-gray-700"
                      >
                        Variable
                      </label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Applicable For
                  </label>
                  <select
                    name="applicableFor"
                    value={formData.applicableFor}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                  >
                    <option value="All Employees">All Employees</option>
                    <option value="Selected Employees">
                      Selected Employees
                    </option>
                    <option value="Permanent Only">Permanent Only</option>
                    <option value="Contract Only">Contract Only</option>
                    <option value="Loan Holders">Loan Holders</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-white">
                    <div
                      className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
                      style={{
                        backgroundColor: formData.active
                          ? "#3b82f6"
                          : "#e5e7eb",
                      }}
                      onClick={() => handleToggleChange("active")}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                          formData.active ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {formData.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-4 border-t pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Deduction</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateNewDeduction;
