import React, { useState } from "react";
import { Save, X, DollarSign } from "lucide-react";

const CreateNewDeduction = () => {
  const [deductions, setDeductions] = useState([
    {
      id: "001",
      deductionCode: "EPF",
      deductionDescription: "Employee Provident Fund",
      amount: "8%",
      applicableFor: "All Employees",
      active: true,
    },
    {
      id: "002",
      deductionCode: "ETF",
      deductionDescription: "Employee Trust Fund",
      amount: "3%",
      applicableFor: "All Employees",
      active: true,
    },
    {
      id: "003",
      deductionCode: "ADVR",
      deductionDescription: "Advance Recovery",
      amount: "Variable",
      applicableFor: "Selected Employees",
      active: true,
    },
    {
      id: "004",
      deductionCode: "LOAN",
      deductionDescription: "Loan Recovery",
      amount: "Variable",
      applicableFor: "Loan Holders",
      active: true,
    },
  ]);

  const [formData, setFormData] = useState({
    deductionCode: "",
    deductionDescription: "",
    amount: "",
    applicableFor: "All Employees",
    active: true,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
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
      active: true,
    });
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-r from-red-500 to-orange-500 p-3 rounded-xl">
          <DollarSign className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">
          Create New Deduction
        </h2>
      </div>

      {/* Form Section */}
      <form
        onSubmit={handleSubmit}
        className="mb-8 bg-gray-50 p-6 rounded-xl border border-gray-200"
      >
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
              Applicable For
            </label>
            <select
              name="applicableFor"
              value={formData.applicableFor}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
            >
              <option value="All Employees">All Employees</option>
              <option value="Selected Employees">Selected Employees</option>
              <option value="Permanent Only">Permanent Only</option>
              <option value="Contract Only">Contract Only</option>
              <option value="Loan Holders">Loan Holders</option>
            </select>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-white h-full">
            <input
              type="checkbox"
              id="active"
              name="active"
              checked={formData.active}
              onChange={handleInputChange}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500 focus:ring-2"
            />
            <label
              htmlFor="active"
              className="text-sm font-medium text-gray-700"
            >
              Active
            </label>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-4">
          <button
            type="button"
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
                Status
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {deductions.map((deduction) => (
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
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      deduction.active
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {deduction.active ? "Active" : "Inactive"}
                  </span>
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
    </div>
  );
};

export default CreateNewDeduction;
