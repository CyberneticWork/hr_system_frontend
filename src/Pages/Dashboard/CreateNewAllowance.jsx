import React, { useState, useEffect } from "react";
import {
  Plus,
  X,
  Search,
  Edit3,
  Trash2,
  FileText,
  Users,
  Settings,
  Plane,
  Target,
  Heart,
  Clipboard,
  DollarSign,
  Loader2,
} from "lucide-react";
import AllowancesService from "../../services/AllowancesService";
import { fetchCompanies, fetchDepartments } from "@services/ApiDataService";
import Swal from "sweetalert2";

const CreateNewAllowance = () => {
  // State management
  const [companies, setCompanies] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [allowances, setAllowances] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAllowance, setSelectedAllowance] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Form states
  const [editAllowance, setEditAllowance] = useState({
    id: null,
    allowance_code: "",
    allowance_name: "",
    company_id: "",
    amount: "",
    department_id: "",
    category: "travel",
    status: "active",
    allowance_type: "fixed",
    fixed_date: "",
    variable_from: "",
    variable_to: "",
  });

  const [newAllowance, setNewAllowance] = useState({
    allowance_code: "",
    allowance_name: "",
    company_id: "",
    department_id: "",
    amount: "",
    category: "travel",
    status: "active",
    allowance_type: "fixed",
    fixed_date: "",
    variable_from: "",
    variable_to: "",
  });

  const [formErrors, setFormErrors] = useState({
    add: {},
    edit: {},
  });

  // Constants
  const categories = ["travel", "bonus", "performance", "health", "other"];
  const statuses = ["active", "inactive"];
  const allowanceTypes = ["fixed", "variable"];

  // Helper function to format dates for input fields
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Show success alert
  const showSuccessAlert = (message) => {
    Swal.fire({
      title: "Success!",
      text: message,
      icon: "success",
      confirmButtonText: "OK",
      customClass: {
        confirmButton:
          "bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg",
      },
    });
  };

  // Show error alert
  const showErrorAlert = (message) => {
    Swal.fire({
      title: "Error!",
      text: message,
      icon: "error",
      confirmButtonText: "OK",
      customClass: {
        confirmButton:
          "bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg",
      },
    });
  };

  // Show confirmation dialog
  const showConfirmDialog = (title, text, confirmButtonText) => {
    return Swal.fire({
      title: title,
      text: text,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: confirmButtonText,
      cancelButtonText: "Cancel",
    });
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [allowancesRes, comp, depts] = await Promise.all([
        AllowancesService.getAllAllowances(),
        fetchCompanies(),
        fetchDepartments(),
      ]);

      setAllowances(allowancesRes);
      setCompanies(comp);
      setDepartments(depts);

      // Set default company_id in newAllowance if companies are loaded
      if (comp.length > 0 && !newAllowance.company_id) {
        setNewAllowance((prev) => ({
          ...prev,
          company_id: comp[0].id,
          department_id: "",
        }));

        // Filter departments for the default company
        const defaultCompanyDepts = depts.filter(
          (dept) => dept.company_id === comp[0].id
        );
        setFilteredDepartments(defaultCompanyDepts);
      }

      // Reset selected company if it's no longer valid
      if (
        selectedCompany !== "all" &&
        !comp.some((c) => c.id == selectedCompany)
      ) {
        setSelectedCompany("all");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message || "Failed to fetch data");
      showErrorAlert(err.message || "Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  };

  // Update filtered departments when company changes in the form
  useEffect(() => {
    if (newAllowance.company_id) {
      const filtered = departments.filter(
        (dept) => dept.company_id == newAllowance.company_id
      );
      setFilteredDepartments(filtered);

      // Reset department selection if the current one doesn't belong to the new company
      if (
        newAllowance.department_id &&
        !filtered.some((dept) => dept.id == newAllowance.department_id)
      ) {
        setNewAllowance((prev) => ({ ...prev, department_id: "" }));
      }
    }
  }, [newAllowance.company_id, departments]);

  // Similar for edit form
  useEffect(() => {
    if (editAllowance.company_id) {
      const filtered = departments.filter(
        (dept) => dept.company_id == editAllowance.company_id
      );

      // Reset department selection if the current one doesn't belong to the new company
      if (
        editAllowance.department_id &&
        !filtered.some((dept) => dept.id == editAllowance.department_id)
      ) {
        setEditAllowance((prev) => ({ ...prev, department_id: "" }));
      }
    }
  }, [editAllowance.company_id, departments]);

  // Filter allowances based on selections
  const filteredAllowances = allowances.filter((allowance) => {
    const matchesCompany =
      selectedCompany === "all" || allowance.company_id == selectedCompany;
    const matchesCategory =
      selectedCategory === "" || allowance.category === selectedCategory;
    const matchesSearch =
      allowance.allowance_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      allowance.allowance_code.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCompany && matchesCategory && matchesSearch;
  });

  // Handlers for CRUD operations
  const handleAddAllowance = async () => {
    setIsProcessing(true);
    setFormErrors({ ...formErrors, add: {} });

    try {
      // Validate form
      const errors = {};
      if (!newAllowance.allowance_code.trim()) {
        errors.allowance_code = ["Allowance code is required"];
      }
      if (!newAllowance.allowance_name.trim()) {
        errors.allowance_name = ["Allowance name is required"];
      }
      if (!newAllowance.company_id) {
        errors.company_id = ["Company is required"];
      }
      if (!newAllowance.department_id) {
        errors.department_id = ["Department is required"];
      }
      if (!newAllowance.amount) {
        errors.amount = ["Amount is required"];
      }

      // Date validation
      if (newAllowance.allowance_type === "fixed") {
        if (!newAllowance.fixed_date) {
          errors.fixed_date = ["Fixed date is required"];
        }
      } else {
        if (!newAllowance.variable_from) {
          errors.variable_from = ["Start date is required"];
        }
        if (!newAllowance.variable_to) {
          errors.variable_to = ["End date is required"];
        }
        if (
          newAllowance.variable_from &&
          newAllowance.variable_to &&
          new Date(newAllowance.variable_from) >
            new Date(newAllowance.variable_to)
        ) {
          errors.variable_to = ["End date must be after start date"];
        }
      }

      if (Object.keys(errors).length > 0) {
        setFormErrors({ ...formErrors, add: errors });
        return;
      }

      const response = await AllowancesService.createAllowance(newAllowance);

      // Find company and department objects
      const selectedCompany = companies.find(
        (c) => c.id == newAllowance.company_id
      );
      const selectedDepartment = departments.find(
        (d) => d.id == newAllowance.department_id
      );

      // Update the state with properly formatted data
      setAllowances((prev) => [
        ...prev,
        {
          ...response,
          // Add these nested objects explicitly
          company: {
            id: selectedCompany.id,
            name: selectedCompany.name,
          },
          department: {
            id: selectedDepartment.id,
            name: selectedDepartment.name,
          },
        },
      ]);

      // Reset form and close modal
      setNewAllowance({
        allowance_code: "",
        allowance_name: "",
        company_id: companies[0]?.id || "",
        department_id: "",
        category: "travel",
        status: "active",
        allowance_type: "fixed",
        amount: "",
        fixed_date: "",
        variable_from: "",
        variable_to: "",
      });

      setIsAddModalOpen(false);
      showSuccessAlert("Allowance created successfully!");
    } catch (error) {
      console.error("Add error:", error);
      if (error.response?.data?.errors) {
        setFormErrors({ ...formErrors, add: error.response.data.errors });
      } else {
        showErrorAlert(error.message || "Failed to create allowance");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEditAllowance = async () => {
    setIsProcessing(true);
    setFormErrors({ ...formErrors, edit: {} });

    try {
      // Validate form
      const errors = {};
      if (!editAllowance.allowance_code.trim()) {
        errors.allowance_code = ["Allowance code is required"];
      }
      if (!editAllowance.allowance_name.trim()) {
        errors.allowance_name = ["Allowance name is required"];
      }
      if (!editAllowance.company_id) {
        errors.company_id = ["Company is required"];
      }
      if (!editAllowance.department_id) {
        errors.department_id = ["Department is required"];
      }
      if (!editAllowance.amount) {
        errors.amount = ["Amount is required"];
      }

      // Date validation
      if (editAllowance.allowance_type === "fixed") {
        if (!editAllowance.fixed_date) {
          errors.fixed_date = ["Fixed date is required"];
        }
      } else {
        if (!editAllowance.variable_from) {
          errors.variable_from = ["Start date is required"];
        }
        if (!editAllowance.variable_to) {
          errors.variable_to = ["End date is required"];
        }
        if (
          editAllowance.variable_from &&
          editAllowance.variable_to &&
          new Date(editAllowance.variable_from) >
            new Date(editAllowance.variable_to)
        ) {
          errors.variable_to = ["End date must be after start date"];
        }
      }

      if (Object.keys(errors).length > 0) {
        setFormErrors({ ...formErrors, edit: errors });
        return;
      }

      // Find company and department objects to include in the updated allowance
      const selectedCompany = companies.find(
        (c) => c.id == editAllowance.company_id
      );
      const selectedDepartment = departments.find(
        (d) => d.id == editAllowance.department_id
      );

      const response = await AllowancesService.updateAllowance(
        editAllowance.id,
        editAllowance
      );

      // Update the state with properly formatted data including nested objects
      setAllowances((prev) =>
        prev.map((item) => {
          if (item.id === editAllowance.id) {
            return {
              ...response,
              // Ensure these nested objects exist
              company: {
                id: selectedCompany.id,
                name: selectedCompany.name,
              },
              department: {
                id: selectedDepartment.id,
                name: selectedDepartment.name,
              },
            };
          }
          return item;
        })
      );

      setIsEditModalOpen(false);
      showSuccessAlert("Allowance updated successfully!");
    } catch (error) {
      console.error("Update error:", error);
      if (error.response?.data?.errors) {
        setFormErrors({ ...formErrors, edit: error.response.data.errors });
      } else {
        showErrorAlert(error.message || "Failed to update allowance");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteAllowance = async () => {
    setIsProcessing(true);
    try {
      await AllowancesService.deleteAllowance(selectedAllowance.id);

      // Update the state directly by removing the deleted allowance
      setAllowances((prev) =>
        prev.filter((item) => item.id !== selectedAllowance.id)
      );

      setIsDeleteModalOpen(false);
      showSuccessAlert("Allowance deleted successfully!");
    } catch (error) {
      showErrorAlert(error.message || "Failed to delete allowance");
    } finally {
      setIsProcessing(false);
    }
  };

  // Modal handlers
  const openEditModal = (allowance) => {
    // Format dates for input fields
    const formattedAllowance = {
      ...allowance,
      department_id: allowance.department_id || "",
      fixed_date: formatDateForInput(allowance.fixed_date),
      variable_from: formatDateForInput(allowance.variable_from),
      variable_to: formatDateForInput(allowance.variable_to),
    };

    setEditAllowance(formattedAllowance);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (allowance) => {
    setSelectedAllowance(allowance);
    setIsDeleteModalOpen(true);
  };

  const handleInputChange = (field, value) => {
    setNewAllowance((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditInputChange = (field, value) => {
    setEditAllowance((prev) => ({ ...prev, [field]: value }));
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setNewAllowance({
      allowance_code: "",
      allowance_name: "",
      company_id: companies[0]?.id || "",
      department_id: "",
      amount: "",
      category: "travel",
      status: "active",
      allowance_type: "fixed",
      fixed_date: "",
      variable_from: "",
      variable_to: "",
    });
    setFormErrors({ ...formErrors, add: {} });
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditAllowance({
      id: null,
      allowance_code: "",
      allowance_name: "",
      amount: "",
      company_id: companies[0]?.id || "",
      department_id: "",
      category: "travel",
      status: "active",
      allowance_type: "fixed",
      fixed_date: "",
      variable_from: "",
      variable_to: "",
    });
    setFormErrors({ ...formErrors, edit: {} });
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedAllowance(null);
  };

  // Helper functions
  const getStatusColor = (status) => {
    return status === "active"
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-gray-100 text-gray-600 border-gray-200";
  };

  const getCategoryIcon = (category) => {
    const icons = {
      travel: <Plane className="w-4 h-4 text-blue-600" />,
      bonus: <DollarSign className="w-4 h-4 text-yellow-600" />,
      performance: <Target className="w-4 h-4 text-green-600" />,
      health: <Heart className="w-4 h-4 text-red-600" />,
      other: <Clipboard className="w-4 h-4 text-gray-600" />,
    };
    return (
      icons[category] || <DollarSign className="w-4 h-4 text-yellow-600" />
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin h-12 w-12 text-blue-500" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Error: </strong> {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                Allowance Management
              </h1>
              <p className="text-gray-600 mt-2">
                Manage and organize employee allowances
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Plus size={20} />
                <span className="font-medium">Add New Allowance</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Allowances
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {allowances.length}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-green-600">
                  {allowances.filter((a) => a.status === "active").length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Inactive</p>
                <p className="text-2xl font-bold text-gray-500">
                  {allowances.filter((a) => a.status === "inactive").length}
                </p>
              </div>
              <div className="p-3 bg-gray-100 rounded-xl">
                <Settings className="w-6 h-6 text-gray-500" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Categories</p>
                <p className="text-2xl font-bold text-purple-600">
                  {categories.length}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-8">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search allowances by name or code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Company and Category Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Company
            </label>
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Companies</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">
                    Code
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">
                    Allowance Name
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 hidden lg:table-cell">
                    Company
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 hidden lg:table-cell">
                    Department
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 hidden lg:table-cell">
                    Amount
                  </th>

                  <th className="text-left py-4 px-6 font-semibold text-gray-700 hidden sm:table-cell">
                    Category
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 hidden lg:table-cell">
                    Type
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 hidden lg:table-cell">
                    Status
                  </th>
                  <th className="text-right py-4 px-6 font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredAllowances.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-12">
                      <div className="flex flex-col items-center gap-3">
                        <div className="p-4 bg-gray-100 rounded-full">
                          <Search className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 font-medium">
                          No allowances found
                        </p>
                        <p className="text-gray-400 text-sm">
                          Try adjusting your search criteria
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredAllowances.map((allowance) => (
                    <tr
                      key={allowance.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-20 h-20  rounded-xl flex items-center justify-center">
                            <span className="text-blue-600 font-bold text-sm">
                              {allowance.allowance_code}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">
                            {allowance.allowance_name}
                          </span>
                          <span className="text-sm text-gray-500 sm:hidden">
                            {getCategoryIcon(allowance.category)}{" "}
                            {allowance.category.charAt(0).toUpperCase() +
                              allowance.category.slice(1)}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 hidden sm:table-cell">
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(allowance.category)}
                          <span className="text-gray-700">
                            {allowance.category.charAt(0).toUpperCase() +
                              allowance.category.slice(1)}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 hidden lg:table-cell">
                        {allowance.company?.name || "Unknown Company"}
                      </td>
                      <td className="py-4 px-6 hidden lg:table-cell">
                        {allowance.department?.name || "Unknown Department"}
                      </td>
                      <td className="py-4 px-6 hidden lg:table-cell">
                        LKR {parseFloat(allowance.amount).toFixed(2)}
                      </td>
                      <td className="py-4 px-6 hidden lg:table-cell">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                            allowance.allowance_type === "fixed"
                              ? "bg-purple-100 text-purple-800 border-purple-200"
                              : "bg-orange-100 text-orange-800 border-orange-200"
                          }`}
                        >
                          {allowance.allowance_type}
                        </span>
                      </td>
                      <td className="py-4 px-6 hidden lg:table-cell">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                            allowance.status
                          )}`}
                        >
                          {allowance.status.charAt(0).toUpperCase() +
                            allowance.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(allowance)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            title="Edit Allowance"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            onClick={() => openDeleteModal(allowance)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Delete Allowance"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Add New Allowance
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  Create a new allowance entry
                </p>
              </div>
              <button
                onClick={closeAddModal}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Allowance Code
                  </label>
                  <input
                    type="text"
                    value={newAllowance.allowance_code}
                    onChange={(e) =>
                      handleInputChange("allowance_code", e.target.value)
                    }
                    className={`w-full px-4 py-3 border ${
                      formErrors.add.allowance_code
                        ? "border-red-500"
                        : "border-gray-200"
                    } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                    placeholder="Enter allowance code"
                  />
                  {formErrors.add.allowance_code && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.add.allowance_code[0]}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Status *
                  </label>
                  <select
                    value={newAllowance.status}
                    onChange={(e) =>
                      handleInputChange("status", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Allowance Name *
                </label>
                <input
                  type="text"
                  value={newAllowance.allowance_name}
                  onChange={(e) =>
                    handleInputChange("allowance_name", e.target.value)
                  }
                  className={`w-full px-4 py-3 border ${
                    formErrors.add.allowance_name
                      ? "border-red-500"
                      : "border-gray-200"
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                  placeholder="Enter allowance name"
                />
                {formErrors.add.allowance_name && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.add.allowance_name[0]}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={newAllowance.category}
                  onChange={(e) =>
                    handleInputChange("category", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Allowance Type *
                </label>
                <select
                  value={newAllowance.allowance_type}
                  onChange={(e) =>
                    handleInputChange("allowance_type", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  {allowanceTypes.map((type) => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Date Configuration *
                </label>
                {newAllowance.allowance_type === "fixed" ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fixed Date
                    </label>
                    <input
                      type="date"
                      value={newAllowance.fixed_date}
                      onChange={(e) =>
                        handleInputChange("fixed_date", e.target.value)
                      }
                      className={`w-full px-4 py-3 border ${
                        formErrors.add.fixed_date
                          ? "border-red-500"
                          : "border-gray-200"
                      } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                      required
                    />
                    {formErrors.add.fixed_date && (
                      <p className="mt-1 text-sm text-red-600">
                        {formErrors.add.fixed_date[0]}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        From Date
                      </label>
                      <input
                        type="date"
                        value={newAllowance.variable_from}
                        onChange={(e) =>
                          handleInputChange("variable_from", e.target.value)
                        }
                        className={`w-full px-4 py-3 border ${
                          formErrors.add.variable_from
                            ? "border-red-500"
                            : "border-gray-200"
                        } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                        required
                      />
                      {formErrors.add.variable_from && (
                        <p className="mt-1 text-sm text-red-600">
                          {formErrors.add.variable_from[0]}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        To Date
                      </label>
                      <input
                        type="date"
                        value={newAllowance.variable_to}
                        onChange={(e) =>
                          handleInputChange("variable_to", e.target.value)
                        }
                        className={`w-full px-4 py-3 border ${
                          formErrors.add.variable_to
                            ? "border-red-500"
                            : "border-gray-200"
                        } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                        required
                        min={newAllowance.variable_from}
                      />
                      {formErrors.add.variable_to && (
                        <p className="mt-1 text-sm text-red-600">
                          {formErrors.add.variable_to[0]}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Amount *
                </label>
                <input
                  type="number"
                  value={newAllowance.amount}
                  onChange={(e) => handleInputChange("amount", e.target.value)}
                  className={`w-full px-4 py-3 border ${
                    formErrors.add.amount ? "border-red-500" : "border-gray-200"
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                  placeholder="Enter allowance amount"
                />
                {formErrors.add.amount && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.add.amount[0]}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Company *
                </label>
                <select
                  value={newAllowance.company_id}
                  onChange={(e) =>
                    handleInputChange("company_id", e.target.value)
                  }
                  className={`w-full px-4 py-3 border ${
                    formErrors.add.company_id
                      ? "border-red-500"
                      : "border-gray-200"
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                >
                  {companies.map((company) => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </select>
                {formErrors.add.company_id && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.add.company_id[0]}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Department *
                </label>
                <select
                  value={newAllowance.department_id}
                  onChange={(e) =>
                    handleInputChange("department_id", e.target.value)
                  }
                  className={`w-full px-4 py-3 border ${
                    formErrors.add.department_id
                      ? "border-red-500"
                      : "border-gray-200"
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                  disabled={
                    !newAllowance.company_id || filteredDepartments.length === 0
                  }
                >
                  <option value="">Select Department</option>
                  {filteredDepartments.map((department) => (
                    <option key={department.id} value={department.id}>
                      {department.name}
                    </option>
                  ))}
                </select>
                {formErrors.add.department_id && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.add.department_id[0]}
                  </p>
                )}
                {newAllowance.company_id &&
                  filteredDepartments.length === 0 && (
                    <p className="mt-1 text-sm text-gray-500">
                      No departments available for selected company
                    </p>
                  )}
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-gray-100 bg-gray-50">
              <button
                onClick={closeAddModal}
                className="px-6 py-3 text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all font-medium"
                disabled={isProcessing}
              >
                Cancel
              </button>
              <button
                onClick={handleAddAllowance}
                disabled={isProcessing}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition-all font-medium shadow-lg disabled:shadow-none flex items-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4" />
                    Processing...
                  </>
                ) : (
                  "Add Allowance"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Edit Allowance
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  Modify allowance details
                </p>
              </div>
              <button
                onClick={closeEditModal}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Allowance Code
                  </label>
                  <div className="w-full px-4 py-3 bg-gray-100 rounded-xl">
                    {editAllowance.allowance_code}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Status *
                  </label>
                  <select
                    value={editAllowance.status}
                    onChange={(e) =>
                      handleEditInputChange("status", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Allowance Name *
                </label>
                <input
                  type="text"
                  value={editAllowance.allowance_name}
                  onChange={(e) =>
                    handleEditInputChange("allowance_name", e.target.value)
                  }
                  className={`w-full px-4 py-3 border ${
                    formErrors.edit.allowance_name
                      ? "border-red-500"
                      : "border-gray-200"
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                  placeholder="Enter allowance name"
                />
                {formErrors.edit.allowance_name && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.edit.allowance_name[0]}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={editAllowance.category}
                  onChange={(e) =>
                    handleEditInputChange("category", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Allowance Type *
                </label>
                <select
                  value={editAllowance.allowance_type}
                  onChange={(e) =>
                    handleEditInputChange("allowance_type", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  {allowanceTypes.map((type) => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>

                <div className="mt-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Date Configuration *
                  </label>
                  {editAllowance.allowance_type === "fixed" ? (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fixed Date
                      </label>
                      <input
                        type="date"
                        value={editAllowance.fixed_date || ""}
                        onChange={(e) =>
                          handleEditInputChange("fixed_date", e.target.value)
                        }
                        className={`w-full px-4 py-3 border ${
                          formErrors.edit.fixed_date
                            ? "border-red-500"
                            : "border-gray-200"
                        } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                        required
                      />
                      {formErrors.edit.fixed_date && (
                        <p className="mt-1 text-sm text-red-600">
                          {formErrors.edit.fixed_date[0]}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          From Date
                        </label>
                        <input
                          type="date"
                          value={editAllowance.variable_from || ""}
                          onChange={(e) =>
                            handleEditInputChange(
                              "variable_from",
                              e.target.value
                            )
                          }
                          className={`w-full px-4 py-3 border ${
                            formErrors.edit.variable_from
                              ? "border-red-500"
                              : "border-gray-200"
                          } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                          required
                        />
                        {formErrors.edit.variable_from && (
                          <p className="mt-1 text-sm text-red-600">
                            {formErrors.edit.variable_from[0]}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          To Date
                        </label>
                        <input
                          type="date"
                          value={editAllowance.variable_to || ""}
                          onChange={(e) =>
                            handleEditInputChange("variable_to", e.target.value)
                          }
                          className={`w-full px-4 py-3 border ${
                            formErrors.edit.variable_to
                              ? "border-red-500"
                              : "border-gray-200"
                          } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                          required
                          min={editAllowance.variable_from}
                        />
                        {formErrors.edit.variable_to && (
                          <p className="mt-1 text-sm text-red-600">
                            {formErrors.edit.variable_to[0]}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Amount *
                </label>
                <input
                  type="number"
                  value={editAllowance.amount}
                  onChange={(e) =>
                    handleEditInputChange("amount", e.target.value)
                  }
                  className={`w-full px-4 py-3 border ${
                    formErrors.edit.amount
                      ? "border-red-500"
                      : "border-gray-200"
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                  placeholder="Enter allowance amount"
                />
                {formErrors.edit.amount && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.edit.amount[0]}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Company *
                </label>
                <select
                  value={editAllowance.company_id}
                  onChange={(e) =>
                    handleEditInputChange("company_id", e.target.value)
                  }
                  className={`w-full px-4 py-3 border ${
                    formErrors.edit.company_id
                      ? "border-red-500"
                      : "border-gray-200"
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                >
                  {companies.map((company) => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </select>
                {formErrors.edit.company_id && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.edit.company_id[0]}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Department *
                </label>
                <select
                  value={editAllowance.department_id}
                  onChange={(e) =>
                    handleEditInputChange("department_id", e.target.value)
                  }
                  className={`w-full px-4 py-3 border ${
                    formErrors.edit.department_id
                      ? "border-red-500"
                      : "border-gray-200"
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                >
                  {departments.map((department) => (
                    <option key={department.id} value={department.id}>
                      {department.name}
                    </option>
                  ))}
                </select>
                {formErrors.edit.department_id && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.edit.department_id[0]}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-gray-100 bg-gray-50">
              <button
                onClick={closeEditModal}
                className="px-6 py-3 text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all font-medium"
                disabled={isProcessing}
              >
                Cancel
              </button>
              <button
                onClick={handleEditAllowance}
                disabled={isProcessing}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition-all font-medium shadow-lg disabled:shadow-none flex items-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4" />
                    Processing...
                  </>
                ) : (
                  "Update Allowance"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedAllowance && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4">
            <div className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Delete Allowance
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete the allowance
                <span className="font-semibold text-gray-900">
                  {" "}
                  "{selectedAllowance.allowance_name}"
                </span>
                ? This action cannot be undone.
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={closeDeleteModal}
                  className="px-6 py-3 text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all font-medium"
                  disabled={isProcessing}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAllowance}
                  disabled={isProcessing}
                  className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 disabled:from-gray-300 disabled:to-gray-300 transition-all font-medium shadow-lg disabled:shadow-none flex items-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4" />
                      Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateNewAllowance;
