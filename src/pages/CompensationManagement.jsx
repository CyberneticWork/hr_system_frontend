import React, { useState, useEffect } from 'react';
import { Save, X, DollarSign, Calendar, Building2, CreditCard, User, AlertCircle } from 'lucide-react';

const CompensationManagement = () => {
  // Load saved data from localStorage if it exists
  const savedData = localStorage.getItem('compensationFormData');
  const initialFormData = savedData ? JSON.parse(savedData) : {
    basicSalary: '',
    incrementValue: '',
    incrementEffectiveFrom: '2025-06-20',
    bankName: '1/1/1900',
    branchName: '1/1/1900',
    bankCode: '',
    branchCode: '',
    bankAccountNo: '',
    comments: '',
    secondaryEmp: false,
    primaryEmploymentBasic: 'false',
    enableEpfEtf: true,
    otActive: true,
    earlyDeduction: false,
    incrementActive: false,
    nopayActive: true,
    morningOt: false,
    eveningOt: true,
    budgetaryReliefAllowance2015: true,
    budgetaryReliefAllowance2016: true
  };

  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    if (!isSubmitted) {
      localStorage.setItem('compensationFormData', JSON.stringify(formData));
    }
  }, [formData, isSubmitted]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Clear localStorage and reset form on submit
    localStorage.removeItem('compensationFormData');
    setIsSubmitted(true);
    setFormData({
      basicSalary: '',
      incrementValue: '',
      incrementEffectiveFrom: '2025-06-20',
      bankName: '1/1/1900',
      branchName: '1/1/1900',
      bankCode: '',
      branchCode: '',
      bankAccountNo: '',
      comments: '',
      secondaryEmp: false,
      primaryEmploymentBasic: 'false',
      enableEpfEtf: true,
      otActive: true,
      earlyDeduction: false,
      incrementActive: false,
      nopayActive: true,
      morningOt: false,
      eveningOt: true,
      budgetaryReliefAllowance2015: true,
      budgetaryReliefAllowance2016: true
    });
    setTimeout(() => setIsSubmitted(false), 1000); // Reset submission status
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <DollarSign className="w-6 h-6 mr-2 text-green-600" />
              Compensation Management
            </h2>
            {isSubmitted && (
              <div className="ml-auto bg-green-100 text-green-800 px-4 py-2 rounded-lg text-sm">
                Form submitted successfully!
              </div>
            )}
          </div>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Salary Information */}
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                    Salary Information
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Basic Salary <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="number"
                          value={formData.basicSalary}
                          onChange={(e) => handleInputChange('basicSalary', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="Enter basic salary"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Increment Value
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="number"
                          value={formData.incrementValue}
                          onChange={(e) => handleInputChange('incrementValue', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="Enter increment"
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Increment Effective From
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="date"
                          value={formData.incrementEffectiveFrom}
                          onChange={(e) => handleInputChange('incrementEffectiveFrom', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Employment Settings */}
                <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-6 rounded-xl border border-purple-200">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2 text-purple-600" />
                    Employment Settings
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center p-3 bg-white rounded-lg border">
                      <input
                        type="checkbox"
                        id="secondaryEmp"
                        checked={formData.secondaryEmp}
                        onChange={(e) => handleInputChange('secondaryEmp', e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="secondaryEmp" className="ml-3 text-sm font-medium text-gray-700">
                        Secondary Employment
                      </label>
                    </div>

                    <div className="flex items-center p-3 bg-white rounded-lg border">
                      <input
                        type="checkbox"
                        id="enableEpfEtf"
                        checked={formData.enableEpfEtf}
                        onChange={(e) => handleInputChange('enableEpfEtf', e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="enableEpfEtf" className="ml-3 text-sm font-medium text-gray-700">
                        Enable EPF/ETF
                      </label>
                    </div>

                    <div className="flex items-center p-3 bg-white rounded-lg border">
                      <input
                        type="checkbox"
                        id="otActive"
                        checked={formData.otActive}
                        onChange={(e) => handleInputChange('otActive', e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="otActive" className="ml-3 text-sm font-medium text-gray-700">
                        OT Active
                      </label>
                    </div>

                    <div className="flex items-center p-3 bg-white rounded-lg border">
                      <input
                        type="checkbox"
                        id="incrementActive"
                        checked={formData.incrementActive}
                        onChange={(e) => handleInputChange('incrementActive', e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="incrementActive" className="ml-3 text-sm font-medium text-gray-700">
                        Increment Active
                      </label>
                    </div>

                    <div className="flex items-center p-3 bg-white rounded-lg border">
                      <input
                        type="checkbox"
                        id="nopayActive"
                        checked={formData.nopayActive}
                        onChange={(e) => handleInputChange('nopayActive', e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="nopayActive" className="ml-3 text-sm font-medium text-gray-700">
                        No-pay Active
                      </label>
                    </div>

                    <div className="flex items-center p-3 bg-white rounded-lg border">
                      <input
                        type="checkbox"
                        id="earlyDeduction"
                        checked={formData.earlyDeduction}
                        onChange={(e) => handleInputChange('earlyDeduction', e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="earlyDeduction" className="ml-3 text-sm font-medium text-gray-700">
                        Early Deduction
                      </label>
                    </div>
                  </div>
                </div>

                {/* OT Settings */}
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-xl border border-orange-200">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2 text-orange-600" />
                    Overtime Settings
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center p-3 bg-white rounded-lg border">
                      <input
                        type="checkbox"
                        id="morningOt"
                        checked={formData.morningOt}
                        onChange={(e) => handleInputChange('morningOt', e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="morningOt" className="ml-3 text-sm font-medium text-gray-700">
                        Morning OT
                      </label>
                    </div>

                    <div className="flex items-center p-3 bg-white rounded-lg border">
                      <input
                        type="checkbox"
                        id="eveningOt"
                        checked={formData.eveningOt}
                        onChange={(e) => handleInputChange('eveningOt', e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="eveningOt" className="ml-3 text-sm font-medium text-gray-700">
                        Evening OT
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Bank Information */}
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <Building2 className="w-5 h-5 mr-2 text-blue-600" />
                    Bank Information
                  </h2>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bank Name
                        </label>
                        <select
                          value={formData.bankName}
                          onChange={(e) => handleInputChange('bankName', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        >
                          <option value="1/1/1900">Select Bank</option>
                          <option value="bank1">Bank of Ceylon</option>
                          <option value="bank2">Commercial Bank</option>
                          <option value="bank3">Peoples Bank</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Branch Name
                        </label>
                        <select
                          value={formData.branchName}
                          onChange={(e) => handleInputChange('branchName', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        >
                          <option value="1/1/1900">Select Branch</option>
                          <option value="branch1">Main Branch</option>
                          <option value="branch2">City Branch</option>
                          <option value="branch3">Regional Branch</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bank Code
                        </label>
                        <input
                          type="text"
                          value={formData.bankCode}
                          onChange={(e) => handleInputChange('bankCode', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="Enter bank code"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Branch Code
                        </label>
                        <input
                          type="text"
                          value={formData.branchCode}
                          onChange={(e) => handleInputChange('branchCode', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="Enter branch code"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bank Account Number
                      </label>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          value={formData.bankAccountNo}
                          onChange={(e) => handleInputChange('bankAccountNo', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="Enter account number"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Budgetary Relief Allowances */}
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-xl border border-emerald-200">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Budgetary Relief Allowances
                  </h2>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                      <div>
                        <h3 className="font-medium text-gray-800">Budgetary Relief Allowance 2015</h3>
                        <p className="text-sm text-gray-600">BR1 Relief allowance for 2015</p>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="br2015"
                          checked={formData.budgetaryReliefAllowance2015}
                          onChange={(e) => handleInputChange('budgetaryReliefAllowance2015', e.target.checked)}
                          className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                      <div>
                        <h3 className="font-medium text-gray-800">Budgetary Relief Allowance 2016</h3>
                        <p className="text-sm text-gray-600">BR2 Relief allowance for 2016</p>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="br2016"
                          checked={formData.budgetaryReliefAllowance2016}
                          onChange={(e) => handleInputChange('budgetaryReliefAllowance2016', e.target.checked)}
                          className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Primary Employment Basic */}
                <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-6 rounded-xl border border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Primary Employment Basic
                  </h2>

                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="primaryTrue"
                        name="primaryEmploymentBasic"
                        value="true"
                        checked={formData.primaryEmploymentBasic === 'true'}
                        onChange={(e) => handleInputChange('primaryEmploymentBasic', e.target.value)}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <label htmlFor="primaryTrue" className="ml-3 text-sm font-medium text-gray-700">
                        True
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="primaryFalse"
                        name="primaryEmploymentBasic"
                        value="false"
                        checked={formData.primaryEmploymentBasic === 'false'}
                        onChange={(e) => handleInputChange('primaryEmploymentBasic', e.target.value)}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <label htmlFor="primaryFalse" className="ml-3 text-sm font-medium text-gray-700">
                        False
                      </label>
                    </div>
                  </div>
                </div>

                {/* Comments */}
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl border border-yellow-200">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Comments
                  </h2>

                  <textarea
                    value={formData.comments}
                    onChange={(e) => handleInputChange('comments', e.target.value)}
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    placeholder="Add any additional comments or notes..."
                  />
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => {
                  localStorage.removeItem('compensationFormData');
                  setFormData({
                    basicSalary: '',
                    incrementValue: '',
                    incrementEffectiveFrom: '2025-06-20',
                    bankName: '1/1/1900',
                    branchName: '1/1/1900',
                    bankCode: '',
                    branchCode: '',
                    bankAccountNo: '',
                    comments: '',
                    secondaryEmp: false,
                    primaryEmploymentBasic: 'false',
                    enableEpfEtf: true,
                    otActive: true,
                    earlyDeduction: false,
                    incrementActive: false,
                    nopayActive: true,
                    morningOt: false,
                    eveningOt: true,
                    budgetaryReliefAllowance2015: true,
                    budgetaryReliefAllowance2016: true
                  });
                }}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
              >
                <X className="w-4 h-4" />
                <span>Clear Form</span>
              </button>
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center space-x-2 shadow-lg"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompensationManagement;