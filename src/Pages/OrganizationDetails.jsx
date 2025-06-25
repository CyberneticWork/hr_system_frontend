import React, { useState } from 'react';
import { 
  Building2, 
  Clock, 
  Settings, 
  Calendar, 
  User, 
  Users, 
  FileText, 
  Upload, 
  Check, 
  X,
  CheckCircle,
  AlertCircle,
  Save
} from 'lucide-react';

const OrganizationDetails = () => {
  const [formData, setFormData] = useState({
    company: '',
    currentSupervisor: '',
    dateOfJoined: '',
    department: '',
    subDepartment: '',
    designation: '',
    trainingPeriod: { from: '', to: '' },
    contractPeriod: { from: '', to: '' },
    probationPeriod: { from: '', to: '' },
    confirmationDate: '',
    dateOfResigning: '',
    resignationStatus: false,
    resignationFile: null,
    status: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  // Sample data
  const companies = [
    { id: 1, name: 'Main Company Headquarters' },
    { id: 2, name: 'Regional Office - North' },
    { id: 3, name: 'Regional Office - South' }
  ];

  const departments = [
    'Production Department',
    'Introduction Department',
    'Quality Assurance',
    'Research & Development'
  ];

  const subDepartments = [
    'Production Line 1',
    'Production Line 2',
    'Quality Control',
    'Research Team A',
    'Research Team B'
  ];

  const designations = [
    'Manager',
    'Supervisor',
    'Team Lead',
    'Senior Developer',
    'Junior Developer',
    'Quality Analyst'
  ];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.company) newErrors.company = 'Company is required';
    if (!formData.subDepartment) newErrors.subDepartment = 'Sub Department is required';
    if (!formData.designation) newErrors.designation = 'Designation is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileUpload = (e, fieldName) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      [fieldName]: file
    }));
  };

  const handlePeriodChange = (periodType, field, value) => {
    setFormData(prev => ({
      ...prev,
      [periodType]: {
        ...prev[periodType],
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const submissionData = {
        ...formData,
        resignationFileName: formData.resignationFile ? formData.resignationFile.name : null
      };
      console.log('Form submitted:', submissionData);
      setIsSubmitting(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 4000);
    }, 1500);
  };

  const InputField = ({ label, name, type = "text", required = false, options = [], placeholder = "", className = "" }) => (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {type === 'select' ? (
        <select
          name={name}
          value={formData[name]}
          onChange={handleChange}
          className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 ${
            errors[name] 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
          } focus:ring-4 focus:outline-none ${className}`}
          required={required}
        >
          <option value="">{placeholder || `Select ${label}`}</option>
          {options.map((option, index) => (
            <option key={index} value={typeof option === 'object' ? option.name : option}>
              {typeof option === 'object' ? option.name : option}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          placeholder={placeholder}
          className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 ${
            errors[name] 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
          } focus:ring-4 focus:outline-none ${className}`}
          required={required}
        />
      )}
      {errors[name] && (
        <p className="text-red-500 text-sm flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {errors[name]}
        </p>
      )}
    </div>
  );

  const DateRangeField = ({ label, periodType, icon: Icon }) => (
    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
      <h3 className="text-md font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Icon className="w-5 h-5 text-blue-600" />
        {label}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-600">From Date</label>
          <input
            type="date"
            value={formData[periodType].from}
            onChange={(e) => handlePeriodChange(periodType, 'from', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-200 focus:outline-none transition-all duration-200"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-600">To Date</label>
          <input
            type="date"
            value={formData[periodType].to}
            onChange={(e) => handlePeriodChange(periodType, 'to', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-200 focus:outline-none transition-all duration-200"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        {/* <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-4">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Organization Assignment</h1>
          <p className="text-gray-600 text-lg">Manage employee details and assignment periods</p>
        </div> */}

        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3 animate-pulse">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <p className="text-green-800 font-semibold">Success!</p>
              <p className="text-green-700 text-sm">Organization details have been saved successfully.</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8 space-y-8">
            {/* Company Information Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Company Information</h2>
                  <p className="text-gray-500 text-sm">Basic company and employee details</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <InputField
                  label="Company"
                  name="company"
                  type="select"
                  options={companies}
                  required={true}
                />
                
                <InputField
                  label="Current Supervisor"
                  name="currentSupervisor"
                  placeholder="e.g., John Doe"
                />
                
                <InputField
                  label="Date of Joined"
                  name="dateOfJoined"
                  type="date"
                />
                
                <InputField
                  label="Department"
                  name="department"
                  type="select"
                  options={departments}
                />
                
                <InputField
                  label="Sub Department"
                  name="subDepartment"
                  type="select"
                  options={subDepartments}
                  required={true}
                />
                
                <InputField
                  label="Designation"
                  name="designation"
                  type="select"
                  options={designations}
                  required={true}
                />
              </div>
            </div>

            {/* Employment Periods Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Employment Periods</h2>
                  <p className="text-gray-500 text-sm">Define training, probation, and contract periods</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <DateRangeField
                  label="Probation Period"
                  periodType="probationPeriod"
                  icon={AlertCircle}
                />
                
                <DateRangeField
                  label="Training Period"
                  periodType="trainingPeriod"
                  icon={Users}
                />
                
                <DateRangeField
                  label="Contract Period"
                  periodType="contractPeriod"
                  icon={FileText}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="Confirmation Date"
                    name="confirmationDate"
                    type="date"
                  />
                </div>
              </div>
            </div>

            {/* Resignation & Status Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Settings className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Resignation & Status</h2>
                  <p className="text-gray-500 text-sm">Manage resignation details and current status</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="Date of Resigning"
                    name="dateOfResigning"
                    type="date"
                  />
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Upload Resignation Letter
                    </label>
                    <div className="flex items-center gap-4">
                      <label className="inline-flex items-center px-6 py-3 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 group">
                        <Upload className="w-5 h-5 mr-2 text-gray-400 group-hover:text-blue-500" />
                        <span className="text-sm font-medium text-gray-600 group-hover:text-blue-600">
                          Choose File
                        </span>
                        <input 
                          type="file" 
                          className="hidden" 
                          onChange={(e) => handleFileUpload(e, 'resignationFile')}
                          accept=".pdf,.doc,.docx"
                        />
                      </label>
                      {formData.resignationFile && (
                        <div className="flex items-center gap-2 text-sm text-green-600">
                          <Check className="w-4 h-4" />
                          {formData.resignationFile.name}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, resignationStatus: !prev.resignationStatus }))}
                    className={`relative w-12 h-6 rounded-full transition-all duration-200 ${
                      formData.resignationStatus ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-all duration-200 ${
                      formData.resignationStatus ? 'translate-x-6' : 'translate-x-0'
                    }`} />
                  </button>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700">
                      Resignation Approved
                    </label>
                    <p className="text-xs text-gray-500">Toggle to approve or reject resignation</p>
                  </div>
                </div>

                <InputField
                  label="Current Status"
                  name="status"
                  placeholder="e.g., Active, On Leave, Resigned"
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 border-t border-gray-200">
              <div className="text-sm text-gray-500">
                <span className="text-red-500">*</span> Required fields
              </div>
              
              <div className="flex gap-4">
                <button
                  type="button"
                  className="px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
                
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Organization Details
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationDetails;