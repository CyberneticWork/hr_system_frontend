import React, { useState } from 'react';
import EmpPersonalDetails from '@dashboard/AddEmployeeMaster/EmpPersonalDetails';
import AddressDetails from '@dashboard/AddEmployeeMaster/AddressDetails';
import OrganizationDetails from '@dashboard/AddEmployeeMaster/OrganizationDetails';
import CompensationManagement from '@dashboard/AddEmployeeMaster/CompensationManagement';
import Employeedocument from '@dashboard/AddEmployeeMaster/Employeedocument';
import EmployeeConfirmationModal from './EmployeeConfirmationModal';

const steps = [
  'personal',
  'address',
  'compensation',
  'organization',
  'employeedocument',
];

const EmployeeMaster = () => {
  const [activeCategory, setActiveCategory] = useState('personal');
  const currentStepIndex = steps.indexOf(activeCategory);

  const goNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setActiveCategory(steps[currentStepIndex + 1]);
    }
  };

  const goPrevious = () => {
    if (currentStepIndex > 0) {
      setActiveCategory(steps[currentStepIndex - 1]);
    }
  };

  const handleSubmit = (allEmployeeData) => {
    // allEmployeeData contains all form data from localStorage and documents
    console.log("Submitting all employee data:", allEmployeeData);
    alert('Employee submitted!');
    // Clear all form data from localStorage after submission
    localStorage.removeItem("employeeFormData");
    // Optionally, you can reset to the first step
    setActiveCategory('personal');
  };

  return (
    <div>
      <div className="flex gap-2 px-4 py-2 border-b border-gray-200 bg-white">
        <button
          className={`px-4 py-2 rounded-md text-sm font-medium transition ${
            activeCategory === 'personal'
              ? 'bg-indigo-600 text-white'
              : 'text-indigo-700 hover:bg-indigo-100'
          }`}
          onClick={() => setActiveCategory('personal')}
        >
          Personal
        </button>
        <button
          className={`px-4 py-2 rounded-md text-sm font-medium transition ${
            activeCategory === 'address'
              ? 'bg-indigo-600 text-white'
              : 'text-indigo-700 hover:bg-indigo-100'
          }`}
          onClick={() => setActiveCategory('address')}
        >
          Address
        </button>
        
        <button
          className={`px-4 py-2 rounded-md text-sm font-medium transition ${
            activeCategory === 'compensation'
              ? 'bg-indigo-600 text-white'
              : 'text-indigo-700 hover:bg-indigo-100'
          }`}
          onClick={() => setActiveCategory('compensation')}
          >
          Compensation
        </button>
        <button
          className={`px-4 py-2 rounded-md text-sm font-medium transition ${
            activeCategory === 'organization'
              ? 'bg-indigo-600 text-white'
              : 'text-indigo-700 hover:bg-indigo-100'
          }`}
          onClick={() => setActiveCategory('organization')}
        >
          Organization
        </button>
        <button
          className={`px-4 py-2 rounded-md text-sm font-medium transition ${
            activeCategory === 'employeedocument'
              ? 'bg-indigo-600 text-white'
              : 'text-indigo-700 hover:bg-indigo-100'
          }`}
          onClick={() => setActiveCategory('employeedocument')}

        >
         Employee Document      
        </button>
        <button
          className={`px-4 py-2 rounded-md text-sm font-medium transition ${
            activeCategory === 'EmployeeConfirmationModal'
              ? 'bg-indigo-600 text-white'
              : 'text-indigo-700 hover:bg-indigo-100'
          }`}
          onClick={() => setActiveCategory('EmployeeConfirmationModal')}

        >
         Final
        </button>
      </div>
        <div className="p-4">
          <div className="p-4">
          {activeCategory === 'personal' && (
            <EmpPersonalDetails
              onNext={goNext}
              activeCategory={activeCategory}
            />
          )}
          {activeCategory === 'address' && (
            <AddressDetails
              onNext={goNext}
              onPrevious={goPrevious}
              activeCategory={activeCategory}
            />
          )}
          {activeCategory === 'compensation' && (
            <CompensationManagement
              onNext={goNext}
              onPrevious={goPrevious}
              activeCategory={activeCategory}
            />
          )}
          {activeCategory === 'organization' && (
            <OrganizationDetails
              onNext={goNext}
              onPrevious={goPrevious}
              activeCategory={activeCategory}
            />
          )}
          {activeCategory === 'employeedocument' && (
            <Employeedocument
              onPrevious={goPrevious}
              onSubmit={handleSubmit}
              activeCategory={activeCategory}
            />
          )}
          {activeCategory === 'EmployeeConfirmationModal' && (
            <EmployeeConfirmationModal
              onPrevious={goPrevious}
              onSubmit={handleSubmit}
              activeCategory={activeCategory}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeMaster;