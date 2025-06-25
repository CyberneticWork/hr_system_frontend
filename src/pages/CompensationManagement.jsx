import React, { useState } from "react";
import { 
  DollarSign, 
  Building2, 
  CreditCard, 
  Calendar, 
  TrendingUp, 
  Settings, 
  Save, 
  Edit3,
  CheckCircle,
  AlertCircle,
  Plus,
  Minus,
  FileText,
  User,
  MapPin,
  Users,
  Briefcase
} from "lucide-react";

const CompensationManagement = () => {
  const [activeTab, setActiveTab] = useState('compensation');
  const [isEditing, setIsEditing] = useState(false);
  
  const [compensationData, setCompensationData] = useState({
    basicSalary: '',
    incrementValue: '',
    incrementEffectiveFrom: '2025-06-20',
    enableEPF: true,
    otActive: false,
    earlyDeduction: false,
    incrementActive: false,
    nopayActive: true,
    morningOT: false,
    eveningOT: true,
    bankName: '1/1/1900',
    branchName: '1/1/1900',
    bankCode: '',
    branchCode: '',
    bankAccountNo: '',
    budgetaryReliefAllowance2015: '',
    budgetaryReliefAllowance2016: '',
    comments: '',
    secondaryEmp: false,
    primaryEmploymentBasic: false
  });

  const [personalData] = useState({
    empName: "PERERA",
    empNo: "10",
    name: "VINOD SANJEEWA",
    status: "ACTIVE",
    type: "PERMANENT"
  });

  const handleInputChange = (field, value) => {
    setCompensationData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleToggle = (field) => {
    setCompensationData(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const bankOptions = [
    { value: '1/1/1900', label: 'Bank of Ceylon' },
    { value: '2/2/1900', label: 'People\'s Bank' },
    { value: '3/3/1900', label: 'Commercial Bank' },
    { value: '4/4/1900', label: 'Hatton National Bank' }
  ];

  const TabButton = ({ id, label, icon: Icon, isActive, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
        isActive 
          ? 'bg-blue-600 text-white shadow-lg transform scale-105' 
          : 'bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-600 shadow-md'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </button>
  );

  const ToggleSwitch = ({ enabled, onToggle, label, description }) => (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
      <div className="flex-1">
        <div className="font-medium text-gray-900">{label}</div>
        {description && <div className="text-sm text-gray-500">{description}</div>}
      </div>
      <button
        onClick={onToggle}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          enabled ? 'bg-blue-600' : 'bg-gray-300'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  const InputField = ({ label, value, onChange, type = 'text', placeholder, icon: Icon, required = false }) => (
    <div className="space-y-2">
      <label className="flex items-center text-sm font-medium text-gray-700">
        {Icon && <Icon className="w-4 h-4 mr-2" />}
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
      />
    </div>
  );

  const SelectField = ({ label, value, onChange, options, icon: Icon }) => (
    <div className="space-y-2">
      <label className="flex items-center text-sm font-medium text-gray-700">
        {Icon && <Icon className="w-4 h-4 mr-2" />}
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  const renderPersonalTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <User className="w-5 h-5 mr-2 text-blue-600" />
          Basic Information
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Employee Name:</span>
            <span className="font-medium">{personalData.empName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Employee Number:</span>
            <span className="font-medium">{personalData.empNo}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Full Name:</span>
            <span className="font-medium">{personalData.name}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Status:</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              personalData.status === 'ACTIVE' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {personalData.status}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Type:</span>
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              {personalData.type}
            </span>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <MapPin className="w-5 h-5 mr-2 text-green-600" />
          Quick Actions
        </h3>
        <div className="space-y-3">
          <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors">
            View Full Profile
          </button>
          <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors">
            Generate Report
          </button>
          <button className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors">
            Update Information
          </button>
        </div>
      </div>
    </div>
  );

  const renderCompensationTab = () => (
    <div className="space-y-6">
      {/* Salary Information */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
          <DollarSign className="w-5 h-5 mr-2 text-green-600" />
          Salary Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Basic Salary"
            value={compensationData.basicSalary}
            onChange={(value) => handleInputChange('basicSalary', value)}
            type="number"
            placeholder="Enter basic salary amount"
            icon={DollarSign}
            required
          />
          <InputField
            label="Increment Value"
            value={compensationData.incrementValue}
            onChange={(value) => handleInputChange('incrementValue', value)}
            type="number"
            placeholder="Enter increment amount"
            icon={TrendingUp}
          />
          <InputField
            label="Increment Effective From"
            value={compensationData.incrementEffectiveFrom}
            onChange={(value) => handleInputChange('incrementEffectiveFrom', value)}
            type="date"
            icon={Calendar}
          />
        </div>
      </div>

      {/* Salary Options */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
          <Settings className="w-5 h-5 mr-2 text-blue-600" />
          Salary Options
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ToggleSwitch
            enabled={compensationData.enableEPF}
            onToggle={() => handleToggle('enableEPF')}
            label="Enable EPF/ETF"
            description="Employee Provident Fund contribution"
          />
          <ToggleSwitch
            enabled={compensationData.otActive}
            onToggle={() => handleToggle('otActive')}
            label="OT Active"
            description="Overtime payment eligibility"
          />
          <ToggleSwitch
            enabled={compensationData.earlyDeduction}
            onToggle={() => handleToggle('earlyDeduction')}
            label="Early Deduction"
            description="Early departure deductions"
          />
          <ToggleSwitch
            enabled={compensationData.incrementActive}
            onToggle={() => handleToggle('incrementActive')}
            label="Increment Active"
            description="Salary increment activation"
          />
          <ToggleSwitch
            enabled={compensationData.nopayActive}
            onToggle={() => handleToggle('nopayActive')}
            label="No-pay Active"
            description="No-pay leave deductions"
          />
          <ToggleSwitch
            enabled={compensationData.morningOT}
            onToggle={() => handleToggle('morningOT')}
            label="Morning OT"
            description="Morning overtime eligibility"
          />
          <ToggleSwitch
            enabled={compensationData.eveningOT}
            onToggle={() => handleToggle('eveningOT')}
            label="Evening OT"
            description="Evening overtime eligibility"
          />
        </div>
      </div>

      {/* Allowances */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
          <Plus className="w-5 h-5 mr-2 text-purple-600" />
          Allowances & Benefits
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Budgetary Relief Allowance 2015"
            value={compensationData.budgetaryReliefAllowance2015}
            onChange={(value) => handleInputChange('budgetaryReliefAllowance2015', value)}
            type="number"
            placeholder="BR1 Amount"
            icon={DollarSign}
          />
          <InputField
            label="Budgetary Relief Allowance 2016"
            value={compensationData.budgetaryReliefAllowance2016}
            onChange={(value) => handleInputChange('budgetaryReliefAllowance2016', value)}
            type="number"
            placeholder="BR2 Amount"
            icon={DollarSign}
          />
        </div>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <ToggleSwitch
            enabled={compensationData.secondaryEmp}
            onToggle={() => handleToggle('secondaryEmp')}
            label="Secondary Employment"
            description="Employee has secondary employment"
          />
          <ToggleSwitch
            enabled={compensationData.primaryEmploymentBasic}
            onToggle={() => handleToggle('primaryEmploymentBasic')}
            label="Primary Employment Basic"
            description="This is primary employment basic salary"
          />
        </div>
      </div>

      {/* Bank Information */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
          <Building2 className="w-5 h-5 mr-2 text-indigo-600" />
          Bank Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SelectField
            label="Bank Name"
            value={compensationData.bankName}
            onChange={(value) => handleInputChange('bankName', value)}
            options={bankOptions}
            icon={Building2}
          />
          <SelectField
            label="Branch Name"
            value={compensationData.branchName}
            onChange={(value) => handleInputChange('branchName', value)}
            options={bankOptions}
            icon={MapPin}
          />
          <InputField
            label="Bank Code"
            value={compensationData.bankCode}
            onChange={(value) => handleInputChange('bankCode', value)}
            placeholder="Enter bank code"
            icon={CreditCard}
          />
          <InputField
            label="Branch Code"
            value={compensationData.branchCode}
            onChange={(value) => handleInputChange('branchCode', value)}
            placeholder="Enter branch code"
            icon={CreditCard}
          />
          <div className="md:col-span-2">
            <InputField
              label="Bank Account Number"
              value={compensationData.bankAccountNo}
              onChange={(value) => handleInputChange('bankAccountNo', value)}
              placeholder="Enter bank account number"
              icon={CreditCard}
            />
          </div>
        </div>
      </div>

      {/* Comments */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <FileText className="w-5 h-5 mr-2 text-orange-600" />
          Comments
        </h3>
        <textarea
          value={compensationData.comments}
          onChange={(e) => handleInputChange('comments', e.target.value)}
          placeholder="Add any additional comments or notes..."
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white resize-none"
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Navigation Tabs */}
        

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'personal' && renderPersonalTab()}
          {activeTab === 'address' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Address Information</h3>
              <p className="text-gray-600">Address management functionality would be implemented here.</p>
            </div>
          )}
          {activeTab === 'organization' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Organization Details</h3>
              <p className="text-gray-600">Organization management functionality would be implemented here.</p>
            </div>
          )}
          {activeTab === 'compensation' && renderCompensationTab()}
          {activeTab === 'salary' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Salary History</h3>
              <p className="text-gray-600">Salary history and records would be displayed here.</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-center space-x-4">
          <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
            Save All Changes
          </button>
          <button className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
            Generate Report
          </button>
          <button className="bg-gradient-to-r from-purple-600 to-violet-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
            Export Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompensationManagement;