import React, { useState, useEffect } from "react";
import {
  Save,
  X,
  DollarSign,
  Plus,
  Search,
  Trash2,
  Edit,
  Filter,
  Building2,
  Layers,
} from "lucide-react";
import {
  fetchDeductions,
  createDeduction,
  updateDeduction,
  deleteDeduction,
  fetchCompanies,
  getDepartments,
} from "@services/DeductionService";
import Swal from "sweetalert2";

const CreateNewDeduction = () => {
  const [deductions, setDeductions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [isLoadingDepartments, setIsLoadingDepartments] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    company_id: "",
    department_id: "",
    deduction_code: "",
    deduction_name: "",
    description: "",
    amount: "",
    status: "active",
    category: "EPF",
    customCategory: "",
    deduction_type: "fixed",
    startDate: "",
    endDate: "",
  });

  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFilter, setSearchFilter] = useState("all");
  const [dateError, setDateError] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch deductions and companies
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        const [deductionsData, companiesData] = await Promise.all([
          fetchDeductions(),
          fetchCompanies(),
        ]);

        setDeductions(deductionsData);
        setCompanies(companiesData);
        setError(null);
      } catch (err) {
        setError("Failed to load data. Please try again later.");
        console.error("Error loading initial data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Load departments when company is selected
  useEffect(() => {
    const loadDepartments = async () => {
      if (formData.company_id) {
        setIsLoadingDepartments(true);
        try {
          const departmentsData = await getDepartments(formData.company_id);
          setDepartments(departmentsData);
        } catch (err) {
          console.error("Error loading departments:", err);
        } finally {
          setIsLoadingDepartments(false);
        }
      } else {
        setDepartments([]);
      }
    };

    loadDepartments();
  }, [formData.company_id]);

  // Filter deductions based on search term and selected filter
  const filteredDeductions = deductions.filter((deduction) => {
    const searchLower = searchTerm.toLowerCase();

    if (searchTerm === "") return true;

    switch (searchFilter) {
      case "deduction_code":
        return deduction.deduction_code?.toLowerCase().includes(searchLower);
      case "deduction_type":
        return deduction.deduction_type?.toLowerCase().includes(searchLower);
      case "category":
        return deduction.category?.toLowerCase().includes(searchLower);
      default:
        // Search in all fields
        return (
          deduction.deduction_code?.toLowerCase().includes(searchLower) ||
          deduction.deduction_name?.toLowerCase().includes(searchLower) ||
          deduction.deduction_type?.toLowerCase().includes(searchLower) ||
          deduction.category?.toLowerCase().includes(searchLower) ||
          deduction.description?.toLowerCase().includes(searchLower)
        );
    }
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Reset department when company changes
    if (name === "company_id") {
      setFormData((prev) => ({
        ...prev,
        department_id: "",
      }));
    }

    // Date validation logic
    if (name === "startDate") {
      if (formData.endDate && value >= formData.endDate) {
        setDateError("Start Date must be before End Date.");
      } else {
        setDateError("");
      }
    }
    if (name === "endDate") {
      if (value <= formData.startDate) {
        setDateError("End Date must be after Start Date.");
      } else {
        setDateError("");
      }
    }

    // Reset endDate if type changes to fixed
    if (name === "deduction_type" && value === "fixed") {
      setFormData((prev) => ({
        ...prev,
        endDate: "",
      }));
    }
  };

  const handleStatusChange = () => {
    setFormData((prev) => ({
      ...prev,
      status: prev.status === "active" ? "inactive" : "active",
    }));
  };

  // Update the handleSubmit function
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for validation errors
    if (
      formData.deduction_type === "variable" &&
      (!formData.startDate || !formData.endDate)
    ) {
      setDateError(
        "Please select both Start Date and End Date for variable deductions."
      );
      return;
    }

    if (formData.deduction_type === "variable") {
      if (formData.startDate >= formData.endDate) {
        setDateError("End Date must be after Start Date.");
        return;
      }
    }

    if (formData.category === "other" && !formData.customCategory.trim()) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please enter a custom category name",
      });
      return;
    }

    setDateError("");
    setIsSubmitting(true);

    try {
      // Prepare data for API
      const deductionData = {
        department_id: parseInt(formData.department_id),
        deduction_code: formData.deduction_code,
        deduction_name: formData.deduction_name,
        description: formData.description,
        amount: parseFloat(formData.amount),
        status: formData.status,
        category:
          formData.category === "other"
            ? formData.customCategory
            : formData.category,
        deduction_type: formData.deduction_type,
        startDate: formData.startDate,
        endDate:
          formData.deduction_type === "variable" ? formData.endDate : null,
      };

      // Find company and department objects regardless if creating or updating
      const selectedCompany = companies.find(
        (c) => c.id === parseInt(formData.company_id)
      );
      const selectedDepartment = departments.find(
        (d) => d.id === parseInt(formData.department_id)
      );

      if (formData.id) {
        // Update existing deduction
        const result = await updateDeduction(formData.id, deductionData);

        // Update the local state with properly structured data
        // This ensures that company and department objects are present
        setDeductions(
          deductions.map((item) =>
            item.id === formData.id
              ? {
                  ...result, // API response data
                  id: formData.id, // Ensure ID is preserved
                  company: {
                    id: selectedCompany.id,
                    name: selectedCompany.name,
                  },
                  department: {
                    id: selectedDepartment.id,
                    name: selectedDepartment.name,
                  },
                  updated_at: new Date().toISOString(),
                }
              : item
          )
        );
      } else {
        // Create new deduction
        const result = await createDeduction(deductionData);

        // Add to local state with properly formatted data
        const newDeduction = {
          ...result, // API response data
          id: result.id || Date.now(), // Use API ID or generate one
          company: {
            id: selectedCompany.id,
            name: selectedCompany.name,
          },
          department: {
            id: selectedDepartment.id,
            name: selectedDepartment.name,
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        setDeductions((prev) => [...prev, newDeduction]);
      }

      // Show success message
      Swal.fire({
        icon: "success",
        title: "Success",
        text: `Deduction ${formData.id ? "updated" : "created"} successfully!`,
        timer: 2000,
        showConfirmButton: false,
      });

      // Close modal and reset form
      resetForm();
      setShowModal(false);
      setShowEditModal(false);
    } catch (err) {
      console.error("Error saving deduction:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to save deduction. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async (deduction) => {
    try {
      // Set initial loading state
      setIsLoadingDepartments(true);

      // First set the company ID
      const companyId = deduction.company.id;

      // Fetch departments for the selected company
      const departmentsData = await getDepartments(companyId);
      setDepartments(departmentsData);

      // Determine if category is custom (not EPF or ETF)
      const isCustomCategory = !["EPF", "ETF"].includes(deduction.category);

      // Set form data with all fields including company and department
      setFormData({
        ...deduction,
        company_id: companyId,
        department_id: deduction.department.id,
        category: isCustomCategory ? "other" : deduction.category,
        customCategory: isCustomCategory ? deduction.category : "",
      });

      setShowEditModal(true);
    } catch (err) {
      console.error("Error loading departments for edit:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load department data. Please try again.",
      });
    } finally {
      setIsLoadingDepartments(false);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteDeduction(deleteId);
      setDeductions(deductions.filter((item) => item.id !== deleteId));

      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Deduction has been deleted successfully.",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Error deleting deduction:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to delete deduction. Please try again.",
      });
    } finally {
      setShowDeleteConfirm(false);
      setDeleteId(null);
    }
  };

  const resetForm = () => {
    setFormData({
      company_id: "",
      department_id: "",
      deduction_code: "",
      deduction_name: "",
      description: "",
      amount: "",
      status: "active",
      category: "EPF",
      customCategory: "",
      deduction_type: "fixed",
      startDate: "",
      endDate: "",
    });
    setDateError("");
  };

  const handleToggleDeductionStatus = async (id) => {
    const deduction = deductions.find((d) => d.id === id);
    if (!deduction) return;

    const newStatus = deduction.status === "active" ? "inactive" : "active";

    try {
      // First update the local state optimistically
      setDeductions((prevDeductions) =>
        prevDeductions.map((d) =>
          d.id === id
            ? {
                ...d,
                status: newStatus,
                updated_at: new Date().toISOString(),
              }
            : d
        )
      );

      // Then make the API call
      await updateDeduction(id, {
        ...deduction, // Include all existing deduction data
        status: newStatus,
      });

      // Show success message
      Swal.fire({
        icon: "success",
        title: "Status Updated",
        text: `Deduction status changed to ${newStatus}`,
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      // If API call fails, revert the optimistic update
      setDeductions((prevDeductions) =>
        prevDeductions.map((d) =>
          d.id === id
            ? {
                ...d,
                status: deduction.status, // Revert to original status
              }
            : d
        )
      );

      console.error("Error updating deduction status:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update deduction status. Please try again.",
      });
    }
  };

  // Get department name by ID
  // const getDepartmentName = (id) => {
  //   const department = departments.find((dept) => dept.id === parseInt(id));

  //   if (department) return department.name;

  //   // If department isn't found in current departments list, look through all companies
  //   for (const company of companies) {
  //     if (company.departments) {
  //       const dept = company.departments.find((d) => d.id === parseInt(id));
  //       if (dept) return dept.name;
  //     }
  //   }

  //   return "Unknown";
  // };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString();
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
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
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
            <option value="deduction_code">Deduction Code</option>
            <option value="deduction_type">Deduction Type</option>
            <option value="category">Category</option>
          </select>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <div className="text-lg font-semibold text-gray-800 mb-4">
          Existing Deductions
        </div>
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : (
            <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Start Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    End Date
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
                {filteredDeductions.length > 0 ? (
                  filteredDeductions.map((deduction) => (
                    <tr key={deduction.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {deduction.deduction_code}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {deduction.deduction_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {deduction.description || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {/* {getDepartmentName(deduction.department_id)} */}
                        {deduction.department.name || "Unknown"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {deduction.company.name || "Unknown"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {typeof deduction.amount === "number"
                          ? deduction.amount.toFixed(2)
                          : deduction.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            deduction.category === "EPF"
                              ? "bg-blue-100 text-blue-800"
                              : deduction.category === "ETF"
                              ? "bg-green-100 text-green-800"
                              : "bg-orange-100 text-orange-800"
                          }`}
                        >
                          {deduction.category.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            deduction.deduction_type === "fixed"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-pink-100 text-pink-800"
                          }`}
                        >
                          {deduction.deduction_type === "fixed"
                            ? "Fixed"
                            : "Variable"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(deduction.startDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {deduction.deduction_type === "fixed"
                          ? "-"
                          : formatDate(deduction.endDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <button
                            type="button"
                            onClick={() =>
                              handleToggleDeductionStatus(deduction.id)
                            }
                            className="relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            style={{
                              backgroundColor:
                                deduction.status === "active"
                                  ? "#3b82f6"
                                  : "#e5e7eb",
                            }}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                deduction.status === "active"
                                  ? "translate-x-5"
                                  : "translate-x-1"
                              }`}
                            />
                          </button>
                          <span
                            className={`ml-2 text-xs font-medium ${
                              deduction.status === "active"
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {deduction.status === "active"
                              ? "Active"
                              : "Inactive"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <button
                          onClick={() => handleEdit(deduction)}
                          className="text-blue-600 hover:text-blue-900 mr-3 flex items-center justify-center"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteClick(deduction.id)}
                          className="text-red-600 hover:text-red-900 flex items-center justify-center mt-1"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          <span>Delete</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="11"
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      <div className="flex flex-col items-center">
                        <Search className="h-12 w-12 text-gray-300 mb-2" />
                        <p className="text-lg font-medium">
                          No deductions found
                        </p>
                        <p className="text-sm">
                          Try adjusting your search or filter to find what
                          you're looking for
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add/Edit Deduction Modal */}
      {(showModal || showEditModal) && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-orange-500" />
                {showEditModal ? "Edit Deduction" : "Create New Deduction"}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setShowEditModal(false);
                }}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Form Section */}
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Company Field - New */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Company <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Building2
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <select
                      name="company_id"
                      value={formData.company_id}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                    >
                      <option value="">Select Company</option>
                      {companies.map((company) => (
                        <option key={company.id} value={company.id}>
                          {company.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Department Field - Updated */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Department <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Layers
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <select
                      name="department_id"
                      value={formData.department_id}
                      onChange={handleInputChange}
                      required
                      disabled={!formData.company_id || isLoadingDepartments}
                      className={`w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white ${
                        !formData.company_id || isLoadingDepartments
                          ? "bg-gray-100 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      <option value="">Select Department</option>
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name}
                        </option>
                      ))}
                    </select>
                    {isLoadingDepartments && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Deduction Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="deduction_code"
                    value={formData.deduction_code}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="e.g., D001, EPF"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Deduction Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="deduction_name"
                    value={formData.deduction_name}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="e.g., Health Insurance"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Amount <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.amount}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="e.g., 500.00"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description || ""}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter deduction description"
                    rows="3"
                  />
                </div>

                {/* Category with "Other" option */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                  >
                    <option value="EPF">EPF</option>
                    <option value="ETF">ETF</option>
                    <option value="other">Other</option>
                  </select>

                  {/* Custom category input */}
                  {formData.category === "other" && (
                    <div className="mt-2">
                      <input
                        name="customCategory"
                        value={formData.customCategory}
                        onChange={handleInputChange}
                        placeholder="Enter custom category"
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  )}
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
                        name="deduction_type"
                        value="fixed"
                        checked={formData.deduction_type === "fixed"}
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
                        name="deduction_type"
                        value="variable"
                        checked={formData.deduction_type === "variable"}
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

                {/* Start Date - Required for both fixed and variable */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate || ""}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                {/* End Date - Only required for variable deductions */}
                {formData.deduction_type === "variable" && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      End Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate || ""}
                      onChange={handleInputChange}
                      required={formData.deduction_type === "variable"}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-white">
                    <div
                      className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
                      style={{
                        backgroundColor:
                          formData.status === "active" ? "#3b82f6" : "#e5e7eb",
                      }}
                      onClick={handleStatusChange}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                          formData.status === "active"
                            ? "translate-x-6"
                            : "translate-x-1"
                        }`}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {formData.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>

              {dateError && (
                <div className="text-red-600 text-sm mt-2">{dateError}</div>
              )}

              <div className="mt-6 flex justify-end space-x-4 border-t pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setShowEditModal(false);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                  disabled={isSubmitting}
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 flex items-center space-x-2 ${
                    isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>{showEditModal ? "Update" : "Save"} Deduction</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <div className="flex flex-col items-center">
              <Trash2 className="w-12 h-12 text-red-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Confirm Deletion
              </h3>
              <p className="text-gray-600 text-center mb-6">
                Are you sure you want to delete this deduction? This action
                cannot be undone.
              </p>
              <div className="flex justify-center space-x-4 w-full">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex-1 max-w-[150px]"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex-1 max-w-[150px]"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateNewDeduction;
