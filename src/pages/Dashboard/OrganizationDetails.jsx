import React, { useState, useEffect } from 'react';
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
  ChevronDown
} from 'lucide-react';

const STORAGE_KEY = 'employeeFormData';

const OrganizationDetails = () => {
  const [formData, setFormData] = useState({
    company: '',
    department: '',
    subDepartment: '',
    currentSupervisor: '',
    dateOfJoined: '',
    designation: '',
    probationFrom: '',
    probationTo: '',
    trainingFrom: '',
    trainingTo: '',
    contractFrom: '',
    contractTo: '',
    confirmationDate: '',
    resignationDate: '',
    resignationLetter: null,
    resignationApproved: false,
    currentStatus: 'Active',
    dayOff: ''
  });
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Load organizationDetails from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && saved !== 'undefined' && saved !== 'null') {
        const parsed = JSON.parse(saved);
        if (parsed.organizationDetails) {
          setFormData(prev => ({
            ...prev,
            ...parsed.organizationDetails
          }));
        }
      }
    } catch (e) {
      // ignore
    } finally {
      setIsDataLoaded(true);
    }
  }, []);

  // Save to localStorage whenever formData changes (after initial load)
  useEffect(() => {
    if (!isDataLoaded) return;
    const saveData = () => {
      let allData = {};
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved && saved !== 'undefined' && saved !== 'null') {
          allData = JSON.parse(saved);
        }
      } catch (e) {
        // ignore
      }
      allData.organizationDetails = formData;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allData));
      setIsSaved(true);
    };
    const timeoutId = setTimeout(saveData, 300);
    return () => clearTimeout(timeoutId);
  }, [formData, isDataLoaded]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
    }));
    setIsSaved(false);
  };

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
          <p className="text-gray-500 mb-4 pl-7">Basic company and employee details</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label className=" text-gray-700 font-medium mb-2 flex items-center gap-1">
                <Building2 className="text-gray-500" size={16} />
                Company <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Company</option>
                  <option value="Company A">Company A</option>
                  <option value="Company B">Company B</option>
                </select>
                <ChevronDown className="absolute right-3 top-2.5 text-gray-400" size={16} />
              </div>
            </div>
            
            <div className="mb-4">
              <label className=" text-gray-700 font-medium mb-2 flex items-center gap-1">
                <Layers className="text-gray-500" size={16} />
                Department
              </label>
              <div className="relative">
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Department</option>
                  <option value="HR">HR</option>
                  <option value="IT">IT</option>
                  <option value="Finance">Finance</option>
                </select>
                <ChevronDown className="absolute right-3 top-2.5 text-gray-400" size={16} />
              </div>
            </div>
            
            <div className="mb-4">
              <label className=" text-gray-700 font-medium mb-2 flex items-center gap-1">
                <Layers className="text-gray-500" size={16} />
                Sub Department <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="subDepartment"
                  value={formData.subDepartment}
                  onChange={handleChange}
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Sub Department</option>
                  <option value="Recruitment">Recruitment</option>
                  <option value="Development">Development</option>
                  <option value="Accounting">Accounting</option>
                </select>
                <ChevronDown className="absolute right-3 top-2.5 text-gray-400" size={16} />
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
                <User className="absolute left-2 top-2.5 text-gray-400" size={16} />
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
                <Calendar className="absolute left-2 top-2.5 text-gray-400" size={16} />
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
                <ChevronDown className="absolute right-3 top-2.5 text-gray-400" size={16} />
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
                  value={formData.dayOff || ''}
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
                <ChevronDown className="absolute right-3 top-2.5 text-gray-400" size={16} />
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
          <p className="text-gray-500 mb-4 pl-7">Define training, probation, and contract periods</p>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm">1</span>
                Probation Period
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-600 mb-1">From Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      name="probationFrom"
                      value={formData.probationFrom}
                      onChange={handleChange}
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Calendar className="absolute left-2 top-2.5 text-gray-400" size={16} />
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
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Calendar className="absolute left-2 top-2.5 text-gray-400" size={16} />
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm">2</span>
                Training Period
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-600 mb-1">From Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      name="trainingFrom"
                      value={formData.trainingFrom}
                      onChange={handleChange}
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Calendar className="absolute left-2 top-2.5 text-gray-400" size={16} />
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
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Calendar className="absolute left-2 top-2.5 text-gray-400" size={16} />
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                <BookOpen className="text-blue-500" size={20} />
                Contract Period
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-600 mb-1">From Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      name="contractFrom"
                      value={formData.contractFrom}
                      onChange={handleChange}
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Calendar className="absolute left-2 top-2.5 text-gray-400" size={16} />
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
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Calendar className="absolute left-2 top-2.5 text-gray-400" size={16} />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:w-1/2">
              <label className=" text-gray-700 font-medium mb-2 flex items-center gap-1">
                <CheckCircle className="text-gray-500" size={16} />
                Confirmation Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="confirmationDate"
                  value={formData.confirmationDate}
                  onChange={handleChange}
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Calendar className="absolute left-2 top-2.5 text-gray-400" size={16} />
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
          <p className="text-gray-500 mb-4 pl-7">Manage resignation details and current status</p>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Date of Resigning</h3>
              <div className="relative md:w-1/2">
                <input
                  type="date"
                  name="resignationDate"
                  value={formData.resignationDate}
                  onChange={handleChange}
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Calendar className="absolute left-2 top-2.5 text-gray-400" size={16} />
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
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      {formData.resignationLetter ? formData.resignationLetter.name : 'PDF, DOCX (MAX. 5MB)'}
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
                <User className="absolute left-2 top-2.5 text-gray-400" size={16} />
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4">
          <p className="text-gray-500 text-sm">
            * Required fields
          </p>
          <div className="flex gap-4">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-2"
              onClick={() => window.location.reload()}
            >
              <RefreshCw size={16} />
              Cancel
            </button>
          </div>
        </div>
        {isSaved && (
          <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-md flex items-center gap-2">
            <CheckCircle className="text-green-600" size={18} />
            Organization details saved automatically!
          </div>
        )}
      </form>
    </div>
  );
};

export default OrganizationDetails;