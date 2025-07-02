import React, { useState, useEffect } from "react";
import {
  Building2,
  Users,
  Layers,
  User,
  Calendar,
  Briefcase,
  Clock,
  BookOpen,
  FileText,
  CheckCircle,
  XCircle,
  Save,
  RefreshCw,
  ChevronDown,
  Plus,
} from "lucide-react";

const STORAGE_KEY = "employeeFormData";

const OrganizationDetails = () => {
  const [formData, setFormData] = useState({
    company: "",
    department: "",
    subDepartment: "",
    currentSupervisor: "",
    dateOfJoined: "",
    designation: "",
    probationPeriod: false,
    trainingPeriod: false,
    contractPeriod: false,
    probationFrom: "",
    probationTo: "",
    trainingFrom: "",
    trainingTo: "",
    contractFrom: "",
    contractTo: "",
    confirmationDate: "",
    resignationDate: "",
    resignationLetter: null,
    resignationApproved: false,
    currentStatus: "Active",
    dayOff: "",
  });
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Dropdown data state
  const [companies, setCompanies] = useState(["Company A", "Company B"]);
  const [departments, setDepartments] = useState(["HR", "IT", "Finance"]);
  const [subDepartments, setSubDepartments] = useState([
    "Recruitment",
    "Development",
    "Accounting",
  ]);

  // Modal state
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [showDepartmentModal, setShowDepartmentModal] = useState(false);
  const [showSubDepartmentModal, setShowSubDepartmentModal] = useState(false);

  // New values for modals
  const [newCompany, setNewCompany] = useState("");
  const [newDepartment, setNewDepartment] = useState("");
  const [newSubDepartment, setNewSubDepartment] = useState("");

  // Load organizationDetails and dropdowns from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && saved !== "undefined" && saved !== "null") {
        const parsed = JSON.parse(saved);
        if (parsed.organizationDetails) {
          setFormData((prev) => ({
            ...prev,
            ...parsed.organizationDetails,
          }));
        }
        if (parsed.dropdownData) {
          setCompanies(parsed.dropdownData.companies || companies);
          setDepartments(parsed.dropdownData.departments || departments);
          setSubDepartments(
            parsed.dropdownData.subDepartments || subDepartments
          );
        }
      }
    } catch (e) {
      // ignore
    } finally {
      setIsDataLoaded(true);
    }
    // eslint-disable-next-line
  }, []);

  // Save to localStorage whenever formData or dropdowns change (after initial load)
  useEffect(() => {
    if (!isDataLoaded) return;
    const saveData = () => {
      let allData = {};
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved && saved !== "undefined" && saved !== "null") {
          allData = JSON.parse(saved);
        }
      } catch (e) {
        // ignore
      }
      allData.organizationDetails = formData;
      allData.dropdownData = {
        companies,
        departments,
        subDepartments,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allData));
      setIsSaved(true);
    };
    const timeoutId = setTimeout(saveData, 300);
    return () => clearTimeout(timeoutId);
  }, [formData, companies, departments, subDepartments, isDataLoaded]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? checked : type === "file" ? files[0] : value,
    }));
    setIsSaved(false);
  };

  // Add handlers for modals
  const handleAddCompany = () => {
    if (newCompany.trim() && !companies.includes(newCompany.trim())) {
      setCompanies((prev) => [...prev, newCompany.trim()]);
      setNewCompany("");
      setShowCompanyModal(false);
    }
  };
  const handleAddDepartment = () => {
    if (newDepartment.trim() && !departments.includes(newDepartment.trim())) {
      setDepartments((prev) => [...prev, newDepartment.trim()]);
      setNewDepartment("");
      setShowDepartmentModal(false);
    }
  };
  const handleAddSubDepartment = () => {
    if (
      newSubDepartment.trim() &&
      !subDepartments.includes(newSubDepartment.trim())
    ) {
      setSubDepartments((prev) => [...prev, newSubDepartment.trim()]);
      setNewSubDepartment("");
      setShowSubDepartmentModal(false);
    }
  };

  // Modal components (improved with delete support)
  const Modal = ({
    show,
    onClose,
    title,
    value,
    setValue,
    onAdd,
    placeholder,
    items,
    onDelete,
  }) => {
    if (!show) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-30 backdrop-blur-sm">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xs">
          <h3 className="text-lg font-semibold mb-4">{title}</h3>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:ring-2 focus:ring-blue-500"
            placeholder={placeholder}
            autoFocus
          />
          <div className="flex justify-end gap-2 mb-4">
            <button
              onClick={onClose}
              className="px-3 py-1 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={onAdd}
              className="px-3 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700"
              disabled={!value.trim()}
            >
              Add
            </button>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-gray-500 mb-2">
              Existing:
            </h4>
            <ul className="space-y-1 max-h-32 overflow-y-auto">
              {items.map((item) => (
                <li
                  key={item}
                  className="flex items-center justify-between group px-2 py-1 rounded hover:bg-gray-50"
                >
                  <span className="truncate">{item}</span>
                  <button
                    type="button"
                    className="ml-2 p-1 rounded-full bg-red-100 hover:bg-red-200 text-red-600 opacity-70 group-hover:opacity-100 transition"
                    title="Delete"
                    onClick={() => onDelete(item)}
                  >
                    <XCircle size={16} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  // Add delete handlers
  const handleDeleteCompany = (company) => {
    setCompanies((prev) => prev.filter((c) => c !== company));
    // Remove from form if selected
    if (formData.company === company) {
      setFormData((prev) => ({ ...prev, company: "" }));
    }
  };
  const handleDeleteDepartment = (department) => {
    setDepartments((prev) => prev.filter((d) => d !== department));
    if (formData.department === department) {
      setFormData((prev) => ({ ...prev, department: "" }));
    }
  };
  const handleDeleteSubDepartment = (subDepartment) => {
    setSubDepartments((prev) => prev.filter((s) => s !== subDepartment));
    if (formData.subDepartment === subDepartment) {
      setFormData((prev) => ({ ...prev, subDepartment: "" }));
    }
  };

  // Add toggle state and helpers
  const [toggleStates, setToggleStates] = useState({
    probationEnabled: false,
    trainingEnabled: false,
    contractEnabled: false,
    confirmationEnabled: false,
  });

  const handleToggle = (section) => {
    setToggleStates((prev) => {
      const newValue = !prev[section];
      // Map toggleStates key to formData key
      const formKeyMap = {
        probationEnabled: "probationPeriod",
        trainingEnabled: "trainingPeriod",
        contractEnabled: "contractPeriod",
        confirmationEnabled: null, // No direct boolean in formData for confirmation
      };
      const formKey = formKeyMap[section];
      if (formKey) {
        setFormData((prevForm) => ({
          ...prevForm,
          [formKey]: newValue,
        }));
      }
      return {
        ...prev,
        [section]: newValue,
      };
    });
  };

  const ToggleButton = ({ enabled, onToggle, label, value }) => (
  <label className="relative inline-flex items-center cursor-pointer">
    <input
      type="checkbox"
      onChange={onToggle}
      // checked={value}
      className="sr-only peer"
      aria-label={`Toggle ${label}`}
    />
    <div
      className={`w-11 h-6 rounded-full transition-colors ${
        enabled ? "bg-blue-600" : "bg-gray-300"
      } peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 peer-focus:ring-offset-2`}
    ></div>
    <div
      className={`absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform ${
        enabled ? "translate-x-5" : "translate-x-0"
      }`}
    ></div>
  </label>
);


  return (
    <div className=" p-4 md:p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Building2 className="text-blue-600" size={24} />
        Organization Details
      </h1>

      <form>
        {/* Company Information Section */}
        <div className="mb-8 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <Users className="text-blue-500" size={20} />
            Company Information
          </h2>
          <p className="text-gray-500 mb-4 pl-7">
            Basic company and employee details
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Company */}
            <div className="mb-4">
              <label className="text-gray-700 font-medium mb-2 flex items-center gap-1">
                <Building2 className="text-gray-500" size={16} />
                Company <span className="text-red-500">*</span>
              </label>
              <div className="relative flex-1">
                <select
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Company</option>
                  {companies.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                {/* <ChevronDown className="absolute right-3 top-2.5 text-gray-400" size={16} /> */}
              </div>
            </div>

            {/* Department */}
            <div className="mb-4">
              <label className="text-gray-700 font-medium mb-2 flex items-center gap-1">
                <Layers className="text-gray-500" size={16} />
                Department
              </label>
              <div className="relative flex-1">
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Department</option>
                  {departments.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                {/* <ChevronDown className="absolute right-3 top-2.5 text-gray-400" size={16} /> */}
              </div>
            </div>

            {/* Sub Department */}
            <div className="mb-4">
              <label className="text-gray-700 font-medium mb-2 flex items-center gap-1">
                <Layers className="text-gray-500" size={16} />
                Sub Department <span className="text-red-500">*</span>
              </label>
              <div className="relative flex-1">
                <select
                  name="subDepartment"
                  value={formData.subDepartment}
                  onChange={handleChange}
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Sub Department</option>
                  {subDepartments.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                {/* <ChevronDown className="absolute right-3 top-2.5 text-gray-400" size={16} /> */}
              </div>
            </div>

            <div className="mb-4">
              <label className=" text-gray-700 font-medium mb-2 flex items-center gap-1">
                <User className="text-gray-500" size={16} />
                Current Supervisor
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="currentSupervisor"
                  value={formData.currentSupervisor}
                  onChange={handleChange}
                  placeholder="e.g., John Doe"
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <User
                  className="absolute left-2 top-2.5 text-gray-400"
                  size={16}
                />
              </div>
            </div>

            <div className="mb-4">
              <label className=" text-gray-700 font-medium mb-2 flex items-center gap-1">
                <Calendar className="text-gray-500" size={16} />
                Date of Joined
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="dateOfJoined"
                  value={formData.dateOfJoined}
                  onChange={handleChange}
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {/* <Calendar className="absolute left-2 top-2.5 text-gray-400" size={16} /> */}
              </div>
            </div>

            <div className="mb-4">
              <label className=" text-gray-700 font-medium mb-2 flex items-center gap-1">
                <Briefcase className="text-gray-500" size={16} />
                Designation <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Designation</option>
                  <option value="Manager">Manager</option>
                  <option value="Developer">Developer</option>
                  <option value="Accountant">Accountant</option>
                </select>
                {/* <ChevronDown className="absolute right-3 top-2.5 text-gray-400" size={16} /> */}
              </div>
            </div>

            <div className="mb-4">
              <label className=" text-gray-700 font-medium mb-2 flex items-center gap-1">
                <Layers className="text-gray-500" size={16} />
                Day Off <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="dayOff"
                  value={formData.dayOff || ""}
                  onChange={handleChange}
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Day Off</option>
                  <option value="Sunday">Sunday</option>
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                  <option value="Saturday">Saturday</option>
                </select>
                {/* <ChevronDown className="absolute right-3 top-2.5 text-gray-400" size={16} /> */}
              </div>
            </div>
          </div>
        </div>

        {/* Employment Periods Section */}
        <div className="mb-8 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <Clock className="text-blue-500" size={20} />
            Employment Periods
          </h2>
          <p className="text-gray-500 mb-4 pl-7">
            Define training, probation, and contract periods
          </p>
          <div className="space-y-6">
            {/* Probation Period */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-700 flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm">
                    1
                  </span>
                  Probation Period
                </h3>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm ${
                      toggleStates.probationEnabled
                        ? "text-blue-600"
                        : "text-red-400"
                    }`}
                  >
                    {toggleStates.probationEnabled ? "Enabled" : "Disabled"}
                  </span>
                  <ToggleButton
                    enabled={formData.probationPeriod}
                    onToggle={() => handleToggle("probationEnabled")}
                    label="Probation Period"
                    value={formData.probationPeriod}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-600 mb-1">From Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      name="probationFrom"
                      value={formData.probationFrom}
                      onChange={handleChange}
                      disabled={!toggleStates.probationEnabled}
                      className={`w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        !toggleStates.probationEnabled
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : ""
                      }`}
                    />
                    <Calendar
                      className={`absolute left-2 top-2.5 ${
                        toggleStates.probationEnabled
                          ? "text-gray-400"
                          : "text-gray-300"
                      }`}
                      size={16}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">To Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      name="probationTo"
                      value={formData.probationTo}
                      onChange={handleChange}
                      disabled={!toggleStates.probationEnabled}
                      className={`w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        !toggleStates.probationEnabled
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : ""
                      }`}
                    />
                    <Calendar
                      className={`absolute left-2 top-2.5 ${
                        toggleStates.probationEnabled
                          ? "text-gray-400"
                          : "text-gray-300"
                      }`}
                      size={16}
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* Training Period */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-700 flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm">
                    2
                  </span>
                  Training Period
                </h3>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm ${
                      toggleStates.trainingEnabled
                        ? "text-blue-600"
                        : "text-red-400"
                    }`}
                  >
                    {toggleStates.trainingEnabled ? "Enabled" : "Disabled"}
                  </span>
                  <ToggleButton
                    enabled={formData.trainingPeriod}
                    onToggle={() => handleToggle("trainingEnabled")}
                    value={formData.trainingPeriod}
                    label="Training Period"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-600 mb-1">From Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      name="trainingFrom"
                      value={formData.trainingFrom}
                      onChange={handleChange}
                      disabled={!toggleStates.trainingEnabled}
                      className={`w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        !toggleStates.trainingEnabled
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : ""
                      }`}
                    />
                    <Calendar
                      className={`absolute left-2 top-2.5 ${
                        toggleStates.trainingEnabled
                          ? "text-gray-400"
                          : "text-gray-300"
                      }`}
                      size={16}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">To Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      name="trainingTo"
                      value={formData.trainingTo}
                      onChange={handleChange}
                      disabled={!toggleStates.trainingEnabled}
                      className={`w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        !toggleStates.trainingEnabled
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : ""
                      }`}
                    />
                    <Calendar
                      className={`absolute left-2 top-2.5 ${
                        toggleStates.trainingEnabled
                          ? "text-gray-400"
                          : "text-gray-300"
                      }`}
                      size={16}
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* Contract Period */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-700 flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm">
                    3
                  </span>
                  Contract Period
                </h3>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm ${
                      toggleStates.contractEnabled
                        ? "text-blue-600"
                        : "text-red-400"
                    }`}
                  >
                    {toggleStates.contractEnabled ? "Enabled" : "Disabled"}
                  </span>
                  <ToggleButton
                    enabled={formData.contractPeriod}
                    onToggle={() => {
                      const updatedValue = !toggleStates.contractEnabled;
                      handleToggle("contractEnabled", updatedValue);
                      console.log("New Toggle Value:", updatedValue); // This logs or returns the value
                    }}
                    label="Contract Period"
                    value={formData.contractPeriod}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-600 mb-1">From Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      name="contractFrom"
                      value={formData.contractFrom}
                      onChange={handleChange}
                      disabled={!toggleStates.contractEnabled}
                      className={`w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        !toggleStates.contractEnabled
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : ""
                      }`}
                    />
                    <Calendar
                      className={`absolute left-2 top-2.5 ${
                        toggleStates.contractEnabled
                          ? "text-gray-400"
                          : "text-gray-300"
                      }`}
                      size={16}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">To Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      name="contractTo"
                      value={formData.contractTo}
                      onChange={handleChange}
                      disabled={!toggleStates.contractEnabled}
                      className={`w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        !toggleStates.contractEnabled
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : ""
                      }`}
                    />
                    <Calendar
                      className={`absolute left-2 top-2.5 ${
                        toggleStates.contractEnabled
                          ? "text-gray-400"
                          : "text-gray-300"
                      }`}
                      size={16}
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* Confirmation Date */}
            <div className="md:w-1/2">
              <div className="flex items-center justify-between mb-2">
                <label className="text-gray-700 font-medium flex items-center gap-1">
                  <CheckCircle className="text-gray-500" size={16} />
                  Confirmation Date
                </label>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm ${
                      toggleStates.confirmationEnabled
                        ? "text-blue-600"
                        : "text-red-400"
                    }`}
                  >
                    {toggleStates.confirmationEnabled ? "Enabled" : "Disabled"}
                  </span>
                  <ToggleButton
                    enabled={toggleStates.confirmationEnabled}
                    onToggle={() => handleToggle("confirmationEnabled")}
                    label="Confirmation Date"
                  />
                </div>
              </div>
              <div className="relative">
                <input
                  type="date"
                  name="confirmationDate"
                  value={formData.confirmationDate}
                  onChange={handleChange}
                  disabled={!toggleStates.confirmationEnabled}
                  className={`w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    !toggleStates.confirmationEnabled
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : ""
                  }`}
                />
                <Calendar
                  className={`absolute left-2 top-2.5 ${
                    toggleStates.confirmationEnabled
                      ? "text-gray-400"
                      : "text-gray-300"
                  }`}
                  size={16}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Resignation Section */}
        <div className="mb-8 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <FileText className="text-blue-500" size={20} />
            Resignation & Status
          </h2>
          <p className="text-gray-500 mb-4 pl-7">
            Manage resignation details and current status
          </p>

          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-700 mb-2">
                Date of Resigning
              </h3>
              <div className="relative md:w-1/2">
                <input
                  type="date"
                  name="resignationDate"
                  value={formData.resignationDate}
                  onChange={handleChange}
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Calendar
                  className="absolute left-2 top-2.5 text-gray-400"
                  size={16}
                />
              </div>
            </div>

            <div>
              <label className=" text-gray-700 font-medium mb-2 flex items-center gap-1">
                <FileText className="text-gray-500" size={16} />
                Upload Resignation Letter
              </label>
              <div className="flex items-center">
                <label className="flex flex-col items-center justify-center w-full p-4 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FileText className="w-8 h-8 mb-3 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      {formData.resignationLetter
                        ? formData.resignationLetter.name
                        : "PDF, DOCX (MAX. 5MB)"}
                    </p>
                  </div>
                  <input
                    type="file"
                    name="resignationLetter"
                    onChange={handleChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="flex items-center">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="resignationApproved"
                  checked={formData.resignationApproved}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                <span className="ms-3 text-gray-700 font-medium flex items-center gap-1">
                  {formData.resignationApproved ? (
                    <CheckCircle className="text-green-500" size={16} />
                  ) : (
                    <XCircle className="text-red-500" size={16} />
                  )}
                  Resignation Approved
                </span>
              </label>
            </div>

            <div>
              <label className=" text-gray-700 font-medium mb-2 flex items-center gap-1">
                <User className="text-gray-500" size={16} />
                Current Status
              </label>
              <div className="relative md:w-1/2">
                <input
                  type="text"
                  name="currentStatus"
                  value={formData.currentStatus}
                  onChange={handleChange}
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Active, On Leave, Resigned"
                />
                <User
                  className="absolute left-2 top-2.5 text-gray-400"
                  size={16}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4">
          <p className="text-gray-500 text-sm">* Required fields</p>
          <div className="flex gap-4">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-2"
              onClick={() => {
                // Only clear organizationDetails from localStorage
                try {
                  const saved = localStorage.getItem(STORAGE_KEY);
                  if (saved && saved !== "undefined" && saved !== "null") {
                    const parsed = JSON.parse(saved);
                    delete parsed.organizationDetails;
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
                  }
                } catch (e) {
                  // ignore
                }
                setFormData({
                  company: "",
                  department: "",
                  subDepartment: "",
                  currentSupervisor: "",
                  dateOfJoined: "",
                  designation: "",
                  probationPeriod: false,
                  trainingPeriod: false,
                  contractPeriod: false,
                  probationFrom: "",
                  probationTo: "",
                  trainingFrom: "",
                  trainingTo: "",
                  contractFrom: "",
                  contractTo: "",
                  confirmationDate: "",
                  resignationDate: "",
                  resignationLetter: null,
                  resignationApproved: false,
                  currentStatus: "Active",
                  dayOff: "",
                });
                setIsSaved(false);
              }}
            >
              <RefreshCw size={16} />
              Clear
            </button>
          </div>
        </div>
        {/* {isSaved && (
          <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-md flex items-center gap-2">
            <CheckCircle className="text-green-600" size={18} />
            Organization details saved automatically!
          </div>
        )} */}
      </form>
      {/* Modals */}
      <Modal
        show={showCompanyModal}
        onClose={() => setShowCompanyModal(false)}
        title="Add New Company"
        value={newCompany}
        setValue={setNewCompany}
        onAdd={handleAddCompany}
        placeholder="Enter company name"
        items={companies}
        onDelete={handleDeleteCompany}
      />
      <Modal
        show={showDepartmentModal}
        onClose={() => setShowDepartmentModal(false)}
        title="Add New Department"
        value={newDepartment}
        setValue={setNewDepartment}
        onAdd={handleAddDepartment}
        placeholder="Enter department name"
        items={departments}
        onDelete={handleDeleteDepartment}
      />
      <Modal
        show={showSubDepartmentModal}
        onClose={() => setShowSubDepartmentModal(false)}
        title="Add New Sub Department"
        value={newSubDepartment}
        setValue={setNewSubDepartment}
        onAdd={handleAddSubDepartment}
        placeholder="Enter sub department name"
        items={subDepartments}
        onDelete={handleDeleteSubDepartment}
      />
    </div>
  );
};

export default OrganizationDetails;
