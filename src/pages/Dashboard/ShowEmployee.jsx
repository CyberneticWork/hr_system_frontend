import React, { useState, useEffect } from "react";
import {
  Eye,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Briefcase,
  X,
  Loader2,
  Users,
  Building,
  Heart,
  Baby,
  Shield,
  Clock,
  UserCheck,
} from "lucide-react";
import employeeService from "@services/EmployeeDataService";

import config from '../../config';

const apiUrl = config.apiBaseUrl;

const ShowEmployee = () => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const employeesData = await employeeService.fetchEmployeesForTable();
        setEmployees(employeesData);
      } catch (e) {
        console.error("Error loading data:", e);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleViewEmployee = async (employee) => {
    const employeeData = await employeeService.fetchEmployeeById(employee);
    setSelectedEmployee(employeeData);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedEmployee(null);
  };

  const getStatusBadge = (status) => {
    const statusClass =
      status === 1
        ? "bg-green-100 text-green-800 border-green-200"
        : "bg-red-100 text-red-800 border-red-200";
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium border ${statusClass}`}
      >
        {status === 1 ? "Active" : "Inactive"}
      </span>
    );
  };

  const getTypeBadge = (type) => {
    const typeClass =
      type === "PERMANENT"
        ? "bg-blue-100 text-blue-800 border-blue-200"
        : type === "Training"
        ? "bg-orange-100 text-orange-800 border-orange-200"
        : "bg-purple-100 text-purple-800 border-purple-200";
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium border ${typeClass}`}
      >
        {type}
      </span>
    );
  };

  const getMaritalStatusBadge = (status) => {
    const statusClass =
      status === "married"
        ? "bg-pink-100 text-pink-800 border-pink-200"
        : "bg-gray-100 text-gray-800 border-gray-200";
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium border ${statusClass}`}
      >
        {status?.charAt(0).toUpperCase() + status?.slice(1) || "Not specified"}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateAge = (dob) => {
    if (!dob) return "Not specified";
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return `${age} years old`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800">
            Loading Employee Data
          </h2>
          <p className="text-gray-600 mt-2">
            Please wait while we fetch the records...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Employee Management
          </h1>
          <p className="text-gray-600">Manage and view employee information</p>
        </div>

        {/* Employee Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <User className="mr-2 h-5 w-5 text-blue-600" />
              Employee List
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee Info
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Position
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {employees.map((employee) => (
                  <tr
                    key={employee.id}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center overflow-hidden">
                            {employee.profile_photo_path ? (
                              <img
                                src={`${apiUrl}/storage/${employee.profile_photo_path}`}
                                alt="Profile photo"
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <span className="text-white font-semibold text-sm">
                                {employee.name_with_initials?.charAt(0) || "?"}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {employee.full_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            Emp No: {employee.epf}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-medium">
                        {employee.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {employee.attendance_employee_no}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(employee.is_active)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getTypeBadge(employee.employment_type?.name)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {employee.contact_detail?.email}
                      </div>
                      <div className="text-sm text-gray-500">
                        {employee.contact_detail?.mobile_line}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleViewEmployee(employee.id)}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Employee Details Modal */}
        {showModal && selectedEmployee && (
          <div className="fixed inset-0 backdrop-blur-sm  bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
                      {selectedEmployee.profile_photo_path ? (
                        <img
                          src={`${apiUrl}/storage/${selectedEmployee.profile_photo_path}`}
                          alt="Profile photo"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-white font-semibold text-lg">
                          {selectedEmployee.name_with_initials?.charAt(0) || "?"}
                        </span>
                      )}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">
                        {selectedEmployee.full_name}
                      </h2>
                      <p className="text-blue-100">{selectedEmployee.title}</p>
                      <p className="text-blue-200 text-sm">
                        {selectedEmployee.display_name} • {calculateAge(selectedEmployee.dob)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={closeModal}
                    className="text-white hover:text-gray-200 transition-colors p-2"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {/* Basic Information */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <User className="h-5 w-5 mr-2 text-blue-600" />
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Employee No
                      </label>
                      <p className="text-gray-900 font-semibold">
                        {selectedEmployee.attendance_employee_no}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Display Name
                      </label>
                      <p className="text-gray-900 font-semibold">
                        {selectedEmployee.display_name}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Gender
                      </label>
                      <p className="text-gray-900 font-semibold capitalize">
                        {selectedEmployee.gender}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Date of Birth
                      </label>
                      <p className="text-gray-900 font-semibold flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                        {formatDate(selectedEmployee.dob)}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Religion
                      </label>
                      <p className="text-gray-900 font-semibold">
                        {selectedEmployee.religion || "Not specified"}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Country of Birth
                      </label>
                      <p className="text-gray-900 font-semibold">
                        {selectedEmployee.country_of_birth || "Not specified"}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        NIC Number
                      </label>
                      <p className="text-gray-900 font-semibold">
                        {selectedEmployee.nic}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        EPF No
                      </label>
                      <p className="text-gray-900 font-semibold">
                        {selectedEmployee.epf}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Marital Status
                      </label>
                      <div className="mt-2">
                        {getMaritalStatusBadge(selectedEmployee.marital_status)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Employment Information */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <Briefcase className="h-5 w-5 mr-2 text-purple-600" />
                    Employment Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Employment Type
                      </label>
                      <div className="mt-2">
                        {getTypeBadge(selectedEmployee.employment_type?.name)}
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Date of Joining
                      </label>
                      <p className="text-gray-900 font-semibold flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                        {formatDate(selectedEmployee.organization_assignment?.date_of_joining)}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Current Supervisor
                      </label>
                      <p className="text-gray-900 font-semibold">
                        {selectedEmployee.organization_assignment?.current_supervisor || "Not assigned"}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Day Off
                      </label>
                      <p className="text-gray-900 font-semibold capitalize">
                        {selectedEmployee.organization_assignment?.day_off || "Not specified"}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Confirmation Date
                      </label>
                      <p className="text-gray-900 font-semibold">
                        {formatDate(selectedEmployee.organization_assignment?.confirmation_date)}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Status
                      </label>
                      <div className="mt-2">
                        {getStatusBadge(selectedEmployee.is_active)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Period Information */}
                {selectedEmployee.organization_assignment && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-orange-600" />
                      Employment Periods
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {selectedEmployee.organization_assignment.probationary_period === 1 && (
                        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                          <label className="block text-sm font-medium text-yellow-800 mb-2">
                            Probationary Period
                          </label>
                          <p className="text-sm text-yellow-700">
                            From: {formatDate(selectedEmployee.organization_assignment.probationary_period_from)}
                          </p>
                          <p className="text-sm text-yellow-700">
                            To: {formatDate(selectedEmployee.organization_assignment.probationary_period_to)}
                          </p>
                        </div>
                      )}
                      {selectedEmployee.organization_assignment.training_period === 1 && (
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                          <label className="block text-sm font-medium text-blue-800 mb-2">
                            Training Period
                          </label>
                          <p className="text-sm text-blue-700">
                            From: {formatDate(selectedEmployee.organization_assignment.training_period_from)}
                          </p>
                          <p className="text-sm text-blue-700">
                            To: {formatDate(selectedEmployee.organization_assignment.training_period_to)}
                          </p>
                        </div>
                      )}
                      {selectedEmployee.organization_assignment.contract_period === 1 && (
                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                          <label className="block text-sm font-medium text-green-800 mb-2">
                            Contract Period
                          </label>
                          <p className="text-sm text-green-700">
                            From: {formatDate(selectedEmployee.organization_assignment.contract_period_from)}
                          </p>
                          <p className="text-sm text-green-700">
                            To: {formatDate(selectedEmployee.organization_assignment.contract_period_to)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Family Information */}
                {(selectedEmployee.spouse || selectedEmployee.children?.length > 0) && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <Heart className="h-5 w-5 mr-2 text-pink-600" />
                      Family Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {selectedEmployee.spouse && (
                        <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
                          <label className="block text-sm font-medium text-pink-800 mb-2">
                            Spouse Information
                          </label>
                          <p className="text-pink-700 font-semibold">
                            {selectedEmployee.spouse.title} {selectedEmployee.spouse.name}
                          </p>
                          <p className="text-sm text-pink-600">
                            Age: {selectedEmployee.spouse.age} years
                          </p>
                          <p className="text-sm text-pink-600">
                            DOB: {formatDate(selectedEmployee.spouse.dob)}
                          </p>
                          <p className="text-sm text-pink-600">
                            NIC: {selectedEmployee.spouse.nic || "Not provided"}
                          </p>
                        </div>
                      )}
                      {selectedEmployee.children?.length > 0 && (
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                          <label className="text-sm font-medium text-blue-800 mb-2 flex items-center">
                            <Baby className="h-4 w-4 mr-1" />
                            Children ({selectedEmployee.children.length})
                          </label>
                          <div className="space-y-2">
                            {selectedEmployee.children.map((child, index) => (
                              <div key={child.id} className="text-sm">
                                <p className="text-blue-700 font-semibold">
                                  {index + 1}. {child.name}
                                </p>
                                <p className="text-blue-600">
                                  Age: {child.age} years • DOB: {formatDate(child.dob)}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Address Information */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-green-600" />
                    Address Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Permanent Address
                      </label>
                      <p className="text-gray-900 font-semibold">
                        {selectedEmployee.contact_detail?.permanent_address || "Not provided"}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Temporary Address
                      </label>
                      <p className="text-gray-900 font-semibold">
                        {selectedEmployee.contact_detail?.temporary_address || "Not provided"}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Province
                      </label>
                      <p className="text-gray-900 font-semibold">
                        {selectedEmployee.contact_detail?.province || "Not specified"}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        District
                      </label>
                      <p className="text-gray-900 font-semibold">
                        {selectedEmployee.contact_detail?.district || "Not specified"}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        GN Division
                      </label>
                      <p className="text-gray-900 font-semibold">
                        {selectedEmployee.contact_detail?.gn_division || "Not specified"}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Police Station
                      </label>
                      <p className="text-gray-900 font-semibold">
                        {selectedEmployee.contact_detail?.police_station || "Not specified"}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Electoral Division
                      </label>
                      <p className="text-gray-900 font-semibold">
                        {selectedEmployee.contact_detail?.electoral_division || "Not specified"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <Phone className="h-5 w-5 mr-2 text-blue-600" />
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Email
                      </label>
                      <p className="text-gray-900 font-semibold flex items-center">
                        <Mail className="h-4 w-4 mr-1 text-gray-500" />
                        {selectedEmployee.contact_detail?.email || "Not provided"}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Mobile
                      </label>
                      <p className="text-gray-900 font-semibold flex items-center">
                        <Phone className="h-4 w-4 mr-1 text-gray-500" />
                        {selectedEmployee.contact_detail?.mobile_line || "Not provided"}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Land Line
                      </label>
                      <p className="text-gray-900 font-semibold">
                        {selectedEmployee.contact_detail?.land_line || "Not provided"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Emergency Contact Information */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-red-600" />
                    Emergency Contact
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                      <label className="block text-sm font-medium text-red-800 mb-1">
                        Relationship
                      </label>
                      <p className="text-red-900 font-semibold">
                        {selectedEmployee.contact_detail?.emg_relationship || "Not specified"}
                      </p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                      <label className="block text-sm font-medium text-red-800 mb-1">
                        Emergency Contact Number
                      </label>
                      <p className="text-red-900 font-semibold">
                        {selectedEmployee.contact_detail?.emg_tel || "Not provided"}
                      </p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg border border-red-200 md:col-span-2 lg:col-span-3">
                      <label className="block text-sm font-medium text-red-800 mb-1">
                        Emergency Contact Address
                      </label>
                      <p className="text-red-900 font-semibold">
                        {selectedEmployee.contact_detail?.emg_address || "Not provided"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                {selectedEmployee.organization_assignment?.date_of_resigning && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <UserCheck className="h-5 w-5 mr-2 text-gray-600" />
                      Additional Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Date of Resignation
                        </label>
                        <p className="text-gray-900 font-semibold">
                          {formatDate(selectedEmployee.organization_assignment.date_of_resigning)}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Resignation Reason
                        </label>
                        <p className="text-gray-900 font-semibold">
                          {selectedEmployee.organization_assignment.resigned_reason || "Not specified"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="bg-gray-50 px-6 py-4 rounded-b-2xl">
                <div className="flex justify-end">
                  <button
                    onClick={closeModal}
                    className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowEmployee;