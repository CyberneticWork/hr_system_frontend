import React, { useState, useEffect, useCallback } from "react";
import {
  Camera,
  Upload,
  User,
  Users,
  Baby,
  Briefcase,
  Plus,
  Trash2,
  Search,
  Edit,
  X,
} from "lucide-react";
import { useEmployeeForm } from "@contexts/EmployeeFormContext";
import FieldError from "@components/ErrorMessage/FieldError";
import { useDebounce } from "@uidotdev/usehooks";
import employeeService from "@services/EmployeeDataService";
import config from "@src/config"; 

const relationshipOptions = [
  { value: "", label: "Select Relationship Type" },
  { value: "husband", label: "Husband" },
  { value: "wife", label: "Wife" },
  { value: "relation", label: "Relation" },
  { value: "non-relation", label: "Non-Relation" },
  { value: "friend", label: "Friend" },
];

// Simple Modal Component
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

const EmpPersonalDetails = ({ onNext, activeCategory }) => {
  const {
    formData,
    updateFormData,
    errors,
    clearFieldError,
    clearForm,
    setFormData,
  } = useEmployeeForm();
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (formData.personal.profilePicture) {
      if (formData.personal.profilePicture instanceof File) {
        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target.result);
        reader.readAsDataURL(formData.personal.profilePicture);
      } else if (typeof formData.personal.profilePicture === "string") {
        setPreview(formData.personal.profilePicture);
      }
    }
  }, [formData.personal.profilePicture]);

  useEffect(() => {
    const performSearch = async () => {
      if (!debouncedSearchTerm) {
        setSearchResults([]);
        return;
      }
      setIsSearching(true);
      try {
        const response = await employeeService.searchEmployees(
          debouncedSearchTerm
        );
        setSearchResults(response);
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    performSearch();
  }, [debouncedSearchTerm]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (errors.personal?.[name]) {
      clearFieldError("personal", name);
    }

    updateFormData("personal", {
      [name]: type === "checkbox" ? checked : value,
    });

    if (e.target.type === "file" && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
        updateFormData("personal", {
          profilePicture: file,
          profilePicturePreview: e.target.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChildChange = (idx, e) => {
    const { name, value } = e.target;
    const updatedChildren = [...formData.personal.children];
    updatedChildren[idx][name] = value;
    updateFormData("personal", { children: updatedChildren });
  };

  const addChild = () => {
    updateFormData("personal", {
      children: [
        ...formData.personal.children,
        { name: "", age: "", dob: "", nic: "" },
      ],
    });
  };

  const removeChild = (idx) => {
    if (formData.personal.children.length > 1) {
      const updatedChildren = formData.personal.children.filter(
        (_, index) => index !== idx
      );
      updateFormData("personal", { children: updatedChildren });
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
        updateFormData("personal", {
          profilePicture: file,
          profilePicturePreview: e.target.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const loadEmployeeData = async (employeeId) => {
    try {
      const response = await employeeService.fetchEmployeeById(employeeId);
      const apiData = response;

      const transformedData = {
        personal: {
          id: apiData.id,
          title: apiData.title,
          attendanceEmpNo: apiData.attendance_employee_no,
          epfNo: apiData.epf,
          nicNumber: apiData.nic,
          dob: apiData.dob,
          gender: apiData.gender,
          religion: apiData.religion,
          countryOfBirth: apiData.country_of_birth,
          profilePicture: null,
          profilePicturePreview: apiData.profile_photo_path
            ? `${config.apiBaseUrl}/storage/${apiData.profile_photo_path}`
            : null,
          employmentStatus: apiData.employment_status,
          nameWithInitial: apiData.name_with_initials,
          fullName: apiData.full_name,
          displayName: apiData.display_name,
          maritalStatus: apiData.marital_status,
          relationshipType: apiData.relationship_type,
          spouseTitle: apiData.spouse?.title,
          spouseName: apiData.spouse?.name,
          spouseAge: apiData.spouse?.age,
          spouseDob: apiData.spouse?.dob,
          spouseNic: apiData.spouse?.nic,
          children:
            apiData.children?.length > 0
              ? apiData.children.map((child) => ({
                  name: child.name,
                  age: child.age,
                  dob: child.dob,
                  nic: child.nic,
                }))
              : [{ name: "", age: "", dob: "", nic: "" }],
        },
        address: {
          permanentAddress: apiData.contact_detail?.permanent_address,
          temporaryAddress: apiData.contact_detail?.temporary_address,
          email: apiData.contact_detail?.email,
          landLine: apiData.contact_detail?.land_line,
          mobileLine: apiData.contact_detail?.mobile_line,
          gnDivision: apiData.contact_detail?.gn_division,
          policeStation: apiData.contact_detail?.police_station,
          district: apiData.contact_detail?.district,
          province: apiData.contact_detail?.province,
          electoralDivision: apiData.contact_detail?.electoral_division,
          emergencyContact: {
            relationship: apiData.contact_detail?.emg_relationship,
            contactName: apiData.contact_detail?.emg_name,
            contactAddress: apiData.contact_detail?.emg_address,
            contactTel: apiData.contact_detail?.emg_tel,
          },
        },
        compensation: {
          basicSalary: apiData.compensation?.basic_salary,
          incrementValue: apiData.compensation?.increment_value,
          incrementEffectiveFrom:
            apiData.compensation?.increment_effective_from,
          bankName: apiData.compensation?.bank_name,
          branchName: apiData.compensation?.branch_name,
          bankCode: apiData.compensation?.bank_code,
          branchCode: apiData.compensation?.branch_code,
          bankAccountNo: apiData.compensation?.bank_account_no,
          comments: apiData.compensation?.comments,
          secondaryEmp: apiData.compensation?.secondary_emp === 1,
          primaryEmploymentBasic:
            apiData.compensation?.primary_employment_basic === 1,
          enableEpfEtf: apiData.compensation?.enable_epf_etf === 1,
          otActive: apiData.compensation?.ot_active === 1,
          earlyDeduction: apiData.compensation?.early_deduction === 1,
          incrementActive: apiData.compensation?.increment_active === 1,
          nopayActive: apiData.compensation?.nopay_active === 1,
          morningOt: apiData.compensation?.morning_ot === 1,
          eveningOt: apiData.compensation?.evening_ot === 1,
          budgetaryReliefAllowance2015:
            apiData.compensation?.budgetary_relief_allowance_2015 === 1,
          budgetaryReliefAllowance2016:
            apiData.compensation?.budgetary_relief_allowance_2016 === 1,
        },
        organization: {
          company: apiData.organization_assignment?.company?.id?.toString(),
          department:
            apiData.organization_assignment?.department?.id?.toString(),
          subDepartment:
            apiData.organization_assignment?.sub_department?.id?.toString(),
          companyName: apiData.organization_assignment?.company?.name,
          departmentName: apiData.organization_assignment?.department?.name,
          subDepartmentName:
            apiData.organization_assignment?.sub_department?.name,
          currentSupervisor:
            apiData.organization_assignment?.current_supervisor,
          dateOfJoined: apiData.organization_assignment?.date_of_joining,
          designation:
            apiData.organization_assignment?.designation?.id?.toString(),
          designationName: apiData.organization_assignment?.designation?.name,
          probationPeriod:
            apiData.organization_assignment?.probationary_period === 1,
          trainingPeriod:
            apiData.organization_assignment?.training_period === 1,
          contractPeriod:
            apiData.organization_assignment?.contract_period === 1,
          probationFrom:
            apiData.organization_assignment?.probationary_period_from,
          probationTo: apiData.organization_assignment?.probationary_period_to,
          trainingFrom: apiData.organization_assignment?.training_period_from,
          trainingTo: apiData.organization_assignment?.training_period_to,
          contractFrom: apiData.organization_assignment?.contract_period_from,
          contractTo: apiData.organization_assignment?.contract_period_to,
          confirmationDate: apiData.organization_assignment?.confirmation_date,
          resignationDate: apiData.organization_assignment?.date_of_resigning,
          resignationLetter: null,
          resignationApproved:
            apiData.organization_assignment?.resignation_approved === 1,
          currentStatus: apiData.is_active ? 1 : 0,
          dayOff: apiData.organization_assignment?.day_off,
        },
        documents:
          apiData.documents?.map((doc) => ({
            id: doc.id,
            name: doc.name,
            type: doc.type,
            size: doc.size,
            status: doc.status,
            preview: doc.path
              ? `${config.apiBaseUrl}/storage/${doc.path}`
              : null,
          })) || [],
      };

      setFormData((prev) => ({
        ...prev,
        ...transformedData,
      }));

      setIsSearchModalOpen(false);
    } catch (error) {
      console.error("Error loading employee data:", error);
    }
  };

  return (
    <div className="rounded-2xl overflow-hidden">
      <div className="bg-white rounded-2xl shadow-xl mb-6 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Employee Personal Details
              </h1>
              <p className="text-gray-600 mt-1">
                Complete employee information management system
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsSearchModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            <span>Edit Employee</span>
          </button>
        </div>
      </div>

      <Modal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        title="Search Employee"
      >
        <div className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search by name, ID, EPF, NIC..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {isSearching && (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          )}

          {!isSearching && searchResults.length > 0 && (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {searchResults.map((employee) => (
                <div
                  key={employee.id}
                  className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => loadEmployeeData(employee.id)}
                >
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {employee.profile_photo_path ? (
                      <img
                        src={employee.profile_photo_path}
                        alt={employee.full_name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User className="h-6 w-6 text-gray-500" />
                    )}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {employee.full_name}
                    </div>
                    <div className="text-sm text-gray-500">
                      EPF: {employee.epf} | NIC: {employee.nic}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isSearching && searchTerm && searchResults.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              No employees found matching your search.
            </div>
          )}
        </div>
      </Modal>

      <div className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-2 rounded-lg">
              <User className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">
              Basic Information
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Title */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Title <span className="text-red-500">*</span>
              </label>
              <select
                name="title"
                value={formData.personal.title}
                onChange={handleChange}
                className={`w-full border ${
                  errors.personal?.title ? "border-red-500" : "border-gray-300"
                } rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white`}
                required
              >
                <option value="">Select Title</option>
                <option>Mr</option>
                <option>Mrs</option>
                <option>Miss</option>
                <option>Ms</option>
                <option>Dr</option>
              </select>
              <FieldError error={errors.personal?.title} />
            </div>

            {/* Attendance Emp No */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Attendance Emp No <span className="text-red-500">*</span>
              </label>
              <input
                name="attendanceEmpNo"
                value={formData.personal.attendanceEmpNo}
                onChange={handleChange}
                className={`w-full border ${
                  errors.personal?.attendanceEmpNo
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                placeholder="Enter employee number"
                required
              />
              <FieldError error={errors.personal?.attendanceEmpNo} />
            </div>

            {/* EPF No */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                EPF No <span className="text-red-500">*</span>
              </label>
              <input
                name="epfNo"
                value={formData.personal.epfNo}
                onChange={handleChange}
                className={`w-full border ${
                  errors.personal?.epfNo ? "border-red-500" : "border-gray-300"
                } rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                placeholder="Enter EPF number"
                required
              />
              <FieldError error={errors.personal?.epfNo} />
            </div>

            {/* NIC Number */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                NIC Number <span className="text-red-500">*</span>
              </label>
              <input
                name="nicNumber"
                value={formData.personal.nicNumber}
                onChange={handleChange}
                className={`w-full border ${
                  errors.personal?.nicNumber
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                placeholder="Enter NIC number"
                required
              />
              <FieldError error={errors.personal?.nicNumber} />
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="dob"
                value={formData.personal.dob}
                onChange={handleChange}
                className={`w-full border ${
                  errors.personal?.dob ? "border-red-500" : "border-gray-300"
                } rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                required
              />
              <FieldError error={errors.personal?.dob} />
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                name="gender"
                value={formData.personal.gender}
                onChange={handleChange}
                className={`w-full border ${
                  errors.personal?.gender ? "border-red-500" : "border-gray-300"
                } rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white`}
                required
              >
                <option value="">Select Gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
              <FieldError error={errors.personal?.gender} />
            </div>

            {/* Religion */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Religion
              </label>
              <input
                name="religion"
                value={formData.personal.religion}
                onChange={handleChange}
                className={`w-full border ${
                  errors.personal?.religion
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                placeholder="Enter religion"
              />
              <FieldError error={errors.personal?.religion} />
            </div>

            {/* Country of Birth */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Country of Birth
              </label>
              <input
                name="countryOfBirth"
                value={formData.personal.countryOfBirth}
                onChange={handleChange}
                className={`w-full border ${
                  errors.personal?.countryOfBirth
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                placeholder="Enter country of birth"
              />
              <FieldError error={errors.personal?.countryOfBirth} />
            </div>

            {/* Profile Picture Upload */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Profile Picture
              </label>

              <div className="flex items-center gap-4">
                {/* Preview Circle */}
                <div className="relative">
                  <div
                    className={`w-16 h-16 rounded-full border-2  ${
                      errors?.profile_picture
                        ? "border-red-500"
                        : "border-gray-200"
                    }  overflow-hidden bg-gray-50 flex items-center justify-center`}
                  >
                    {preview ? (
                      <img
                        src={preview}
                        alt="Profile preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  {preview && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>

                {/* Upload Area */}
                <div
                  className={`relative flex-1 border-2 border-dashed rounded-lg px-4 py-3 
              transition-all duration-200 cursor-pointer
              ${errors?.profile_picture ? "border-red-500" : "border-gray-300"}
              ${
                isDragging
                  ? "border-blue-400 bg-blue-50"
                  : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
              }
            `}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                >
                  <input
                    name="profilePicture"
                    type="file"
                    accept="image/*"
                    onChange={handleChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />

                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Camera className="w-4 h-4" />
                      <span>Choose photo</span>
                    </div>
                    <div className="text-gray-400">or drag and drop</div>
                  </div>
                </div>
              </div>

              {/* File info */}
              {formData.personal.profilePicture && (
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <Upload className="w-3 h-3" />
                  <span>
                    {formData.personal.profilePicture.name || "File selected"}
                  </span>
                </div>
              )}
              <FieldError error={errors?.profile_picture} />
            </div>
          </div>
        </div>

        {/* Employment Status */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">
              Employment Status
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { value: "1", label: "Permanent Basis" },
              { value: "2", label: "Training" },
              { value: "3", label: "Contract Basis" },
              { value: "4", label: "Daily Wages Salary" },
            ].map((item) => (
              <label
                key={item.value}
                className={`flex items-center gap-3 p-3 rounded-lg border ${
                  errors.personal?.employmentStatus
                    ? "border-red-500"
                    : "border-gray-200"
                } hover:bg-gray-50 transition-colors cursor-pointer`}
              >
                <input
                  type="radio"
                  name="employmentStatus"
                  value={item.value}
                  checked={formData.personal.employmentStatus === item.value}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 focus:ring-2"
                />
                <span className="text-sm font-medium text-gray-700">
                  {item.label}
                </span>
              </label>
            ))}
          </div>
          <FieldError error={errors.personal?.employmentStatus} />
        </div>

        {/* Name Details */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-2 rounded-lg">
              <User className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">
              Name Details
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Name With Initial <span className="text-red-500">*</span>
              </label>
              <input
                name="nameWithInitial"
                value={formData.personal.nameWithInitial}
                onChange={handleChange}
                className={`w-full border ${
                  errors.personal?.nameWithInitial
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                placeholder="e.g., J.A. Smith"
                required
              />
              <FieldError error={errors.personal?.nameWithInitial} />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                name="fullName"
                value={formData.personal.fullName}
                onChange={handleChange}
                className={`w-full border ${
                  errors.personal?.fullName
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                placeholder="Enter full name"
                required
              />
              <FieldError error={errors.personal?.fullName} />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Display Name <span className="text-red-500">*</span>
              </label>
              <input
                name="displayName"
                value={formData.personal.displayName}
                onChange={handleChange}
                className={`w-full border ${
                  errors.personal?.displayName
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                placeholder="Enter display name"
                required
              />
              <FieldError error={errors.personal?.displayName} />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Marital Status <span className="text-red-500">*</span>
            </label>
            <select
              name="maritalStatus"
              value={formData.personal.maritalStatus}
              onChange={handleChange}
              className={`w-full lg:w-1/3 border ${
                errors.personal?.maritalStatus
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white`}
            >
              <option value="">Select Status</option>
              <option>Single</option>
              <option>Married</option>
              <option>Divorced</option>
              <option>Widowed</option>
            </select>
            <FieldError error={errors.personal?.maritalStatus} />
          </div>
        </div>

        {/* Spouse Details */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-r from-rose-500 to-pink-500 p-2 rounded-lg">
              <Users className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">
              Relationship Details
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Relationship Type <span className="text-red-500">*</span>
              </label>
              <select
                name="relationshipType"
                value={formData.personal.relationshipType || ""}
                onChange={handleChange}
                className={`w-full border ${
                  errors.personal?.relationshipType
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white`}
              >
                {relationshipOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <FieldError error={errors.personal?.relationshipType} />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <select
                name="spouseTitle"
                value={formData.personal.spouseTitle || ""}
                onChange={handleChange}
                className={`w-full border ${
                  errors.personal?.spouseTitle
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white`}
                required
              >
                <option value="">Select Title</option>
                <option>Mr</option>
                <option>Mrs</option>
                <option>Miss</option>
                <option>Ms</option>
                <option>Dr</option>
              </select>
              <FieldError error={errors.personal?.spouseTitle} />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                name="spouseName"
                value={formData.personal.spouseName}
                onChange={handleChange}
                className={`w-full border ${
                  errors.personal?.spouseName
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                placeholder="Enter spouse name"
              />
              <FieldError error={errors.personal?.spouseName} />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Age <span className="text-red-500">*</span>
              </label>
              <input
                name="spouseAge"
                type="number"
                min="0"
                value={formData.personal.spouseAge}
                onChange={handleChange}
                className={`w-full border ${
                  errors.personal?.spouseAge
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                placeholder="Enter age"
              />
              <FieldError error={errors.personal?.spouseAge} />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                DOB <span className="text-red-500">*</span>
              </label>
              <input
                name="spouseDob"
                type="date"
                value={formData.personal.spouseDob}
                onChange={handleChange}
                className={`w-full border ${
                  errors.personal?.spouseDob
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
              />
              <FieldError error={errors.personal?.spouseDob} />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                NIC <span className="text-red-500">*</span>
              </label>
              <input
                name="spouseNic"
                value={formData.personal.spouseNic}
                onChange={handleChange}
                className={`w-full border ${
                  errors.personal?.spouseNic
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                placeholder="Enter NIC number"
              />
              <FieldError error={errors.personal?.spouseNic} />
            </div>
          </div>
        </div>

        {/* Children Details - Dynamic */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-2 rounded-lg">
                <Baby className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">
                Children Details
              </h2>
            </div>
            <button
              onClick={addChild}
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              Add Child
            </button>
          </div>

          <div className="space-y-4">
            {formData.personal.children.map((child, idx) => (
              <div key={idx} className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-600">
                    Child {idx + 1}
                  </h3>
                  {formData.personal.children.length > 1 && (
                    <button
                      onClick={() => removeChild(idx)}
                      className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-lg transition-colors duration-200 flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <input
                    name="name"
                    placeholder="Child name"
                    value={child.name}
                    onChange={(e) => handleChildChange(idx, e)}
                    className={`w-full border ${
                      errors.personal?.children?.[idx]?.name
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                  />
                  <input
                    name="age"
                    type="number"
                    min="0"
                    placeholder="Age"
                    value={child.age}
                    onChange={(e) => handleChildChange(idx, e)}
                    className={`w-full border ${
                      errors.personal?.children?.[idx]?.age
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                  />
                  <input
                    name="dob"
                    type="date"
                    value={child.dob}
                    onChange={(e) => handleChildChange(idx, e)}
                    className={`w-full border ${
                      errors.personal?.children?.[idx]?.dob
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                  />
                  <input
                    name="nic"
                    placeholder="NIC number"
                    value={child.nic}
                    onChange={(e) => handleChildChange(idx, e)}
                    className={`w-full border ${
                      errors.personal?.children?.[idx]?.nic
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                  />
                </div>
                {errors.personal?.children?.[idx] && (
                  <div className="mt-2 text-sm text-red-600">
                    {Object.values(errors.personal.children[idx]).map(
                      (error, i) => (
                        <div key={i} className="flex items-start">
                          <span className="mr-1">•</span>
                          <span>{error}</span>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Next Button */}
        
      </div>
      <div className="flex justify-end mt-8">
          <button
            type="button"
            onClick={onNext}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Next
          </button>
        </div>
    </div>
  );
};

export default EmpPersonalDetails;
